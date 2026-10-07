// Sets. Drawn in world coords; the camera frames them.

function classroomWall(t, { clockSec = null, haze = 0 } = {}) {
  let s = '';
  s += `<rect x="-600" y="-400" width="2280" height="1720" fill="#A6D9CF"/>`;
  // subtle wall stripes
  for (let x = -600; x < 1700; x += 120) s += `<rect x="${x}" y="-400" width="60" height="1720" fill="#9DD2C7"/>`;
  s += `<rect x="-600" y="1000" width="2280" height="330" fill="#6BB3A6"/><rect x="-600" y="990" width="2280" height="22" fill="#4E9488" stroke="${OL}" stroke-width="5"/>`;
  s += `<rect x="-600" y="1320" width="2280" height="900" fill="#E3C397"/>`;
  for (let x = -600; x < 1700; x += 160) s += `<path d="M ${x} 1330 L ${x - 120} 2200" stroke="#CFAA78" stroke-width="5"/>`;
  // window
  s += `<g transform="translate(60 210)"><rect x="-14" y="-14" width="388" height="458" rx="10" fill="#F7F3EA" stroke="${OL}" stroke-width="7"/>
    <rect x="10" y="10" width="340" height="410" fill="#8FD0FF"/><rect x="10" y="215" width="340" height="205" fill="#BFE6FF"/>
    <g fill="#fff" stroke="${OL}" stroke-width="5"><path transform="translate(${f1(120 + ((t * 8) % 300) - 60)} 110)" d="M -60 20 Q -60 -10 -30 -8 Q -20 -40 15 -30 Q 40 -50 60 -18 Q 85 -15 80 20 Z"/></g>
    <path d="M 10 300 Q 90 250 170 300 Q 250 260 350 300 L 350 420 L 10 420 Z" fill="#7CC67A" stroke="${OL}" stroke-width="5"/>
    <rect x="172" y="10" width="16" height="410" fill="#F7F3EA" stroke="${OL}" stroke-width="5"/><rect x="10" y="207" width="340" height="16" fill="#F7F3EA" stroke="${OL}" stroke-width="5"/></g>`;
  // periodic-table poster
  s += `<g transform="translate(560 470) rotate(-2)"><rect width="220" height="260" fill="#FFF8E7" stroke="${OL}" stroke-width="6"/>`;
  const cols = ['#FF8A80', '#FFD180', '#A5D6A7', '#90CAF9', '#CE93D8'];
  for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) if (!(r < 2 && c > 0 && c < 5)) s += `<rect x="${16 + c * 32}" y="${50 + r * 32}" width="26" height="26" fill="${cols[(r * 3 + c) % 5]}" stroke="${OL}" stroke-width="2"/>`;
  s += `<text x="110" y="32" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="22" fill="${OL}">PERIODENSYSTEM</text></g>`;
  // clock
  const sec = clockSec == null ? (t * 6) % 60 : clockSec;
  s += clock({ x: 860, y: 330, r: 88, sec, min: 47, hour: 10.8 });
  // notice board
  s += `<g transform="translate(860 560)"><rect x="-90" y="0" width="180" height="140" fill="#C98E5A" stroke="${OL}" stroke-width="6"/><rect x="-70" y="18" width="70" height="60" fill="#FFF59D" stroke="${OL}" stroke-width="3" transform="rotate(-6)"/><rect x="10" y="30" width="62" height="80" fill="#B3E5FC" stroke="${OL}" stroke-width="3" transform="rotate(5)"/></g>`;
  if (haze > 0) s += `<rect x="-600" y="-400" width="2280" height="2600" fill="#FFFFFF" opacity="${f1(haze * 10) / 10}"/>`;
  return s;
}

function chalkboardWall(t, { dark = 0 } = {}) {
  let s = '';
  s += `<rect x="-600" y="-400" width="2280" height="2600" fill="#EAD7AE"/>`;
  for (let x = -600; x < 1700; x += 120) s += `<rect x="${x}" y="-400" width="60" height="2600" fill="#E3CFA3"/>`;
  s += `<g transform="translate(540 560)"><rect x="-560" y="-330" width="1120" height="660" rx="10" fill="#8B5A33" stroke="${OL}" stroke-width="8"/>
    <rect x="-530" y="-300" width="1060" height="600" fill="#2F5D50" stroke="${OL}" stroke-width="5"/>
    <rect x="-570" y="320" width="1140" height="34" rx="6" fill="#A06B3F" stroke="${OL}" stroke-width="6"/>
    <rect x="-300" y="306" width="60" height="16" rx="5" fill="#fff" stroke="${OL}" stroke-width="3"/><rect x="200" y="300" width="90" height="26" rx="6" fill="#4A4A5A" stroke="${OL}" stroke-width="3"/>
    <g font-family="Fredoka" font-weight="600" fill="#F3F6F2" opacity="0.92">
      <text x="-470" y="-190" font-size="72">x² + 5x − 3 = 0</text>
      <text x="-470" y="-80" font-size="56">f(x) = ?</text>
      <text x="80" y="-60" font-size="54">a² + b² = c²</text>
      <text x="-470" y="60" font-size="50">∫ 2x dx = ...</text>
      <text x="120" y="80" font-size="44">HA: S. 47 Nr. 3–19</text>
    </g>
    <path d="M 120 -150 l 160 0 l -160 -110 Z" fill="none" stroke="#F3F6F2" stroke-width="6" opacity="0.85"/></g>`;
  if (dark > 0) s += `<rect x="-600" y="-400" width="2280" height="2600" fill="#1A0E2E" opacity="${f1(dark * 100) / 100}"/>`;
  return s;
}

