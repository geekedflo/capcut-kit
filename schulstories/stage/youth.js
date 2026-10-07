// Youth-style cast (ep02+): teen proportions, cel shading, streetwear.
// teen(name, opts) — origin = belt line, head centre at y -575.

const YOL = '#17151C'; // a touch darker outline
const TEENS = {
  toni:   { skin: '#F1C29C', shade: '#D9A07C', hair: 'crop', hairCol: '#1D1A1F', outfit: 'puffer', top: '#1B1C21', pants: '#3A3C43', shoes: '#F2F2EF', belt: true, airpods: true },
  jonas:  { skin: '#F6D3B8', shade: '#E0B092', hair: 'curtains', hairCol: '#8A5A35', outfit: 'hoodie', top: '#8D939B', pants: '#2C3850', shoes: '#26262A' },
  lena:   { skin: '#F3CDB0', shade: '#DDAA8A', hair: 'long', hairCol: '#3A2420', outfit: 'knit', top: '#E6D8C4', pants: '#56698A', shoes: '#F2F2EF', earrings: true },
  emre:   { skin: '#D2976C', shade: '#B67C54', hair: 'curls', hairCol: '#1E150F', outfit: 'zip', top: '#283546', pants: '#1F2024', shoes: '#F2F2EF' },
  sara:   { skin: '#8C5A3C', shade: '#744830', hair: 'bun', hairCol: '#1A120E', outfit: 'hoodie', top: '#3E5E4E', pants: '#1F2024', shoes: '#F2F2EF', earrings: true },
  ben:    { skin: '#FAD9C0', shade: '#E6B99C', hair: 'buzz', hairCol: '#C9A55A', outfit: 'zip', top: '#6E2F3A', pants: '#2C3850', shoes: '#26262A' },
  krause: { skin: '#F2C6A6', shade: '#DBA888', hair: 'bobgrey', hairCol: '#B9B6C4', outfit: 'blazer', top: '#4A3F6B', pants: '#2A2833', shoes: '#26262A', glasses: true, adult: true },
};

const TEXP = {
  deadpan: { lid: 0.46, bi: 0, bo: 0, ir: 10, m: 'flat' },
  side:    { lid: 0.46, bi: 0, bo: -2, ir: 10, m: 'flat', look: 1 },
  annoyed: { lid: 0.54, bi: 7, bo: -3, ir: 10, m: 'frown' },
  shock:   { lid: 0.0, bi: -14, bo: -12, ir: 7, m: 'O' },
  smug:    { lid: 0.42, bi: 0, bo: 0, ir: 10, m: 'smirk', raise: 12 },
  tired:   { lid: 0.62, bi: -3, bo: 2, ir: 10, m: 'flat', bags: true },
  neutral: { lid: 0.22, bi: 0, bo: 0, ir: 10, m: 'flat' },
  smile:   { lid: 0.25, bi: -3, bo: 0, ir: 10, m: 'smile' },
  stern:   { lid: 0.38, bi: 8, bo: -4, ir: 9, m: 'frown' },
  sweet:   { lid: 1, bi: -5, bo: 0, ir: 9, m: 'smile', happy: true },
};

function almondEye(x, y, { lid = 0, lx = 0, ly = 0, ir = 10, skin, iris = '#3B2A22', side = 1 }) {
  const id = uid();
  const d = `M ${x - 29} ${y} Q ${x - 4} ${y - 19} ${x + 29} ${y - 2} Q ${x + 2} ${y + 14} ${x - 29} ${y} Z`;
  const dd = side < 0 ? `M ${x + 29} ${y} Q ${x + 4} ${y - 19} ${x - 29} ${y - 2} Q ${x - 2} ${y + 14} ${x + 29} ${y} Z` : d;
  let s = `<clipPath id="${id}"><path d="${dd}"/></clipPath><path d="${dd}" fill="#fff"/>`;
  s += `<g clip-path="url(#${id})"><circle cx="${f1(x + lx * 11)}" cy="${f1(y - 2 + ly * 5)}" r="${ir}" fill="${iris}"/><circle cx="${f1(x + lx * 11)}" cy="${f1(y - 2 + ly * 5)}" r="${f1(ir * 0.5)}" fill="#0E0B0B"/><circle cx="${f1(x + lx * 11 - 3)}" cy="${f1(y - 5 + ly * 5)}" r="2.6" fill="#fff"/>`;
  const yl = y - 13 + lid * 26;
  if (lid > 0.01) s += `<path d="M ${x - 34} ${y - 30} L ${x + 34} ${y - 30} L ${x + 34} ${f1(yl - 2)} Q ${x} ${f1(yl - 10)} ${x - 34} ${f1(yl)} Z" fill="${skin}"/>`;
  s += `</g><path d="${dd}" fill="none" stroke="${YOL}" stroke-width="2.6"/>`;
  // lash line follows the lid
  if (lid > 0.01) s += `<path d="M ${x - 31} ${f1(yl + 1)} Q ${x} ${f1(yl - 9)} ${x + 31} ${f1(yl - 2)}" fill="none" stroke="${YOL}" stroke-width="5.5" stroke-linecap="round"/>`;
  else s += `<path d="${side < 0 ? `M ${x + 31} ${y} Q ${x + 4} ${y - 20} ${x - 31} ${y - 3}` : `M ${x - 31} ${y} Q ${x - 4} ${y - 20} ${x + 31} ${y - 3}`}" fill="none" stroke="${YOL}" stroke-width="5.5" stroke-linecap="round"/>`;
  return s;
}

