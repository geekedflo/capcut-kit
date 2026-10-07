// Characters. Every function returns SVG markup in its own local space
// (origin = bottom centre of the torso), placed with x, y, s.

// ------------------------------------------------------------ shared parts
// side: 'L' = eye on viewer's left (inner corner on its right)
function eye({ x, y, rx, ry, px = 0, py = 0, pr = 14, lid = 0, angry = 0, lower = 0, skin, side = 'L', sw = 6, hl = true }) {
  const id = uid();
  const top = y - ry - 6;
  const yl = y - ry + 2 * ry * lid;
  const k = angry * rx * 0.55;
  const dl = side === 'L' ? -k : k, dr = side === 'L' ? k : -k;
  let s = `<clipPath id="${id}"><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}"/></clipPath>`;
  s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff"/>`;
  s += `<g clip-path="url(#${id})">`;
  s += `<circle cx="${f1(x + px)}" cy="${f1(y + py)}" r="${f1(pr)}" fill="${OL}"/>`;
  if (hl && pr > 7) s += `<circle cx="${f1(x + px - pr * 0.35)}" cy="${f1(y + py - pr * 0.4)}" r="${f1(pr * 0.32)}" fill="#fff"/>`;
  if (lid > 0.001 || Math.abs(angry) > 0.01) {
    s += `<path d="M ${f1(x - rx - 6)} ${f1(top)} L ${f1(x + rx + 6)} ${f1(top)} L ${f1(x + rx + 6)} ${f1(yl + dr)} L ${f1(x - rx - 6)} ${f1(yl + dl)} Z" fill="${skin}"/>`;
    s += `<path d="M ${f1(x - rx - 6)} ${f1(yl + dl)} L ${f1(x + rx + 6)} ${f1(yl + dr)}" stroke="${OL}" stroke-width="${sw}"/>`;
  }
  if (lower > 0.001) {
    const yb = y + ry - 2 * ry * lower;
    s += `<rect x="${f1(x - rx - 6)}" y="${f1(yb)}" width="${f1(2 * rx + 12)}" height="${f1(2 * ry)}" fill="${skin}"/>`;
    s += `<path d="M ${f1(x - rx)} ${f1(yb)} L ${f1(x + rx)} ${f1(yb)}" stroke="${OL}" stroke-width="${sw * 0.8}"/>`;
  }
  s += `</g><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${OL}" stroke-width="${sw}"/>`;
  return s;
}
// closed happy eye ^
const happyEye = (x, y, rx, sw = 7) => `<path d="M ${f1(x - rx)} ${f1(y + 8)} Q ${f1(x)} ${f1(y - rx * 1.1)} ${f1(x + rx)} ${f1(y + 8)}" fill="none" stroke="${OL}" stroke-width="${sw}" stroke-linecap="round"/>`;

