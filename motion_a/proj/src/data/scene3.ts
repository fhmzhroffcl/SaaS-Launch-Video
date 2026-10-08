import { DuoChatData } from '../duo/DuoChat';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './helpers';

// Scene 3 — prepare the DO for SO-2026-00312 -> Delivery Note DN-2026-00091. 09:40–09:42.
export const scene3Chat: DuoChatData = {
  clock: '9:42',
  messages: [
    me('09:40', [p('can you prepare the Delivery Order', 'for SO-2026-00312?')], { tail: true }),
    maia('09:40', [
      p(L(e('✅'), ' ', c('SO-2026-00312'), ' is good and verified.')),
      pm(8, 'What time do you want to deliver,', 'and to which address?'),
    ], { tail: true, gapBefore: GAP }),
    me('09:41', [p('11am at main branch')], { tail: true, gapBefore: GAP }),
    maia('09:42', [
      p(L(e('✅'), ' ', b('Delivery arranged'))),
      lim(8, L('Checked ', c('DN-2026-00091'), ' before proceeding')),
      li('Tue 29 Sep, 11:00 AM'),
      li('Main Branch, SS 15 Subang Jaya'),
      pm(8, 'Delivery Note PDF below.'),
    ], { tail: true, gapBefore: GAP }),
    maia('09:42', undefined, { gapBefore: GAP_IN, pdf: pdf('Delivery_Note_DN-2026-00091.pdf') }),
  ],
};
