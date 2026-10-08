import { DuoChatData } from '../duo/DuoChat';
import { me, maia, p, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './helpers';

// Scene 4 — approve invoice -> edit billing address -> INV rev 2 re-synced. 10:05–10:08.
export const scene4Chat: DuoChatData = {
  clock: '10:08',
  messages: [
    me('10:05', [p('approve invoice for 00312')], { tail: true }),
    maia('10:05', [
      p(L(e('🧾'), ' ', b('Invoice approved — '), c('INV-2026-00147'))),
      lim(8, 'RM 3,053.90 · due 28 Oct 2026'),
      li(L('Synced to system ', e('✅'))),
    ], { tail: true, gapBefore: GAP }),
    maia('10:05', undefined, { gapBefore: GAP_IN, pdf: pdf('Invoice_INV-2026-00147.pdf') }),
    me('10:07', [p('change address to HQ pls')], { tail: true, gapBefore: GAP }),
    maia('10:07', [p('Editing…')], { tail: true, gapBefore: GAP }),
    maia('10:08', [
      p(L(e('✏️'), ' ', b('Updated — rev 2'))),
      lim(8, 'Bill to: HQ, Bandar Puchong Jaya'),
      li(L('Re-synced to SQL Account & AutoCount ', e('✅'))),
    ], { gapBefore: GAP_IN }),
    maia('10:08', undefined, { gapBefore: GAP_IN, pdf: pdf('Invoice_INV-2026-00147_rev2.pdf') }),
  ],
};