function mouthShape({ x, y, open = 0, w = 50, shape = 'flat', sw = 5, inside = '#5B1A2B', lip = OL }) {
  if (shape === 'O') {
    const r = w * (0.22 + 0.12 * open);
    return `<ellipse cx="${f1(x)}" cy="${f1(y + 6)}" rx="${f1(r * 0.85)}" ry="${f1(r * 1.15)}" fill="${inside}" stroke="${OL}" stroke-width="${sw}"/>`;
  }
  if (shape === 'laugh') open = Math.max(open, 0.85);
  if (open < 0.08) {
    const L = x - w / 2, R = x + w / 2;
    const st = `fill="none" stroke="${lip}" stroke-width="${sw + 1}" stroke-linecap="round"`;
    switch (shape) {
      case 'smile': return `<path d="M ${f1(L)} ${f1(y - 4)} Q ${f1(x)} ${f1(y + 16)} ${f1(R)} ${f1(y - 4)}" ${st}/>`;
      case 'frown': return `<path d="M ${f1(L)} ${f1(y + 7)} Q ${f1(x)} ${f1(y - 9)} ${f1(R)} ${f1(y + 7)}" ${st}/>`;
      case 'smirk': return `<path d="M ${f1(L)} ${f1(y + 3)} Q ${f1(x + w * 0.15)} ${f1(y + 7)} ${f1(R)} ${f1(y - 9)}" ${st}/>`;
      case 'wavy': {
        const q = w / 4;
        return `<path d="M ${f1(L)} ${f1(y)} q ${f1(q / 2)} -9 ${f1(q)} 0 t ${f1(q)} 0 t ${f1(q)} 0 t ${f1(q)} 0" ${st}/>`;
      }
      default: return `<path d="M ${f1(L)} ${f1(y)} L ${f1(R)} ${f1(y)}" ${st}/>`;
    }
  }
  const ww = w * (shape === 'laugh' ? 1.5 : 0.8 + 0.45 * open), hh = 8 + 56 * open;
  const id = uid();
  const d = shape === 'laugh'
    ? `M ${f1(x - ww / 2)} ${f1(y - 4)} L ${f1(x + ww / 2)} ${f1(y - 4)} C ${f1(x + ww / 2)} ${f1(y + hh)} ${f1(x - ww / 2)} ${f1(y + hh)} ${f1(x - ww / 2)} ${f1(y - 4)} Z`
    : `M ${f1(x - ww / 2)} ${f1(y)} Q ${f1(x)} ${f1(y - hh * 0.18)} ${f1(x + ww / 2)} ${f1(y)} C ${f1(x + ww / 2)} ${f1(y + hh * 0.95)} ${f1(x - ww / 2)} ${f1(y + hh * 0.95)} ${f1(x - ww / 2)} ${f1(y)} Z`;
  let s = `<clipPath id="${id}"><path d="${d}"/></clipPath><path d="${d}" fill="${inside}"/>`;
  s += `<g clip-path="url(#${id})"><ellipse cx="${f1(x)}" cy="${f1(y + hh * 0.85)}" rx="${f1(ww * 0.33)}" ry="${f1(hh * 0.33)}" fill="#F0788A"/>`;
  if (open > 0.35 || shape === 'laugh') s += `<rect x="${f1(x - ww / 2)}" y="${f1(y - hh * 0.3)}" width="${f1(ww)}" height="${f1(hh * 0.28)}" fill="#fff"/>`;
  s += `</g><path d="${d}" fill="none" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  return s;
}

const brow = (x1, y1, x2, y2, sw = 12, col = OL) => `<path d="M ${f1(x1)} ${f1(y1)} Q ${f1((x1 + x2) / 2)} ${f1(Math.min(y1, y2) - 6)} ${f1(x2)} ${f1(y2)}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round"/>`;
// limb: thick outlined stroke along a quadratic curve
const limb = (a, c, b, w, col) => {
  const d = `M ${f1(a[0])} ${f1(a[1])} Q ${f1(c[0])} ${f1(c[1])} ${f1(b[0])} ${f1(b[1])}`;
  return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + 13}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
};
const hand = (x, y, r, skin, rot = 0) => `<g transform="${T(x, y)} rotate(${f1(rot)})"><circle cx="${f1(-r * 0.75)}" cy="${f1(-r * 0.2)}" r="${f1(r * 0.42)}" fill="${skin}" stroke="${OL}" stroke-width="6"/><circle r="${r}" fill="${skin}" stroke="${OL}" stroke-width="6.5"/></g>`;
const bez = (p0, p1, p2, u) => [lerp(lerp(p0[0], p1[0], u), lerp(p1[0], p2[0], u), u), lerp(lerp(p0[1], p1[1], u), lerp(p1[1], p2[1], u), u)];
const drop = (x, y, s = 1) => `<path transform="${T(x, y)} scale(${s})" d="M 0 -30 C 12 -12 20 0 20 10 A 20 20 0 0 1 -20 10 C -20 0 -12 -12 0 -30 Z" fill="#9AD8FF" stroke="${OL}" stroke-width="5"/><ellipse cx="${f1(x - 6 * s)}" cy="${f1(y + 8 * s)}" rx="${5 * s}" ry="${7 * s}" fill="#fff"/>`;

// ------------------------------------------------------------ TONI
const TONI = { skin: '#FFCFA6', hair: '#3A2633', hoodie: '#F5B83D', hoodieDark: '#D99728', pants: '#34416E', shoe: '#FFFFFF', stripe: '#E5484D' };
const TONI_EXPR = {
  deadpan:  { lid: 0.44, brow: -2, tilt: 0, pr: 14, es: 1, closed: 'flat' },
  neutral:  { lid: 0.12, brow: 4, tilt: 0, pr: 15, es: 1, closed: 'flat' },
  innocent: { lid: 0.0, brow: 14, tilt: -0.25, pr: 17, es: 1.05, closed: 'smile' },
  shock:    { lid: 0.0, brow: 26, tilt: 0, pr: 8, es: 1.22, closed: 'O' },
  worried:  { lid: 0.1, brow: 12, tilt: -0.6, pr: 13, es: 1.05, closed: 'wavy' },
  panic:    { lid: 0.0, brow: 22, tilt: -0.7, pr: 9, es: 1.18, closed: 'wavy' },
  dead:     { lid: 0.5, brow: -4, tilt: 0, pr: 5, es: 1, closed: 'flat' },
};

function toni(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, mouth: 0, expr: 'deadpan', lx: 0, ly: 0, seed: 1, blush: 0, sweat: -1,
    antenna: 0, antWob: 0, raise: 0, wave: 0, panic: 0, tilt: 0, bob: 0, legs: false, walk: 0, desk: true, backpack: false,
    pale: 0, mouthShape: null, noBlink: false }, o);
  const E = TONI_EXPR[p.expr];
  const skin = p.pale > 0 ? '#E9D9CF' : TONI.skin;
  const t = p.t;
  const breathe = Math.sin(t * 2.2) * 3;
  let back = '', front = '';

  // legs (full body)
  if (p.legs) {
    const ph = p.walk * Math.PI * 2;
    // front view: feet lift alternately (no sideways swing)
    [[-52, 1], [52, -1]].forEach(([hx, dir]) => {
      const lift = Math.max(0, Math.sin(ph) * dir) * 34;
      const fx = hx * 1.05, fy = 190 - lift;
      back += limb([hx, -20], [hx + Math.sign(hx) * lift * 0.5, 85 - lift * 0.5], [fx, fy], 62, TONI.pants);
      back += `<g transform="${T(fx + 12, fy + 14)}"><ellipse rx="52" ry="27" fill="${TONI.shoe}" stroke="${OL}" stroke-width="6.5"/><path d="M -40 2 L 40 2" stroke="${TONI.stripe}" stroke-width="8"/></g>`;
    });
  }
  const bodyY = -Math.abs(Math.sin(p.walk * Math.PI * 2)) * (p.legs ? 12 : 0) + p.bob;

  // torso
  let torso = '';
  torso += `<ellipse cx="0" cy="-252" rx="125" ry="42" fill="${TONI.hoodieDark}" stroke="${OL}" stroke-width="7"/>`;
  torso += `<path d="M -178 0 C -182 -120 -172 -212 -112 -250 Q 0 -278 112 -250 C 172 -212 182 -120 178 0 Z" fill="${TONI.hoodie}" stroke="${OL}" stroke-width="7.5" stroke-linejoin="round"/>`;
  torso += `<path d="M -96 -38 Q -96 -112 -60 -112 L 60 -112 Q 96 -112 96 -38" fill="${TONI.hoodieDark}" stroke="${OL}" stroke-width="6"/>`;
  torso += `<path d="M -34 -244 L -42 -156 M 34 -244 L 40 -156" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><circle cx="-42" cy="-152" r="8" fill="#fff" stroke="${OL}" stroke-width="4"/><circle cx="40" cy="-152" r="8" fill="#fff" stroke="${OL}" stroke-width="4"/>`;
  torso += `<g transform="translate(96 -188) rotate(10)"><circle r="27" fill="#FFF3D0" stroke="${OL}" stroke-width="5"/><text y="2" text-anchor="middle" dominant-baseline="central" font-family="Fredoka" font-weight="700" font-size="38" fill="${OL}">?</text></g>`;
  if (p.backpack) torso = `<path d="M -150 -40 C -175 -200 -150 -300 -80 -300 L 80 -300 C 150 -300 175 -200 150 -40 Z" fill="#2D7F7A" stroke="${OL}" stroke-width="7"/>` + torso +
    `<path d="M -118 -236 L -110 -40 M 118 -236 L 110 -40" stroke="${OL}" stroke-width="36" stroke-linecap="round"/><path d="M -118 -236 L -110 -40 M 118 -236 L 110 -40" stroke="#2D7F7A" stroke-width="24" stroke-linecap="round"/>`;

  // arms: viewer-left arm can raise; panic lifts both
  const shL = [-148, -208], shR = [148, -208];
  const restL = [-122, -50], restR = [126, -50];
  const upL = [-232, -655];
  let hL = bez(restL, [-360, -270], upL, Ease.inOutQuad(clamp(p.raise)));
  hL = [hL[0] + p.wave * Math.sin(t * 13) * 26, hL[1]];
  let hR = restR.slice();
  if (p.panic > 0) {
    const jit = Math.sin(t * 40) * 7;
    hL = [lerp(hL[0], -262 + jit, p.panic), lerp(hL[1], -520, p.panic)];
    hR = [lerp(hR[0], 262 - jit, p.panic), lerp(hR[1], -520, p.panic)];
  }
  if (p.legs) { // standing: arms hang
    hL = [lerp(-205, hL[0], p.raise + p.panic), lerp(-30, hL[1], p.raise + p.panic)];
    hR = [lerp(205, hR[0], p.panic), lerp(-30, hR[1], p.panic)];
  }
  const elbow = (sh, h, out) => [(sh[0] + h[0]) / 2 + out, (sh[1] + h[1]) / 2 + 30];
  const armL = limb(shL, elbow(shL, hL, -55), hL, 54, TONI.hoodie) + hand(hL[0], hL[1], 31, skin, p.raise * -20);
  const armR = limb(shR, elbow(shR, hR, 55), hR, 54, TONI.hoodie) + hand(hR[0], hR[1], 31, skin, 0);

  // head
  const hx = 0, hy = -432 + breathe * 0.5;
  let head = '';
  head += `<circle cx="-162" cy="14" r="30" fill="${skin}" stroke="${OL}" stroke-width="7"/><circle cx="162" cy="14" r="30" fill="${skin}" stroke="${OL}" stroke-width="7"/>`;
  head += `<ellipse cx="0" cy="0" rx="166" ry="153" fill="${skin}" stroke="${OL}" stroke-width="8"/>`;
  if (p.blush > 0) head += `<g opacity="${f1(p.blush * 0.75)}"><ellipse cx="-102" cy="58" rx="32" ry="16" fill="#FF6F86"/><ellipse cx="102" cy="58" rx="32" ry="16" fill="#FF6F86"/></g>` +
    (p.blush > 0.55 ? `<path d="M -120 50 l 10 -14 M -102 52 l 10 -14 M -84 54 l 10 -14 M 84 54 l 10 -14 M 102 52 l 10 -14 M 120 50 l 10 -14" stroke="#D83A5C" stroke-width="4" stroke-linecap="round" opacity="${f1(p.blush)}"/>` : '');
  const bl = p.noBlink ? 0 : blink(t, p.seed);
  const lid = clamp(Math.max(E.lid, bl));
  const es = E.es;
  head += eye({ x: -58, y: 4, rx: 39 * es, ry: 45 * es, px: p.lx * 14, py: p.ly * 14 + 4, pr: E.pr, lid, angry: E.tilt, skin, side: 'L' });
  head += eye({ x: 58, y: 4, rx: 39 * es, ry: 45 * es, px: p.lx * 14, py: p.ly * 14 + 4, pr: E.pr, lid, angry: E.tilt, skin, side: 'R' });
  head += `<path d="M -9 50 Q 0 60 9 50" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
  head += mouthShape({ x: 0, y: 94, open: p.mouth, w: 52, shape: p.mouthShape || E.closed });
  // hair
  head += `<path d="M -172 6 C -192 -128 -102 -200 0 -196 C 102 -200 192 -128 172 6 L 152 -38 L 130 -102 L 106 -80 L 80 -124 L 52 -90 L 24 -128 L -6 -92 L -36 -126 L -64 -88 L -92 -122 L -118 -78 L -140 -106 L -156 -36 Z" fill="${TONI.hair}" stroke="${OL}" stroke-width="7.5" stroke-linejoin="round"/>`;
  head += `<path d="M -112 -150 Q -60 -184 -6 -182" fill="none" stroke="#5E4456" stroke-width="10" stroke-linecap="round"/>`;
  // signature antenna strand
  const A = p.antenna;
  const N = [[25, -255], [88, -272], [76, -318]], U = [[18, -262], [18, -312], [18, -366]], D = [[44, -218], [112, -216], [130, -160]];
  const tgt = A >= 0 ? U : D, a = Math.abs(A);
  const cp = N.map((pt, i) => [lerp(pt[0], tgt[i][0], a), lerp(pt[1], tgt[i][1], a)]);
  const wobx = p.antWob * 34 + Math.sin(t * 3.1) * 4;
  cp[1][0] += wobx * 0.5; cp[2][0] += wobx;
  const ad = `M 18 -188 C ${f1(cp[0][0])} ${f1(cp[0][1])} ${f1(cp[1][0])} ${f1(cp[1][1])} ${f1(cp[2][0])} ${f1(cp[2][1])}`;
  head += `<path d="${ad}" fill="none" stroke="${OL}" stroke-width="26" stroke-linecap="round"/><path d="${ad}" fill="none" stroke="${TONI.hair}" stroke-width="13" stroke-linecap="round"/>`;
  // brows (on top of hair)
  const by = -60 - E.brow * 0.7, inner = E.tilt * 18; // >0 angry (inner end lower), <0 worried
  head += brow(-92, by - inner * 0.3, -30, by + inner, 13);
  head += brow(30, by + inner, 92, by - inner * 0.3, 13);
  if (p.sweat >= 0) head += drop(150, -70 + p.sweat * 70, 1.1);

  const headG = `<g transform="translate(${hx} ${f1(hy)}) rotate(${f1(p.tilt)})">${head}</g>`;
  const neck = `<rect x="-34" y="-306" width="68" height="64" fill="${skin}" stroke="${OL}" stroke-width="7"/>`;
  const raisedArm = p.raise > 0.01 || p.panic > 0.01;
  back += `<g transform="translate(0 ${f1(bodyY)})">` + neck + torso + (p.legs ? armL + armR : '') + headG + (!p.legs && raisedArm ? armL : '') + `</g>`;
  if (!p.legs) front += `<g transform="translate(0 ${f1(bodyY)})">` + (raisedArm ? '' : armL) + armR + `</g>`;
  const wrap = s => `<g transform="${T(p.x, p.y)} scale(${p.s})">${s}</g>`;
  return { back: wrap(back), front: wrap(front) };
}

