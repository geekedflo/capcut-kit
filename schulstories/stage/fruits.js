// Fruit-drama cast (ep03+). Origin = bottom of the fruit body; feet hang below to ~ +170.

const LIMB = '#2A2230';
const FEXP = {
  neutral:  { lid: 0.15, bi: 0, bo: 0, pr: 1, m: 'flat' },
  calm:     { lid: 0.38, bi: 0, bo: 0, pr: 1, m: 'flat' },
  smug:     { lid: 0.42, bi: 0, bo: 0, pr: 1, m: 'smirk', raise: 14 },
  sweet:    { lid: 0.12, bi: -8, bo: -2, pr: 1.15, m: 'smile' },
  innocent: { lid: 0.0, bi: -14, bo: -6, pr: 1.3, m: 'o' },
  evil:     { lid: 0.48, bi: 12, bo: -8, pr: 0.9, m: 'grin' },
  angry:    { lid: 0.18, bi: 16, bo: -8, pr: 0.8, m: 'shout' },
  shock:    { lid: 0.0, bi: -18, bo: -14, pr: 0.55, m: 'O' },
  nervous:  { lid: 0.08, bi: -12, bo: 4, pr: 0.8, m: 'wavy', sweat: true },
  stern:    { lid: 0.42, bi: 14, bo: -6, pr: 0.85, m: 'pursed' },
  dumb:     { lid: 0.3, bi: -6, bo: 0, pr: 1, m: 'smile' },
  sad:      { lid: 0.25, bi: -14, bo: 6, pr: 1, m: 'frown' },
};

function fruitMouth(x, y, open, shape, lip = '#3A1418') {
  if (shape === 'grin') {
    const d = `M ${x - 46} ${y - 8} Q ${x} ${y + 40} ${x + 46} ${y - 8} Q ${x} ${y + 6} ${x - 46} ${y - 8} Z`;
    return `<path d="${d}" fill="#fff" stroke="${YOL}" stroke-width="5" stroke-linejoin="round"/><path d="M ${x - 30} ${y + 2} L ${x - 30} ${y + 14} M ${x - 10} ${y + 6} L ${x - 10} ${y + 22} M ${x + 10} ${y + 6} L ${x + 10} ${y + 22} M ${x + 30} ${y + 2} L ${x + 30} ${y + 14}" stroke="${YOL}" stroke-width="2.5" opacity="0.5"/>`;
  }
  if (shape === 'pursed' && open < 0.12) return `<ellipse cx="${x}" cy="${y}" rx="9" ry="7" fill="${lip}" stroke="${YOL}" stroke-width="4"/><path d="M ${x - 18} ${y - 6} l -6 -5 M ${x + 18} ${y - 6} l 6 -5 M ${x - 18} ${y + 6} l -6 5 M ${x + 18} ${y + 6} l 6 5" stroke="${YOL}" stroke-width="3" stroke-linecap="round" opacity="0.6"/>`;
  if (shape === 'o' && open < 0.12) return `<ellipse cx="${x}" cy="${y + 2}" rx="8" ry="10" fill="${lip}" stroke="${YOL}" stroke-width="4"/>`;
  if (shape === 'shout') open = Math.max(open, 0.55);
  return teenMouth(x, y, open, shape === 'pursed' || shape === 'o' ? 'flat' : shape);
}

// face on a fruit body. e = expression, er = eye radius
function fruitFace(cx, cy, { e, er = 30, gap = 44, skin, lx = 0, ly = 0, t, seed, mouth = 0, mouthDy = 62, lashes = false, brow = YOL, noBlink = false, glasses = false, stache = null, lip }) {
  const E = FEXP[e] || FEXP.neutral;
  const bl = noBlink ? 0 : blink(t, seed);
  const lid = clamp(Math.max(E.lid, bl));
  let s = '';
  const pr = er * 0.42 * E.pr;
  [[-1, 'L'], [1, 'R']].forEach(([d, side]) => {
    s += eye({ x: cx + d * gap, y: cy, rx: er * 0.9, ry: er, px: lx * er * 0.35, py: ly * er * 0.3 + 2, pr, lid, angry: E.bi > 8 ? 0.6 : E.bi < -8 ? -0.5 : 0, skin, side, sw: 5 });
    if (lashes) s += `<path d="M ${cx + d * (gap + er * 0.7)} ${cy - er * 0.6} l ${d * 14} -12 M ${cx + d * (gap + er * 0.35)} ${cy - er * 0.9} l ${d * 8} -14" stroke="${YOL}" stroke-width="4.5" stroke-linecap="round"/>`;
  });
  if (glasses) s += `<g fill="#fff" fill-opacity="0.15" stroke="${YOL}" stroke-width="5"><circle cx="${cx - gap}" cy="${cy}" r="${er + 10}"/><circle cx="${cx + gap}" cy="${cy}" r="${er + 10}"/><path d="M ${cx - gap + er + 10} ${cy - 4} Q ${cx} ${cy - 14} ${cx + gap - er - 10} ${cy - 4}" fill="none"/></g>`;
  const by = cy - er - 18, r = E.raise || 0;
  s += `<path d="M ${cx - gap - er * 0.8} ${by + E.bo} L ${cx - gap + er * 0.7} ${by + E.bi}" stroke="${brow}" stroke-width="9" stroke-linecap="round"/>`;
  s += `<path d="M ${cx + gap - er * 0.7} ${by + E.bi - r} L ${cx + gap + er * 0.8} ${by + E.bo - r * 1.2}" stroke="${brow}" stroke-width="9" stroke-linecap="round"/>`;
  if (stache) s += `<path d="M ${cx} ${cy + mouthDy - 18} C ${cx - 20} ${cy + mouthDy - 30} ${cx - 50} ${cy + mouthDy - 22} ${cx - 56} ${cy + mouthDy - 8} C ${cx - 38} ${cy + mouthDy - 16} ${cx - 16} ${cy + mouthDy - 12} ${cx} ${cy + mouthDy - 12} C ${cx + 16} ${cy + mouthDy - 12} ${cx + 38} ${cy + mouthDy - 16} ${cx + 56} ${cy + mouthDy - 8} C ${cx + 50} ${cy + mouthDy - 22} ${cx + 20} ${cy + mouthDy - 30} ${cx} ${cy + mouthDy - 18} Z" fill="${stache}" stroke="${YOL}" stroke-width="3.5"/>`;
  s += fruitMouth(cx, cy + mouthDy, mouth, E.m, lip);
  if (E.sweat) s += drop(cx + gap + er + 26, cy - er + ((t * 40) % 30), 0.8);
  return s;
}

