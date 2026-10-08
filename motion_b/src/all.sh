for m in 16x9 9x16; do for s in s4 s5 s6 s7 same review s8 recap; do node render.js $s "" $m 2>&1 | tail -1; done; done