// soul leaving the body (ghost Toni)
function ghost(x, y, s, t, alpha = 0.85) {
  const sway = Math.sin(t * 4) * 12;
  return `<g transform="${T(x + sway, y)} scale(${s})" opacity="${f1(alpha)}">
    <path d="M -120 0 C -125 -150 125 -150 120 0 L 120 120 Q 90 100 70 135 Q 40 105 15 140 Q -15 105 -40 140 Q -70 105 -95 135 Q -110 110 -120 120 Z" fill="#F4F7FF" stroke="${OL}" stroke-width="7"/>
    <path d="M 10 -105 C 15 -150 60 -160 52 -195" fill="none" stroke="${OL}" stroke-width="20" stroke-linecap="round"/><path d="M 10 -105 C 15 -150 60 -160 52 -195" fill="none" stroke="#F4F7FF" stroke-width="9" stroke-linecap="round"/>
    <ellipse cx="-38" cy="-20" rx="13" ry="9" fill="${OL}"/><ellipse cx="38" cy="-20" rx="13" ry="9" fill="${OL}"/><path d="M -18 30 L 18 30" stroke="${OL}" stroke-width="6" stroke-linecap="round"/></g>`;
}

// ------------------------------------------------------------ classmates
const KIDS = {
  lena: { skin: '#F2C29B', hair: '#C2622D', hairStyle: 'bob', shirt: '#E85D75' },
  jonas: { skin: '#E0A57A', hair: '#24212D', hairStyle: 'spiky', shirt: '#4BA36E', glasses: true },
  mia: { skin: '#8D5A3B', hair: '#2B1D1A', hairStyle: 'puffs', shirt: '#6C8CF5' },
  ben: { skin: '#FFD9BC', hair: '#E8C15A', hairStyle: 'buzz', shirt: '#9B6CD9', freckles: true },
  emre: { skin: '#D69B70', hair: '#3B2620', hairStyle: 'curly', shirt: '#F28C38' },
  sara: { skin: '#F7D0B5', hair: '#7A3E9D', hairStyle: 'pony', shirt: '#2FB5A8' },
};

