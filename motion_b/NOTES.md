# motion_b — launch film OMS / document scenes (re-fit to the real VO, see work/VO_TIMING.md)

All clips: H.264, 30 fps, no audio, each in `_16x9` (1920x1080) and `_9x16` (1080x1920). Data = motion_a/ORDER_DATA.md (QTN-2026-00201 -> SO-2026-00350 -> DN-2026-00188 -> INV-2026-00412, 6 lines, RM 1,290.00, FreezeFood Sdn. Bhd., Dapur Mak Long Catering).
Source: `src/docs.html`, `src/docs.js`, `src/render.js` (`node render.js <scene> "" <16x9|9x16>`; scenes s4 s5 s6 s7 same review s8 recap; f4..f7 = older long 11/11/9/9 s document versions, not rendered by default). All end frames are holdable (last 0.3–1 s is static or a slow push), so each clip tolerates ±10 % retime.

| clip | dur | VO slot | cues (s from clip start) |
|---|---|---|---|
| scene4_quotation | 2.5 | 56.3–58.8 | 0.00 title+number slide in, 0.10 PDF page rises (whoosh), 1.4 chip Draft->Sent (tick), hold |
| scene5_sales-order | 2.0 | 58.8–60.8 | 0.00 title, 0.08 page (whoosh), 1.1 chip Draft->To Bill and Deliver (tick) |
| scene6_delivery-order | 1.2 | 60.8–62.0 | 0.00 title, 0.06 page (whoosh), chip 'Delivered' pops at 0.2 |
| scene7_invoice | 1.2 | 62.0–63.2 | 0.00 title, 0.06 page (whoosh), chip 'Billed' pops at 0.2 |
| scene_same-order | 6.6 | 63.6–70.2 | doc phases start at 0.0 QTN, 1.65 SO, 3.30 DN, 4.95 INV (a soft whoosh/tick at each); row highlight sweep 0.3–0.8 after each start; step-node tick at +1.4 after each start; price columns fade at DN (3.3) and return at INV (4.95) |
| scene_review-confirm | 7.0 | 70.5–77.6 | 0.35–1.3 rows in, 1.7 row 5 expands (options), 2.9 cursor tap on 'Udang 31/40' (click), 3.6 chip Needs your check -> Confirmed (tick), 5.0 cursor presses Confirm (click), 5.2–5.8 button + status chip turn green 'Confirmed by Aina Sofea' (ding-lite) |
| scene8_erp-sync | 10.7 | 78.0–88.7 | row departs: 1.5/3.0/4.5/6.1 (docs 1–4: pills fly, whoosh each); ERP ticks ≈ +1.0 s after each departure (tick x2); sync chips -> Synced ✓ ≈ +2.5 s after each departure; 'Synced' hub label + ding at ≈ 8.9; hold to 10.7 |
| scene_recap | 4.4 | 89.6–94.0 | 0.4 'Confirm' bubble, 1.0 'Synced' bubble pops (ding), 0.5–1.4 ERP rows stagger in, gentle push to the end; the 5 s logo_outro_en starts at ≈94.0 |

Outro: reuse ../10. Feature-Outcome Series/logo/logo_outro_en.mp4 (16:9 variant by the logo agent), not remade here.

## Caption-safe areas
- 16:9: captions in the bottom band y 960–1060 (full width); main content above y 960 except in scene_review (panel to y ~1040: put caption left-aligned under the panel only if needed) and scene8/recap (cards end ~y 1040).
- 9:16: captions in y 1620–1840 (the document / panel bottoms stay above ~1700 except quick-reveal pages which run to y ~1810; those pages carry no key text in the last 200 px). Top 130 px kept free of key content (logo / step pill).

## Language-neutral vs English text
- Neutral: doc numbers, SKUs, quantities, UOM, prices, totals, dates, customer / company names, the document PDF pages' numbers.
- English UI text (translate for other versions): titles 'Quotation / Sales Order / Delivery Order / Invoice', status chips (Draft, Sent, To Bill and Deliver, To Deliver, Delivered, Billed, Syncing, Synced, Waiting, Connected, Posted), 'Two-way sync', 'Needs your check / Confirmed', 'Confirm order', 'Confirmed by Aina Sofea', 'Review' side panel (16:9), chat lines ('Confirm', 'Synced', 'Posted to SQL Account and AutoCount'), 'Your ERP', 'Same order', PDF boilerplate (terms, delivery note, 'Prepared by MAIA').
- ERP names are text only ('SQL Account', 'AutoCount'); no third-party logos. 'your connected ERP' is not drawn: carry it in the caption/VO.

## Revision 2 fixes
- scene_review-confirm: no camera zoom any more (whole card always inside the frame); option row expands in place and pushes later rows down (no overlay).
- scene8: pills now only travel inside the hub gutter between the cards (never over row text); ERP rows slide in by themselves; 'Two-way sync' on one line, hub label at the gutter top.
- scene6: title is single-line in both ratios.

## Known flaws / notes
- Cursor in scene_review is a simple arrow; WhatsApp 'doc ready' cards from the old long versions are not in the quick clips (the VO gives 1.2–2.5 s per doc), they exist only in the f4..f7 builds.
- Zoomed moves keep the non-focus blocks blurred and dimmed on purpose (depth of field) so zooms never cut readable text; the PDF page is cropped by the frame during its totals push-in (intended).
- Wide scene8: first ~0.4 s the ERP cards are still sliding in.
- Tall (9:16) scene_review / same-order cards end at y ~1550–1700; the lower band is intentionally free for captions.
