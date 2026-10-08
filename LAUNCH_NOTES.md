# MAIA launch film - notes
Outputs: MAIA_launch_16x9.mp4 (primary), MAIA_launch_9x16.mp4, *_subtitled.mp4 (full burned-in subtitles). 30 fps H.264, AAC 48k stereo, 101.5 s, -16.1 LUFS, TP -2.3 dBTP (ebur128 on the mp4s).
VO: vo_in/launch_en.mp3 unmodified speed, starts at film 1.0 s (VO time + 1.0 = film time). Timing taken from work/launch_en_words.json (actual audio; VO_TIMING.md times are ~0.3-0.4 s early).
## Timeline (film s) - build in work/build (timeline.py, build_base.py, audio.py, caps.py, render.sh)
0-6.2 logo intro (last frame held to 5.9) | 5.9-10.8 scene2 (0-4.9) | 10.8-28.2 scene2 rest: local 5.9-13.6 at 1.1x, 13.6-end at 0.9x (1.0 s of pen-scribble 4.9-5.9 cut) | 28.16 scene3a | 36.9 scene3b (hold on table to 59.7) | 59.7 quotation | 61.3 sales order | 62.5 delivery order | 63.8 invoice | 65.0 same-order (0.91x) | 72.5 review-confirm | 79.6 ERP sync | 90.5 recap | 94.1 outro (CTA pill at 98.1 = 'Start at') held to 101.5.
Transitions 0.15-0.3 s (xfade fade / smoothleft / smoothright) with whoosh/swoosh SFX; cue SFX (pops, dings, shutter, ticks, typing, clicks) from the NOTES.md cue sheets mapped to film time, -17..-12 dB under voice.
Audio: VO highpass 80, afftdn nr 6, gentle compressor; BGM 'MAIA - Investigation Bed.mp3' sidechain-ducked, swells at intro / ERP sync / outro; BGM ~ -41 LUFS base (about 17-19 dB under VO); final gain + limiter.
Kinetic text (Montserrat Bold, white + orange #EE9A00, ASS animated fade/slide, bottom safe band): 'Meet MAIA', 'Text . Voice note . Handwritten . Email', 'Right SKU. Right unit. Right price.', 'Quotation -> Sales Order -> Delivery Order -> Invoice', 'Your team stays in control', 'SQL Account . AutoCount'. CTA maia.wasap.my comes from the outro pill. All text says MAIA / maia.wasap.my (grep of caption files for 'Maya'/'whatsapp.my' is clean).
## Defects
- Not every frame at 4-6 fps was reviewed in both aspects; coarse 1.25-2 fps sheets checked for most of 16:9 and parts of 9:16.
- Kinetic caption over the PDF pages (9:16 and 16:9, 60-65 s) sits on the white page bottom (boxed for legibility); 'SQL Account . AutoCount' (16:9) slightly overlaps ERP card bottoms; 'Your team stays in control' shortened to 72.0-74.7 to avoid the Confirm button.
- Scene2 middle is retimed/cut; email arrival is ~1 s after the spoken 'an email'. Scene2 flaws from motion_a/NOTES.md remain (photo/email overlap, handwriting overrun).
- BGM is very quiet (spec: >=18 dB under voice); no ear-check performed. SFX levels not listened to.
- Logo intro last frame is held ~1.7 s; scene3b table is held ~2 s before the quotation.
- Hallucinated whisper tail ('Do not try') ignored. The VO's last words are read as 'maya.whatsapp.my' - on-screen text uses maia.wasap.my.

## Revision 2 (new cartoon-hands scene 2)
Re-assembled all four films with the replaced motion_a scene2 (previous renders kept as *_prevhands.mp4). Hand-capture section (film ~12.5-17 s) checked at 8 fps in both aspects: hands aligned with phone, no white box, shutter flash and photo landing in chat OK. Loudness re-measured: -16.1 LUFS, TP -2.3 dBFS.
Caption fixes: the 'Quotation -> ... -> Invoice' caption moved to 65.2-69.6 s (over same-order, off the PDF pages); 'Text . Voice note . Handwritten . Email' moved to 7.6-10.2 s so it no longer sits on the camera/hands; 'SQL Account . AutoCount' (16:9) lowered/smaller (y 1048, 42 px).
Remaining: the quotation->invoice caption no longer sits on the PDF pages, so the doc intro (59.7-65 s) has only the on-screen titles; subtitled versions still overlay subtitles at the bottom band over UI edges; BGM/SFX not ear-checked; 9:16 sheets reviewed at lower density than 16:9.

## Revision 3 (16:9 only)
Re-assembled 16:9 films with the recomposed scene3a/3b (wide layout); previous 16:9 kept as *_prev3ab.mp4; 9:16 untouched. Film 28-46 s checked at 4 fps: right side used, no clipping, 'Meet MAIA' sits at the bottom centre clear of key content. Loudness -16.1 LUFS, TP -2.3 dBFS.