function kidHair(style, col, front) {
  const st = `fill="${col}" stroke="${OL}" stroke-width="7" stroke-linejoin="round"`;
  switch (style) {
    case 'bob':
      return front
        ? `<path d="M -150 40 C -175 -120 -90 -170 0 -168 C 90 -170 175 -120 150 40 L 128 50 C 130 -20 120 -60 90 -76 Q 30 -40 -40 -84 Q -100 -60 -128 50 Z" ${st}/>`
        : `<path d="M -165 120 C -190 -60 -150 -175 0 -175 C 150 -175 190 -60 165 120 Z" ${st}/>`;
    case 'spiky':
      return front ? `<path d="M -142 -10 L -150 -70 L -120 -90 L -128 -150 L -80 -130 L -60 -185 L -20 -140 L 10 -190 L 40 -140 L 80 -180 L 90 -125 L 135 -140 L 125 -85 L 150 -60 L 140 -10 Q 90 -80 0 -88 Q -90 -80 -142 -10 Z" ${st}/>` : '';
    case 'puffs':
      return front
        ? `<path d="M -138 -10 C -150 -120 -80 -160 0 -160 C 80 -160 150 -120 138 -10 Q 80 -95 0 -96 Q -80 -95 -138 -10 Z" ${st}/>`
        : `<circle cx="-140" cy="-130" r="70" ${st}/><circle cx="140" cy="-130" r="70" ${st}/>`;
    case 'buzz':
      return front ? `<path d="M -134 -30 C -140 -130 -70 -150 0 -150 C 70 -150 140 -130 134 -30 Q 70 -100 0 -102 Q -70 -100 -134 -30 Z" ${st}/>` : '';
    case 'curly': {
      let s = '';
      [[-120, -70], [-90, -120], [-40, -145], [15, -150], [65, -135], [110, -100], [130, -50], [-135, -20]].forEach(([x, y]) => (s += `<circle cx="${x}" cy="${y}" r="48" ${st}/>`));
      return front ? s + `<path d="M -120 -60 Q 0 -150 120 -60" fill="${col}"/>` : '';
    }
    case 'pony':
      return front
        ? `<path d="M -142 0 C -150 -120 -80 -165 0 -165 C 80 -165 150 -120 142 0 Q 110 -70 40 -90 Q -60 -60 -142 0 Z" ${st}/>`
        : `<path d="M 120 -120 C 220 -120 240 40 190 110 C 180 40 160 -40 110 -60 Z" ${st}/>`;
  }
  return '';
}

