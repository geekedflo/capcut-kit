#!/bin/bash
# Build one episode: audio (TTS, SFX, music) -> render frames -> out/<ep>.mp4
set -e
cd "$(dirname "$0")"
ep="$1"
.venv/bin/python build_audio.py "episodes/$ep.json"
node render.mjs "$ep" --workers "${WORKERS:-4}"
