// Episode 3 — Obst-Gymnasium Teil 1: "Das Direktorkind". Shot list + choreography.
const M = v => t => mouthOf([v], t);
const mKiwi = M('kiwi'), mErd = M('erdbeere'), mZit = M('zitrone');
const mAna = t => mouthOf(['ananas', 'ananas_wut'], t), mBan = M('banane');

// --- hook composition: bag close-up, then tilt up to Erdbeere's grin
function hookScene(ht) {
  const grinT = 1.85;
  let w = `<g filter="url(#mute)">${hallway(0, 0)}<rect x="-600" y="2190" width="2280" height="1200" fill="#CDB892"/></g><rect x="-600" y="-400" width="2280" height="3800" fill="#120E18" opacity="0.3"/>`;
  w += erdbeere({ x: 540, y: 1850, s: 2.6, t: ht, e: ht >= grinT ? 'evil' : 'sweet', pose: 'down', noBlink: true, legs: false, ly: ht < 1.2 ? 0.8 : 0 });
  w += bigBag(540, 1720, 1.0, ht, { drop: prog(ht, 0.0, 0.42), zip: prog(ht, 0.5, 0.95), handOut: prog(ht, 0.42, 0.62) });
  const tilt = Ease.inOutCubic(prog(ht, 0.95, 1.75));
  const punch = tw(ht, grinT, grinT + 0.1, 0, 0.12, Ease.outCubic) - tw(ht, grinT + 0.1, 3.0, 0, 0.06);
  return { world: w, cam: { x: 540, y: lerp(1640, 1230, tilt), z: lerp(1.5, 1.18, tilt) + punch } };
}

// --- classroom with fruit students
function classScene(t, { turn = 0, banPoint = 0, kiwiE = 'calm', erdE = 'sweet' } = {}) {
  let w = classroomMuted(t);
  const back = [['apfel', 230], ['birne', 540], ['orange', 850]];
  back.forEach(([k, x], i) => {
    const tt = Ease.outBack(prog(t, B.turn.start + i * 0.05, B.turn.start + 0.2 + i * 0.05)) * turn;
    w += extraFruit(k, { x, y: 1130, s: 0.55, t, seed: 40 + i, e: turn ? 'shock' : 'neutral', lx: tt, ly: tt * 0.5 });
    w += desk(x, 1130, 380, 0.55, false);
  });
  w += banane({ x: 200, y: 1560, s: 0.78, t, e: 'dumb', pose: banPoint ? 'pointR' : 'down', mouth: mBan(t), lx: banPoint ? 1 : 0, legs: false });
  w += desk(200, 1560, 380, 0.8, false);
  w += erdbeere({ x: 560, y: 1580, s: 0.72, t, e: erdE, pose: 'down', mouth: mErd(t), lx: turn ? 0.8 : 0, legs: false });
  w += desk(560, 1580, 400, 0.8, false);
  w += kiwi({ x: 900, y: 1590, s: 0.72, t, e: kiwiE, pose: 'down', mouth: mKiwi(t), lx: turn ? -0.3 : 0, legs: false });
  w += desk(900, 1590, 400, 0.8, true);
  return w;
}

// --- director's office
function officeScene(t, { zitE = 'stern', zitLx = 0, erdE = 'sweet', erdLx = 0, reach = 0, bagShake = 0, anaE = 'smug', anaPose = 'crossed', kiwiE = 'calm', kiwiLx = 0.3, anaLeaf = 0, anaWatch = false } = {}) {
  let w = officeSet(t);
  w += ananas({ x: 120, y: 1300, s: 0.78, t, e: anaE, pose: anaPose, mouth: mAna(t), lx: 0.6, leafUp: anaLeaf, watchGlow: anaWatch, seed: 7 });
  w += zitrone({ x: 520, y: 1330, s: 1.05, t, e: zitE, pose: 'desk', mouth: mZit(t), lx: zitLx, seed: 19 });
  const bagX = 980, bagY = 1222;
  w += erdbeere({ x: 810, y: 1300, s: 0.85, t, e: erdE, pose: reach ? 'reachR' : 'down', target: [lerp(190, (bagX - 810) / 0.85, reach), lerp(-40, (bagY - 1300) / 0.85 - 30, reach)], mouth: mErd(t), lx: erdLx, seed: 11 });
  w += bigDesk(540, 1250, 0.9, { photo: 1, photoX: -240 });
  const sh = bagShake ? Math.sin(t * 70) * 6 * bagShake : 0;
  w += `<g transform="translate(${f1(bagX + sh)} ${bagY}) rotate(${f1(sh * 0.6)})"><path d="M -40 -50 Q 0 -96 40 -50" fill="none" stroke="#E07AA0" stroke-width="8"/><rect x="-70" y="-56" width="140" height="100" rx="24" fill="#F49AC1" stroke="${YOL}" stroke-width="5"/><path d="M -58 -30 L 58 -30" stroke="#D9B23C" stroke-width="5"/><circle cx="0" cy="4" r="10" fill="#D9B23C" stroke="${YOL}" stroke-width="3"/></g>`;
  w += kiwi({ x: 220, y: 1790, s: 1.18, t, e: kiwiE, pose: 'down', mouth: mKiwi(t), lx: kiwiLx, ly: -0.3, seed: 3 });
  return w;
}
const CU = { zit: { x: 520, y: 1070, z: 2.0 }, erd: { x: 810, y: 1090, z: 2.3 }, kiwi: { x: 230, y: 1520, z: 1.9 }, ana: { x: 140, y: 1110, z: 2.1 }, photo: { x: 324, y: 1135, z: 3.2 }, wide: { x: 540, y: 1300, z: 1.0 } };
const camLerp = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), z: lerp(a.z, b.z, k) });