function fLegs(p, shoe = '#F2F2EF', pants = null) {
  let s = '';
  const ph = p.walk * Math.PI * 2;
  [[-1, 1], [1, -1]].forEach(([d, dir]) => {
    const lift = p.walk ? Math.max(0, Math.sin(ph) * dir) * 26 : 0;
    const hx = d * (p.legGap || 40), fx = d * ((p.legGap || 40) + 8), fy = 158 - lift;
    s += `<path d="M ${hx} -10 Q ${hx + d * 6} ${74 - lift * 0.5} ${fx} ${fy}" fill="none" stroke="${pants || LIMB}" stroke-width="${pants ? 40 : 17}" stroke-linecap="round"/>`;
    s += `<g transform="translate(${fx + d * 10} ${fy + 10})"><path d="M -30 4 C -32 -16 -12 -20 6 -18 C 28 -15 40 -6 42 6 L 42 14 L -30 14 Z" fill="${shoe}" stroke="${YOL}" stroke-width="5" stroke-linejoin="round" transform="scale(${d} 1)"/><rect x="-32" y="10" width="76" height="9" rx="4" fill="#D5D5D0" stroke="${YOL}" stroke-width="3.5" transform="scale(${d} 1)"/></g>`;
  });
  return s;
}

// arm from shoulder to a hand target; hands are small dark mittens, optional nails
function fArm(sh, h, { w = 16, sleeve = null, nails = null, out = 1, holding = null, rot = 0 } = {}) {
  const c = [(sh[0] + h[0]) / 2 + out * 26, (sh[1] + h[1]) / 2 + 24];
  let s = '';
  if (sleeve) {
    const m = bez(sh, c, h, 0.55);
    s += `<path d="M ${f1(sh[0])} ${f1(sh[1])} Q ${f1(c[0])} ${f1(c[1])} ${f1(h[0])} ${f1(h[1])}" fill="none" stroke="${LIMB}" stroke-width="${w}" stroke-linecap="round"/>`;
    s += `<path d="M ${f1(sh[0])} ${f1(sh[1])} Q ${f1((sh[0] + m[0]) / 2 + out * 10)} ${f1((sh[1] + m[1]) / 2 + 10)} ${f1(m[0])} ${f1(m[1])}" fill="none" stroke="${YOL}" stroke-width="${w * 2.3 + 10}" stroke-linecap="round"/><path d="M ${f1(sh[0])} ${f1(sh[1])} Q ${f1((sh[0] + m[0]) / 2 + out * 10)} ${f1((sh[1] + m[1]) / 2 + 10)} ${f1(m[0])} ${f1(m[1])}" fill="none" stroke="${sleeve}" stroke-width="${w * 2.3}" stroke-linecap="round"/>`;
  } else {
    s += `<path d="M ${f1(sh[0])} ${f1(sh[1])} Q ${f1(c[0])} ${f1(c[1])} ${f1(h[0])} ${f1(h[1])}" fill="none" stroke="${LIMB}" stroke-width="${w}" stroke-linecap="round"/>`;
  }
  if (holding) s += holding;
  s += `<g transform="${T(h[0], h[1])} rotate(${rot})"><circle cx="${-out * 13}" cy="-6" r="8" fill="${LIMB}"/><circle r="17" fill="${LIMB}"/>`;
  if (nails) s += `<circle cx="-9" cy="13" r="4.5" fill="${nails}"/><circle cx="0" cy="16" r="4.5" fill="${nails}"/><circle cx="9" cy="13" r="4.5" fill="${nails}"/>`;
  s += `</g>`;
  return s;
}

const goldPhone = (x, y, rot = 0, s = 1) => `<g transform="${T(x, y)} rotate(${rot}) scale(${s})"><rect x="-24" y="-46" width="48" height="92" rx="10" fill="#E3BC56" stroke="${YOL}" stroke-width="4"/><circle cx="-10" cy="-32" r="6" fill="#3A3226"/><circle cx="-10" cy="-16" r="6" fill="#3A3226"/></g>`;

function shade(clipD, color, opacity, side = 1) {
  const id = uid();
  return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})"><ellipse cx="${side * 120}" cy="-160" rx="150" ry="320" fill="${color}" opacity="${opacity}"/><ellipse cx="${-side * 60}" cy="-300" rx="45" ry="70" fill="#fff" opacity="0.18" transform="rotate(-20 ${-side * 60} -300)"/></g>`;
}