function kid(name, o) {
  const k = KIDS[name];
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, expr: 'neutral', turn: 0, lx: 0, ly: 0, mouth: 0, seed: 3, bounce: 0, excl: 0, tilt: 0 }, o);
  const t = p.t;
  const laugh = p.expr === 'laugh';
  const bob = laugh ? -Math.abs(Math.sin(t * 9 + p.seed)) * 22 : Math.sin(t * 2 + p.seed) * 2;
  let s = `<rect x="-30" y="-275" width="60" height="70" fill="${k.skin}" stroke="${OL}" stroke-width="7"/>`;
  s += `<path d="M -150 0 C -152 -110 -140 -190 -92 -218 Q 0 -238 92 -218 C 140 -190 152 -110 150 0 Z" fill="${k.shirt}" stroke="${OL}" stroke-width="7.5"/>`;
  s += `<path d="M -40 -222 Q 0 -190 40 -222" fill="none" stroke="${OL}" stroke-width="6"/>`;
  const dx = p.turn * 34;
  let h = kidHair(k.hairStyle, k.hair, false);
  h += `<circle cx="${-140 + dx * 0.3}" cy="12" r="26" fill="${k.skin}" stroke="${OL}" stroke-width="7"/><circle cx="${140 + dx * 0.3}" cy="12" r="26" fill="${k.skin}" stroke="${OL}" stroke-width="7"/>`;
  h += `<ellipse cx="0" cy="0" rx="142" ry="134" fill="${k.skin}" stroke="${OL}" stroke-width="8"/>`;
  if (k.freckles) h += `<g fill="#C9825A">${[[-80, 50], [-66, 62], [-92, 64], [80, 50], [66, 62], [92, 64]].map(([x, y]) => `<circle cx="${x + dx}" cy="${y}" r="4"/>`).join('')}</g>`;
  const bl = blink(t, p.seed);
  if (laugh) {
    h += happyEye(-50 + dx, 4, 30) + happyEye(50 + dx, 4, 30);
    h += drop(-100 + dx, 30 + ((t * 120) % 50), 0.5) + drop(100 + dx, 30 + ((t * 120 + 25) % 50), 0.5);
    h += mouthShape({ x: dx, y: 70, open: 0.7 + 0.3 * Math.abs(Math.sin(t * 14 + p.seed)), w: 60, shape: 'laugh' });
  } else {
    const stare = p.expr === 'stare';
    const ex = { rx: stare ? 38 : 32, ry: stare ? 44 : 38, pr: stare ? 8 : 13, lid: stare ? 0 : 0.12 };
    h += eye({ x: -50 + dx, y: 4, rx: ex.rx, ry: ex.ry, px: p.lx * 12, py: p.ly * 12 + 3, pr: ex.pr, lid: Math.max(ex.lid, bl), skin: k.skin, side: 'L' });
    h += eye({ x: 50 + dx, y: 4, rx: ex.rx, ry: ex.ry, px: p.lx * 12, py: p.ly * 12 + 3, pr: ex.pr, lid: Math.max(ex.lid, bl), skin: k.skin, side: 'R' });
    h += mouthShape({ x: dx, y: 80, open: p.mouth, w: 40, shape: stare ? 'O' : p.expr === 'smile' ? 'smile' : 'flat' });
  }
  h += `<path d="M ${-7 + dx} 42 Q ${dx} 50 ${7 + dx} 42" fill="none" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`;
  if (k.glasses) h += `<g fill="none" stroke="${OL}" stroke-width="7"><circle cx="${-50 + dx}" cy="4" r="46"/><circle cx="${50 + dx}" cy="4" r="46"/><path d="M ${-4 + dx} 0 L ${4 + dx} 0"/></g>`;
  h += `<g transform="translate(${f1(dx * 0.35)} 0)">${kidHair(k.hairStyle, k.hair, true)}</g>`;
  const by = p.expr === 'stare' ? -82 : -66;
  h += brow(-78 + dx, by, -26 + dx, by - 4, 10) + brow(26 + dx, by - 4, 78 + dx, by, 10);
  s += `<g transform="translate(0 ${f1(-382 + bob * 0.4)}) rotate(${f1(p.turn * 7 + p.tilt + (laugh ? Math.sin(t * 9) * 4 : 0))})">${h}</g>`;
  if (p.excl > 0) s += `<g transform="translate(0 -620) scale(${f1(Ease.outBack(clamp(p.excl)) * 10) / 10})"><text text-anchor="middle" dominant-baseline="central" font-family="Luckiest Guy" font-size="150" fill="#FF4F6D" stroke="${OL}" stroke-width="22" stroke-linejoin="round" paint-order="stroke">!</text></g>`;
  return `<g transform="${T(p.x, p.y + bob)} scale(${p.s})">${s}</g>`;
}

