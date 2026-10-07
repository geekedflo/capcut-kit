// Episode 2 — "Gruppenarbeit" (youth style). Shot list + choreography.
const T2 = ['toni2'];

function toniCU(t, { expr = 'deadpan', tilt = 0, mouth = true } = {}) {
  let w = classroomMuted(t);
  w += `<rect x="-600" y="-400" width="2280" height="2600" fill="#141018" opacity="0.18"/>`;
  w += teen('toni', { x: 540, y: 1760, s: 1.5, t, pose: 'crossed', expr, mouth: mouth ? mouthOf(T2, t) : 0, seed: 4, tilt: Math.sin(t * 1.2) * 1.5 + tilt });
  return w;
}

const SHOTS = [
  // 1 hook: Toni, arms crossed, dead stare
  { from: 'hook', draw(t, tt) {
    const boomT = B.hook2.start + 0.55;
    const w = toniCU(t, { expr: t > boomT - 0.05 ? 'annoyed' : 'deadpan' });
    const z = tw(t, 0, boomT, 1.0, 1.06, Ease.inOutQuad) + tw(t, boomT, boomT + 0.08, 0, 0.16, Ease.outCubic) - tw(t, boomT + 0.08, boomT + 0.9, 0, 0.06, Ease.inOutQuad);
    const sh = wob(t, boomT, 18, 14, 7);
    return { world: w, cam: { x: 540 + sh, y: 930 + sh * 0.5, z }, flash: t > boomT && t < boomT + 0.06 ? 0.25 : 0, noPunch: true };
  } },
  // 2 group chat
  { from: 'chat', draw(t, tt) {
    const w = chatScreen(t, {
      title: 'Referat Bio',
      msgs: [
        { from: 'toni', text: 'wer macht was? 👀', t0: B.chat.start + 0.05, time: '16:02' },
        { from: 'jonas', text: 'ich mach die titelfolie 🙏', t0: B.chat2.start, time: '16:40' },
        { from: 'lena', text: 'ich bring kekse mit 🍪', t0: B.chat3.start, time: '17:15' },
      ],
      readBy: { text: 'Emre hat gelesen · vor 3 Wochen', t0: B.chat4.start + 0.4 },
    });
    const z = tw(tt, 0, 4, 1.0, 1.04, Ease.inOutQuad);
    return { world: w, cam: { x: 540, y: 960, z }, capY: 1500 };
  } },
  // 3 night grind: slides count up, then 03:12
  { from: 'nacht', draw(t, tt) {
    const late = t >= B.nacht2.start;
    const nod = late ? Math.max(0, Math.sin((t - B.nacht2.start) * 5)) * 6 : 0;
    let w = bedroomNight(t);
    w += teen('toni', { x: 540, y: 1660, s: 1.55, t, pose: 'desk', expr: late ? 'tired' : 'deadpan', mouth: 0, seed: 4, tilt: nod, phoneGlow: 1 });
    w += `<ellipse cx="540" cy="1000" rx="420" ry="520" fill="#7FA6FF" opacity="0.08"/>`;
    const cans = Math.min(6, Math.floor(prog(t, B.nacht.start, B.nacht2.end) * 7));
    w += laptopDesk(540, 1560, 1.25, cans);
    let screen = '';
    if (!late) screen += slideCounter(t, B.nacht.start + 0.2, B.nacht.end, 540, 400);
    else {
      const flip = prog(t, B.nacht2.start, B.nacht2.start + 0.5);
      const mins = Math.floor(lerp(23 * 60 + 41, 27 * 60 + 12, Ease.outCubic(flip)));
      const hh = String(Math.floor(mins / 60) % 24).padStart(2, '0'), mm = String(mins % 60).padStart(2, '0');
      screen += digitalClock(`${hh}:${mm}`, 540, 400, 1.15 + 0.1 * wob(t, B.nacht2.start + 0.5, 1, 6, 5));
    }
    screen += `<g transform="translate(940 160)" opacity="${f1(0.5 + 0.5 * Math.sin(t * 8))}"><path d="M -30 -26 L 0 0 L -30 26 Z M 2 -26 L 32 0 L 2 26 Z" fill="#fff"/></g>`;
    const z = tw(tt, 0, 4, 1.0, 1.08, Ease.inOutQuad);
    return { world: w, cam: { x: 540, y: 1020, z }, screen };
  } },
  // 4 presentation day: fit check walk-in, then Emre's "bin krank"
  { from: 'krank', draw(t, tt) {
    let w = `<g filter="url(#mute)">${hallway(t, tt * 140)}</g>`;
    w += teen('toni', { x: 540, y: 1180, s: 1.0, t, legs: true, walk: tt * 1.7, pose: 'down', expr: t > B.krank.end - 0.5 ? 'side' : 'deadpan', seed: 4 });
    const tilt = Ease.inOutCubic(prog(tt, 0.1, 1.3));
    const cam = { x: 540, y: lerp(1560, 880, tilt), z: lerp(1.75, 1.12, tilt) };
    const screen = notif(t, B.krank.end - 0.62, 'emre', 'bin krank 🤒');
    return { world: w, cam, screen, capY: 1560 };
  } },
  // 5 Emre's story: Freibad
  { from: 'krank2', draw(t, tt) {
    const circleT = wt('krank2', 4) - 0.05;
    const w = storyScreen(t, B.krank2.start, circleT);
    const z = tw(tt, 0, 2.2, 1.0, 1.06, Ease.inOutQuad) + tw(t, B.krank2.end + 0.05, B.krank2.end + 0.15, 0, 0.12, Ease.outCubic);
    const sh = wob(t, B.krank2.end + 0.05, 16, 14, 6);
    const screen = auraPop(t, B.krank2.end + 0.05, 'KRANK??', 540, 1480, '#FF2E3F');
    return { world: w, cam: { x: 540 + sh, y: 960, z }, screen, capY: 1300 };
  } },
  // 6 Jonas reads the title slide… wrong
  { from: 'jonas', draw(t, tt) {
    let w = frontOfClass(t, titleSlide());
    w += teen('jonas', { x: 400, y: 1520, s: 0.95, t, legs: true, pose: 'phone', expr: t >= B.jonas3.start ? 'neutral' : 'tired', mouth: mouthOf(['jonas'], t), lx: -0.6, ly: 0.6, seed: 8 });
    w += teen('toni', { x: 1020, y: 1560, s: 0.95, t, legs: true, pose: 'crossed', expr: t > B.jonas2.start + 1.0 ? 'annoyed' : 'side', lx: -1, seed: 4 });
    const auraT = B.jonas3.end + 0.1;
    const z = tw(tt, 0, 4.5, 1.05, 1.18, Ease.inOutQuad) + tw(t, auraT, auraT + 0.08, 0, 0.1, Ease.outCubic);
    const sh = wob(t, auraT, 14, 14, 6);
    const screen = auraPop(t, auraT, '−1000 AURA', 540, 620, '#FF2E3F');
    return { world: w, cam: { x: 560 + sh, y: 1020, z }, screen };
  } },
  // 7 everyone looks at Toni — he answers everything
  { from: 'frage', draw(t, tt) {
    const lookT = wt('frage', 4);
    let w = frontOfClass(t, titleSlide());
    const turn = Ease.outBack(prog(t, lookT, lookT + 0.2));
    w += teen('jonas', { x: 250, y: 1330, s: 0.6, t, legs: true, pose: 'down', expr: t > lookT ? 'neutral' : 'tired', lx: turn, seed: 8 });
    w += teen('lena', { x: 530, y: 1330, s: 0.6, t, legs: true, pose: 'phone', expr: 'neutral', lx: turn * 0.9 + (1 - turn) * -0.2, ly: 0.3 * (1 - turn), seed: 12 });
    w += teen('toni', { x: 820, y: 1330, s: 0.6, t, legs: true, pose: 'hips', expr: t > B.frage2.start ? 'smug' : 'side', mouth: 0, seed: 4 });
    const z = tw(tt, 0, 3, 1.3, 1.38, Ease.inOutQuad);
    const screen = auraPop(t, B.frage2.start + 0.3, '+1000 AURA', 540, 560, '#3BE07A');
    return { world: w, cam: { x: 560, y: 1080, z }, screen };
  } },
  // 8 grades
  { from: 'noten', draw(t, tt) {
    let w = classroomMuted(t);
    w += `<rect x="-600" y="-400" width="2280" height="2600" fill="#141018" opacity="0.25"/>`;
    const stern = t >= B.noten2.start;
    w += teen('krause', { x: 540, y: 1150, s: 0.95, t, pose: 'down', expr: stern ? 'stern' : 'neutral', mouth: mouthOf(['krause'], t), seed: 9 });
    const toniT = B.noten2.start + 0.6;
    const list = gradeList(t, [
      { name: 'Jonas', grade: '1', col: '#2E8B57', t0: B.noten.start + 0.7, rot: -8 },
      { name: 'Lena', grade: '1', col: '#2E8B57', t0: B.noten.start + 0.9, rot: 6 },
      { name: 'Emre', grade: '1', col: '#2E8B57', t0: B.emre.start + 0.3, rot: -4 },
      { name: 'Toni', grade: '3', col: '#D2202F', t0: toniT, rot: -12, note: { txt: 'Teamfähigkeit?', t0: toniT + 0.5 } },
    ]);
    const z = tw(tt, 0, 6, 1.0, 1.06, Ease.inOutQuad) + tw(t, toniT, toniT + 0.08, 0, 0.08, Ease.outCubic);
    const sh = wob(t, toniT, 20, 13, 6);
    return { world: w, cam: { x: 540 + sh, y: 960 + sh * 0.4, z }, screen: list, capY: 1560 };
  } },
  // 9 punchline + loop back to the hook framing
  { from: 'emre', draw(t, tt) {
    const w = toniCU(t, { expr: t > wt('emre', 5) ? 'annoyed' : 'deadpan' });
    const z = tw(tt, 0, B.end.end - B.emre.start, 1.0, 1.14, Ease.inOutQuad);
    let screen = '';
    const st = B.emre.start + 0.3;
    if (t >= st) {
      const p = prog(t, st, st + 0.12);
      screen += `<g transform="translate(860 360) scale(${lerp(2.2, 1, Ease.outCubic(p)).toFixed(3)}) rotate(10)" opacity="${f1(Math.min(1, p * 2) * 100) / 100}"><rect x="-150" y="-80" width="300" height="160" rx="14" fill="#FBFAF6" stroke="${YOL}" stroke-width="6"/><text x="-70" y="6" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="54" fill="${YOL}">Emre</text><circle cx="80" cy="0" r="52" fill="none" stroke="#2E8B57" stroke-width="9"/><text x="80" y="4" text-anchor="middle" dominant-baseline="central" font-family="Inter" font-weight="900" font-size="74" fill="#2E8B57">1</text></g>`;
    }
    return { world: w, cam: { x: 540, y: 930, z }, screen };
  } },
];

function episodeOverlays(t) {
  let s = card(TL.hook.split('\n'), 540, 210, t, -0.3, B.chat.start - 0.02, 54);
  s += card(['Markier den Jonas', 'aus deiner Gruppe 👇'], 540, 1380, t, B.end.start + 0.15, 99, 62);
  return s;
}
