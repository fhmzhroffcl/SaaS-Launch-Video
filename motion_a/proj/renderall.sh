#!/bin/bash
cd "$(dirname "$0")"; mkdir -p raw
for id in "$@"; do npx remotion render src/indexA.ts $id raw/$id.mp4 --codec=h264 --pixel-format=yuv420p --crf=16 --concurrency=4 --log=error; done
