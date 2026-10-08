import { DuoChatData } from '../duo/DuoChat';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './helpers';

// Scene 2 — phone 1: past orders lookup. Mon 28 Sep 2026, 09:27.
export const scene2aChat: DuoChatData = {
  clock: '9:27',
  messages: [
    me('09:27', [p('Selera past orders ah?')], { tail: true }),
    maia('09:27', [
      p(L(e('🗂️'), ' ', b('Last 2 orders — Selera Kampung'))),
      lim(8, L(c('SO-2026-00291'), ' · 4 Sep · RM 2,841.40')),
      li(L(c('SO-2026-00268'), ' · 14 Aug · RM 2,946.80')),
      pm(8, 'Both SO PDFs below.'),
    ], { tail: true, gapBefore: GAP }),
    maia('09:27', undefined, { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00291.pdf') }),
    maia('09:27', undefined, { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00268.pdf') }),
    maia('09:27', [p(L('Want me to check them? ', e('🔍')))], { gapBefore: GAP_IN }),
  ],
};

// Scene 2 — phone 2: repeat last order with a change -> SO-2026-00312 rev 2 for review. 09:31.
export const scene2bChat: DuoChatData = {
  clock: '9:31',
  messages: [
    me('09:30', [p('ok follow last order, but beras make 15 bag')], { tail: true }),
    maia('09:31', [
      p(L(e('📝'), ' ', b('Order updated — '), c('SO-2026-00312'), ' (rev 2)')),
      pm(8, L('Same items as ', c('SO-2026-00291'), ', beras now 15 bag:')),
      lim(8, '20 ctn Minyak Masak 5kg @ RM 118.00'),
      li(L(b('15 bag'), ' Beras Faiza 10kg @ RM 36.50')),
      li('30 pkt Gula 1kg @ RM 2.80'),
      li('2 ctn Tepung Gandum 1kg @ RM 31.20'),
      lim(6, L('Total: ', b('RM 3,053.90'))),
      li('Delivery: Tue 29 Sep, 11:00 AM — Main Branch'),
      pm(20, L('Next: please review ', e('👀'))),
    ], { tail: true, gapBefore: GAP }),
  ],
};