// ------------------------------------------------------------ teacher: Frau Krause
const KRAUSE = { skin: '#F4C7A6', hair: '#B4B2C6', cardigan: '#6B47A0', cardiganDark: '#55358A', blouse: '#F5EFE4', glasses: '#E5394A', lip: '#B8325A' };
function krause(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, mouth: 0, mood: 'stern', glint: -1, glassesDown: 0, tilt: 0, lx: 0, ly: 0, seed: 9, prop: 'stick', stickTap: 0, blush: 0 }, o);
  const K = KRAUSE, t = p.t;
  let s = '';
  // torso
  s += `<rect x="-36" y="-400" width="72" height="90" fill="${K.skin}" stroke="${OL}" stroke-width="7"/>`;
  s += `<path d="M -190 140 C -196 -90 -178 -282 -108 -322 Q 0 -350 108 -322 C 178 -282 196 -90 190 140 Z" fill="${K.cardigan}" stroke="${OL}" stroke-width="8" stroke-linejoin="round"/>`;
  s += `<path d="M -62 -330 L 0 -150 L 62 -330 Z" fill="${K.blouse}" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="M 0 -150 L 0 140" stroke="${K.cardiganDark}" stroke-width="7"/>`;
  [-90, -30, 30, 90].forEach(y => (s += `<circle cx="16" cy="${y}" r="8" fill="#F0D36B" stroke="${OL}" stroke-width="4"/>`));
  s += `<path d="M -56 -318 Q 0 -250 56 -318" fill="none" stroke="#fff" stroke-width="0"/>`;
  for (let i = 0; i <= 8; i++) { const a = i / 8; const x = lerp(-50, 50, a), y = -312 + Math.sin(a * Math.PI) * 58; s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="#FBF7EE" stroke="${OL}" stroke-width="3.5"/>`; }
  // arms + prop
  if (p.prop === 'stick') {
    const tap = Math.sin(p.stickTap * Math.PI * 2) * 12;
    s += limb([150, -270], [215, -120], [120, -40 + tap], 56, K.cardigan);
    s += `<path d="M 120 ${f1(-40 + tap)} L -40 ${f1(-310 + tap)}" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M 120 ${f1(-40 + tap)} L -40 ${f1(-310 + tap)}" stroke="#A86A3C" stroke-width="9" stroke-linecap="round"/>`;
    s += hand(120, -40 + tap, 32, K.skin, 20);
    s += limb([-150, -270], [-220, -120], [-60, -60], 56, K.cardigan) + hand(-60, -60, 32, K.skin, -10);
  } else if (p.prop === 'mug') {
    s += limb([-150, -270], [-225, -110], [-90, -95], 56, K.cardigan);
    s += `<g transform="translate(-60 -150)"><path d="M 45 -40 Q 95 -40 90 5 Q 85 40 45 30" fill="none" stroke="${OL}" stroke-width="20"/><path d="M 45 -40 Q 95 -40 90 5 Q 85 40 45 30" fill="none" stroke="#fff" stroke-width="9"/><rect x="-60" y="-75" width="110" height="130" rx="14" fill="#fff" stroke="${OL}" stroke-width="7"/><text x="-5" y="-30" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="30" fill="${K.glasses}">#1</text><text x="-5" y="8" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="21" fill="${OL}">MATHE</text><path d="M -30 -95 q 10 -15 0 -30 M 10 -95 q 10 -15 0 -30" stroke="#C9C4D8" stroke-width="6" fill="none" stroke-linecap="round" opacity="${f1(0.5 + 0.5 * Math.sin(t * 3))}"/></g>`;
    s += hand(-100, -105, 32, K.skin, -10);
    s += limb([150, -270], [215, -120], [120, -40], 56, K.cardigan) + hand(120, -40, 32, K.skin, 10);
  }
  // head
  let h = '';
  h += `<path d="M -150 30 C -170 -140 -90 -190 0 -190 C 90 -190 170 -140 150 30 Z" fill="${K.hair}" stroke="${OL}" stroke-width="7"/>`;
  h += `<circle cx="0" cy="-205" r="72" fill="${K.hair}" stroke="${OL}" stroke-width="7"/>`;
  h += `<path d="M -40 -240 Q 0 -260 40 -240" fill="none" stroke="#8F8CA6" stroke-width="7" stroke-linecap="round"/>`;
  h += `<g transform="translate(40 -230) rotate(-35)"><rect x="-8" y="-70" width="16" height="120" fill="#F4C542" stroke="${OL}" stroke-width="5"/><path d="M -8 50 L 0 70 L 8 50 Z" fill="#F2D2A9" stroke="${OL}" stroke-width="4"/><rect x="-8" y="-80" width="16" height="14" fill="#F08AA0" stroke="${OL}" stroke-width="4"/></g>`;
  h += `<circle cx="-128" cy="18" r="24" fill="${K.skin}" stroke="${OL}" stroke-width="7"/><circle cx="128" cy="18" r="24" fill="${K.skin}" stroke="${OL}" stroke-width="7"/>`;
  h += `<ellipse cx="0" cy="0" rx="128" ry="148" fill="${K.skin}" stroke="${OL}" stroke-width="8"/>`;
  h += `<path d="M -120 -40 C -110 -120 -50 -140 10 -132 C -40 -110 -70 -80 -120 -40 Z" fill="${K.hair}" stroke="${OL}" stroke-width="6"/>`;
  h += `<path d="M 120 -40 C 112 -110 70 -136 10 -132 C 60 -112 90 -86 120 -40 Z" fill="${K.hair}" stroke="${OL}" stroke-width="6"/>`;
  if (p.blush > 0) h += `<g opacity="${f1(p.blush * 0.7)}"><ellipse cx="-78" cy="62" rx="26" ry="13" fill="#FF6F86"/><ellipse cx="78" cy="62" rx="26" ry="13" fill="#FF6F86"/></g>`;
  const bl = blink(t, p.seed);
  const gd = p.glassesDown * 38;
  if (p.mood === 'sweet') {
    h += happyEye(-46, 14, 24, 7) + happyEye(46, 14, 24, 7);
  } else {
    const calm = p.mood === 'calm';
    const lid = Math.max(calm ? 0.48 : 0.32, bl);
    h += eye({ x: -46, y: 10, rx: 26, ry: 27, px: p.lx * 9, py: p.ly * 9 + 3, pr: calm ? 9 : 7, lid, angry: calm ? 0 : 0.7, skin: K.skin, side: 'L', sw: 5.5 });
    h += eye({ x: 46, y: 10, rx: 26, ry: 27, px: p.lx * 9, py: p.ly * 9 + 3, pr: calm ? 9 : 7, lid, angry: calm ? 0 : 0.7, skin: K.skin, side: 'R', sw: 5.5 });
  }
  // brows
  if (p.mood === 'stern') h += brow(-80, -40, -22, -26, 8, '#6E6A85') + brow(22, -26, 80, -40, 8, '#6E6A85');
  else h += brow(-80, -38, -22, -44, 8, '#6E6A85') + brow(22, -44, 80, -38, 8, '#6E6A85');
  // nose + mouth
  h += `<path d="M -4 0 L 16 62 Q 4 70 -8 64" fill="none" stroke="${OL}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  const mshape = p.mood === 'sweet' ? 'smile' : p.mood === 'stern' ? 'frown' : 'flat';
  h += mouthShape({ x: 0, y: 100, open: p.mouth * 0.8, w: 46, shape: mshape, lip: K.lip });
  // glasses (cat-eye) + glint
  const gl = `<g transform="translate(0 ${f1(gd)})">
    <path d="M -96 -8 Q -100 -30 -70 -30 L -18 -26 Q -6 -24 -8 0 Q -12 36 -50 38 Q -88 38 -94 12 Z M -96 -8 L -116 -38" fill="#fff" fill-opacity="0.18" stroke="${K.glasses}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M 96 -8 Q 100 -30 70 -30 L 18 -26 Q 6 -24 8 0 Q 12 36 50 38 Q 88 38 94 12 Z M 96 -8 L 116 -38" fill="#fff" fill-opacity="0.18" stroke="${K.glasses}" stroke-width="8" stroke-linejoin="round"/>
    <path d="M -10 -8 Q 0 -16 10 -8" fill="none" stroke="${K.glasses}" stroke-width="7"/>
    <path d="M -128 0 L -96 -4 M 128 0 L 96 -4" stroke="${K.glasses}" stroke-width="6"/></g>`;
  h += gl;
  if (p.glint >= 0 && p.glint <= 1) {
    const gx = lerp(-60, 60, p.glint);
    const id = uid();
    h += `<clipPath id="${id}"><path d="M -96 -8 Q -100 -30 -70 -30 L -18 -26 Q -6 -24 -8 0 Q -12 36 -50 38 Q -88 38 -94 12 Z M 96 -8 Q 100 -30 70 -30 L 18 -26 Q 6 -24 8 0 Q 12 36 50 38 Q 88 38 94 12 Z" transform="translate(0 ${f1(gd)})"/></clipPath>`;
    h += `<g clip-path="url(#${id})"><path d="M ${f1(gx - 90)} 60 L ${f1(gx - 40)} -50 L ${f1(gx - 10)} -50 L ${f1(gx - 60)} 60 Z M ${f1(gx - 30)} 60 L ${f1(gx + 20)} -50 L ${f1(gx + 34)} -50 L ${f1(gx - 16)} 60 Z" fill="#fff" opacity="0.95"/></g>`;
    const st = Math.sin(p.glint * Math.PI);
    h += `<g transform="translate(78 ${f1(-36 + gd)}) scale(${f1(st * 10) / 10}) rotate(${f1(p.glint * 90)})"><path d="M 0 -40 L 8 -8 L 40 0 L 8 8 L 0 40 L -8 8 L -40 0 L -8 -8 Z" fill="#fff" stroke="${OL}" stroke-width="3"/></g>`;
  }
  s += `<g transform="translate(0 -540) rotate(${f1(p.tilt)})">${h}</g>`;
  return `<g transform="${T(p.x, p.y)} scale(${p.s})">${s}</g>`;
}

// ------------------------------------------------------------ janitor
function janitor(o) {
  const p = Object.assign({ x: 0, y: 0, s: 1, t: 0, mouth: 0, wave: 0, wink: 0, seed: 21 }, o);
  const t = p.t, skin = '#E8B48C';
  let s = '';
  // broom (behind)
  s += `<g transform="translate(-150 -60) rotate(-12)"><rect x="-9" y="-520" width="18" height="560" fill="#B07A4A" stroke="${OL}" stroke-width="6"/><path d="M -70 40 L 70 40 L 90 170 L -90 170 Z" fill="#E7C55B" stroke="${OL}" stroke-width="7"/><path d="M -60 70 L -70 165 M -25 70 L -28 165 M 10 70 L 12 165 M 45 70 L 55 165" stroke="#B9922F" stroke-width="5"/></g>`;
  s += `<rect x="-38" y="-390" width="76" height="90" fill="${skin}" stroke="${OL}" stroke-width="7"/>`;
  s += `<path d="M -175 150 C -180 -100 -165 -270 -100 -312 Q 0 -340 100 -312 C 165 -270 180 -100 175 150 Z" fill="#8E99A6" stroke="${OL}" stroke-width="8"/>`;
  s += `<path d="M -120 150 L -110 -170 L 110 -170 L 120 150 Z" fill="#3E6FB0" stroke="${OL}" stroke-width="7"/>`;
  s += `<path d="M -105 -165 L -80 -310 M 105 -165 L 80 -310" stroke="#3E6FB0" stroke-width="30" stroke-linecap="round"/><path d="M -105 -165 L -80 -310 M 105 -165 L 80 -310" stroke="${OL}" stroke-width="4" stroke-opacity="0.4"/>`;
  s += `<circle cx="-100" cy="-170" r="11" fill="#F0D36B" stroke="${OL}" stroke-width="4"/><circle cx="100" cy="-170" r="11" fill="#F0D36B" stroke="${OL}" stroke-width="4"/>`;
  s += `<rect x="-45" y="-120" width="90" height="70" rx="8" fill="#355F9A" stroke="${OL}" stroke-width="5"/>`;
  // arms
  s += limb([-150, -270], [-200, -150], [-150, -60], 56, '#8E99A6') + hand(-150, -60, 33, skin);
  const wv = p.wave > 0 ? Math.sin(t * 14) * 22 * p.wave : 0;
  const hw = [lerp(150, 250, p.wave) + wv, lerp(-60, -560, p.wave)];
  s += limb([150, -270], [lerp(210, 290, p.wave), lerp(-150, -330, p.wave)], hw, 56, '#8E99A6') + hand(hw[0], hw[1], 34, skin, wv);
  // head
  let h = '';
  h += `<circle cx="-128" cy="10" r="27" fill="${skin}" stroke="${OL}" stroke-width="7"/><circle cx="128" cy="10" r="27" fill="${skin}" stroke="${OL}" stroke-width="7"/>`;
  h += `<ellipse cx="0" cy="0" rx="132" ry="126" fill="${skin}" stroke="${OL}" stroke-width="8"/>`;
  const bl = blink(t, p.seed);
  h += eye({ x: -45, y: -6, rx: 22, ry: 24, pr: 10, lid: Math.max(0.2, bl), skin, side: 'L', sw: 5.5 });
  h += p.wink > 0.5 ? happyEye(45, -2, 20, 7) : eye({ x: 45, y: -6, rx: 22, ry: 24, pr: 10, lid: Math.max(0.2, bl), skin, side: 'R', sw: 5.5 });
  h += brow(-80, -50, -20, -44, 13, '#5A4A40') + brow(20, -44, 80, -50, 13, '#5A4A40');
  h += mouthShape({ x: 0, y: 84, open: p.mouth, w: 50, shape: 'smile' });
  const mb = p.mouth * -10;
  h += `<path d="M 0 ${f1(48 + mb)} C -30 ${f1(30 + mb)} -95 ${f1(40 + mb)} -100 ${f1(80 + mb)} C -80 ${f1(66 + mb)} -60 ${f1(76 + mb)} -48 ${f1(70 + mb)} C -35 ${f1(80 + mb)} -15 ${f1(74 + mb)} 0 ${f1(66 + mb)} C 15 ${f1(74 + mb)} 35 ${f1(80 + mb)} 48 ${f1(70 + mb)} C 60 ${f1(76 + mb)} 80 ${f1(66 + mb)} 100 ${f1(80 + mb)} C 95 ${f1(40 + mb)} 30 ${f1(30 + mb)} 0 ${f1(48 + mb)} Z" fill="#6B5A4E" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>`;
  h += `<ellipse cx="0" cy="28" rx="30" ry="24" fill="#E09A78" stroke="${OL}" stroke-width="6"/>`;
  // cap
  h += `<path d="M -134 -40 C -130 -150 -60 -168 0 -168 C 60 -168 130 -150 134 -40 Z" fill="#4D5B6E" stroke="${OL}" stroke-width="7"/>`;
  h += `<path d="M -134 -42 Q 0 -70 190 -30 Q 140 -10 120 -28 Q 0 -45 -134 -30 Z" fill="#3B4757" stroke="${OL}" stroke-width="7" stroke-linejoin="round"/>`;
  h += `<rect x="-30" y="-130" width="60" height="38" rx="8" fill="#F0D36B" stroke="${OL}" stroke-width="5"/>`;
  s += `<g transform="translate(0 -500) rotate(${f1(Math.sin(t * 2) * 2)})">${h}</g>`;
  return `<g transform="${T(p.x, p.y)} scale(${p.s})">${s}</g>`;
}

// ------------------------------------------------------------ props
function clock({ x, y, r, sec = 0, min = 10, hour = 10, eyes = 0, lx = 0, lid = 0, t = 0 }) {
  let s = `<g transform="${T(x, y)}">`;
  s += `<circle r="${r + r * 0.12}" fill="#E55A4E" stroke="${OL}" stroke-width="${r * 0.05}"/>`;
  s += `<circle r="${r}" fill="#FFFDF6" stroke="${OL}" stroke-width="${r * 0.035}"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2, r1 = r * (i % 3 === 0 ? 0.78 : 0.86), r2 = r * 0.93;
    s += `<path d="M ${f1(Math.sin(a) * r1)} ${f1(-Math.cos(a) * r1)} L ${f1(Math.sin(a) * r2)} ${f1(-Math.cos(a) * r2)}" stroke="${OL}" stroke-width="${f1(r * (i % 3 === 0 ? 0.045 : 0.025))}" stroke-linecap="round"/>`;
  }
  if (eyes > 0) {
    const e = Ease.outBack(clamp(eyes));
    s += `<g transform="translate(0 ${f1(-r * 0.32)}) scale(${f1(e * 100) / 100})">`;
    s += eye({ x: -r * 0.26, y: 0, rx: r * 0.17, ry: r * 0.2, px: lx * r * 0.07, py: 0, pr: r * 0.07, lid, skin: '#FFFDF6', side: 'L', sw: r * 0.025 });
    s += eye({ x: r * 0.26, y: 0, rx: r * 0.17, ry: r * 0.2, px: lx * r * 0.07, py: 0, pr: r * 0.07, lid, skin: '#FFFDF6', side: 'R', sw: r * 0.025 });
    s += `</g>`;
  }
  const hand_ = (ang, len, w, col) => `<path d="M 0 0 L ${f1(Math.sin(ang) * len)} ${f1(-Math.cos(ang) * len)}" stroke="${col}" stroke-width="${f1(w)}" stroke-linecap="round"/>`;
  s += hand_((hour / 12) * Math.PI * 2, r * 0.45, r * 0.06, OL) + hand_((min / 60) * Math.PI * 2, r * 0.68, r * 0.045, OL) + hand_((sec / 60) * Math.PI * 2, r * 0.78, r * 0.02, '#E5394A');
  s += `<circle r="${f1(r * 0.05)}" fill="#E5394A" stroke="${OL}" stroke-width="${f1(r * 0.015)}"/>`;
  return s + '</g>';
}