// arms per pose. sh = [left shoulder, right shoulder]
function fPose(p, sh, opt) {
  const L = sh[0], R = sh[1];
  const hangL = [L[0] - 26, L[1] + 150], hangR = [R[0] + 26, R[1] + 150];
  const a = (s, h, extra = {}) => fArm(s, h, Object.assign({}, opt, extra));
  const sw = p.walk ? Math.sin(p.walk * Math.PI * 2) * 16 : 0;
  switch (p.pose) {
    case 'hips': return { back: '', front: a(L, [L[0] + 34, L[1] + 110], { out: -1.4 }) + a(R, [R[0] - 34, R[1] + 110], { out: 1.4 }) };
    case 'crossed': return { back: '', front: a(L, [R[0] - 20, R[1] + 70], { out: -0.4 }) + a(R, [L[0] + 20, L[1] + 60], { out: 0.4 }) };
    case 'phone': return { back: a(R, hangR), front: a(L, [-20, L[1] + 40], { out: -1, holding: goldPhone(-6, L[1] - 6, -8) }) };
    case 'give': return { back: a(R, hangR), front: a(L, [L[0] - 120, L[1] + 10], { out: -0.3, holding: p.holdPhone ? goldPhone(L[0] - 120, L[1] - 40, -14) : '' }) };
    case 'take': return { back: a(L, hangL), front: a(R, [R[0] + 120, R[1] + 10], { out: 0.3, holding: p.holdPhone ? goldPhone(R[0] + 122, R[1] - 40, 14) : '' }) };
    case 'point': return { back: a(R, hangR), front: a(L, [L[0] - 150, L[1] - 30], { out: -0.2 }) };
    case 'pointR': return { back: a(L, hangL), front: a(R, [R[0] + 150, R[1] - 30], { out: 0.2 }) };
    case 'reachR': return { back: a(L, hangL), front: a(R, p.target, { out: 0.5 }) };
    case 'watch': return { back: a(R, hangR), front: a(L, [-60, L[1] + 50], { out: -1.2, holding: `<g transform="translate(-60 ${L[1] + 64})"><rect x="-22" y="-26" width="44" height="52" rx="12" fill="#121216" stroke="${YOL}" stroke-width="4"/><rect x="-16" y="-20" width="32" height="40" rx="8" fill="${p.watchGlow ? '#3BE07A' : '#25303F'}"/></g>` }) };
    case 'bag': {
      const hb = [R[0] + 40, R[1] + 120];
      const bag = `<g transform="translate(${hb[0] + 8} ${hb[1] + 56})"><path d="M -34 -46 Q 0 -86 34 -46" fill="none" stroke="#E07AA0" stroke-width="7"/><rect x="-60" y="-50" width="120" height="96" rx="22" fill="#F49AC1" stroke="${YOL}" stroke-width="5"/><path d="M -50 -26 L 50 -26" stroke="#D9B23C" stroke-width="5"/><circle cx="0" cy="4" r="9" fill="#D9B23C" stroke="${YOL}" stroke-width="3"/></g>`;
      return { back: a(L, [L[0] - 26 + sw, L[1] + 150]), front: a(R, hb, { out: 0.6 }) + bag };
    }
    case 'desk': return { back: '', front: a(L, [L[0] + 40, L[1] + 70], { out: -1 }) + a(R, [R[0] - 40, R[1] + 70], { out: 1 }) };
    default: return { back: '', front: a(L, [hangL[0] + sw, hangL[1]]) + a(R, [hangR[0] - sw, hangR[1]]) };
  }
}

// ------------------------------------------------------------ the cast
function kiwi(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'calm', lx: 0, ly: 0, mouth: 0, seed: 3, walk: 0, pose: 'down', tilt: 0, legs: true, flip: false }, o);
  const body = 'M 0 -350 C 82 -350 140 -270 140 -175 C 140 -70 82 0 0 0 C -82 0 -140 -70 -140 -175 C -140 -270 -82 -350 0 -350 Z';
  let s = p.legs ? fLegs(p) : '';
  const arms = fPose(p, [[-120, -132], [120, -132]], { sleeve: '#3E7B4F', w: 16 });
  s += arms.back;
  s += `<path d="${body}" fill="#8A5A36" stroke="${YOL}" stroke-width="6"/>`;
  // fuzz
  const id = uid();
  let fz = '';
  for (let i = 0; i < 120; i++) {
    const a = hash(i * 3.1) * Math.PI * 2, r = Math.sqrt(hash(i * 7.7));
    const x = Math.cos(a) * 130 * r, y = -175 + Math.sin(a) * 165 * r;
    fz += `<path d="M ${f1(x)} ${f1(y)} l ${f1(Math.cos(a) * 9)} ${f1(Math.sin(a) * 9)}" stroke="${i % 3 ? '#6E4428' : '#B07C50'}" stroke-width="3" stroke-linecap="round"/>`;
  }
  s += `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})" opacity="0.6">${fz}</g>`;
  s += shade(body, '#4E2F18', 0.35);
  s += `<path d="M -6 -350 q 4 -14 12 -12" stroke="${YOL}" stroke-width="7" fill="none" stroke-linecap="round"/>`;
  // jacket (lower bowl) + headphones
  const jk = 'M -138 -150 C -140 -70 -82 0 0 0 C 82 0 140 -70 138 -150 Q 0 -128 -138 -150 Z';
  s += `<path d="${jk}" fill="#3E7B4F" stroke="${YOL}" stroke-width="6"/><path d="M -138 -150 Q 0 -128 138 -150 L 136 -132 Q 0 -110 -136 -132 Z" fill="#2F6440" stroke="${YOL}" stroke-width="4"/><path d="M 0 -128 L 0 -4" stroke="#C9D3CC" stroke-width="4"/>`;
  s += `<path d="M -118 -128 Q 0 -100 118 -128" fill="none" stroke="#1B1B20" stroke-width="12"/><rect x="-140" y="-150" width="34" height="48" rx="12" fill="#1B1B20" stroke="${YOL}" stroke-width="3"/><rect x="106" y="-150" width="34" height="48" rx="12" fill="#1B1B20" stroke="${YOL}" stroke-width="3"/>`;
  s += fruitFace(0, -225, { e: p.e, er: 33, gap: 46, skin: '#8A5A36', lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouth: p.mouth, mouthDy: 66, noBlink: p.noBlink });
  s += arms.front;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s}) rotate(${f1(p.tilt)})">${s}</g>`;
}