function teenMouth(x, y, open, shape) {
  if (shape === 'O') return `<ellipse cx="${x}" cy="${y + 4}" rx="11" ry="15" fill="#3A1418" stroke="${YOL}" stroke-width="4.5"/>`;
  if (open < 0.1) {
    const st = `fill="none" stroke="${YOL}" stroke-width="5" stroke-linecap="round"`;
    if (shape === 'smirk') return `<path d="M ${x - 18} ${y + 2} Q ${x + 4} ${y + 6} ${x + 20} ${y - 7}" ${st}/>`;
    if (shape === 'frown') return `<path d="M ${x - 18} ${y + 5} Q ${x} ${y - 3} ${x + 18} ${y + 5}" ${st}/>`;
    if (shape === 'smile') return `<path d="M ${x - 20} ${y - 2} Q ${x} ${y + 12} ${x + 20} ${y - 2}" ${st}/>`;
    return `<path d="M ${x - 17} ${y} L ${x + 17} ${y}" ${st}/>`;
  }
  const w = 30 + 12 * open, h = 5 + 24 * open;
  const d = `M ${x - w / 2} ${y} Q ${x} ${y - 4} ${x + w / 2} ${y} Q ${x + w / 2 - 2} ${y + h} ${x} ${y + h} Q ${x - w / 2 + 2} ${y + h} ${x - w / 2} ${y} Z`;
  const id = uid();
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="#3A1418"/><g clip-path="url(#${id})"><rect x="${x - w / 2}" y="${y - 2}" width="${w}" height="${f1(4 + h * 0.18)}" fill="#F4F1EC"/><ellipse cx="${x}" cy="${y + h}" rx="${w * 0.3}" ry="${h * 0.35}" fill="#B9505C"/></g><path d="${d}" fill="none" stroke="${YOL}" stroke-width="4.5" stroke-linejoin="round"/>`;
}

function teenHair(style, col, part) {
  const st = `fill="${col}" stroke="${YOL}" stroke-width="6" stroke-linejoin="round"`;
  const tex = (paths) => paths.map(p => `<path d="${p}" fill="none" stroke="#FFFFFF" stroke-opacity="0.13" stroke-width="5" stroke-linecap="round"/>`).join('');
  if (part === 'back') {
    if (style === 'long') return `<path d="M -128 -70 C -150 90 -146 250 -122 330 Q 0 360 122 330 C 146 250 150 90 128 -70 Z" ${st}/>`;
    if (style === 'bun') return `<g transform="translate(0 -150)"><ellipse rx="58" ry="46" ${st}/><rect x="-40" y="-12" width="80" height="24" rx="8" fill="#C7A07A" stroke="${YOL}" stroke-width="5"/></g>`;
    if (style === 'bobgrey') return `<path d="M -124 -60 C -140 40 -132 110 -112 140 L 112 140 C 132 110 140 40 124 -60 Z" ${st}/>`;
    return '';
  }
  switch (style) {
    case 'crop':
      return `<path d="M -106 -20 C -112 -80 -100 -112 -78 -126 L -70 -60 Q -94 -50 -104 0 Z M 106 -20 C 112 -80 100 -112 78 -126 L 70 -60 Q 94 -50 104 0 Z" fill="${col}" opacity="0.5"/>` +
        `<path d="M -100 -52 C -112 -126 -60 -172 0 -170 C 60 -174 114 -126 100 -52 L 88 -64 L 76 -54 L 62 -68 L 46 -57 L 30 -71 L 14 -59 L -4 -71 L -20 -58 L -38 -69 L -54 -56 L -70 -67 L -86 -55 Z" ${st}/>` +
        tex(['M -62 -140 q 16 -12 32 -8', 'M -12 -152 q 18 -10 34 -4', 'M 40 -140 q 14 -8 28 0', 'M -84 -100 q 10 -14 26 -16']);
    case 'curtains':
      return `<path d="M -114 30 C -128 -110 -70 -176 0 -170 C 70 -176 128 -110 114 30 L 100 40 C 102 -26 84 -66 44 -80 Q 18 -74 3 -116 Q -14 -74 -42 -80 C -84 -66 -102 -26 -100 40 Z" ${st}/>` +
        tex(['M -70 -120 q 30 -20 60 -10', 'M 20 -130 q 30 0 56 20', 'M -90 -40 q 6 -30 30 -44']);
    case 'long':
      return `<path d="M -112 -10 C -124 -124 -60 -174 0 -168 C 60 -174 124 -124 112 -10 L 122 140 L 94 146 C 100 50 92 -30 54 -86 Q 22 -108 2 -146 Q -20 -108 -52 -86 C -92 -30 -100 50 -94 146 L -122 140 Z" ${st}/>` +
        tex(['M -100 10 q -6 60 4 110', 'M 100 10 q 6 60 -4 110', 'M -50 -140 q 20 -14 44 -10']);
    case 'curls': {
      let s = `<path d="M -106 -20 C -110 -70 -102 -100 -84 -112 L -74 -60 Q -96 -50 -104 0 Z M 106 -20 C 110 -70 102 -100 84 -112 L 74 -60 Q 96 -50 104 0 Z" fill="${col}" opacity="0.5"/>`;
      [[-78, -96], [-50, -128], [-14, -142], [24, -140], [58, -124], [82, -96], [-30, -100], [10, -106], [48, -94], [-62, -72], [66, -70], [-20, -70], [22, -72]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="30" ${st}/>`));
      return s;
    }
    case 'bun':
      return `<path d="M -104 -40 C -112 -130 -60 -166 0 -164 C 60 -166 112 -130 104 -40 Q 70 -96 0 -104 Q -70 -96 -104 -40 Z" ${st}/>` + tex(['M -60 -130 q 30 -14 60 -10', 'M 10 -140 q 30 -4 50 10']);
    case 'buzz':
      return `<path d="M -104 -40 C -110 -130 -60 -160 0 -160 C 60 -160 110 -130 104 -40 Q 60 -84 0 -86 Q -60 -84 -104 -40 Z" fill="${col}" opacity="0.85" stroke="${YOL}" stroke-width="5"/>`;
    case 'bobgrey':
      return `<path d="M -118 40 C -132 -120 -60 -176 0 -170 C 60 -176 132 -120 118 40 L 100 44 C 104 -40 80 -92 30 -98 Q -20 -96 -60 -70 C -90 -50 -102 -10 -100 44 Z" ${st}/>` + tex(['M -80 -110 q 30 -30 70 -30', 'M 30 -140 q 40 0 60 30']);
  }
  return '';
}

