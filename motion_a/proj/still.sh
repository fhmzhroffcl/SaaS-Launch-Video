#!/bin/bash
# usage: ./still.sh s2-9x16 150 200 ...
cd "$(dirname "$0")"; id=$1; shift; mkdir -p stills
for f in "$@"; do npx remotion still src/indexL.ts $id stills/${id}_$f.png --frame=$f --log=error 2>&1 | grep -iE "error|Cannot" | head -5; done