function erdbeere(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'sweet', lx: 0, ly: 0, mouth: 0, seed: 11, walk: 0, pose: 'bag', tilt: 0, legs: true, flip: false }, o);
  const body = 'M 0 0 C -70 -6 -165 -120 -165 -238 C -165 -330 -96 -372 0 -356 C 96 -372 165 -330 165 -238 C 165 -120 70 -6 0 0 Z';
  let s = p.legs ? fLegs(Object.assign({}, p, { legGap: 26 }), '#F7C6DA') : '';
  const arms = fPose(p, [[-150, -190], [150, -190]], { nails: '#D81B3C', w: 15 });
  s += arms.back;
  s += `<path d="${body}" fill="#E43D4F" stroke="${YOL}" stroke-width="6"/>`;
  const id = uid();
  let seeds = '';
  for (let r = 0; r < 8; r++) for (let c = -5; c <= 5; c++) {
    const x = c * 30 + (r % 2) * 15, y = -330 + r * 42;
    const inFace = ((x / 120) ** 2 + ((y + 245) / 95) ** 2) < 1;
    if (!inFace) seeds += `<path d="M ${x} ${y - 7} Q ${x + 6} ${y + 2} ${x} ${y + 8} Q ${x - 6} ${y + 2} ${x} ${y - 7} Z" fill="#F8D66B" stroke="#B7832A" stroke-width="1.5"/>`;
  }
  s += `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})">${seeds}</g>`;
  s += shade(body, '#8E1426', 0.32);
  // leaf crown + bow
  [-60, -30, 0, 30, 60].forEach((a, i) => (s += `<path transform="translate(0 -352) rotate(${a})" d="M 0 0 C -22 -18 -16 -56 0 -70 C 16 -56 22 -18 0 0 Z" fill="${i % 2 ? '#3FA34D' : '#4DB85A'}" stroke="${YOL}" stroke-width="4.5"/>`));
  s += `<g transform="translate(70 -360) rotate(14)"><path d="M 0 0 L -34 -20 L -34 20 Z M 0 0 L 34 -20 L 34 20 Z" fill="#F49AC1" stroke="${YOL}" stroke-width="4"/><circle r="9" fill="#F49AC1" stroke="${YOL}" stroke-width="4"/></g>`;
  // pearls
  for (let i = 0; i <= 10; i++) { const u = i / 10; s += `<circle cx="${f1(lerp(-120, 120, u))}" cy="${f1(-150 + Math.sin(u * Math.PI) * 34)}" r="8" fill="#FBF7EE" stroke="${YOL}" stroke-width="2.5"/>`; }
  s += fruitFace(0, -248, { e: p.e, er: 32, gap: 48, skin: '#E43D4F', lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouth: p.mouth, mouthDy: 64, lashes: true, lip: '#B0103A', noBlink: p.noBlink });
  if (p.e === 'sweet' || p.e === 'innocent') s += `<ellipse cx="-92" cy="-196" rx="22" ry="11" fill="#FF8FA8" opacity="0.6"/><ellipse cx="92" cy="-196" rx="22" ry="11" fill="#FF8FA8" opacity="0.6"/>`;
  s += arms.front;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s}) rotate(${f1(p.tilt)})">${s}</g>`;
}

function ananas(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'smug', lx: 0, ly: 0, mouth: 0, seed: 7, walk: 0, pose: 'down', tilt: 0, legs: true, flip: false, leafUp: 0 }, o);
  const body = 'M 0 -380 C 86 -380 146 -296 146 -190 C 146 -80 86 0 0 0 C -86 0 -146 -80 -146 -190 C -146 -296 -86 -380 0 -380 Z';
  let s = p.legs ? fLegs(p, '#F2F2EF', '#2B2D33') : '';
  // crown (behind body) — stands up when angry
  const up = p.leafUp;
  [[-70, -40], [-45, -20], [-20, -5], [0, 8], [25, 22], [50, 40], [10, 30]].forEach(([dx, rot], i) => {
    const h = 150 + (i % 3) * 30 + up * 40;
    s += `<path transform="translate(${dx * 0.7} -360) rotate(${rot * (1 - up * 0.6) + Math.sin(p.t * 2 + i) * 2})" d="M -16 0 C -22 -${h * 0.5} -6 -${h * 0.85} 6 -${h} C 10 -${h * 0.6} 18 -${h * 0.3} 16 0 Z" fill="${i % 2 ? '#2F8A3E' : '#3FA34D'}" stroke="${YOL}" stroke-width="4.5"/>`;
  });
  const arms = fPose(p, [[-130, -150], [130, -150]], { sleeve: '#1B1C21', w: 17 });
  s += arms.back;
  s += `<path d="${body}" fill="#F2B23A" stroke="${YOL}" stroke-width="6"/>`;
  const id = uid();
  let pat = '';
  for (let k = -12; k <= 12; k++) pat += `<path d="M ${k * 46 - 400} -400 L ${k * 46 + 400} 400 M ${k * 46 + 400} -400 L ${k * 46 - 400} 400" stroke="#C98A1F" stroke-width="3.5"/>`;
  for (let i = -4; i <= 4; i++) for (let j = 0; j < 9; j++) pat += `<circle cx="${i * 46}" cy="${-360 + j * 46}" r="4" fill="#94600F"/>`;
  s += `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})" opacity="0.75">${pat}</g>`;
  s += shade(body, '#9A5A0A', 0.3);
  // puffer jacket (lower part) + gold chain
  const jk = 'M -144 -168 C -146 -70 -86 0 0 0 C 86 0 146 -70 144 -168 Q 0 -140 -144 -168 Z';
  s += `<path d="${jk}" fill="#1B1C21" stroke="${YOL}" stroke-width="6"/>`;
  [-120, -80, -40].forEach(y => (s += `<path d="M ${-Math.sqrt(Math.max(0, 1 - ((y + 190) / 190) ** 2)) * 140} ${y} Q 0 ${y + 14} ${Math.sqrt(Math.max(0, 1 - ((y + 190) / 190) ** 2)) * 140} ${y}" fill="none" stroke="#07070A" stroke-width="4"/>`));
  s += `<path d="M -110 -150 Q -60 -160 -20 -150" fill="none" stroke="#fff" stroke-opacity="0.18" stroke-width="8" stroke-linecap="round"/><path d="M -150 -168 Q 0 -138 150 -168 L 146 -146 Q 0 -116 -146 -146 Z" fill="#26272E" stroke="${YOL}" stroke-width="4"/>`;
  s += `<path d="M -70 -150 Q 0 -96 70 -150" fill="none" stroke="#E2B740" stroke-width="7" stroke-dasharray="9 5"/>`;
  s += sleeveBadge(118, -126);
  s += fruitFace(0, -250, { e: p.e, er: 30, gap: 46, skin: '#F2B23A', lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouth: p.mouth, mouthDy: 62, noBlink: p.noBlink });
  s += arms.front;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s}) rotate(${f1(p.tilt)})">${s}</g>`;
}