function pufferLimb(a, c, b, w, col, segs = 2) {
  let s = limb(a, c, b, w, col).replace(new RegExp(OL, 'g'), YOL);
  for (let i = 1; i <= segs; i++) {
    const u = i / (segs + 1), p = bez(a, c, b, u), p2 = bez(a, c, b, u + 0.01);
    const dx = p2[0] - p[0], dy = p2[1] - p[1], L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L, r = w * 0.48;
    s += `<path d="M ${f1(p[0] - nx * r)} ${f1(p[1] - ny * r)} L ${f1(p[0] + nx * r)} ${f1(p[1] + ny * r)}" stroke="#08080A" stroke-width="4" stroke-linecap="round"/>`;
  }
  const h0 = bez(a, c, b, 0.12), h1 = bez(a, c, b, 0.5), h2 = bez(a, c, b, 0.88);
  s += `<path d="M ${f1(h0[0] - 10)} ${f1(h0[1])} Q ${f1(h1[0] - 16)} ${f1(h1[1])} ${f1(h2[0] - 10)} ${f1(h2[1])}" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="7" stroke-linecap="round"/>`;
  return s;
}
const ylimb = (a, c, b, w, col) => limb(a, c, b, w, col).replace(new RegExp(OL, 'g'), YOL);
const yhand = (x, y, r, skin, rot = 0) => hand(x, y, r, skin, rot).replace(new RegExp(OL, 'g'), YOL);

// fake designer bits (recognisable, not copied logos)
const sleeveBadge = (x, y) => `<g transform="${T(x, y)} rotate(-8)"><circle r="17" fill="#fff" stroke="${YOL}" stroke-width="3.5"/><path d="M -15 5 L 15 5 L 13 10 L -13 10 Z" fill="#2A4FB0"/><path d="M -12 10 L 12 10 L 8 14 L -8 14 Z" fill="#D8333A"/><path d="M -6 -9 L 6 -9 L 3 1 L -3 1 Z" fill="${YOL}"/></g>`;
const beltBuckle = (x, y) => `<g transform="${T(x, y)} scale(1.35)" fill="none" stroke="#D9B23C" stroke-width="5.5" stroke-linecap="round"><path d="M 2 -9 A 11 11 0 1 0 2 9 L 2 1 L -4 1"/><path d="M -2 -9 A 11 11 0 1 1 -2 9 L -2 1 L 4 1"/></g>`;

