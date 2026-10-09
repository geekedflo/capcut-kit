// "Würdest du lieber…?" — split-screen dilemma format, no voice.
const QS = () => TL.beats.filter(b => b.q);  // one entry per question

function wrapText(txt, size, maxW) {
  const words = txt.split(' '), lines = [];
  let cur = '';
  words.forEach(w => {
    const tryL = cur ? cur + ' ' + w : w;
    if (textW(tryL, size) > maxW && cur) { lines.push(cur); cur = w; } else cur = tryL;
  });
  if (cur) lines.push(cur);
  return lines;
}
const bigText = (lines, x, y, size, fill = '#fff') => lines.map((l, i) =>
  `<text x="${x}" y="${f1(y + (i - (lines.length - 1) / 2) * size * 1.12)}" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="${size}" fill="${fill}" stroke="${YOL}" stroke-width="${size * 0.16}" stroke-linejoin="round" paint-order="stroke">${esc(l)}</text>`).join('');

function half(top, col1, col2, slide) {
  const id = uid();
  const y = top ? 0 : 960;
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col1}"/><stop offset="1" stop-color="${col2}"/></linearGradient>
    <g transform="translate(${f1(slide)} 0)"><rect x="-40" y="${y}" width="1160" height="960" fill="url(#${id})"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${(i * 233 + (top ? 80 : 190)) % 1080}" cy="${y + 120 + ((i * 317) % 720)}" r="${60 + (i % 3) * 40}" fill="#fff" opacity="0.05"/>`).join('')}</g>`;
}

// timing of question n: fixed offsets (silent version, beat "qN") or voiced beats ("qNx"/"qNa"/"qNb"/"qNc")
function qTiming(n) {
  const a = B['q' + n + 'a'] || B['q' + n], b = B['q' + n + 'b'], c = B['q' + n + 'c'], x = B['q' + n + 'x'];
  return { start: x ? x.start : a.start, aT: b ? a.start : a.start + 0.35, bT: b ? b.start : a.start + 0.85,
    cd0: c ? c.start : a.start + 1.5, cd1: c ? c.end : a.start + 6.5, q: a.q, voiced: !!b };
}

function questionFrame(t, T, idx, n) {
  const [ea, ta, eb, tb] = T.q;
  const last = idx === n;
  let s = '';
  const slide = 1 - Ease.outCubic(prog(t, T.start, T.start + 0.35));
  s += last ? half(true, '#5B1020', '#1A0B12', slide * -1100) + half(false, '#2A0B3F', '#0E0716', slide * 1100) : half(true, '#2F7BFF', '#1449C9', slide * -1100) + half(false, '#FF4258', '#C41C3A', slide * 1100);
  const pa = Ease.outBack(prog(t, T.aT, T.aT + 0.3)), pb = Ease.outBack(prog(t, T.bT, T.bT + 0.3));
  // in the voiced version the option being read pulses with the voice
  const amp = T.voiced ? mouthOf(['sprecher'], t) : 0;
  const reading = t < T.bT ? 'A' : 'B';
  const kA = 1 + (reading === 'A' ? 0.1 * amp : 0), kB = 1 + (reading === 'B' ? 0.1 * amp : 0);
  const bobA = Math.sin(t * 3) * 8, bobB = Math.sin(t * 3 + 1.5) * 8;
  s += `<g transform="translate(540 ${f1(440 + bobA)}) scale(${(pa * kA).toFixed(3)})"><text text-anchor="middle" dominant-baseline="central" font-family="'Noto Color Emoji'" font-size="230">${ea}</text></g>`;
  s += `<g opacity="${f1(prog(t, T.aT + 0.1, T.aT + 0.35) * 100) / 100}">${bigText(wrapText(ta, 66, 900), 540, 715, 66)}</g>`;
  s += `<g transform="translate(540 ${f1(1240 + bobB)}) scale(${(pb * kB).toFixed(3)})"><text text-anchor="middle" dominant-baseline="central" font-family="'Noto Color Emoji'" font-size="230">${eb}</text></g>`;
  s += `<g opacity="${f1(prog(t, T.bT + 0.1, T.bT + 0.35) * 100) / 100}">${bigText(wrapText(tb, 66, 900), 540, 1490, 66)}</g>`;
  // announcement before the impossible question ("qNx" beat)
  if (t < T.aT - 0.05 && T.start < T.aT - 0.5) {
    const k = Ease.outBack(prog(t, T.start + 0.1, T.start + 0.45));
    s += `<g transform="translate(540 600) scale(${Math.max(k, 0.001).toFixed(3)}) rotate(-4)">${bigText(['Die unmögliche', 'Frage 💀'], 0, 0, 96)}</g>`.replace(/font-family="Inter"/g, `font-family="Inter, 'Noto Color Emoji'"`);
  }
  // letter tags
  s += `<g transform="translate(110 ${150 + 120})" opacity="${f1(pa * 100) / 100}"><circle r="56" fill="#fff"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="64" fill="#1449C9">A</text></g>`;
  s += `<g transform="translate(110 1080)" opacity="${f1(pb * 100) / 100}"><circle r="56" fill="#fff"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="64" fill="#C41C3A">B</text></g>`;
  // header: question counter
  const hdr = last ? '💀 UNMÖGLICH · Frage 6/6' : `Frage ${idx}/${n}`;
  const hw = textW(hdr, 44) + 70;
  s += `<g transform="translate(${540 + 0} 255)"><rect x="${-hw / 2}" y="-40" width="${hw}" height="80" rx="40" fill="${YOL}" opacity="0.82"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter, 'Noto Color Emoji'" font-weight="900" font-size="44" fill="#fff">${esc(hdr)}</text></g>`;
  // centre badge: ODER + countdown ring
  const dur = T.cd1 - T.cd0;
  const cd = prog(t, T.cd0, T.cd1);
  const num = t >= T.cd0 && t < T.cd1 ? Math.ceil(T.cd1 - t - 1e-6) : null;
  const frac = t >= T.cd0 ? (t - T.cd0) % 1 : 0;
  const pulse = 1 + 0.06 * Math.sin(t * 10) + (num ? 0.08 * Math.max(0, 1 - frac * 4) : 0);
  const R = 118, C = 2 * Math.PI * R;
  s += `<g transform="translate(540 960) scale(${pulse.toFixed(3)})"><circle r="${R + 22}" fill="${YOL}" opacity="0.35"/><circle r="${R}" fill="#fff" stroke="${YOL}" stroke-width="8"/>`;
  if (t >= T.cd0) s += `<circle r="${R}" fill="none" stroke="${num && num <= Math.ceil(dur / 2.5) ? '#FF2E3F' : '#FFC93C'}" stroke-width="16" stroke-dasharray="${f1(C * (1 - cd))} ${f1(C)}" transform="rotate(-90)" stroke-linecap="round"/>`;
  if (num) s += `<text y="-30" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="34" fill="${YOL}">ODER</text><text y="28" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="96" fill="${YOL}">${num}</text>`;
  else s += `<text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="58" fill="${YOL}">ODER</text>`;
  s += `</g>`;
  // time's up flash
  if (t > T.cd1) s += `<rect width="1080" height="1920" fill="#fff" opacity="${f1((1 - prog(t, T.cd1, T.cd1 + 0.25)) * 0.35 * 100) / 100}"/>`;
  return s;
}