function zitrone(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'stern', lx: 0, ly: 0, mouth: 0, seed: 19, walk: 0, pose: 'desk', tilt: 0, legs: false, flip: false }, o);
  const body = 'M 0 -440 C 12 -440 14 -424 26 -418 C 110 -396 156 -310 156 -212 C 156 -98 96 -6 26 6 C 14 10 12 24 0 24 C -12 24 -14 10 -26 6 C -96 -6 -156 -98 -156 -212 C -156 -310 -110 -396 -26 -418 C -14 -424 -12 -440 0 -440 Z';
  let s = p.legs ? fLegs(p, '#1B1B20', '#4A4F5A') : '';
  const arms = fPose(p, [[-138, -150], [138, -150]], { sleeve: '#5A5F6B', w: 16 });
  s += arms.back;
  s += `<path d="${body}" fill="#F5DC3C" stroke="${YOL}" stroke-width="6"/>`;
  const id = uid();
  let pores = '';
  for (let i = 0; i < 90; i++) pores += `<circle cx="${f1((hash(i * 2.3) - 0.5) * 290)}" cy="${f1(-420 + hash(i * 5.1) * 430)}" r="2.6" fill="#D9BC22"/>`;
  s += `<clipPath id="${id}"><path d="${body}"/></clipPath><g clip-path="url(#${id})">${pores}</g>`;
  s += shade(body, '#B39410', 0.3);
  // suit
  const jk = 'M -150 -160 C -150 -80 -96 -6 -26 6 L 26 6 C 96 -6 150 -80 150 -160 Q 0 -134 -150 -160 Z';
  s += `<path d="${jk}" fill="#5A5F6B" stroke="${YOL}" stroke-width="6"/><path d="M -46 -146 L 0 -40 L 46 -146 Z" fill="#F4F2EC" stroke="${YOL}" stroke-width="4"/><path d="M 0 -138 L -12 -120 L 0 -54 L 12 -120 Z" fill="#B3263A" stroke="${YOL}" stroke-width="3.5"/><path d="M -46 -146 L -70 -96 L -30 -80 M 46 -146 L 70 -96 L 30 -80" fill="none" stroke="${YOL}" stroke-width="4.5"/>`;
  s += fruitFace(0, -262, { e: p.e, er: 26, gap: 46, skin: '#F5DC3C', lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouth: p.mouth, mouthDy: 70, glasses: true, brow: '#8C8A80', stache: '#9A968A', noBlink: p.noBlink });
  s += arms.front;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s}) rotate(${f1(p.tilt)})">${s}</g>`;
}

