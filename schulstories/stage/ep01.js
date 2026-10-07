// Episode 1 — "Ich hab meine Lehrerin MAMA genannt". Shot list + choreography.
// Each shot: from = beat id where it starts; draw(t, tt) returns {world, cam, post, screen}.

const NARR = ['toni'], SCENE_TONI = ['toni_scene', 'toni_panic'];

// classroom layout (shared by class shots)
const CLASS_KIDS = [
  // name, x, y, scale, how far they turn toward Toni when staring
  ['lena', 220, 1130, 0.52, 0.5], ['jonas', 540, 1130, 0.52, 0.35], ['emre', 860, 1130, 0.52, -0.1],
  ['mia', 170, 1640, 0.72, 0.8], ['ben', 470, 1640, 0.72, 0.7],
];
function classWide(t, phase) {
  let s = classroomWall(t);
  const stareT = B.stille.start;
  const tx = 810, ty = 1640, ts = 0.72;
  let back = '', front = '';
  CLASS_KIDS.forEach(([name, x, y, sc, turnTo], i) => {
    const o = { x, y, s: sc, t, seed: i * 7 + 2 };
    if (phase === 'stare') {
      const t0 = stareT + i * 0.06;
      const k = Ease.outBack(prog(t, t0, t0 + 0.2));
      o.turn = turnTo * k; o.lx = k; o.ly = (y < 1300 ? 0.5 : 0.1) * k;
      o.expr = t > t0 ? 'stare' : 'neutral';
      o.excl = prog(t, t0 + 0.05, t0 + 0.3);
    } else if (phase === 'laugh') {
      o.expr = 'laugh'; o.turn = turnTo * 0.6;
    } else {
      o.lx = Math.sin(t * 0.7 + i) * 0.3;
    }
    const str = kid(name, o) + desk(x, y, 420, sc);
    if (y < 1300) back += str; else front += str;
  });
  const to = { x: tx, y: ty, s: ts, t, seed: 5 };
  if (phase === 'raise') {
    const r0 = B.meld.start + 0.42;
    to.raise = Ease.outBack(prog(t, r0, r0 + 0.3));
    to.expr = 'neutral'; to.antWob = wob(t, r0 + 0.1, 1, 5, 4);
  } else if (phase === 'stare') {
    to.raise = 1; to.expr = 'shock'; to.antenna = Ease.outBack(prog(t, stareT, stareT + 0.2));
    to.sweat = prog(t, stareT + 0.3, stareT + 1.5); to.blush = prog(t, stareT + 0.2, stareT + 1.0);
  } else if (phase === 'laugh') {
    const l0 = B.lach.start;
    to.expr = 'dead'; to.antenna = -Ease.outBack(prog(t, l0 + 0.45, l0 + 0.7)); to.pale = 1; to.noBlink = true;
  }
  const tn = toni(to);
  s += back + front + tn.back + desk(tx, ty, 460, ts) + tn.front;
  if (phase === 'laugh') {
    const gp = prog(t, B.lach.start + 0.35, B.lach.start + 1.6);
    if (gp > 0) s += ghost(tx + 10, ty - 330 - gp * 330, 0.55 + gp * 0.15, t, 0.9 * Ease.outCubic(clamp(gp * 4)));
  }
  return s;
}

