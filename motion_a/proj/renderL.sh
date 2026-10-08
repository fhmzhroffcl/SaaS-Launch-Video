#!/bin/bash
cd "$(dirname "$0")"; mkdir -p ../out
for id in "$@"; do npx remotion render src/indexL.ts $id ../out/$id.mp4 --codec=h264 --pixel-format=yuv420p --crf=16 --concurrency=6 --log=error; done
echo DONE