function banane(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'dumb', lx: 0, ly: 0, mouth: 0, seed: 23, walk: 0, pose: 'down', tilt: 0, legs: true, flip: false }, o);
  const body = 'M -46 0 C -118 -110 -122 -320 -40 -462 Q -4 -488 30 -458 C -20 -330 -6 -130 60 -14 Q 10 16 -46 0 Z';
  let s = p.legs ? fLegs(Object.assign({}, p, { legGap: 30 }), '#F2F2EF', '#3B5B8C') : '';
  const arms = fPose(p, [[-108, -190], [6, -190]], { w: 15 });
  s += arms.back;
  s += `<path d="${body}" fill="#F7D84A" stroke="${YOL}" stroke-width="6"/>`;
  s += `<path d="M -30 -440 C -96 -320 -96 -130 -30 -10" fill="none" stroke="#D9B52A" stroke-width="5" opacity="0.7"/>`;
  [[-70, -120, 12, 8], [-84, -260, 9, 6], [-40, -70, 7, 5], [-60, -380, 8, 6]].forEach(([x, y, rx, ry]) => (s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#7A5420" opacity="0.85"/>`));
  s += `<rect x="-6" y="-494" width="22" height="38" rx="5" fill="#5B4423" stroke="${YOL}" stroke-width="4" transform="rotate(18 5 -475)"/>`;
  s += `<g transform="translate(-14 -456) rotate(-8)"><path d="M -58 10 C -58 -40 58 -40 58 10 Z" fill="#2F6FD6" stroke="${YOL}" stroke-width="5"/><path d="M 40 6 L 96 18 L 92 32 L 36 22 Z" fill="#2559B0" stroke="${YOL}" stroke-width="5"/></g>`;
  s += fruitFace(-46, -322, { e: p.e, er: 25, gap: 34, skin: '#F7D84A', lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouth: p.mouth, mouthDy: 56, noBlink: p.noBlink });
  s += arms.front;
  return `<g transform="${T(p.x, p.y)} scale(${p.flip ? -p.s : p.s} ${p.s}) rotate(${f1(p.tilt)})">${s}</g>`;
}

// simple background classmates (no legs, sit behind desks)
function extraFruit(kind, o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, e: 'neutral', lx: 0, ly: 0, seed: 31 }, o);
  const K = { apfel: ['#D9373F', '#8E1C22'], birne: ['#A6C94A', '#6E8A22'], orange: ['#F28C28', '#B85A0E'], pflaume: ['#7A4FA0', '#4E2F6E'] }[kind];
  const body = kind === 'birne'
    ? 'M 0 -330 C 50 -330 60 -260 90 -200 C 130 -130 120 0 0 0 C -120 0 -130 -130 -90 -200 C -60 -260 -50 -330 0 -330 Z'
    : 'M 0 -300 C 90 -320 150 -240 150 -150 C 150 -50 80 0 0 0 C -80 0 -150 -50 -150 -150 C -150 -240 -90 -320 0 -300 Z';
  let s = `<path d="${body}" fill="${K[0]}" stroke="${YOL}" stroke-width="6"/>` + shade(body, K[1], 0.3);
  if (kind !== 'orange') s += `<path d="M 0 ${kind === 'birne' ? -330 : -300} q 4 -30 14 -36" stroke="#5B4423" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M 10 ${kind === 'birne' ? -352 : -322} C 30 -380 70 -370 66 -350 C 50 -340 30 -340 10 ${kind === 'birne' ? -352 : -322} Z" fill="#4DB85A" stroke="${YOL}" stroke-width="4"/>`;
  s += fruitFace(0, kind === 'birne' ? -150 : -170, { e: p.e, er: 26, gap: 38, skin: K[0], lx: p.lx, ly: p.ly, t: p.t, seed: p.seed, mouthDy: 54 });
  return `<g transform="${T(p.x, p.y)} scale(${p.s})">${s}</g>`;
}

// ------------------------------------------------------------ sets
function officeSet(t) {
  let s = `<rect x="-600" y="-400" width="2280" height="2600" fill="#4A3424"/>`;
  for (let x = -600; x < 1700; x += 180) s += `<rect x="${x}" y="-400" width="176" height="2600" fill="#553C29"/><rect x="${x + 20}" y="200" width="136" height="420" fill="none" stroke="#3A281B" stroke-width="6"/>`;
  // window with blinds
  s += `<g transform="translate(60 160)"><rect width="360" height="520" fill="#BFD9E8" stroke="${YOL}" stroke-width="8"/>`;
  for (let i = 0; i < 13; i++) s += `<rect x="0" y="${i * 40}" width="360" height="22" fill="#E8E2D2" stroke="#9C9480" stroke-width="2"/>`;
  s += `</g><path d="M 420 200 L 900 900 L 1100 900 L 420 400 Z" fill="#FFF3C8" opacity="0.08"/>`;
  // bookshelf
  s += `<g transform="translate(640 120)"><rect width="380" height="620" fill="#3A281B" stroke="${YOL}" stroke-width="7"/>`;
  const bc = ['#8E2F2F', '#2F5E8E', '#C9A24A', '#3E7B4F', '#6B3E8E'];
  for (let r = 0; r < 4; r++) {
    s += `<rect x="10" y="${150 + r * 150}" width="360" height="12" fill="#2A1C12"/>`;
    let x = 18;
    for (let b = 0; x < 340; b++) { const w = 22 + hash(r * 9 + b) * 18, h = 90 + hash(r * 5 + b) * 40; s += `<rect x="${f1(x)}" y="${f1(150 + r * 150 - h)}" width="${f1(w)}" height="${f1(h)}" fill="${bc[(r + b) % 5]}" stroke="${YOL}" stroke-width="2.5"/>`; x += w + 3; }
  }
  s += `<g transform="translate(270 -16)"><path d="M -30 0 L 30 0 L 22 -20 L -22 -20 Z" fill="#D9B23C" stroke="${YOL}" stroke-width="3"/><path d="M -24 -20 C -40 -80 40 -80 24 -20" fill="#E8C35A" stroke="${YOL}" stroke-width="3"/></g></g>`;
  // flag
  s += `<g transform="translate(560 160)"><rect x="-6" y="0" width="10" height="700" fill="#8A6A3A"/><path d="M 4 20 L 120 30 L 112 150 L 4 140 Z" fill="#3E7B4F" stroke="${YOL}" stroke-width="4"/><circle cx="58" cy="85" r="26" fill="#F5DC3C" stroke="${YOL}" stroke-width="3"/></g>`;
  s += `<rect x="-600" y="1300" width="2280" height="900" fill="#2E2219"/>`;
  return s;
}