function hallway(t, scroll) {
  let s = '';
  s += `<rect x="-600" y="-400" width="2280" height="2600" fill="#F2E4C4"/>`;
  s += `<rect x="-600" y="-400" width="2280" height="700" fill="#E6D3AC"/>`;
  // ceiling lights
  for (let i = -2; i < 6; i++) { const x = ((i * 420 - scroll * 0.5) % 1680 + 1680) % 1680 - 300; s += `<rect x="${f1(x)}" y="150" width="260" height="36" rx="12" fill="#FFFBE6" stroke="${OL}" stroke-width="5"/>`; }
  // lockers
  const lw = 150;
  const off = ((-scroll % lw) + lw) % lw - lw;
  const colors = ['#4C7BD9', '#4C7BD9', '#E25D5D', '#4C7BD9', '#F2B33D', '#4C7BD9', '#4C7BD9'];
  for (let i = -6; i < 16; i++) {
    const x = off + i * lw - 300;
    const idx = Math.floor((scroll + (i * lw)) / lw);
    const col = colors[((idx % 7) + 7) % 7];
    s += `<g transform="translate(${f1(x)} 460)"><rect width="${lw}" height="860" fill="${col}" stroke="${OL}" stroke-width="6"/>
      <rect x="20" y="40" width="${lw - 40}" height="10" rx="4" fill="${OL}" opacity="0.35"/><rect x="20" y="62" width="${lw - 40}" height="10" rx="4" fill="${OL}" opacity="0.35"/><rect x="20" y="84" width="${lw - 40}" height="10" rx="4" fill="${OL}" opacity="0.35"/>
      <rect x="${lw - 38}" y="400" width="16" height="60" rx="6" fill="#D9DEE8" stroke="${OL}" stroke-width="4"/></g>`;
  }
  // poster on lockers band
  const px = ((1100 - scroll) % 2400 + 2400) % 2400 - 600;
  s += `<g transform="translate(${f1(px)} 300) rotate(-3)"><rect x="-130" y="-90" width="260" height="150" fill="#FFF3B0" stroke="${OL}" stroke-width="6"/><text y="-20" text-anchor="middle" font-family="Luckiest Guy" font-size="44" fill="#E5484D">SCHULFEST</text><text y="30" text-anchor="middle" font-family="Fredoka" font-weight="700" font-size="28" fill="${OL}">FR. 14 UHR</text></g>`;
  s += `<rect x="-600" y="1320" width="2280" height="900" fill="#CDB892"/>`;
  for (let i = -4; i < 14; i++) { const x = ((i * 200 - scroll) % 2800 + 2800) % 2800 - 700; s += `<path d="M ${f1(x)} 1320 L ${f1(x + (x - 540) * 0.9)} 2200" stroke="#B9A47C" stroke-width="6"/>`; }
  s += `<path d="M -600 1500 L 1700 1500 M -600 1760 L 1700 1760" stroke="#B9A47C" stroke-width="6"/>`;
  s += `<rect x="-600" y="1310" width="2280" height="16" fill="#8E7B58"/>`;
  return s;
}

// speech bubble in world space
function bubble(x, y, txt, t, t0, { size = 46, dir = 1, dur = 1.6 } = {}) {
  if (t < t0 || t > t0 + dur) return '';
  const p = Ease.outBack(prog(t, t0, t0 + 0.2)) * (1 - Ease.inCubic(prog(t, t0 + dur - 0.15, t0 + dur)));
  const w = textW(txt, size, 'Fredoka', 700) + 50, h = size + 40;
  return `<g transform="${T(x, y)} scale(${p.toFixed(3)})"><path d="M ${-w / 2} ${-h} H ${w / 2} Q ${w / 2 + 16} ${-h} ${w / 2 + 16} ${-h + 16} V -16 Q ${w / 2 + 16} 0 ${w / 2} 0 H ${dir * 30} L ${dir * 10} 34 L ${dir * -10} 0 H ${-w / 2} Q ${-w / 2 - 16} 0 ${-w / 2 - 16} -16 V ${-h + 16} Q ${-w / 2 - 16} ${-h} ${-w / 2} ${-h} Z" fill="#fff" stroke="${OL}" stroke-width="6" stroke-linejoin="round"/>
    <text x="0" y="${-h / 2}" text-anchor="middle" dominant-baseline="central" font-family="Fredoka" font-weight="700" font-size="${size}" fill="${OL}">${esc(txt)}</text></g>`;
}