const SHOTS = [
  // 1 HOOK — the theft, first frame
  { from: 'hook', draw(t, tt) { const r = hookScene(tt); r.noPunch = true; return r; } },
  // 2 REWIND — the hook plays backwards under VHS noise
  { from: 'rewind', draw(t, tt) {
    const r = hookScene(Math.max(0, B.rewind.start - tt * 2.8));
    r.screen = vhs(t, '⏪ 2 Minuten vorher');
    r.noPunch = true;
    return r;
  } },
  // 3 FIND — Kiwi spots a gold phone; lockscreen POV while he reads it
  { from: 'find', draw(t, tt) {
    const picked = t > B.find.start + 0.9;
    const pov = t > B.find.start + 1.0 && t < B.flur1.start + 1.7;
    let w = `<g filter="url(#mute)">${hallway(t, Math.min(tt, 0.7) * 260)}</g>`;
    if (!picked) w += goldPhone(560, 1430, 80, 1.1) + `<ellipse cx="560" cy="1440" rx="70" ry="22" fill="#FFE27A" opacity="${f1((0.3 + 0.2 * Math.sin(t * 9)) * 100) / 100}"/>`;
    w += kiwi({ x: 420, y: 1250, s: 1.0, t, e: picked ? 'calm' : 'neutral', pose: picked ? 'phone' : 'down', walk: tt < 0.7 ? tt * 1.8 : 0, mouth: mKiwi(t), lx: picked ? 0.2 : 0.4, ly: picked ? 0.6 : 1, seed: 3 });
    let screen = '';
    if (pov) screen = `<rect width="1080" height="1920" fill="#0B0B10" opacity="0.55"/>` + lockscreen(t, 540, 880, 1.25 + 0.03 * prog(t, B.find.start + 1, B.flur1.start + 1.7));
    return { world: w, cam: pov ? { x: 540, y: 960, z: 1 } : { x: 470, y: 1080, z: lerp(1.15, 1.3, prog(tt, 0, 1.2)) }, screen, capY: pov ? 1560 : 1265 };
  } },
  // 4 HANDOVER — Erdbeere slides in
  { from: 'flur2', draw(t, tt) {
    const inT = Ease.outCubic(prog(t, B.flur2.start - 0.45, B.flur2.start + 0.1));
    const handed = t > B.flur4.start + 0.15;
    const leave = prog(t, B.flur4.end + 0.15, B.flur4.end + 1.0);
    let w = `<g filter="url(#mute)">${hallway(t, 182)}</g>`;
    w += kiwi({ x: 330 - leave * 500, y: 1250, s: 1.0, t, e: 'calm', pose: !handed && t > B.flur3.start ? 'give' : 'down', holdPhone: !handed, flip: true, walk: leave > 0 ? t * 1.8 : 0, mouth: mKiwi(t), lx: -0.6, seed: 3 });
    w += erdbeere({ x: lerp(1300, 770, inT), y: 1260, s: 0.98, t, e: 'sweet', pose: handed ? 'take' : 'bag', holdPhone: handed, flip: true, mouth: mErd(t), lx: 0.5, seed: 11 });
    return { world: w, cam: { x: 560, y: 1020, z: 1.18 }, noPunch: false };
  } },
  // 5 LAUTLOS — she mutes it; bag; the grin (mirrors the hook)
  { from: 'lautlos', draw(t, tt) {
    if (tt < 1.5) {
      const w = `<g filter="url(#mute)">${hallway(t, 182)}</g><rect x="-600" y="-400" width="2280" height="2600" fill="#000" opacity="0.5"/>`;
      const buzz = t > B.lautlos.start + 0.9 && t < B.lautlos.start + 1.25 ? Math.sin(t * 90) * 6 : 0;
      let screen = lockscreen(t, 540 + buzz, 900, 1.35, { silent: prog(t, B.lautlos.start + 0.9, B.lautlos.start + 1.15) * 1.0 - (t < B.lautlos.start + 0.9 ? 1 : 0) });
      screen += `<g transform="translate(${f1(870 + buzz)} 1240)"><path d="M 0 0 L 160 260" stroke="${LIMB}" stroke-width="90" stroke-linecap="round"/><circle r="70" fill="${LIMB}"/><circle cx="-50" cy="-40" r="18" fill="#D81B3C"/><circle cx="-62" cy="0" r="18" fill="#D81B3C"/></g>`;
      screen += `<rect x="${f1(803 + buzz)}" y="${f1(380 + (tt > 0.75 ? 6 : 0))}" width="14" height="110" rx="6" fill="#B8902E" stroke="${YOL}" stroke-width="3"/>`;
      return { world: w, cam: { x: 540, y: 960, z: 1 }, screen, noPunch: false };
    }
    if (tt < 1.95) { const r = hookScene(0.5 + (tt - 1.5) * 1.0); return r; }
    const r = hookScene(1.85 + (tt - 1.95));
    r.cam = { x: 540, y: 1190, z: 1.5 + tw(tt, 1.95, 2.05, 0.1, 0, Ease.outCubic) };
    return r;
  } },
  // 6 ANANAS bursts in
  { from: 'klasse1', draw(t, tt) {
    const open = Ease.outBack(prog(t, B.klasse1.start - 0.4, B.klasse1.start - 0.2));
    let w = classDoor(t, open);
    w += ananas({ x: 540, y: 1150, s: 1.05, t, e: 'angry', pose: 'hips', mouth: mAna(t), leafUp: 1, seed: 7 });
    w += doorPanel(open);
    const sh = wob(t, B.klasse1.start - 0.2, 16, 14, 6);
    return { world: w, cam: { x: 540 + sh, y: 900, z: tw(tt, 0, 3, 1.12, 1.25, Ease.inOutQuad) }, noPunch: true };
  } },
  // 7 WATCH — he calls; nobody hears anything
  { from: 'watch', draw(t, tt) {
    const w = `<rect x="-600" y="-400" width="2280" height="2600" fill="#1B1C21"/>` + `<g transform="translate(540 960) scale(1.4)"><path d="M -600 -180 L 600 -120 L 600 220 L -600 260 Z" fill="#26272E" stroke="${YOL}" stroke-width="6"/></g>`;
    const screen = watchUI(t, 540, 900, 1.25, 'call') + `<text x="540" y="1560" text-anchor="middle" font-family="Inter" font-weight="900" font-size="54" fill="#9AA1B2">*stille*</text>`;
    return { world: w, cam: { x: 540, y: 960, z: 1 + tt * 0.02 }, screen };
  } },
  // 8 BANANE snitches — everyone turns
  { from: 'klasse2', draw(t, tt) {
    const turning = t >= B.turn.start;
    const w = classScene(t, { turn: turning ? 1 : 0, banPoint: t > B.klasse2.start + 0.5 });
    const z = turning ? tw(t, B.turn.start, B.turn.start + 1.0, 1.05, 1.25, Ease.inOutQuad) : 1.05;
    return { world: w, cam: { x: turning ? lerp(540, 760, prog(t, B.turn.start, B.turn.start + 1)) : 540, y: 1200, z }, capY: 1600 };
  } },
  // 9 KIWI: "Hab ich Erdbeere gegeben."
  { from: 'klasse3', draw(t, tt) {
    return { world: classScene(t, { turn: 1, kiwiE: 'calm' }), cam: { x: 900, y: 1430, z: 2.3 } };
  } },
  // 10 ERDBEERE: "Was für ein Handy?"
  { from: 'klasse4', draw(t, tt) {
    return { world: classScene(t, { turn: 1, erdE: 'innocent' }), cam: { x: 560, y: 1420, z: tw(tt, 0, 2, 2.3, 2.5, Ease.inOutQuad) } };
  } },
  // 11 OFFICE establishing
  { from: 'buero0', draw(t, tt) {
    return { world: officeScene(t, {}), cam: camLerp(CU.wide, { x: 540, y: 1200, z: 1.15 }, Ease.inOutQuad(prog(tt, 0, 1.6))) };
  } },
  // 12 ZITRONE: "Meine Tochter lügt nicht." → photo insert
  { from: 'buero1', draw(t, tt) {
    const photo = t > B.buero1.end + 0.15;
    const cam = photo ? camLerp(CU.photo, { ...CU.photo, z: 3.5 }, prog(t, B.buero1.end + 0.15, B.buero2.start + 0.3)) : CU.zit;
    return { world: officeScene(t, { zitE: 'stern', erdE: 'sweet' }), cam, noPunch: false };
  } },
  // 13 KIWI: "…Ihre Tochter." (dramatic zoom)
  { from: 'buero2', draw(t, tt) {
    const z = CU.kiwi.z + tw(t, B.buero2.start + 0.6, B.buero2.start + 0.75, 0, 0.5, Ease.outCubic);
    return { world: officeScene(t, { kiwiE: 'calm', kiwiLx: 0.6 }), cam: { ...CU.kiwi, y: CU.kiwi.y - 20, z } };
  } },
  // 14 KIWI → ANANAS: "Ton abspielen" / "Das geht?"
  { from: 'buero3', draw(t, tt) {
    const anaTalk = t >= B.buero4.start - 0.1;
    const w = officeScene(t, { kiwiE: 'calm', kiwiLx: -0.8, anaE: anaTalk ? 'shock' : 'smug', anaLeaf: anaTalk ? 1 : 0 });
    return { world: w, cam: anaTalk ? CU.ana : { x: 230, y: 1340, z: 1.22 } };
  } },
  // 15 BEEP — watch, bag beeps, her hand dives in, frozen faces
  { from: 'beep', draw(t, tt) {
    if (tt < 0.9) {
      const w = `<rect x="-600" y="-400" width="2280" height="2600" fill="#1B1C21"/>`;
      return { world: w, cam: { x: 540, y: 960, z: 1 }, screen: watchUI(t, 540, 900, 1.25, tt > 0.3 ? 'sound' : 'idle') };
    }
    const beepOn = tt > 1.0 && tt < 1.56;
    const reach = Ease.outCubic(prog(tt, 1.2, 1.4));
    const w = officeScene(t, { erdE: tt > 1.2 ? 'nervous' : 'sweet', reach, bagShake: beepOn ? 1 : 0, zitE: 'stern', zitLx: tt > 1.7 ? 1 : 0, anaE: 'shock', kiwiE: 'calm', kiwiLx: 0.8 });
    const cam = tt < 1.65 ? { x: 860, y: 1170, z: 1.9 } : camLerp({ ...CU.zit, z: 2.4 }, { ...CU.zit, z: 2.7 }, prog(tt, 1.65, 2.6));
    return { world: w, cam, screen: beepOn ? popWord('piep', 1000, 760, t, B.beep.start + 1.0, { size: 70, color: '#fff', rot: -8, dur: 0.56 }) : '' };
  } },
  // 16 ERDBEERE: "Mein Wecker."
  { from: 'buero5', draw(t, tt) {
    return { world: officeScene(t, { erdE: 'sweet', reach: 1, zitE: 'stern', zitLx: 1 }), cam: { ...CU.erd, z: tw(tt, 0, 1.2, 2.3, 2.45) } };
  } },
  // 17 LOOK — Zitrone looks at his daughter… then at Kiwi
  { from: 'look', draw(t, tt) {
    const toKiwi = tt > 1.3;
    const w = officeScene(t, { zitE: 'stern', zitLx: toKiwi ? -1 : 1, erdE: 'sweet', reach: 1 });
    return { world: w, cam: { ...CU.zit, z: tw(tt, 0, 2.2, 2.2, 2.6, Ease.inOutQuad) } };
  } },
  // 18 ZITRONE: "Kiwi. Leer deine Taschen aus."
  { from: 'buero6', draw(t, tt) {
    const w = officeScene(t, { zitE: 'stern', zitLx: -1, erdE: 'evil', reach: 1 });
    return { world: w, cam: { ...CU.zit, z: tw(tt, 0, 2, 2.6, 2.9, Ease.inOutQuad) } };
  } },
  // 19 END — Kiwi's face, black, "Teil 2"
  { from: 'end', draw(t, tt) {
    if (tt > 0.8) return { world: `<rect x="-600" y="-400" width="2280" height="2600" fill="#000"/>`, cam: { x: 540, y: 960, z: 1 }, noPunch: true };
    const w = officeScene(t, { kiwiE: tt > 0.25 ? 'shock' : 'calm', kiwiLx: 0.5 });
    return { world: w, cam: { ...CU.kiwi, z: tw(tt, 0, 0.8, 2.1, 2.6, Ease.inCubic) } };
  } },
];

function episodeOverlays(t) {
  let s = card(TL.hook.split('\n'), 540, 200, t, -0.3, B.rewind.start - 0.02, 54);
  if (t > B.end.start + 0.8) s += card(['Teil 2 👀'], 540, 860, t, B.end.start + 0.85, 999, 96);
  return s;
}