function bigDesk(x, y, s = 1, { photo = 1, photoFlip = 1, photoX = 330 } = {}) {
  let d = `<g transform="${T(x, y)} scale(${s})">`;
  d += `<rect x="-520" y="0" width="1040" height="700" fill="#5E3B22" stroke="${YOL}" stroke-width="8"/><rect x="-540" y="-36" width="1080" height="44" rx="8" fill="#7A5030" stroke="${YOL}" stroke-width="7"/>`;
  d += `<rect x="-480" y="60" width="440" height="200" rx="6" fill="none" stroke="#4A2D18" stroke-width="6"/><rect x="40" y="60" width="440" height="200" rx="6" fill="none" stroke="#4A2D18" stroke-width="6"/>`;
  d += `<g transform="translate(0 120)"><rect x="-190" y="-34" width="380" height="68" rx="6" fill="#D9B23C" stroke="${YOL}" stroke-width="5"/><text y="2" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="30" fill="#2A1C12">Dr. Z. Zitrone · Schulleiter</text></g>`;
  // photo frame "Papas Prinzessin"
  if (photo) {
    d += `<g transform="translate(${photoX} -36) scale(${photoFlip} 1)"><path d="M -10 0 L -40 0 L -46 -10" stroke="#B8902E" stroke-width="5" fill="none"/><rect x="-80" y="-190" width="160" height="190" rx="6" fill="#D9B23C" stroke="${YOL}" stroke-width="5"/><rect x="-66" y="-176" width="132" height="132" fill="#FBE8EE"/>`;
    d += `<g transform="translate(-22 -64) scale(0.22)">${zitrone({ t: 0, e: 'sweet', legs: false, pose: 'down', noBlink: true })}</g><g transform="translate(26 -64) scale(0.22)">${erdbeere({ t: 0, e: 'sweet', legs: false, pose: 'down', noBlink: true })}</g>`;
    d += `<text x="0" y="-22" text-anchor="middle" font-family="Inter" font-weight="900" font-size="15" fill="#5A1A2A">Papas Prinzessin 🍓</text></g>`;
  }
  return d + '</g>';
}

function classDoor(t, open) {
  let s = classroomWall(t);
  s += `<g transform="translate(540 1320)"><rect x="-230" y="-1000" width="460" height="1010" fill="#2E2A26"/><rect x="-250" y="-1020" width="500" height="1030" fill="none" stroke="#7A5634" stroke-width="40"/></g>`;
  return `<g filter="url(#mute)">${s}</g>`;
}
function doorPanel(open) {
  const w = 460 * (1 - open * 0.85);
  return `<g filter="url(#mute)"><rect x="${310}" y="320" width="${f1(w)}" height="1000" fill="#A57A4E" stroke="${YOL}" stroke-width="6"/><rect x="${f1(310 + w * 0.12)}" y="400" width="${f1(w * 0.76)}" height="360" fill="#BCD3E0" stroke="${YOL}" stroke-width="5"/><circle cx="${f1(310 + w * 0.85)}" cy="860" r="16" fill="#D9B23C" stroke="${YOL}" stroke-width="4"/></g>`;
}

// ------------------------------------------------------------ UI inserts (screen space)
function lockscreen(t, x, y, s = 1, { silent = -1 } = {}) {
  let p = `<g transform="${T(x, y)} scale(${s})">`;
  p += `<rect x="-250" y="-500" width="500" height="1000" rx="70" fill="#E3BC56" stroke="${YOL}" stroke-width="8"/><rect x="-226" y="-476" width="452" height="952" rx="52" fill="#1A1A22"/>`;
  const id = uid();
  p += `<clipPath id="${id}"><rect x="-226" y="-476" width="452" height="952" rx="52"/></clipPath><g clip-path="url(#${id})">`;
  p += `<rect x="-226" y="-476" width="452" height="952" fill="#F3A64A"/><rect x="-226" y="120" width="452" height="360" fill="#5C5C66"/>`;
  // lambo silhouette
  p += `<path d="M -210 210 L -160 150 L -40 120 L 120 130 L 200 170 L 210 230 L -210 230 Z" fill="#F7D21E" stroke="${YOL}" stroke-width="5"/><circle cx="-130" cy="232" r="34" fill="#1B1B20"/><circle cx="140" cy="232" r="34" fill="#1B1B20"/><path d="M -120 150 L -40 132 L 60 136 L 110 160 Z" fill="#3A3F4B"/>`;
  p += `<g transform="translate(-40 110) scale(0.45)">${ananas({ t, e: 'smug', pose: 'hips', legs: false })}</g>`;
  p += `</g>`;
  p += `<text x="0" y="-300" text-anchor="middle" font-family="Inter" font-weight="900" font-size="128" fill="#fff">10:42</text><text x="0" y="-410" text-anchor="middle" font-family="Inter" font-weight="400" font-size="30" fill="#fff">Donnerstag, 9. Oktober</text>`;
  p += `<rect x="-70" y="-462" width="140" height="34" rx="17" fill="#000"/>`;
  if (silent >= 0) {
    const k = Ease.outBack(clamp(silent));
    p += `<g transform="translate(0 -150) scale(${k.toFixed(3)})"><rect x="-150" y="-44" width="300" height="88" rx="44" fill="#1E2129" stroke="#3A3F4B" stroke-width="2"/><circle cx="-92" cy="0" r="26" fill="#E5484D"/><text x="-92" y="2" text-anchor="middle" dominant-baseline="central" font-size="30" font-family="'Noto Color Emoji'">🔕</text><text x="22" y="2" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="38" fill="#fff">Lautlos</text></g>`;
  }
  return p + '</g>';
}

