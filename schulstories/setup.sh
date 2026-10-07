#!/bin/bash
# One-time setup: German TTS voices (CC0) + Python env. Needs: uv, node, ffmpeg (with rubberband), playwright.
set -e
cd "$(dirname "$0")"
mkdir -p voices
for v in thorsten-high thorsten_emotional-medium kerstin-low; do
  [ -d "voices/vits-piper-de_DE-$v" ] && continue
  echo "lade Stimme $v ..."
  curl -sSL "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-de_DE-$v.tar.bz2" | tar xj -C voices
done
[ -d .venv ] || uv venv -q .venv
uv pip install -q --python .venv/bin/python sherpa-onnx numpy soundfile
echo "fertig. Folge bauen: ./make.sh ep01-mama"