function introFrame(t) {
  const p = Ease.outBack(prog(t, -0.3, 0.05));
  let s = half(true, '#2F7BFF', '#1449C9', 0) + half(false, '#FF4258', '#C41C3A', 0) + `<rect width="1080" height="1920" fill="#0B0B10" opacity="0.45"/>`;
  s += `<g transform="translate(540 820) scale(${Math.max(p, 0.001).toFixed(3)}) rotate(${f1(-3 + Math.sin(t * 4) * 1.5)})">${bigText(['Würdest du', 'lieber…?'], 0, 0, 130)}</g>`;
  s += `<g opacity="${f1(prog(t, -0.3, 0.05) * 100) / 100}">${bigText(['6 Fragen.', 'Die letzte ist unmöglich 💀'], 540, 1180, 62)}</g>`;
  return s.replace(/font-family="Inter"/g, `font-family="Inter, 'Noto Color Emoji'"`);
}

function outroFrame(t, b) {
  const tt = t - b.start;
  let s = `<rect width="1080" height="1920" fill="#0E0F14"/>` + half(true, '#2F7BFF', '#1449C9', 0).replace(/<rect/, '<rect opacity="0.25"') + half(false, '#FF4258', '#C41C3A', 0).replace(/<rect/, '<rect opacity="0.25"');
  const p = Ease.outBack(prog(tt, 0.05, 0.4));
  s += `<g transform="translate(540 760) scale(${Math.max(p, 0.001).toFixed(3)})">${bigText(['Schreib deine', '6 Antworten 👇'], 0, 0, 96)}</g>`.replace(/font-family="Inter"/g, `font-family="Inter, 'Noto Color Emoji'"`);
  const ex = 'A B A B B A';
  s += `<g opacity="${f1(prog(tt, 0.5, 0.9) * 100) / 100}">${bigText(['z. B.'], 540, 1040, 52, '#9AA1B2')}${bigText([ex], 540, 1150, 110, '#FFC93C')}</g>`;
  return s;
}

const SHOTS = [{
  from: 'intro', draw(t) {
    const n = QS().length, Ts = [...Array(n).keys()].map(i => qTiming(i + 1));
    let w;
    if (t < Ts[0].start) w = introFrame(t);
    else if (t >= B.outro.start) w = outroFrame(t, B.outro);
    else {
      let idx = 0;
      Ts.forEach((T, i) => { if (t >= T.start) idx = i; });
      w = questionFrame(t, Ts[idx], idx + 1, n);
    }
    // the last question opens with a shake
    const sh = wob(t, Ts[n - 1].start, 22, 12, 6);
    return { world: w, cam: { x: 540 - sh, y: 960, z: 1 }, noPunch: true };
  },
}];

function episodeOverlays() { return ''; }