function teen(name, o) {
  let k = TEENS[name];
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, expr: 'deadpan', lx: null, ly: 0, mouth: 0, seed: 1, legs: false, walk: 0, pose: 'down', tilt: 0, bob: 0, noBlink: false, phoneGlow: 0, flip: false, sunglasses: false, outfit: null }, o);
  if (p.outfit) Object.assign(k = { ...k }, { outfit: p.outfit, top: p.top || k.top });
  const E = TEXP[p.expr];
  const t = p.t, skin = k.skin;
  const breathe = Math.sin(t * 2 + p.seed) * 2.5;
  let s = '';
  // legs
  if (p.legs) {
    const ph = p.walk * Math.PI * 2;
    [[-56, 1], [56, -1]].forEach(([hx, dir]) => {
      const lift = Math.max(0, Math.sin(ph) * dir) * 30;
      const fy = 410 - lift;
      s += ylimb([hx, 20], [hx + Math.sign(hx) * (4 + lift * 0.4), 215 - lift * 0.5], [hx * 1.08, fy], 80, k.pants);
      s += `<path d="M ${f1(hx * 1.08 + Math.sign(hx) * 26)} ${f1(fy - 110)} l 0 60" stroke="${YOL}" stroke-width="4" opacity="0.5"/>`;
      s += `<g transform="${T(hx * 1.12 + Math.sign(hx) * 6, fy + 18)}"><path d="M -48 6 C -50 -24 -20 -30 8 -26 C 40 -22 58 -8 60 8 L 60 20 L -48 20 Z" fill="${k.shoes}" stroke="${YOL}" stroke-width="5.5" stroke-linejoin="round"/><rect x="-50" y="14" width="112" height="14" rx="6" fill="#DADAD6" stroke="${YOL}" stroke-width="5"/></g>`;
    });
  } else {
    s += `<rect x="-150" y="-10" width="300" height="200" fill="${k.pants}" stroke="${YOL}" stroke-width="6"/>`;
  }
  const by = (p.legs ? -Math.abs(Math.sin(p.walk * Math.PI * 2)) * 10 : 0) + p.bob;
  let body = '';
  // back hair
  const hb = teenHair(k.hair, k.hairCol, 'back');
  if (hb) body += `<g transform="translate(0 ${f1(-575 + breathe * 0.4)}) rotate(${f1(p.tilt)})">${hb}</g>`;
  // neck
  body += `<rect x="-34" y="-478" width="68" height="100" fill="${skin}" stroke="${YOL}" stroke-width="6"/><path d="M -34 -456 Q 0 -432 34 -456 L 34 -478 L -34 -478 Z" fill="${k.shade}" opacity="0.7"/>`;
  // torso
  const sh = [[-152, -388], [152, -388]];
  if (k.outfit === 'puffer') {
    const ys = [-388, -312, -236, -160, -84, -12];
    let d = `M -60 -440 Q -128 -430 -152 -388`;
    for (let i = 1; i < ys.length; i++) d += ` Q ${-170 - 14} ${(ys[i - 1] + ys[i]) / 2} ${-160 - i * 1.5} ${ys[i]}`;
    d += ` Q 0 4 ${160 + 7.5} -12`;
    for (let i = ys.length - 2; i >= 0; i--) d += ` Q ${170 + 14} ${(ys[i + 1] + ys[i]) / 2} ${i === 0 ? 152 : 160 + i * 1.5} ${ys[i]}`;
    d += ` Q 128 -430 60 -440 Z`;
    body += `<path d="${d}" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    ys.slice(1, -1).forEach(y => (body += `<path d="M -166 ${y} Q 0 ${y + 16} 166 ${y}" fill="none" stroke="#07070A" stroke-width="4.5"/>`));
    ys.slice(0, -1).forEach((y, i) => (body += `<path d="M -130 ${y + 22} Q -80 ${y + 12} -30 ${y + 20}" fill="none" stroke="#fff" stroke-opacity="0.17" stroke-width="8" stroke-linecap="round"/><path d="M 40 ${y + 24} Q 80 ${y + 16} 120 ${y + 22}" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="6" stroke-linecap="round"/>`));
    body += `<path d="M 0 -440 L 0 -6" stroke="#9097A3" stroke-width="4"/>`;
    body += `<path d="M -66 -432 Q -76 -486 -36 -494 L 36 -494 Q 76 -486 66 -432 Q 0 -414 -66 -432 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6"/><path d="M -50 -470 Q 0 -462 50 -470" stroke="#07070A" stroke-width="4" fill="none"/><rect x="-6" y="-470" width="12" height="22" rx="3" fill="#B9BEC8" stroke="${YOL}" stroke-width="3"/>`;
  } else if (k.outfit === 'hoodie') {
    body += `<path d="M -70 -430 Q -60 -470 0 -472 Q 60 -470 70 -430 Q 0 -400 -70 -430 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6" style="filter:brightness(0.9)"/>`;
    body += `<path d="M -62 -436 Q -150 -428 -172 -370 C -184 -250 -184 -120 -176 20 L -176 46 L 176 46 L 176 20 C 184 -120 184 -250 172 -370 Q 150 -428 62 -436 Q 0 -404 -62 -436 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    body += `<rect x="-176" y="14" width="352" height="34" rx="8" fill="${k.top}" stroke="${YOL}" stroke-width="5"/><path d="M -100 -40 L -80 -150 L 80 -150 L 100 -40 Z" fill="none" stroke="${YOL}" stroke-width="4.5" opacity="0.7"/>`;
    body += `<path d="M -26 -424 L -30 -330 M 26 -424 L 30 -330" stroke="#EDEDED" stroke-width="6" stroke-linecap="round"/><path d="M 120 -380 C 140 -250 140 -120 130 20" stroke="${YOL}" stroke-opacity="0.18" stroke-width="30" fill="none"/>`;
  } else if (k.outfit === 'knit') {
    body += `<path d="M -50 -444 Q -140 -432 -160 -380 C -170 -260 -168 -120 -160 0 L 160 0 C 168 -120 170 -260 160 -380 Q 140 -432 50 -444 Q 0 -420 -50 -444 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    for (let x = -130; x <= 130; x += 26) body += `<path d="M ${x} -400 L ${x * 1.04} -10" stroke="${YOL}" stroke-opacity="0.09" stroke-width="5"/>`;
    body += `<rect x="-160" y="-22" width="320" height="26" rx="6" fill="${k.top}" stroke="${YOL}" stroke-width="5"/><path d="M -40 -438 Q 0 -380 40 -438" fill="none" stroke="#D9B23C" stroke-width="3"/><circle cx="0" cy="-394" r="6" fill="#D9B23C" stroke="${YOL}" stroke-width="2"/>`;
  } else if (k.outfit === 'zip') {
    body += `<path d="M -60 -440 Q -140 -432 -160 -382 C -170 -260 -168 -120 -162 -6 L 162 -6 C 168 -120 170 -260 160 -382 Q 140 -432 60 -440 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    body += `<path d="M -58 -440 L -40 -490 L 40 -490 L 58 -440" fill="${k.top}" stroke="${YOL}" stroke-width="6"/><path d="M 0 -490 L 0 -8" stroke="#C9CDD4" stroke-width="4"/><rect x="-162" y="-26" width="324" height="24" rx="6" fill="${k.top}" stroke="${YOL}" stroke-width="5" style="filter:brightness(0.85)"/>`;
  } else if (k.outfit === 'tee') {
    body += `<path d="M -56 -446 Q -150 -436 -168 -380 C -172 -260 -168 -120 -160 0 L 160 0 C 168 -120 172 -260 168 -380 Q 150 -436 56 -446 Q 0 -410 -56 -446 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    body += `<path d="M -150 -420 Q -70 -360 -40 -440 L -10 -440 Q -40 -330 -170 -380 Z" fill="#F08A5D" stroke="${YOL}" stroke-width="5"/><path d="M 150 -420 Q 70 -360 40 -440 L 10 -440 Q 40 -330 170 -380 Z" fill="#F08A5D" stroke="${YOL}" stroke-width="5"/>`;
  } else if (k.outfit === 'blazer') {
    body += `<path d="M -56 -444 Q -146 -432 -166 -380 C -176 -260 -176 -100 -170 80 L 170 80 C 176 -100 176 -260 166 -380 Q 146 -432 56 -444 Z" fill="${k.top}" stroke="${YOL}" stroke-width="6.5" stroke-linejoin="round"/>`;
    body += `<path d="M -56 -444 L 0 -220 L 56 -444 Z" fill="#EFE9DE" stroke="${YOL}" stroke-width="5"/><path d="M -56 -444 L -90 -300 L -20 -260 M 56 -444 L 90 -300 L 20 -260" fill="none" stroke="${YOL}" stroke-width="5"/>`;
    body += `<circle cx="12" cy="-150" r="7" fill="#D9B23C" stroke="${YOL}" stroke-width="3"/><circle cx="12" cy="-80" r="7" fill="#D9B23C" stroke="${YOL}" stroke-width="3"/>`;
  }
  if (k.belt && k.outfit === 'puffer') body += `<rect x="-150" y="-6" width="300" height="24" fill="#121216" stroke="${YOL}" stroke-width="4"/>` + beltBuckle(0, 6);
  // arms
  const pose = p.pose;
  const armCol = k.top;
  const L = (a, c, b) => (k.outfit === 'puffer' ? pufferLimb(a, c, b, 76, armCol) : ylimb(a, c, b, k.outfit === 'knit' ? 62 : 70, armCol));
  let arms = '', armsFront = '';
  if (pose === 'crossed') {
    arms += L(sh[0], [-215, -220], [120, -236]);
    armsFront += L(sh[1], [215, -250], [-110, -262]) + yhand(-128, -268, 23, skin, -30);
    if (k.outfit === 'puffer') armsFront += sleeveBadge(168, -330);
  } else if (pose === 'phone' || pose === 'phoneUp') {
    const up = pose === 'phoneUp';
    const hp = up ? [-40, -330] : [-70, -230];
    arms += L(sh[1], [190, -200], [180, -20]) + yhand(180, -20, 26, skin);
    if (k.outfit === 'puffer') arms += sleeveBadge(166, -320);
    armsFront += L(sh[0], [-210, -200], hp);
    armsFront += `<g transform="${T(hp[0] + 10, hp[1] - 60)} rotate(${up ? 0 : -12})"><rect x="-40" y="-75" width="80" height="150" rx="14" fill="#2B2D33" stroke="${YOL}" stroke-width="5"/><circle cx="-18" cy="-52" r="8" fill="#111" stroke="#555" stroke-width="3"/><circle cx="-18" cy="-28" r="8" fill="#111" stroke="#555" stroke-width="3"/></g>`;
    armsFront += yhand(hp[0], hp[1], 26, skin, 10);
  } else if (pose === 'desk') {
    const ty = Math.sin(t * 22) * 4;
    arms += L(sh[0], [-200, -240], [-90, -150 + ty]) + yhand(-90, -150 + ty, 25, skin) + L(sh[1], [200, -240], [90, -150 - ty]) + yhand(90, -150 - ty, 25, skin);
    if (k.outfit === 'puffer') arms += sleeveBadge(176, -330);
  } else if (pose === 'point') {
    arms += L(sh[1], [190, -200], [180, -20]) + yhand(180, -20, 26, skin);
    armsFront += L(sh[0], [-260, -360], [-300, -520]) + yhand(-300, -520, 26, skin);
  } else if (pose === 'hips') {
    arms += L(sh[0], [-250, -260], [-140, -40]) + yhand(-140, -40, 25, skin) + L(sh[1], [250, -260], [140, -40]) + yhand(140, -40, 25, skin);
    if (k.outfit === 'puffer') arms += sleeveBadge(196, -320);
  } else {
    const sw = p.legs ? Math.sin(p.walk * Math.PI * 2) * 14 : 0;
    arms += L(sh[0], [-196, -200], [-184 + sw, -16]) + yhand(-184 + sw, -16, 26, skin) + L(sh[1], [196, -200], [184 - sw, -16]) + yhand(184 - sw, -16, 26, skin);
    if (k.outfit === 'puffer') arms += sleeveBadge(178, -320);
  }
  // head
  let h = '';
  const bl = p.noBlink ? 0 : blink(t, p.seed);
  const lid = clamp(Math.max(E.lid, bl));
  h += `<ellipse cx="-103" cy="8" rx="16" ry="26" fill="${skin}" stroke="${YOL}" stroke-width="5.5"/><ellipse cx="103" cy="8" rx="16" ry="26" fill="${skin}" stroke="${YOL}" stroke-width="5.5"/>`;
  const face = `M -105 -24 C -108 -112 -60 -138 0 -138 C 60 -138 108 -112 105 -24 C 102 48 72 108 0 124 C -72 108 -102 48 -105 -24 Z`;
  const fid = uid();
  h += `<clipPath id="${fid}"><path d="${face}"/></clipPath><path d="${face}" fill="${skin}"/>`;
  h += `<g clip-path="url(#${fid})"><path d="M 46 -150 C 118 -70 112 60 24 150 L 220 150 L 220 -150 Z" fill="${k.shade}" opacity="0.6"/><path d="M -120 -64 Q 0 -40 120 -64 L 120 -40 Q 0 -18 -120 -40 Z" fill="${k.shade}" opacity="0.35"/>`;
  if (k.adult) h += `<path d="M -40 40 Q -54 70 -42 92 M 40 40 Q 54 70 42 92" fill="none" stroke="${k.shade}" stroke-width="5" stroke-linecap="round"/>`;
  h += `</g><path d="${face}" fill="none" stroke="${YOL}" stroke-width="6"/>`;
  if (k.airpods) h += `<g fill="#FBFBFB" stroke="${YOL}" stroke-width="3.5"><ellipse cx="-99" cy="10" rx="9" ry="8"/><rect x="-103" y="12" width="8" height="26" rx="4"/><ellipse cx="99" cy="10" rx="9" ry="8"/><rect x="95" y="12" width="8" height="26" rx="4"/></g>`;
  if (k.earrings) h += `<circle cx="-103" cy="40" r="9" fill="none" stroke="#D9B23C" stroke-width="3.5"/><circle cx="103" cy="40" r="9" fill="none" stroke="#D9B23C" stroke-width="3.5"/>`;
  const lx = p.lx != null ? p.lx : E.look || 0;
  if (E.happy) {
    h += `<path d="M -70 -6 Q -42 -24 -14 -6 M 14 -6 Q 42 -24 70 -6" fill="none" stroke="${YOL}" stroke-width="5.5" stroke-linecap="round"/>`;
  } else {
    h += almondEye(-42, -6, { lid, lx, ly: p.ly, ir: E.ir, skin, side: 1 });
    h += almondEye(42, -6, { lid, lx, ly: p.ly, ir: E.ir, skin, side: -1 });
  }
  if (E.bags) h += `<path d="M -66 16 Q -42 26 -18 16 M 18 16 Q 42 26 66 16" fill="none" stroke="${k.shade}" stroke-width="4" stroke-linecap="round"/><path d="M -62 22 Q -42 30 -22 22 M 22 22 Q 42 30 62 22" fill="none" stroke="#9A86A8" stroke-opacity="0.45" stroke-width="5" stroke-linecap="round"/>`;
  if (k.glasses) h += `<g fill="#fff" fill-opacity="0.12" stroke="#B2343F" stroke-width="5.5"><path d="M -82 -18 Q -84 -34 -60 -32 L -14 -28 Q -6 -6 -14 10 Q -40 22 -70 14 Q -84 6 -82 -18 Z M -82 -18 L -98 -36"/><path d="M 82 -18 Q 84 -34 60 -32 L 14 -28 Q 6 -6 14 10 Q 40 22 70 14 Q 84 6 82 -18 Z M 82 -18 L 98 -36"/><path d="M -12 -16 Q 0 -24 12 -16" fill="none"/></g>`;
  if (p.sunglasses) h += `<g fill="#15151A" stroke="${YOL}" stroke-width="5"><path d="M -86 -24 L -10 -24 Q -8 6 -30 14 L -66 14 Q -88 6 -86 -24 Z"/><path d="M 86 -24 L 10 -24 Q 8 6 30 14 L 66 14 Q 88 6 86 -24 Z"/><path d="M -10 -20 L 10 -20" fill="none"/></g><path d="M -74 -16 L -54 -16" stroke="#fff" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>`;
  // brows
  const browY = -40, r = E.raise || 0;
  h += `<path d="M -72 ${browY + E.bo} L -20 ${browY + E.bi}" stroke="${k.adult ? '#7A7489' : k.hairCol}" stroke-width="10" stroke-linecap="round"/>`;
  h += `<path d="M 20 ${browY + E.bi - r} L 72 ${browY + E.bo - r * 1.3}" stroke="${k.adult ? '#7A7489' : k.hairCol}" stroke-width="10" stroke-linecap="round"/>`;
  // nose + mouth
  h += `<path d="M 4 -2 L 13 38 Q 4 45 -7 41" fill="none" stroke="${YOL}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  h += teenMouth(0, 72, p.mouth, E.m);
  h += teenHair(k.hair, k.hairCol, 'front');
  if (p.phoneGlow > 0) h += `<path d="${face}" fill="#7FA6FF" opacity="${f1(p.phoneGlow * 0.1 * 100) / 100}"/>`;
  const head = `<g transform="translate(0 ${f1(-575 + breathe * 0.4)}) rotate(${f1(p.tilt)})">${h}</g>`;
  s += `<g transform="translate(0 ${f1(by)})">${body}${arms}${head}${armsFront}</g>`;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s})">${s}</g>`;
}

