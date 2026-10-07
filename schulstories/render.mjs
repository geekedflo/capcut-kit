// Render an episode: node render.mjs ep01-mama [--stills 0,2.5,5] [--workers 4] [--from s --to s]
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
// playwright: local install, else the global one
let pw;
try { pw = createRequire(import.meta.url)('playwright'); }
catch { pw = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright'); }
const { chromium } = pw;
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.dirname(new URL(import.meta.url).pathname);
const ep = process.argv[2];
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const build = path.join(root, 'build', ep);
const tl = JSON.parse(fs.readFileSync(path.join(build, 'timeline.json'), 'utf8'));
const epScript = ep.split('-')[0];
const fps = tl.fps;

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.error('pageerror', e.message));
  await page.addInitScript(tl => { window.__TL = tl; }, tl);
  await page.goto(`file://${root}/stage/stage.html?ep=${epScript}`);
  await page.evaluate(async () => {
    await Promise.all(['40px "Luckiest Guy"', '700 40px Fredoka', '900 40px Inter', '40px "Noto Color Emoji"'].map(f => document.fonts.load(f)));
    await document.fonts.ready;
    initTimeline(window.__TL);
  });
  return page;
}

const browser = await chromium.launch();
const stills = arg('--stills');
if (stills) {
  const dir = path.join(build, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  const page = await openPage(browser);
  for (const s of stills.split(',')) {
    const t = parseFloat(s);
    await page.evaluate(t => renderFrame(t), t);
    const f = path.join(dir, `t${t.toFixed(2)}.png`);
    await page.screenshot({ path: f });
    console.log(f);
  }
  await browser.close();
  process.exit(0);
}

const from = parseFloat(arg('--from', '0')), to = parseFloat(arg('--to', String(tl.duration)));
const n0 = Math.round(from * fps), n1 = Math.round(to * fps);
const workers = parseInt(arg('--workers', '4'));
const per = Math.ceil((n1 - n0) / workers);
const t0 = Date.now();
const segs = await Promise.all([...Array(workers).keys()].map(async w => {
  const a = n0 + w * per, b = Math.min(n1, a + per);
  const out = path.join(build, `seg${w}.mp4`);
  if (a >= b) return null;
  const page = await openPage(browser);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = a; f < b; f++) {
    await page.evaluate(t => renderFrame(t), f / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 94 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (w === 0 && (f - a) % 60 === 0) console.log(`frame ${f - a}/${b - a} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  return out;
}));
await browser.close();
const list = path.join(build, 'segs.txt');
fs.writeFileSync(list, segs.filter(Boolean).map(s => `file '${s}'`).join('\n'));
const outDir = path.join(root, 'out');
fs.mkdirSync(outDir, { recursive: true });
const final = path.join(outDir, `${ep}.mp4`);
execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-ss', String(from), '-i', path.join(build, 'audio.wav'),
  '-t', String(to - from), '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', final]);
segs.filter(Boolean).forEach(s => fs.unlinkSync(s));
console.log(`done ${final} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
