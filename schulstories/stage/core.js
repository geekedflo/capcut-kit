// Core: math, easing, timeline access, camera, captions. Pure functions of time t.
const W = 1080, H = 1920, OL = '#1F1A2E';
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const Ease = {
  linear: t => t,
  outQuad: t => 1 - (1 - t) * (1 - t),
  inQuad: t => t * t,
  inOutQuad: t => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inCubic: t => t * t * t,
  inOutCubic: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  outElastic: t => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
};
const prog = (t, a, b) => clamp((t - a) / (b - a));
const tw = (t, a, b, v0, v1, e = Ease.inOutCubic) => lerp(v0, v1, e(prog(t, a, b)));
// decaying oscillation started at t0 (for wobbles, shakes, springy settles)
const wob = (t, t0, amp = 1, freq = 8, decay = 5) => (t < t0 ? 0 : amp * Math.sin((t - t0) * freq * 2 * Math.PI) * Math.exp(-(t - t0) * decay));
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise(x) { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u) * 2 - 1; }
const f1 = v => Math.round(v * 10) / 10;
const T = (x, y) => `translate(${f1(x)} ${f1(y)})`;
let UID = 0;
const uid = () => 'u' + (UID++);

// eyelid blink: returns 0..1 closure
function blink(t, seed) {
  let bt = hash(seed) * 2.2 + 0.4;
  for (let k = 0; k < 200 && bt < t + 1; k++) {
    const d = t - bt;
    if (d >= 0 && d < 0.15) return Math.sin((d / 0.15) * Math.PI);
    bt += 2.3 + hash(seed * 13.7 + k) * 2.0;
  }
  return 0;
}

// ------------------------------------------------------------ timeline
let TL, B;
function initTimeline(tl) {
  TL = tl;
  B = {};
  tl.beats.forEach(b => (B[b.id] = b));
  buildCaptionChunks();
}
// mouth opening 0..1 for any of the given voices at time t
function mouthOf(voices, t) {
  for (const b of TL.beats) {
    if (b.voice && voices.includes(b.voice) && t >= b.start && t < b.end) {
      const i = Math.floor((t - b.start) * TL.fps);
      return b.mouth[Math.min(i, b.mouth.length - 1)] || 0;
    }
  }
  return 0;
}
const wt = (id, i) => B[id].start + B[id].words[i].s; // absolute start time of word i in beat id

// ------------------------------------------------------------ text measure
const _cv = document.createElement('canvas').getContext('2d');
function textW(txt, size, family = 'Inter', weight = 900) {
  _cv.font = `${weight} ${size}px ${family}`;
  return _cv.measureText(txt).width;
}

// ------------------------------------------------------------ captions
const VOICE_COLOR = { krause: '#D7B4FF', janitor: '#8FD8FF' };
let CHUNKS = [];
function buildCaptionChunks() {
  CHUNKS = [];
  const beats = TL.beats.filter(b => b.words);
  beats.forEach((b, bi) => {
    let cur = [];
    const flush = () => { if (cur.length) CHUNKS.push({ beat: b, words: cur }); cur = []; };
    b.words.forEach(w => {
      const len = cur.reduce((a, x) => a + x.w.length + 1, 0) + w.w.length;
      if (cur.length && (cur.length >= 3 || len > 17)) flush();
      cur.push(w);
      if (/[,.!?:…]$/.test(w.w)) flush();
    });
    flush();
  });
  CHUNKS.forEach(c => (c.t0 = c.beat.start + c.words[0].s - 0.04));
  CHUNKS.forEach((c, i) => {
    const n = CHUNKS[i + 1], hard = c.beat.end + 0.35;
    c.t1 = n ? Math.min(n.t0, n.beat === c.beat ? Infinity : hard) : hard;
  });
}