// ------------------------------------------------------------ sets (muted palette)
function classroomMuted(t) {
  return `<g filter="url(#mute)">${classroomWall(t)}</g>`;
}

function frontOfClass(t, slide) {
  let s = `<rect x="-600" y="-400" width="2280" height="2600" fill="#CFC6B6"/>`;
  for (let x = -600; x < 1700; x += 140) s += `<rect x="${x}" y="-400" width="70" height="2600" fill="#C8BFAE"/>`;
  s += `<rect x="-600" y="1240" width="2280" height="900" fill="#9C9384"/><rect x="-600" y="1230" width="2280" height="16" fill="#7D7466"/>`;
  // projection screen
  s += `<g transform="translate(540 520)"><rect x="-470" y="-300" width="940" height="560" fill="#F4F2EE" stroke="${YOL}" stroke-width="7"/><rect x="-490" y="-322" width="980" height="30" rx="12" fill="#55555E" stroke="${YOL}" stroke-width="5"/>${slide || ''}</g>`;
  return s;
}

function titleSlide() {
  return `<rect x="-450" y="-280" width="900" height="520" fill="#1F6B4F"/><circle cx="330" cy="-160" r="70" fill="#F4D35E"/><path d="M -450 160 Q -200 60 0 160 T 450 140 L 450 240 L -450 240 Z" fill="#2E8B63"/>
    <text x="0" y="-30" text-anchor="middle" font-family="Inter" font-weight="900" font-size="92" fill="#fff">PHOTOSYNTHESE</text>
    <text x="0" y="50" text-anchor="middle" font-family="Inter" font-weight="900" font-size="38" fill="#CDEBDC">Gruppe 3 · Jonas, Lena, Emre, Toni</text>`;
}

