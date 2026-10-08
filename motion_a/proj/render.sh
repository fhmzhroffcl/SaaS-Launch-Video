#!/bin/bash
# usage: ./render.sh wa-price-flag  -> ../../wa_price_flag.mp4
cd "$(dirname "$0")"
id=$1; out=../../${id//-/_}.mp4
npx remotion render src/index.ts $id "$out" --codec=h264 --pixel-format=yuv420p --crf=16 --concurrency=4 --log=error
