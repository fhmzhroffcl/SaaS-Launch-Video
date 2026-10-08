# MAIA × iPhone Duo — 30 s 9:16 showcase (Remotion)

Output: `out/maia-duo-showcase-9x16.mp4` (1080x1920, 30 fps, 900 frames = 13 bars at 104 bpm, H.264 CRF 18 + AAC 48 kHz, -16 LUFS).

```
scripts/build.sh                      # render picture, synthesize SFX + music, mix, mux, export stills
node scripts/stills.mjs 0,245,760     # quick PNG stills into work/
```

- `src/timeline.ts` — every beat (frame numbers) + headline copy. Picture and sound both read it
  (`scripts/events.ts` turns it into the SFX cue list `work/events.json`).
- `src/data/video.ts` — chat rows (copy from maia-duo-scenes scene1-4 / history, re-wrapped for the larger chat).
- `src/chat/`, `src/duo/`, `src/web/`, `src/data/` — ported from `/workspace/maia-duo-scenes` (Bubble, PdfCard, header,
  DuoFrame, MaiaWindow...). Added: `AnimatedChat.tsx` (springy bubbles, typing dots, ticks, composer typing, voice note,
  reaction, reply button, PDF viewer navigation), `web/SalesOrders.tsx`, `cards/` (SO PDF, synced, DN, invoice cards).
- `src/Showcase.tsx` — 3D stage (floating Duo, dashboard window, pop-out cards, fingertip + ripple, headlines, end card).
- `scripts/audio.py` — all SFX and the music bed synthesized with numpy/scipy, written circularly for a seamless loop;
  `scripts/mix.sh` mixes (music -6 dB under SFX), limits and normalizes to -16 LUFS / -1.5 dBTP.
