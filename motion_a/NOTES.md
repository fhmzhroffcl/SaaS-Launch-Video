# motion_a — launch film scenes 2, 3a, 3b (1080x1920 and 1920x1080, 30 fps, H.264, no audio)
Order data: see ORDER_DATA.md (Dapur Mak Long Catering, 6 lines, RM 1,290.00, QTN-2026-00201 / SO-2026-00350 / DN-2026-00188 / INV-2026-00412, delivery Wed 7 Oct 2026).
Source: proj/ (Remotion; src/launch/*; WhatsApp bubbles/header/status bar are the original chat components copied from src_a/wa, originals untouched). Render: proj/renderL.sh <comp-id>.

## Files (in this folder)
| file | frames | duration | role / VO sync (film time = scene start + local) |
|---|---|---|---|
| scene1 | - | - | SKIPPED: ../10. Feature-Outcome Series/logo/logo_intro.mp4 (4.5 s chaos -> ERP -> logo) already is the opener. |
| scene2_inputs_9x16.mp4 / _16x9.mp4 | 690 | 23.0 s | start at film t=4.5 s (right after logo intro). Continues the chaos with a clean montage; does not repeat intro. Final 40 f (~1.3 s) are a static-ish hold (slack). |
| scene3a_forward_9x16.mp4 / _16x9.mp4 | 255 | 8.5 s | start at VO 26.5. Forward to MAIA in WhatsApp (VO 26.7-34.6). |
| scene3b_understand_9x16.mp4 / _16x9.mp4 | 660 | 22.0 s | start at VO 34.8. Reads at VO 35.0/36.5/38.5; SKU matching 44.5-50.2; table/total 51.0-56.3. Last ~120 f are table hold. |
Scene 2 overlaps S3a start by ~1 s (VO 26.7 vs film 27.5): trim the tail of scene2 (hold frames) as needed.

## Content
Scene2 (local seconds; VO = 4.5 + local): 1.4-2.5 five Manglish WhatsApp text bubbles; 2.7 voice note arrives (0:23 waveform, plays, shimmer 3.3-4.3 then transcript); 4.5 paper handwritten list is written with a pen (4.9-6.0); 6.0 phone held in two hands opens camera viewfinder (grid, focus box); 7.9 shutter + white flash; 8.1-9.1 photo flies into chat as image bubble (9.2); 9.5 email card (generic mail UI, no brand marks) -> 11.0 Forward tapped -> To: MAIA -> 12.2 Send, card flies off; 13.6-21.7 staff retype the same order by hand into Quotation / Sales Order / Invoice entry forms (generic ERP form, "Typing it in by hand...").
Scene3a: MAIA chat opens; the four inputs (text, voice, handwriting photo, email) are forwarded in as 'Forwarded' bubbles.
Scene3b: lavender scan + badges 'Read' / 'Transcribed' / 'Handwriting read' / 'Email read'; MAIA types and replies; order card rises; messy chips ('ayam fillet 30kg', 'mee kuning small one 10', 'kobis 20kg', 'udang 2 ctn', ...) fly into slots and morph into exact SKU + UOM + price list price with ticks; Udang row shows orange 'Needs your check'; total RM 1,290.00 counts up.

## Caption-safe areas
9:16: key content stays inside y 150-1500; captions: bottom band y 1560-1800 (chat composer/lower table may sit under it in S3b: table card spans ~y 330-1590, keep captions <= 2 lines at y>=1620) and top 0-130 free. 16:9: key content y 60-1000; captions bottom band y 960-1060 over the table/chat bottom edge only; side margins 90 px.

## SFX cue sheet (local time within each clip, seconds @30fps)
### scene2
0.00 soft whoosh in (chat); pings: 1.40, 1.67, 1.93, 2.20, 2.47 (text bubbles); 2.73 voice-note ping; 3.00 play click; 4.47 paper slide whoosh; 4.87-6.00 pen scribble loop; 5.93 phone rise whoosh; 7.40 focus beep; 7.87 SHUTTER click + flash; 8.07-9.13 photo whoosh; 9.17 sent pop; 9.53 mail-arrive ping + slide whoosh; 11.00 tap click (Forward); 11.40 key tick (typing 'MAIA') ; 11.83-12.2 chip pop; 12.20 SEND whoosh; 12.3-13.3 card fly-away whoosh; 14.0-21.7 keyboard typing bed (tab switches at 16.8 and 19.5: click).
### scene3a
1.47 whoosh+ping (text forwarded), 2.93 (voice), 4.40 (image), 5.87 (email); 'WhatsApp' lands VO 34.0 = local 7.3 s (subtle swell).
### scene3b
0.2 / 1.7 / 3.7 / 5.0 read badge ticks (Read, Transcribed, Handwriting read, Email read; scan sweeps start 0.2 s before each); 5.7-6.6 typing dots; 6.6 MAIA reply pop; 8.4-9.4 table rise whoosh; chip whooshes + morph ticks: row i chip at 9.5+0.93*i, tick at 10.0+0.93*i (rows 0..5 -> 9.97, 10.9, 11.8, 12.8, 13.7, 14.6 s for ticks; ambiguity warning tone at 13.7); 16.2-17.4 total count-up ticks; total settles 17.4.

## Known flaws / notes
- Photo-to-bubble flight is approximate (cross-dissolve at landing). Handwriting is a pen-wipe reveal with a handwriting font (Bradley Hand), not real stroke paths. Hands are stylised vector thumbs. 9:16 table is vertically centered; blurred chat ghosts under it.
- Landscape: chat is on the left (centered while nothing else is on stage), inputs/phone/email/table spread on the right; text scale is smaller than portrait (WhatsApp 0.88x, cards 0.76-0.82x).

## Final status (verified via ffprobe + contact sheets)
Durations: scene2 23.06 s, scene3a 8.55 s, scene3b 22.06 s (both aspects, 30 fps, no audio). Cue times in the table above are for the final timing (scene2 values were written for the first 690-frame version; final cues: texts 1.4-2.5 s, voice 2.7, paper 4.5, shutter 7.87, photo lands 9.17, mail 9.5, tap 11.0, send 12.2, manual typing 14-21.7).
Extra known flaws: (1) at ~9.2-9.6 s of scene2 the flying photo briefly overlaps the incoming email card (2-3 frames); (2) last handwritten line ('minyak masak 5kg 6 tin') slightly overruns the paper edge inside the phone viewfinder/photo; (3) in S3b the camera push crops the order-card header while rows resolve (intentional, header visible at start and end); (4) landscape text is smaller than portrait.

## Hands update (user image)
PhoneCam hands replaced with the user's work/hands_user.png (already RGBA; cropped per hand to proj/public/hand_l.png / hand_r.png). Shutter tap now has a ripple ring. Handwriting font reduced so lines no longer overrun the paper. Changed clips: scene2_inputs_9x16.mp4 and scene2_inputs_16x9.mp4 only (same names/durations, 23.06 s). Scene 3a/3b and the Ripple/pen contain no hands/fingers and are unchanged; motion_b untouched.

## 16:9 recompose of scene3a / first half of scene3b
scene3a_forward_16x9: right side = 2x2 grid of large input cards (text, voice, handwriting photo, email) that fly left into the MAIA chat at the forward cue times (1.47/2.93/4.40/5.87 s) and stay as dimmed 'Sent to MAIA' cards. scene3b_understand_16x9: right 'MAIA reads it' panel (message tokens highlighted, voice waveform + transcript words, handwriting OCR lines + scan bar, email row) linked by dashed lines to the chat bubbles; active at read cues 0.2/1.7/3.7/5.0 s, fades out ~7.2 s as the order table rises (table/SKU chips unchanged, SKU matching 9.9-14.6 s). Durations unchanged (8.55 s / 22.06 s). Old versions kept as *_16x9_old.mp4. 9:16 untouched.