// ------------------------------------------------------------ phone chat UI (generic, dark mode)
const CHAT_COL = { toni: '#5B5BD6', jonas: '#E7A04B', lena: '#E46C9A', emre: '#4FB6A8' };
function chatScreen(t, { title, msgs, typing = null, readBy = null }) {
  let s = `<rect width="1080" height="1920" fill="#0F1115"/>`;
  s += `<rect width="1080" height="300" fill="#1A1D24"/><path d="M 0 300 L 1080 300" stroke="#2B2F38" stroke-width="3"/>`;
  s += `<path d="M 60 220 l -22 -22 l 22 -22" fill="none" stroke="#8EA2FF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;
  s += `<circle cx="150" cy="200" r="46" fill="#2E7D5B"/><text x="150" y="200" text-anchor="middle" dominant-baseline="central" font-size="46" font-family="'Noto Color Emoji'">🧬</text>`;
  s += `<text x="220" y="188" font-family="Inter" font-weight="900" font-size="46" fill="#F2F3F7">${esc(title)}</text>`;
  s += `<text x="220" y="238" font-family="Inter" font-weight="400" font-size="30" fill="#8C93A3">Jonas, Lena, Emre, Du</text>`;
  let y = 380;
  msgs.forEach(m => {
    if (t < m.t0) return;
    const pop = Ease.outBack(prog(t, m.t0, m.t0 + 0.22));
    const me = m.from === 'toni';
    const size = 50, maxW = 820;
    const emo = (m.text.match(/[\u{1F000}-\u{1FFFF}\u2600-\u27BF]/gu) || []).length;
    const tw_ = Math.min(maxW, textW(m.text, size, 'Inter', 400) + 64 + emo * 34);
    const name = me ? '' : m.from[0].toUpperCase() + m.from.slice(1);
    const bh = 136 + (name ? 0 : -40);
    const bx = me ? 1040 - tw_ : 140;
    let b = '';
    if (!me) b += `<circle cx="90" cy="${y + bh - 40}" r="34" fill="${CHAT_COL[m.from]}"/><text x="90" y="${y + bh - 40}" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="34" fill="#fff">${name[0]}</text>`;
    b += `<rect x="${bx}" y="${y}" width="${tw_}" height="${bh}" rx="34" fill="${me ? CHAT_COL.toni : '#262A33'}"/>`;
    if (name) b += `<text x="${bx + 30}" y="${y + 44}" font-family="Inter" font-weight="900" font-size="34" fill="${CHAT_COL[m.from]}">${name}</text>`;
    b += `<text x="${bx + 30}" y="${y + bh - 34}" font-family="Inter" font-weight="400" font-size="${size}" fill="#F2F3F7">${esc(m.text)}</text>`;
    b += `<text x="${bx + tw_ - 20}" y="${y + bh + 34}" text-anchor="end" font-family="Inter" font-weight="400" font-size="26" fill="#6C7383">${m.time || ''}</text>`;
    const cx = me ? bx + tw_ : bx;
    s += `<g transform="translate(${cx} ${y + bh}) scale(${pop.toFixed(3)}) translate(${-cx} ${-(y + bh)})">${b}</g>`;
    y += bh + 70;
  });
  if (readBy && t >= readBy.t0) {
    const pop = Ease.outBack(prog(t, readBy.t0, readBy.t0 + 0.25));
    s += `<g transform="translate(540 ${y + 20}) scale(${pop.toFixed(3)})"><rect x="-360" y="-42" width="720" height="84" rx="42" fill="#1E222B"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="400" font-size="38" fill="#9AA1B2">${esc(readBy.text)}</text></g>`;
  }
  s += `<rect x="0" y="1700" width="1080" height="220" fill="#1A1D24"/><rect x="40" y="1740" width="860" height="90" rx="45" fill="#262A33"/><text x="90" y="1798" font-family="Inter" font-size="36" fill="#6C7383">Nachricht</text><circle cx="975" cy="1785" r="45" fill="${CHAT_COL.toni}"/>`;
  return s;
}

// phone push notification banner (screen space)
function notif(t, t0, who, text, { y = 120, dur = 2.2 } = {}) {
  if (t < t0 || t > t0 + dur) return '';
  const p = Ease.outBack(prog(t, t0, t0 + 0.3)) - Ease.inCubic(prog(t, t0 + dur - 0.25, t0 + dur));
  const yy = lerp(-220, y, p);
  return `<g transform="translate(60 ${f1(yy)})"><rect width="960" height="170" rx="40" fill="#1E2129" fill-opacity="0.94" stroke="#3A3F4B" stroke-width="2"/>
    <circle cx="90" cy="85" r="50" fill="${CHAT_COL[who] || '#888'}"/><text x="90" y="85" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="46" fill="#fff">${who[0].toUpperCase()}</text>
    <text x="170" y="70" font-family="Inter" font-weight="900" font-size="40" fill="#F2F3F7">${who[0].toUpperCase() + who.slice(1)} · Referat Bio</text>
    <text x="170" y="125" font-family="Inter" font-weight="400" font-size="42" fill="#C9CEDA">${esc(text)}</text>
    <text x="920" y="70" text-anchor="end" font-family="Inter" font-weight="400" font-size="30" fill="#6C7383">jetzt</text></g>`;
}

// ------------------------------------------------------------ ep02 sets & overlays
function bedroomNight(t, flicker = 0) {
  let s = `<rect x="-600" y="-400" width="2280" height="2600" fill="#1A1E2C"/>`;
  s += `<rect x="-600" y="80" width="2280" height="26" fill="#C46BFF" opacity="0.9"/><rect x="-600" y="60" width="2280" height="140" fill="url(#ledglow)"/>`;
  s += `<g transform="translate(110 360)"><rect width="320" height="400" rx="8" fill="#0D1020" stroke="${YOL}" stroke-width="7"/><circle cx="230" cy="110" r="42" fill="#F4EFD8"/><circle cx="214" cy="100" r="40" fill="#0D1020"/><circle cx="70" cy="80" r="3" fill="#fff"/><circle cx="130" cy="190" r="2.5" fill="#fff"/><circle cx="260" cy="300" r="3" fill="#fff"/><path d="M 160 0 L 160 400 M 0 200 L 320 200" stroke="#2A2F45" stroke-width="10"/></g>`;
  s += `<g transform="translate(700 330) rotate(3)"><rect width="240" height="330" fill="#2A2238" stroke="${YOL}" stroke-width="6"/><text x="120" y="150" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#C46BFF" opacity="0.85">NO</text><text x="120" y="210" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#C46BFF" opacity="0.85">SLEEP</text></g>`;
  s += `<rect x="-600" y="1180" width="2280" height="1000" fill="#121522"/>`;
  s += `<rect x="-600" y="-400" width="2280" height="2600" fill="#000" opacity="${f1(flicker * 100) / 100}"/>`;
  return s;
}
function laptopDesk(x, y, s, cans = 0, glow = 1) {
  let d = `<g transform="${T(x, y)} scale(${s})">`;
  d += `<rect x="-560" y="-20" width="1120" height="600" fill="#2B2420" stroke="${YOL}" stroke-width="7"/><rect x="-580" y="-40" width="1160" height="40" rx="10" fill="#3A302A" stroke="${YOL}" stroke-width="6"/>`;
  d += `<path d="M -230 -40 L -250 -330 L 250 -330 L 230 -40 Z" fill="#8D929C" stroke="${YOL}" stroke-width="7"/><path d="M -250 -330 L 250 -330" stroke="#C9CDD4" stroke-width="5"/><circle cx="0" cy="-190" r="26" fill="#A3A8B2" stroke="#7A7F89" stroke-width="3"/><rect x="60" y="-140" width="80" height="34" rx="8" fill="#C46BFF" transform="rotate(-8 100 -123)"/>`;
  for (let i = 0; i < cans; i++) {
    const cx = (i % 2 ? -1 : 1) * (300 + Math.floor(i / 2) * 62), cy = -40;
    d += `<g transform="translate(${cx} ${cy})"><rect x="-26" y="-118" width="52" height="118" rx="8" fill="${['#2FD07A', '#E8E8EA', '#3A6BFF'][i % 3]}" stroke="${YOL}" stroke-width="5"/><rect x="-26" y="-80" width="52" height="34" fill="${YOL}" opacity="0.8"/><text x="0" y="-57" text-anchor="middle" font-family="Inter" font-weight="900" font-size="11" fill="#fff">ENERGY</text></g>`;
  }
  return d + '</g>';
}
function slideCounter(t, t0, t1, x, y) {
  const n = Math.max(1, Math.min(24, Math.floor(1 + 23 * Ease.inOutQuad(prog(t, t0, t1)))));
  return `<g transform="${T(x, y)} rotate(-3)"><rect x="-230" y="-150" width="460" height="300" rx="18" fill="#F4F2EE" stroke="${YOL}" stroke-width="7"/><rect x="-230" y="-150" width="460" height="56" rx="18" fill="#2D3340"/><circle cx="-195" cy="-122" r="9" fill="#E5484D"/><circle cx="-167" cy="-122" r="9" fill="#F2B33D"/><circle cx="-139" cy="-122" r="9" fill="#4FB66A"/>
    <rect x="-190" y="-70" width="250" height="26" rx="6" fill="#1F6B4F"/><rect x="-190" y="-30" width="380" height="14" rx="6" fill="#C9CDD4"/><rect x="-190" y="-6" width="330" height="14" rx="6" fill="#C9CDD4"/><rect x="-190" y="18" width="360" height="14" rx="6" fill="#C9CDD4"/>
    <text x="190" y="118" text-anchor="end" font-family="Inter" font-weight="900" font-size="46" fill="${YOL}">Folie ${n}/24</text></g>`;
}
function digitalClock(txt, x, y, s = 1) {
  return `<g transform="${T(x, y)} scale(${s})"><rect x="-200" y="-80" width="400" height="160" rx="24" fill="#0B0B10" stroke="${YOL}" stroke-width="7"/><text x="0" y="8" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="104" fill="#FF3B4A" letter-spacing="6">${txt}</text></g>`;
}
function auraPop(t, t0, txt, x, y, color) {
  if (t < t0 || t > t0 + 1.6) return '';
  const p = Ease.outBack(prog(t, t0, t0 + 0.18)), o = 1 - prog(t, t0 + 1.3, t0 + 1.6);
  const sh = wob(t, t0, 8, 18, 6);
  return `<g transform="translate(${f1(x + sh)} ${f1(y - (t - t0) * 30)}) scale(${p.toFixed(3)}) rotate(-6)" opacity="${f1(o * 100) / 100}"><text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="112" fill="${color}" stroke="${YOL}" stroke-width="16" stroke-linejoin="round" paint-order="stroke">${esc(txt)}</text></g>`;
}
function storyScreen(t, t0, circleT) {
  let s = `<rect width="1080" height="1920" fill="#0B0D12"/>`;
  // photo: pool selfie
  s += `<g><rect x="0" y="0" width="1080" height="1920" fill="#7FCBF0"/><rect x="0" y="1100" width="1080" height="820" fill="#2DA9E1"/>`;
  for (let i = 0; i < 6; i++) s += `<path d="M 0 ${1180 + i * 120} q 135 -24 270 0 t 270 0 t 270 0 t 270 0" fill="none" stroke="#9EE2FF" stroke-width="8" opacity="0.6"/>`;
  s += `<rect x="0" y="1060" width="1080" height="50" fill="#EDE6D6"/><circle cx="880" cy="260" r="110" fill="#FFE27A"/><circle cx="880" cy="260" r="160" fill="#FFE27A" opacity="0.25"/>`;
  s += teen('emre', { x: 520, y: 1720, s: 1.45, t, expr: 'smile', outfit: 'tee', top: '#F4F4F2', sunglasses: true, seed: 14, tilt: -6 });
  s += `</g>`;
  // story chrome
  const pr = clamp((t - t0) / 3);
  s += `<rect x="0" y="0" width="1080" height="260" fill="url(#topfade)"/>`;
  s += `<rect x="30" y="40" width="1020" height="8" rx="4" fill="#fff" opacity="0.35"/><rect x="30" y="40" width="${f1(1020 * pr)}" height="8" rx="4" fill="#fff"/>`;
  s += `<circle cx="90" cy="120" r="44" fill="${CHAT_COL.emre}" stroke="#fff" stroke-width="4"/><text x="90" y="120" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="40" fill="#fff">E</text>`;
  s += `<text x="155" y="132" font-family="Inter" font-weight="900" font-size="40" fill="#fff">emre</text><text x="270" y="132" font-family="Inter" font-weight="400" font-size="36" fill="#E8EEF5">heute, 10:14</text>`;
  s += `<g transform="translate(560 560) rotate(-6)"><rect x="-230" y="-56" width="460" height="112" rx="22" fill="#fff"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter, 'Noto Color Emoji'" font-weight="900" font-size="58" fill="#111">chillen ☀️🏊</text></g>`;
  if (circleT != null && t >= circleT) {
    const c = Ease.outCubic(prog(t, circleT, circleT + 0.35));
    const len = 2 * Math.PI * 300;
    s += `<ellipse cx="520" cy="880" rx="300" ry="330" fill="none" stroke="#FF2E3F" stroke-width="16" stroke-linecap="round" stroke-dasharray="${f1(len * c)} ${f1(len)}" transform="rotate(-80 520 880)"/>`;
  }
  return s;
}
function gradeList(t, rows) {
  let s = `<g transform="translate(540 1110) rotate(-1.5)"><rect x="-430" y="-330" width="860" height="660" rx="12" fill="#FBFAF6" stroke="${YOL}" stroke-width="7"/>`;
  s += `<text x="-380" y="-250" font-family="Inter" font-weight="900" font-size="54" fill="${YOL}">Noten Referat · Gruppe 3</text><path d="M -380 -222 L 380 -222" stroke="${YOL}" stroke-width="4"/>`;
  for (let i = 0; i < 9; i++) s += `<path d="M -400 ${-170 + i * 60} L 400 ${-170 + i * 60}" stroke="#AFC8E8" stroke-width="2.5"/>`;
  rows.forEach((r, i) => {
    const y = -140 + i * 120;
    s += `<text x="-370" y="${y + 20}" font-family="Inter" font-weight="900" font-size="60" fill="${YOL}">${r.name}</text>`;
    if (r.note && t >= r.note.t0) s += `<text x="-120" y="${y + 20}" font-family="Inter" font-weight="400" font-size="40" fill="#C8202F" font-style="italic">${esc(r.note.txt)}</text>`;
    if (t >= r.t0) {
      const p = prog(t, r.t0, r.t0 + 0.12);
      const sc = lerp(2.4, 1, Ease.outCubic(p));
      s += `<g transform="translate(290 ${y}) scale(${sc.toFixed(3)}) rotate(${r.rot || -8})" opacity="${f1(Math.min(1, p * 2) * 100) / 100}"><circle r="62" fill="none" stroke="${r.col}" stroke-width="10"/><text text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="90" fill="${r.col}">${r.grade}</text></g>`;
    }
  });
  return s + '</g>';
}