function desk(x, y, w, s = 1, items = true) {
  let d = `<g transform="${T(x, y)} scale(${s})">`;
  d += `<rect x="${-w / 2 + 14}" y="-30" width="${w - 28}" height="420" fill="#B9763F" stroke="${OL}" stroke-width="7"/>`;
  d += `<rect x="${-w / 2 + 14}" y="-30" width="${w - 28}" height="30" fill="#9C5F2F"/>`;
  d += `<rect x="${-w / 2}" y="-74" width="${w}" height="50" rx="14" fill="#DDA36C" stroke="${OL}" stroke-width="7"/>`;
  if (items) {
    d += `<g transform="translate(${-w * 0.08} -86) rotate(-4)"><rect x="-70" y="-14" width="140" height="22" rx="4" fill="#FDFBF3" stroke="${OL}" stroke-width="5"/><path d="M -50 -4 L 40 -4" stroke="#7FB5E8" stroke-width="3"/></g>`;
    d += `<g transform="translate(${w * 0.25} -84) rotate(8)"><rect x="-55" y="-7" width="110" height="14" rx="3" fill="#F4C542" stroke="${OL}" stroke-width="4"/><path d="M 55 -7 L 75 0 L 55 7 Z" fill="#F2D2A9" stroke="${OL}" stroke-width="4"/></g>`;
  }
  return d + '</g>';
}