function watchUI(t, x, y, s, mode) {
  let w = `<g transform="${T(x, y)} scale(${s})">`;
  w += `<rect x="-60" y="-330" width="120" height="660" rx="30" fill="#2B2D33" stroke="${YOL}" stroke-width="6"/>`;
  w += `<rect x="-220" y="-250" width="440" height="500" rx="110" fill="#121216" stroke="${YOL}" stroke-width="8"/><rect x="-190" y="-220" width="380" height="440" rx="90" fill="#000"/><rect x="220" y="-80" width="26" height="90" rx="10" fill="#3A3D45" stroke="${YOL}" stroke-width="4"/>`;
  if (mode === 'call') {
    const pulse = 1 + 0.12 * Math.sin(t * 8);
    w += `<text x="0" y="-120" text-anchor="middle" font-family="Inter" font-weight="400" font-size="36" fill="#9AA1B2">Anruf…</text><text x="0" y="-60" text-anchor="middle" font-family="Inter" font-weight="900" font-size="44" fill="#fff">Mein Handy</text>`;
    w += `<g transform="translate(0 80) scale(${pulse.toFixed(3)})"><circle r="70" fill="#2FC160"/><path d="M -28 -24 C -20 -34 -10 -30 -6 -20 L -2 -8 C 0 0 -6 6 -10 8 C -4 20 6 30 18 36 C 20 32 26 26 34 28 L 46 32 C 56 36 58 46 48 54 C 30 70 -40 20 -28 -24 Z" fill="#fff" transform="translate(-6 -12) scale(0.9)"/></g>`;
  } else {
    w += `<text x="0" y="-120" text-anchor="middle" font-family="Inter" font-weight="400" font-size="34" fill="#9AA1B2">Wo ist?</text><text x="0" y="-60" text-anchor="middle" font-family="Inter" font-weight="900" font-size="40" fill="#fff">Ton abspielen</text>`;
    const on = mode === 'sound';
    w += `<g transform="translate(0 80)"><circle r="70" fill="${on ? '#2F7DF6' : '#3A3D45'}"/><path d="M -30 -16 L -10 -16 L 14 -38 L 14 38 L -10 16 L -30 16 Z" fill="#fff"/>`;
    if (on) [0, 1, 2].forEach(i => (w += `<path d="M ${26 + i * 16} -${20 + i * 10} Q ${40 + i * 18} 0 ${26 + i * 16} ${20 + i * 10}" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="${f1((0.5 + 0.5 * Math.sin(t * 12 - i)) * 100) / 100}"/>`));
    w += `</g>`;
  }
  return w + '</g>';
}

function vhs(t, label) {
  let s = `<rect width="1080" height="1920" fill="#000" opacity="0.35"/>`;
  for (let i = 0; i < 18; i++) {
    const y = (hash(Math.floor(t * 30) * 13 + i) * 1920);
    s += `<rect x="0" y="${f1(y)}" width="1080" height="${f1(4 + hash(i * 7 + Math.floor(t * 30)) * 18)}" fill="#fff" opacity="${f1(0.08 + hash(i) * 0.2)}"/>`;
  }
  s += `<rect x="0" y="${f1(((t * 900) % 2200) - 200)}" width="1080" height="60" fill="#fff" opacity="0.12"/>`;
  s += `<g font-family="Inter" font-weight="900" font-size="72"><text x="546" y="966" text-anchor="middle" fill="#FF2E5A" opacity="0.8">${esc(label)}</text><text x="534" y="960" text-anchor="middle" fill="#2EE6FF" opacity="0.8">${esc(label)}</text><text x="540" y="963" text-anchor="middle" fill="#fff">${esc(label)}</text></g>`;
  s += `<text x="80" y="200" font-family="Inter" font-weight="900" font-size="56" fill="#fff">◀◀ PLAY</text>`;
  return s;
}

// hook close-up: hand drops the gold phone into the pink bag, zipper closes
function bigBag(x, y, s, t, { drop = 1, zip = 1, handOut = 1 } = {}) {
  let b = `<g transform="${T(x, y)} scale(${s})">`;
  b += `<path d="M -150 -150 Q 0 -330 150 -150" fill="none" stroke="#E07AA0" stroke-width="22"/><path d="M -150 -150 Q 0 -330 150 -150" fill="none" stroke="${YOL}" stroke-width="4" opacity="0.4"/>`;
  b += `<rect x="-300" y="-160" width="600" height="440" rx="80" fill="#F49AC1" stroke="${YOL}" stroke-width="8"/>`;
  b += `<path d="M -260 60 Q 0 90 260 60" fill="none" stroke="#E07AA0" stroke-width="6"/><circle cx="0" cy="120" r="30" fill="#D9B23C" stroke="${YOL}" stroke-width="6"/>`;
  // opening + phone going in
  const id = uid();
  b += `<rect x="-250" y="-178" width="500" height="40" rx="20" fill="#3A1F2C"/>`;
  b += `<clipPath id="${id}"><rect x="-400" y="-900" width="800" height="740"/></clipPath><g clip-path="url(#${id})">`;
  const py = lerp(-420, -60, Ease.inOutCubic(drop));
  if (drop < 1) b += goldPhone(-20, py, -6, 2.4);
  const hy = lerp(-500, -140, Ease.inOutCubic(drop)) - Ease.inCubic(clamp(handOut)) * 600 * (drop >= 1 ? 1 : 0);
  b += `<g transform="translate(-20 ${f1(hy)})" opacity="${f1((1 - clamp(handOut)) * 100) / 100}"><path d="M 0 -600 L 0 -40" stroke="${LIMB}" stroke-width="70" stroke-linecap="round"/><circle r="62" fill="${LIMB}"/><circle cx="-40" cy="44" r="15" fill="#D81B3C"/><circle cx="0" cy="56" r="15" fill="#D81B3C"/><circle cx="40" cy="44" r="15" fill="#D81B3C"/></g>`;
  b += `</g>`;
  // zipper: teeth line + pull travelling left -> right
  const zx = lerp(-240, 240, Ease.inOutQuad(zip));
  b += `<path d="M -250 -158 L ${f1(zx)} -158" stroke="#D9B23C" stroke-width="12" stroke-dasharray="6 5"/>`;
  b += `<g transform="translate(${f1(zx)} -158)"><rect x="-16" y="-14" width="32" height="28" rx="6" fill="#D9B23C" stroke="${YOL}" stroke-width="4"/><path d="M 0 14 L 0 60" stroke="#D9B23C" stroke-width="10" stroke-linecap="round"/></g>`;
  return b + '</g>';
}