const SHOTS = [
  // 1 — hook: Toni talks to camera
  { from: 'hook', draw(t, tt) {
    const mamaT = wt('hook', 7);
    let w = classroomWall(t, { haze: 0.28 });
    const lean = tw(t, B.notany.start, B.notany.start + 0.25, 0, 1, Ease.outBack);
    const tn = toni({ x: 540, y: 1520, s: 1.38, t, mouth: mouthOf(NARR, t), expr: t > B.notany.start ? 'neutral' : 'deadpan',
      antenna: Ease.outBack(prog(t, mamaT, mamaT + 0.15)) * (1 - prog(t, mamaT + 0.6, mamaT + 0.9)), antWob: wob(t, mamaT + 0.75, 1, 6, 4),
      tilt: Math.sin(t * 1.3) * 2 + lean * -4, lx: 0, ly: 0.1 });
    w += tn.back + desk(540, 1520, 640, 1.38) + tn.front;
    const z = tw(t, 0, B.notany.start, 1.0, 1.07, Ease.inOutQuad) + lean * 0.12;
    // whip pan out at the end of the shot
    const whip = Ease.inCubic(prog(t, B.krause.start - 0.18, B.krause.start));
    return { world: w, cam: { x: 540 + whip * 700, y: 900 - lean * 60, z }, blur: whip * 40, noPunch: true };
  } },
  // 2 — Frau Krause, dramatic
  { from: 'krause', draw(t, tt) {
    const longNote = B.krause.start + 0.56, thunder = B.mathe.start;
    const flash = Math.max(0, 1 - prog(t, thunder, thunder + 0.12)) * (t >= thunder ? 1 : 0) + (t > thunder + 0.16 && t < thunder + 0.24 ? 0.7 : 0);
    let w = chalkboardWall(t, { dark: 0.62 - flash * 0.55 });
    w += `<ellipse cx="540" cy="1000" rx="520" ry="620" fill="url(#spot)" opacity="${f1(0.9 - flash * 0.5)}"/>`;
    w += krause({ x: 540, y: 1720, s: 1.32, t, mood: 'stern', glint: prog(t, longNote + 0.05, longNote + 0.45) || -1, stickTap: t * 1.6, prop: 'stick', ly: 0.3 });
    // red under-glow
    w += `<rect x="-600" y="1100" width="2280" height="1200" fill="url(#redglow)" opacity="0.55"/>`;
    const whipIn = 1 - Ease.outCubic(prog(tt, 0, 0.18));
    const zoom = tw(t, longNote, longNote + 0.14, 1.0, 1.35, Ease.outCubic) + tw(t, thunder, thunder + 1.2, 0, 0.08, Ease.outQuad);
    const sh = wob(t, thunder, 26, 13, 5);
    return { world: w, cam: { x: 540 - whipIn * 700 + sh, y: tw(t, longNote, longNote + 0.14, 1000, 900, Ease.outCubic) + sh * 0.6, z: zoom }, blur: whipIn * 40, flash, noPunch: true };
  } },
  // 3 — class, Toni raises hand
  { from: 'meld', draw(t, tt) {
    const w = classWide(t, 'raise');
    return { world: w, cam: { x: tw(tt, 0, 2, 560, 630), y: tw(tt, 0, 2, 1270, 1300), z: tw(tt, 0, 2, 1.02, 1.12, Ease.inOutQuad) } };
  } },
  // 4 — Toni close: "Mama, darf ich aufs Klo?"
  { from: 'klo', draw(t, tt) {
    const end = B.klo.end;
    const tf = Math.min(t, end + 0.05); // freeze after the line
    let w = classroomWall(tf, { haze: 0.28 });
    const tn = toni({ x: 540, y: 1520, s: 1.38, t: tf, mouth: mouthOf(SCENE_TONI, tf), expr: 'innocent', raise: 1, wave: t < end ? 0.4 : 0, tilt: 5, lx: -0.3, ly: -0.3, noBlink: t > end });
    w += tn.back + desk(540, 1520, 640, 1.38) + tn.front;
    const z = 1.05 + tw(t, end, end + 0.5, 0, 0.08, Ease.outCubic);
    return { world: w, cam: { x: 470, y: 900, z } };
  } },
  // 5 — class freezes and stares
  { from: 'stille', draw(t, tt) {
    const w = classWide(t, 'stare');
    const z = 1.04 + tw(tt, 0, 1.6, 0, 0.12, Ease.inOutQuad);
    return { world: w, cam: { x: 600, y: 1290, z }, tint: '#3B5BA8', tintA: 0.12 };
  } },
  // 6 — the clock stops… and looks
  { from: 'uhr', draw(t, tt) {
    const tickTimes = [0, 0.5, 1.0, 1.5].map(x => B.uhr.start + x);
    let ticks = tickTimes.filter(x => t >= x).length;
    const lastTick = tickTimes[Math.max(0, ticks - 1)];
    const sec = 2 + ticks + (t >= lastTick && ticks > 0 ? Math.min(1, (t - lastTick) / 0.06) - 1 : 0) + wob(t, lastTick, 0.15, 10, 9);
    const g0 = B.uhrgag.start + 0.28;
    let w = `<rect x="-600" y="-400" width="2280" height="2600" fill="#A6D9CF"/>`;
    for (let x = -600; x < 1700; x += 120) w += `<rect x="${x}" y="-400" width="60" height="2600" fill="#9DD2C7"/>`;
    w += `<circle cx="580" cy="850" r="345" fill="${OL}" opacity="0.12"/>`;
    const lx = -tw(t, g0 + 0.35, g0 + 0.7, 0, 1, Ease.outBack);
    const lid = tw(t, g0 + 0.8, g0 + 1.0, 0, 0.45);
    w += clock({ x: 560, y: 820, r: 300, sec, min: 47, hour: 10.8, eyes: prog(t, g0, g0 + 0.25), lx, lid, t });
    const tick = ticks > 0 && t - lastTick < 0.25 ? popWord('tick', 860, 470, t, lastTick, { size: 60, color: '#fff', rot: 10, dur: 0.25 }) : '';
    const z = tw(tt, 0, 3, 1.0, 1.1, Ease.inOutQuad) + tw(t, g0, g0 + 0.2, 0, 0.08, Ease.outBack);
    return { world: w, cam: { x: 560, y: 900, z }, screen: tick };
  } },
  // 7 — Toni tries to save it… "PAPA!"
  { from: 'retten', draw(t, tt) {
    const papaW = wt('papa', 4);
    const freezeAt = B.papa.end + 0.02;
    const tf = Math.min(t, freezeAt);
    const inPapa = tf >= B.papa.start;
    let w = classroomWall(tf, { haze: 0.28 });
    const tn = toni({ x: 540, y: 1520, s: 1.38, t: tf, mouth: mouthOf(NARR.concat(SCENE_TONI), tf),
      expr: inPapa ? 'panic' : 'worried', raise: inPapa ? 0 : 1 - Ease.inOutQuad(prog(tf, B.retten.start, B.retten.start + 0.9)) * 0.9,
      panic: Ease.outBack(prog(tf, B.papa.start, B.papa.start + 0.2)), antenna: inPapa ? 1 : 0.2, antWob: wob(tf, B.papa.start, 0.4, 7, 3),
      sweat: prog(tf, B.retten.start, B.retten.start + 1.4), blush: 0.6 + 0.4 * prog(tf, B.papa.start, papaW),
      lx: inPapa ? 0 : Math.sign(Math.sin(tf * 5)) * 0.8, ly: 0, tilt: Math.sin(tf * 30) * (inPapa ? 1.5 : 0), noBlink: t > freezeAt });
    w += tn.back + desk(540, 1520, 640, 1.38) + tn.front;
    const crash = tw(tf, papaW - 0.02, papaW + 0.1, 0, 0.42, Ease.outCubic);
    const sh = t < freezeAt ? wob(tf, papaW, 14, 15, 6) : 0;
    const frozen = t >= freezeAt;
    const screen = frozen ? popWord('?!', 820, 520, t, freezeAt, { size: 170, color: '#FF4F6D', rot: 12 }) : '';
    return { world: w, cam: { x: 540 + sh, y: tw(tf, papaW - 0.02, papaW + 0.1, 950, 820, Ease.outCubic), z: 1.05 + crash }, gray: frozen ? 1 : 0, screen };
  } },
  // 8 — Frau Krause, calm… "Nein, Schatz."
  { from: 'guckt', draw(t, tt) {
    const sweet = t >= B.schatz.start - 0.05;
    let w = chalkboardWall(t);
    w += krause({ x: 540, y: 1760, s: 1.36, t, mood: sweet ? 'sweet' : 'calm', mouth: mouthOf(['krause'], t),
      glassesDown: Ease.inOutCubic(prog(t, B.guckt.start + 0.5, B.guckt.start + 1.3)), tilt: sweet ? tw(t, B.schatz.start, B.schatz.start + 0.4, 0, 8, Ease.outBack) : 0,
      prop: 'mug', lx: 0.4, ly: 0.2, blush: sweet ? 0.8 : 0 });
    let hearts = '';
    if (sweet) [[300, 760, 0.0, -14], [800, 700, 0.35, 12], [250, 1000, 0.9, -8]].forEach(([x, y, d, r]) => (hearts += popWord('♥', x, y - (t - B.schatz.start - d) * 40, t, B.schatz.start + d, { size: 110, color: '#FF6F9C', rot: r })));
    const z = tw(tt, 0, B.schatz.start - B.guckt.start, 1.0, 1.22, Ease.inOutQuad) + (sweet ? tw(t, B.schatz.start, B.schatz.start + 0.3, 0, 0.05, Ease.outBack) : 0);
    return { world: w + hearts, cam: { x: 540, y: 960, z }, tint: sweet ? '#FF7BAC' : null, tintA: sweet ? 0.12 : 0 };
  } },
  // 9 — the whole class laughs, Toni's soul leaves
  { from: 'lach', draw(t, tt) {
    const w = classWide(t, 'laugh');
    let screen = '';
    [['HAHA', 230, 380, 0.0, -12], ['HAHAHA', 760, 330, 0.15, 10], ['HAHA', 200, 1500, 0.3, 8], ['LOL', 620, 1560, 0.45, -10]].forEach(([s, x, y, d, r]) => (screen += popWord(s, x, y, t, B.lach.start + d, { size: 96, color: '#FFE03A', rot: r })));
    const sh = Math.sin(t * 40) * 5 * (1 - prog(tt, 0, 1.6));
    return { world: w, cam: { x: 560 + sh, y: 1290, z: 1.04 }, screen };
  } },
  // 10 — hallway: "Schatz" for everyone, even the janitor
  { from: 'seitdem', draw(t, tt) {
    const stopT = B.hausm.start + 0.2;
    const walkT = Math.min(tt, stopT - B.seitdem.start);
    const scroll = walkT * 300;
    let w = hallway(t, scroll);
    // passing classmates (background, they walk the other way)
    const passers = [['lena', 1500, 'Hi Schatz!', 0.9, -1], ['jonas', 2250, 'Na, Schatz?', 1.6, 1]];
    passers.forEach(([name, x0, txt, d, dir]) => {
      const x = x0 - scroll * 1.6 - tt * 120;
      if (x > -300 && x < 1400) {
        w += kid(name, { x, y: 1360, s: 0.6, t, turn: 0.6, lx: -0.8, expr: 'smile', seed: 30 + d * 10 });
        w += bubble(x + 40, 1360 - 0.6 * 560, txt, t, B.seitdem.start + d, { dir, size: 46, dur: 1.1 });
      }
    });
    const walking = tt < stopT - B.seitdem.start;
    const jx = tw(t, B.hausm.start - 0.05, B.hausm.start + 0.35, 1400, 760, Ease.outBack);
    const lookCam = t > B.morgen.end;
    const tn = toni({ x: 340, y: 1440, s: 0.9, t, legs: true, walk: walking ? tt * 1.9 : 0, backpack: true, expr: 'deadpan', antenna: -0.8,
      mouth: 0, lx: lookCam ? 0 : t > B.hausm.start ? 1 : 0.2, tilt: lookCam ? 0 : t > B.hausm.start ? 4 : 0 });
    w += tn.back;
    if (t > B.hausm.start - 0.1) w += janitor({ x: jx, y: 1640, s: 0.9, t, mouth: mouthOf(['janitor'], t), wave: Ease.outBack(prog(t, B.morgen.start - 0.15, B.morgen.start + 0.15)), wink: t > B.morgen.start + 0.5 ? 1 : 0 });
    if (t > B.morgen.start + 0.4) w += popWord('♥', jx + 170, 900 - (t - B.morgen.start - 0.4) * 50, t, B.morgen.start + 0.4, { size: 100, color: '#FF6F9C', rot: 14 });
    const z = 1.0 + (t > B.hausm.start ? tw(t, B.hausm.start, B.hausm.start + 0.4, 0, 0.06, Ease.outCubic) : 0);
    return { world: w, cam: { x: 560, y: 1040, z } };
  } },
  // 11 — deadpan stare into the lens (loops back into the hook)
  { from: 'end', draw(t, tt) {
    let w = hallway(t, 0) + `<rect x="-600" y="-400" width="2280" height="2600" fill="#fff" opacity="0.25"/>`;
    const tn = toni({ x: 540, y: 1600, s: 1.38, t, expr: 'deadpan', antenna: -0.8, backpack: true, legs: true, lx: 0, ly: 0 });
    w += tn.back + tn.front;
    const z = tw(tt, 0, 1.6, 1.05, 1.2, Ease.inOutQuad);
    return { world: w, cam: { x: 540, y: 980, z } };
  } },
];

function episodeOverlays(t) {
  let s = '';
  const hookLines = TL.hook.split('\n');
  s += card(hookLines, 540, 230, t, -0.3, B.krause.start - 0.02, 64); // fully visible on frame 0 (cover)
  s += card([TL.outro], 540, 1400, t, B.end.start + 0.25, 99, 84);
  return s;
}
