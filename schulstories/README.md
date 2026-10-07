# Schulstories Studio

Animierte 9:16-Kurzvideos (TikTok, Reels, Shorts) mit **Toni**, einem Schüler, der
relatable und absurde Schulgeschichten erlebt. Alles wird per Code erzeugt:
Vektor-Zeichentrick, deutsche Sprachausgabe, Soundeffekte, Musik und Untertitel
mit Wort-Hervorhebung. Es fallen keine KI-Credits an, und die Figuren sehen in jeder Folge exakt gleich aus.

```
./setup.sh              # einmalig: Stimmen + Python-Umgebung
./make.sh ep01-mama     # -> out/ep01-mama.mp4 (ca. 1 Minute Renderzeit)
node render.mjs ep01-mama --stills 1.0,5.3   # einzelne Standbilder zum Prüfen
```

Voraussetzungen: `uv`, `node` + `playwright` (mit Chromium), `ffmpeg` (mit `rubberband`).

## Aufbau

| Datei | Inhalt |
|---|---|
| `episodes/epXX-*.json` | Drehbuch: Sätze (`beats`), Sprecher, Pausen, Soundeffekte, Hook-Text, Musik-Abschnitte |
| `build_audio.py` | Sprachausgabe (Piper/sherpa-onnx), Lippen-Sync-Kurven, Wort-Timings, Soundeffekte, Musik, Lautheit −14 LUFS |
| `stage/core.js` | Easing, Kamera, Untertitel, Hook-Karte |
| `stage/characters.js` | Toni, Mitschüler, Frau Krause, Hausmeister, Uhr, Tische |
| `stage/backgrounds.js` | Klassenzimmer, Tafel, Flur |
| `stage/epXX.js` | Regie der Folge: Einstellungen, Kamerafahrten, Gags |
| `render.mjs` | rendert jedes Bild in Chromium und baut mit ffmpeg das MP4 |

Im Drehbuch markiert `*Wort*` ein Wort, das im Untertitel rot hervorgehoben wird.
`"say"` überschreibt den gesprochenen Text, falls die Aussprache nicht stimmt.

## Lizenzen

- Stimmen: Thorsten (CC0) und Kerstin (CC0), kommerziell nutzbar. Die Stimmen `dii`/`miro`
  sind bewusst **nicht** verwendet (nur nicht-kommerziell).
- Schriften: Inter (OFL), Fredoka (OFL), Luckiest Guy (Apache 2.0).
- Musik und Soundeffekte werden im Code synthetisiert und sind frei von Rechten Dritter.