function captions(t, y = 1265) {
  const c = CHUNKS.find(c => t >= c.t0 && t < c.t1);
  if (!c) return '';
  const size = 76, gap = 40;
  const hiColor = VOICE_COLOR[c.beat.voice] || '#FFE03A';
  const ws = c.words.map(w => ({ ...w, size: w.hi ? size * 1.12 : size }));
  ws.forEach(w => (w.width = textW(w.w, w.size)));
  let total = ws.reduce((a, w) => a + w.width, 0) + gap * (ws.length - 1);
  const k = Math.min(1, 960 / total);
  const pop = Ease.outBack(prog(t, c.t0, c.t0 + 0.14));
  let out = `<g transform="translate(540 ${y}) scale(${((0.85 + 0.15 * pop) * k).toFixed(3)}) translate(-540 ${-y})">`;
  let x = 540 - total / 2;
  ws.forEach(w => {
    const ts = c.beat.start + w.s, te = c.beat.start + w.e;
    const active = t >= ts - 0.03 && t < te + 0.02;
    const p = Ease.outBack(prog(t, ts - 0.03, ts + 0.09));
    const sc = active ? 1.05 + 0.08 * (1 - Math.abs(p - 1)) : 1;
    const fill = w.hi ? '#FF4F6D' : active ? hiColor : '#FFFFFF';
    const cx = x + w.width / 2;
    out += `<g transform="translate(${f1(cx)} ${y}) scale(${sc.toFixed(3)}) translate(${f1(-cx)} ${-y})">
      <text x="${f1(cx)}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-family="Inter" font-weight="900" font-size="${w.size}"
        fill="${fill}" stroke="${OL}" stroke-width="15" stroke-linejoin="round" paint-order="stroke">${esc(w.w)}</text></g>`;
    x += w.width + gap;
  });
  return out + '</g>';
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// card with dark text on white (hook / outro)
function card(lines, cx, top, t, tIn, tOut, size = 62) {
  if (t < tIn || t > tOut) return '';
  const pin = Ease.outBack(prog(t, tIn, tIn + 0.3));
  const pout = prog(t, tOut - 0.15, tOut);
  const sc = pin * (1 - Ease.inCubic(pout));
  const lh = size * 1.22;
  const wmax = Math.max(...lines.map(l => textW(l, size)));
  const bw = wmax + 70, bh = lh * lines.length + 40;
  let s = `<g transform="translate(${cx} ${top + bh / 2}) scale(${sc.toFixed(3)}) rotate(${f1(-2 + 2 * pin)}) translate(${-cx} ${-(top + bh / 2)})">`;
  s += `<rect x="${cx - bw / 2 + 8}" y="${top + 10}" width="${bw}" height="${bh}" rx="28" fill="${OL}" opacity="0.35"/>`;
  s += `<rect x="${cx - bw / 2}" y="${top}" width="${bw}" height="${bh}" rx="28" fill="#fff" stroke="${OL}" stroke-width="6"/>`;
  lines.forEach((l, i) => {
    s += `<text x="${cx}" y="${top + 20 + lh * (i + 0.5)}" text-anchor="middle" dominant-baseline="central" font-family="Inter, 'Noto Color Emoji'" font-weight="900" font-size="${size}" fill="${OL}">${esc(l)}</text>`;
  });
  return s + '</g>';
}

// popping comic word (Luckiest Guy)
function popWord(txt, x, y, t, t0, { size = 90, color = '#FFE03A', rot = 0, dur = 9, stroke = OL } = {}) {
  if (t < t0 || t > t0 + dur) return '';
  const p = Ease.outBack(prog(t, t0, t0 + 0.18));
  const out = 1 - Ease.inCubic(prog(t, t0 + dur - 0.15, t0 + dur));
  const sc = p * out;
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${sc.toFixed(3)})">
    <text text-anchor="middle" dominant-baseline="central" font-family="Luckiest Guy" font-size="${size}" fill="${color}" stroke="${stroke}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke">${esc(txt)}</text></g>`;
}
