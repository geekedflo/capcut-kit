"""Voice (TTS), SFX and music for one episode -> build/<ep>/audio.wav + timeline.json.

Usage: python build_audio.py episodes/ep01-mama.json
Voice models: set VOICES_DIR (default ./voices) to a folder holding the
sherpa-onnx piper models (vits-piper-de_DE-*).
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
import sherpa_onnx

SR = 44100
FPS = 30
VOICES_DIR = os.environ.get("VOICES_DIR", os.path.join(os.path.dirname(__file__), "voices"))

# model, speaker id, speed, pitch factor (rubberband, formants shift with it -> younger/older)
VOICES = {
    "toni":         ("thorsten-high", 0, 1.10, 1.13),
    "toni_scene":   ("thorsten-high", 0, 1.05, 1.15),
    "toni_whisper": ("thorsten_emotional-medium", 7, 0.95, 1.13),
    "toni_panic":   ("thorsten_emotional-medium", 6, 1.22, 1.17),
    "krause":       ("kerstin-low", 0, 0.92, 1.02),
    "janitor":      ("thorsten-high", 0, 0.95, 0.84),
    # youth style (ep02+): natural pitch, faster delivery
    "toni2":        ("thorsten-high", 0, 1.16, 1.03),
    "jonas":        ("thorsten_emotional-medium", 5, 0.85, 1.12),
}

_tts = {}


def tts_model(name):
    if name not in _tts:
        d = os.path.join(VOICES_DIR, f"vits-piper-de_DE-{name}")
        cfg = sherpa_onnx.OfflineTtsConfig(
            model=sherpa_onnx.OfflineTtsModelConfig(
                vits=sherpa_onnx.OfflineTtsVitsModelConfig(
                    model=os.path.join(d, f"de_DE-{name}.onnx"),
                    tokens=os.path.join(d, "tokens.txt"),
                    data_dir=os.path.join(d, "espeak-ng-data"),
                ),
                num_threads=4,
            )
        )
        _tts[name] = sherpa_onnx.OfflineTts(cfg)
    return _tts[name]


def synth(voice, text):
    model, sid, speed, pitch = VOICES[voice]
    a = tts_model(model).generate(text, sid=sid, speed=speed)
    with tempfile.TemporaryDirectory() as td:
        raw, out = os.path.join(td, "raw.wav"), os.path.join(td, "out.wav")
        sf.write(raw, np.asarray(a.samples, dtype=np.float32), a.sample_rate)
        af = f"aresample={SR},rubberband=pitch={pitch}:pitchq=quality,highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=80"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", af, "-ac", "1", out], check=True)
        y, _ = sf.read(out, dtype="float32")
    return trim(y)


def trim(y, thr=0.012, pad=0.03):
    idx = np.where(np.abs(y) > thr)[0]
    if len(idx) == 0:
        return y
    a = max(0, idx[0] - int(pad * SR))
    b = min(len(y), idx[-1] + int(pad * SR))
    return y[a:b]


def frame_rms(y, fps=FPS):
    hop = SR // fps
    n = int(np.ceil(len(y) / hop))
    return np.array([np.sqrt(np.mean(y[i * hop:(i + 1) * hop] ** 2) + 1e-12) for i in range(n)])


def mouth_curve(y):
    r = frame_rms(y)
    ref = np.percentile(r, 90) + 1e-9
    m = np.clip(r / ref, 0, 1.2)
    m = np.where(m < 0.18, 0, m)
    # light smoothing so the mouth doesn't jitter, but keep it snappy
    sm = np.convolve(m, [0.25, 0.5, 0.25], mode="same")
    return [round(float(v), 3) for v in np.clip(sm, 0, 1)]


def word_times(text, y):
    """Caption word timings. Splits at punctuation and pins those splits to the
    longest silent gaps in the audio, then spreads words by length inside each part."""
    words = text.split()
    dur = len(y) / SR
    groups, cur = [], []
    for w in words:
        cur.append(w)
        if re.search(r"[,.!?:…]\**$", w):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    # silent gaps (>= 90ms) inside the line
    hop = SR // 100
    r = np.array([np.sqrt(np.mean(y[i:i + hop] ** 2)) for i in range(0, len(y), hop)])
    quiet = r < 0.02
    gaps, start = [], None
    for i, q in enumerate(quiet):
        if q and start is None:
            start = i
        if not q and start is not None:
            if i - start >= 9 and start > 5:
                gaps.append((start / 100, i / 100))
            start = None
    gaps = sorted(sorted(gaps, key=lambda g: g[0] - g[1])[: len(groups) - 1])
    regions, t = [], 0.0
    if len(gaps) == len(groups) - 1:
        for g in gaps:
            regions.append((t, g[0]))
            t = g[1]
        regions.append((t, dur))
    else:  # fallback: one proportional span
        total = sum(len(w) + 2 for w in words)
        for g in groups:
            span = dur * sum(len(w) + 2 for w in g) / total
            regions.append((t, t + span))
            t += span
    out = []
    for g, (a, b) in zip(groups, regions):
        tot = sum(len(w.strip("*")) + 1.5 for w in g)
        t = a
        for w in g:
            d = (b - a) * (len(w.strip("*")) + 1.5) / tot
            out.append({"w": w.replace("*", ""), "hi": "*" in w, "s": round(t, 3), "e": round(t + d, 3)})
            t += d
    return out


# ---------------------------------------------------------------- SFX
rng = np.random.default_rng(7)


def env_exp(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def onepole_lp(x, cut):
    """cutoff can be an array (sweeps)."""
    cut = np.broadcast_to(cut, x.shape)
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.zeros_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def sine_sweep(f0, f1, dur, curve="exp"):
    n = int(dur * SR)
    f = np.geomspace(f0, f1, n) if curve == "exp" else np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def sfx_whoosh(dur=0.42):
    n = int(dur * SR)
    x = rng.standard_normal(n)
    t = np.linspace(0, 1, n)
    y = onepole_lp(x, 300 + 4200 * np.sin(np.pi * t) ** 2)
    y -= onepole_lp(y, 180)
    return 0.9 * y * np.sin(np.pi * t) ** 2 / (np.abs(y).max() + 1e-9)


def sfx_pop():
    y = sine_sweep(320, 1100, 0.07) * env_exp(int(0.07 * SR), 0.018)
    return 0.6 * y


def sfx_boing(dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 140 + 260 * t / dur + 70 * np.sin(2 * np.pi * 16 * t) * np.exp(-3 * t)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-3.2 * t)
    return 0.55 * y


def sfx_thunder():
    crack_n = int(0.12 * SR)
    crack = rng.standard_normal(crack_n) * env_exp(crack_n, 0.03)
    n = int(2.6 * SR)
    t = np.arange(n) / SR
    brown = np.cumsum(rng.standard_normal(n))
    brown -= onepole_lp(brown, 8)
    rumble = onepole_lp(brown, 220)
    rumble /= np.abs(rumble).max() + 1e-9
    mod = 0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 1.7 * t + 1)) * np.abs(np.sin(2 * np.pi * 0.6 * t))
    rumble *= mod * np.minimum(t / 0.05, 1) * np.exp(-1.3 * t)
    y = rumble.copy()
    y[:crack_n] += 0.5 * crack
    return 0.9 * y / (np.abs(y).max() + 1e-9)


def brass(freq, dur, vib=5.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = freq * (1 + 0.006 * np.sin(2 * np.pi * vib * t) * np.minimum(t / 0.3, 1))
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = sum(np.sin(k * ph) / k ** 1.3 for k in range(1, 14))
    att = np.minimum(t / 0.03, 1)
    rel = np.minimum((dur - t) / 0.08, 1)
    return y * att * rel


def sfx_dundun():
    notes = [(130.8, 0.0, 0.22), (130.8, 0.28, 0.22), (92.5, 0.56, 1.3)]
    total = np.zeros(int(2.0 * SR))
    for f, at, d in notes:
        s = brass(f, d) + 0.6 * brass(f / 2, d)
        i = int(at * SR)
        total[i:i + len(s)] += s
    # timpani on the long note
    n = int(1.2 * SR)
    t = np.arange(n) / SR
    timp = np.sin(2 * np.pi * np.cumsum(70 * np.exp(-t * 0.8)) / SR) * np.exp(-2.5 * t)
    i = int(0.56 * SR)
    total[i:i + n] += 2.2 * timp
    return 0.85 * total / np.abs(total).max()


def sfx_scratch():
    src_n = int(0.5 * SR)
    src = onepole_lp(rng.standard_normal(src_n), 2500) + 0.4 * np.sin(2 * np.pi * 330 * np.arange(src_n) / SR)
    dur = 0.38
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    rate = 2.6 * np.sin(2 * np.pi * (1.6 * t + 0.1))  # forward / back like a hand on the record
    pos = np.clip(0.2 * SR + np.cumsum(rate), 0, src_n - 2)
    y = np.interp(pos, np.arange(src_n), src) * (0.3 + 0.7 * np.abs(rate) / 2.6)
    y *= np.minimum(t / 0.02, 1) * np.minimum((1 - t) / 0.05, 1)
    return 0.8 * y / np.abs(y).max()


def sfx_cricket(dur=1.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for start in np.arange(0.0, dur - 0.2, 0.42):
        for k in range(3):
            a = int((start + k * 0.035) * SR)
            m = int(0.02 * SR)
            seg = np.sin(2 * np.pi * 4700 * t[:m]) * np.sin(np.pi * np.arange(m) / m)
            y[a:a + m] += seg
    return 0.18 * y


def sfx_tick():
    n = int(0.05 * SR)
    t = np.arange(n) / SR
    y = 0.5 * np.sin(2 * np.pi * 2600 * t) * np.exp(-t / 0.006) + 0.3 * rng.standard_normal(n) * np.exp(-t / 0.002)
    return 0.55 * y


def sfx_ding():
    n = int(1.4 * SR)
    t = np.arange(n) / SR
    y = sum(a * np.sin(2 * np.pi * 1046 * r * t) * np.exp(-t / d) for r, a, d in [(1, 1, 0.6), (2.76, 0.4, 0.25), (5.4, 0.2, 0.12), (8.93, 0.1, 0.06)])
    return 0.35 * y


def drum(f0, f1, dur, tau):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.04)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / tau)


def sfx_rimshot():
    total = np.zeros(int(2.0 * SR))
    snare_n = int(0.15 * SR)
    snare = onepole_lp(rng.standard_normal(snare_n), 5000) * env_exp(snare_n, 0.04)
    tom1, tom2 = 0.8 * drum(260, 180, 0.2, 0.06), 0.8 * drum(200, 120, 0.25, 0.08)
    tom1[:snare_n] += 0.3 * snare
    tom2[:snare_n] += 0.3 * snare
    parts = [(0.0, tom1), (0.17, tom2)]
    cym_n = int(1.2 * SR)
    cym = rng.standard_normal(cym_n)
    cym -= onepole_lp(cym, 6000)
    kick = drum(110, 50, 0.4, 0.12)
    crash = 0.6 * cym * env_exp(cym_n, 0.35)
    crash[: len(kick)] += kick
    parts.append((0.42, crash))
    for at, s in parts:
        i = int(at * SR)
        total[i:i + len(s)] += s
    return 0.8 * total / np.abs(total).max()


def sfx_boom():
    """meme bass boom: low sine drop, saturated, long tail"""
    n = int(1.6 * SR)
    t = np.arange(n) / SR
    f = 42 + 70 * np.exp(-t / 0.05)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.45)
    y = np.tanh(3.5 * y) / np.tanh(3.5)
    click = rng.standard_normal(int(0.01 * SR)) * 0.4
    y[: len(click)] += click
    return 0.95 * y


def sfx_msg():
    """message notification: two quick soft tones"""
    out = np.zeros(int(0.3 * SR))
    for at, f in [(0.0, 1320), (0.09, 1760)]:
        n = int(0.14 * SR)
        t = np.arange(n) / SR
        tone = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t / 0.04)
        i = int(at * SR)
        out[i:i + n] += tone
    return 0.35 * out


def sfx_stamp():
    """grade stamp: thud + paper slap"""
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * np.cumsum(90 + 120 * np.exp(-t / 0.02)) / SR) * np.exp(-t / 0.07)
    slap = rng.standard_normal(n) * np.exp(-t / 0.015)
    slap -= onepole_lp(slap, 900)
    return 0.8 * (thud + 0.5 * slap) / 1.3


SFX = {
    "whoosh": (sfx_whoosh, 0.45), "pop": (sfx_pop, 0.55), "boing": (sfx_boing, 0.45),
    "thunder": (sfx_thunder, 0.6), "dundun": (sfx_dundun, 0.45), "scratch": (sfx_scratch, 0.55),
    "cricket": (sfx_cricket, 0.6), "tick": (sfx_tick, 0.5), "ding": (sfx_ding, 0.45),
    "rimshot": (sfx_rimshot, 0.6), "boom": (sfx_boom, 0.7), "msg": (sfx_msg, 0.5), "stamp": (sfx_stamp, 0.6),
}


# ---------------------------------------------------------------- music
def pluck(freq, dur, bright=4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    y = np.sin(2 * np.pi * freq * t) + 0.25 * np.sin(2 * np.pi * bright * freq * t) * np.exp(-t / 0.03)
    return y * np.exp(-t / (dur / 3)) * np.minimum(t / 0.003, 1)


def music(dur, bpm=112):
    beat = 60 / bpm
    y = np.zeros(int((dur + 2) * SR))
    midi = lambda m: 440 * 2 ** ((m - 69) / 12)
    prog = [(48, [60, 64, 67]), (45, [60, 64, 69]), (41, [60, 65, 69]), (43, [59, 62, 67])]  # C Am F G
    bass_pat = [0, 7, 9, 7]
    bar = 0
    t = 0.0
    while t < dur:
        root, chord = prog[bar % 4]
        for b in range(4):
            tb = t + b * beat
            s = pluck(midi(root - 12 + bass_pat[b]), beat * 0.9, bright=2)
            i = int(tb * SR)
            y[i:i + len(s)] += 0.55 * s
            # marimba stab on the off-beat
            for k, m in enumerate(chord):
                s = pluck(midi(m), 0.22)
                i = int((tb + beat / 2 + k * 0.008) * SR)
                y[i:i + len(s)] += 0.16 * s
            # shaker
            for h in range(2):
                n = int(0.04 * SR)
                sh = rng.standard_normal(n)
                sh -= onepole_lp(sh, 7000)
                sh *= env_exp(n, 0.012)
                i = int((tb + h * beat / 2) * SR)
                y[i:i + n] += (0.05 if h else 0.03) * sh
        # little melody every other bar
        if bar % 2 == 1:
            mel = [chord[2] + 12, chord[1] + 12, chord[2] + 12, chord[0] + 12 + 2]
            for k, m in enumerate(mel):
                s = pluck(midi(m), 0.3, bright=3)
                i = int((t + k * beat * 0.5 + beat * 2) * SR)
                y[i:i + len(s)] += 0.1 * s
        t += 4 * beat
        bar += 1
    return y / np.abs(y).max()


def cowbell(freq, dur=0.16):
    n = int(dur * SR)
    t = np.arange(n) / SR
    sq = lambda f: np.sign(np.sin(2 * np.pi * f * t))
    y = sq(freq) + sq(freq * 1.48)
    y = onepole_lp(y, 2800)
    y -= onepole_lp(y, 500)
    return y * np.exp(-t / 0.05)


def music_trap(dur, bpm=140):
    """half-time trap/phonk loop in F minor: 808s, claps, hats with rolls, cowbell riff"""
    step = 60 / bpm / 4
    y = np.zeros(int((dur + 3) * SR))
    midi = lambda m: 440 * 2 ** ((m - 69) / 12)
    add = lambda at, sig, g: y.__setitem__(slice(int(at * SR), int(at * SR) + len(sig)), y[int(at * SR):int(at * SR) + len(sig)] + g * sig)
    bass = [[(0, 29, 6), (7, 29, 3), (10, 32, 6)], [(0, 25, 6), (8, 24, 4), (12, 27, 4)]]
    bell = [65, 68, 72, 70, 68, 65, 63, 65]
    bar, t0 = 0, 0.0
    while t0 < dur:
        for st, note, ln in bass[bar % 2]:
            n = int(ln * step * SR)
            tt = np.arange(n) / SR
            f = midi(note) * (1 + np.exp(-tt / 0.03))
            sig = np.tanh(2.5 * np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-tt / (ln * step * 0.9))
            add(t0 + st * step, sig, 0.55)
            kn = int(0.16 * SR)
            kt = np.arange(kn) / SR
            add(t0 + st * step, np.sin(2 * np.pi * np.cumsum(50 + 110 * np.exp(-kt / 0.02)) / SR) * np.exp(-kt / 0.06), 0.5)
        cn = int(0.22 * SR)
        clap = rng.standard_normal(cn)
        clap = onepole_lp(clap, 4000)
        clap -= onepole_lp(clap, 900)
        clap *= np.exp(-np.arange(cn) / (0.06 * SR))
        add(t0 + 8 * step, clap, 0.9)
        hats = list(range(0, 16, 2)) + ([13, 13.5, 14, 14.5, 15, 15.5] if bar % 2 else [])
        for h in hats:
            hn = int(0.03 * SR)
            hat = rng.standard_normal(hn)
            hat -= onepole_lp(hat, 7000)
            add(t0 + h * step, hat * np.exp(-np.arange(hn) / (0.012 * SR)), 0.22)
        for i, st in enumerate([0, 3, 6, 8, 10, 12, 14]):
            add(t0 + st * step, cowbell(midi(bell[(i + bar * 3) % len(bell)])), 0.16)
        t0 += 16 * step
        bar += 1
    return y / np.abs(y).max()


# ---------------------------------------------------------------- build
def main(ep_path):
    ep = json.load(open(ep_path))
    name = os.path.splitext(os.path.basename(ep_path))[0]
    outdir = os.path.join(os.path.dirname(os.path.abspath(ep_path)), "..", "build", name)
    os.makedirs(outdir, exist_ok=True)

    t = 0.05
    beats, voice_clips = [], []
    for b in ep["beats"]:
        if "hold" in b:
            dur, entry = b["hold"], {"id": b["id"], "start": t, "end": t + b["hold"]}
        else:
            text_for_tts = b.get("say", b["text"].replace("*", ""))
            y = synth(b["voice"], text_for_tts)
            dur = len(y) / SR
            entry = {"id": b["id"], "voice": b["voice"], "text": b["text"].replace("*", ""), "start": t, "end": t + dur,
                     "words": word_times(b["text"], y), "mouth": mouth_curve(y)}
            voice_clips.append((t, y))
            print(f"{b['id']:8s} {t:6.2f}s  {dur:4.2f}s  {entry['text']}")
        entry["sfx"] = b.get("sfx", [])
        beats.append(entry)
        t += dur + b.get("gap", 0)
    total = t
    n = int((total + 0.1) * SR)
    voice = np.zeros(n)
    for at, y in voice_clips:
        i = int(at * SR)
        voice[i:i + len(y)] += y[: n - i]
    fx = np.zeros(n)
    byid = {b["id"]: b for b in beats}
    for b in beats:
        for name_, anchor, off in b["sfx"]:
            fn, gain = SFX[name_]
            s = fn()
            at = (b["start"] if anchor == "start" else b["end"]) + off
            i = max(0, int(at * SR))
            seg = s[: n - i]
            fx[i:i + len(seg)] += gain * seg
    mus = np.zeros(n)
    m = music_trap(total) if ep.get("music_style") == "trap" else music(total)
    for a, z in ep.get("music", []):
        t0, t1 = byid[a]["start"], byid[z]["end"] if z != "end" else total
        i0, i1 = int(t0 * SR), int(t1 * SR)
        seg = m[i0:i1].copy()
        fade = int(0.03 * SR)
        seg[-fade:] *= np.linspace(1, 0, fade)
        mus[i0:i0 + len(seg)] += seg
    # duck music under voice
    env = np.convolve(np.abs(voice), np.ones(int(0.15 * SR)) / int(0.15 * SR), mode="same")
    duck = 1 - 0.45 * np.clip(env / 0.05, 0, 1)
    mix = 1.0 * voice + 0.75 * fx + ep.get("music_gain", 0.13) * mus * duck
    mix /= np.abs(mix).max() / 0.95
    raw = os.path.join(outdir, "audio_raw.wav")
    sf.write(raw, mix.astype(np.float32), SR)
    # loudness: compress, measure, then gain to -14 LUFS with a true-peak limiter
    pre = "acompressor=threshold=0.25:ratio=3:attack=5:release=120"
    meas = subprocess.run(["ffmpeg", "-nostats", "-i", raw, "-af", pre + ",ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
    lufs = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", meas)[-1])
    af = f"{pre},volume={-14 - lufs + 1.5:.2f}dB,alimiter=limit=0.75:attack=2:release=60:level=false"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", af, "-ar", str(SR), os.path.join(outdir, "audio.wav")], check=True)
    tl = {"fps": FPS, "duration": round(total, 3), "title": ep["title"], "hook": ep.get("hook", ""),
          "outro": ep.get("outro", ""), "beats": beats}
    json.dump(tl, open(os.path.join(outdir, "timeline.json"), "w"), ensure_ascii=False)
    print(f"total {total:.2f}s -> {outdir}")


if __name__ == "__main__":
    main(sys.argv[1])
