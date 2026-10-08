#!/bin/bash
# usage: ./sheet.sh out.png file1 file2 ...  (tile scaled 3-up rows)
out=$1; shift; n=$#; args=(); for f in "$@"; do args+=(-i "$f"); done
ffmpeg -loglevel error -y "${args[@]}" -filter_complex "$(for i in $(seq 0 $((n-1))); do echo -n "[$i:v]scale=480:-1[s$i];"; done)$(for i in $(seq 0 $((n-1))); do echo -n "[s$i]"; done)hstack=inputs=$n" "$out"
