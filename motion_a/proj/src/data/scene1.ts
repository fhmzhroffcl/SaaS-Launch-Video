import { DuoChatData } from '../duo/DuoChat';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './helpers';

// Scene 1 — messy forwarded order -> structured SO -> SO PDF (+ synced to SQL). Mon 28 Sep 2026.
export const scene1Chat: DuoChatData = {
  clock: '9:14',
  messages: [
    me('09:12', [p(
      L('boss esok hantar ye ', e('🙏')),
      'minyak masak 5kg 20 ctn, beras faiza 10kg x10 bag',
      'gula 1kg 30pkt, tepng 2 ctn',
      'same add mcm last time, before 11 ok. tq',
    )], { tail: true, forwarded: true }),
    me('09:12', [p('pls process this for Selera')], { gapBefore: GAP_IN }),
    maia('09:12', [p('Received, processing your order…')], { tail: true, gapBefore: GAP }),
    maia('09:13', [
      p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00312'))),
      p('Restoran Selera Kampung Sdn Bhd'),
      lim(8, '20 ctn Minyak Masak 5kg @ RM 118.00'),
      li('10 bag Beras Faiza 10kg @ RM 36.50'),
      li('30 pkt Gula 1kg @ RM 2.80'),
      li('2 ctn Tepung Gandum 1kg @ RM 31.20'),
      li(L('Total: ', b('RM 2,871.40'))),
      li('Delivery: Tue 29 Sep, 11:00 AM — Main Branch'),
    ], { gapBefore: GAP_IN }),
    me('09:14', [p('can send the SO?')], { tail: true, gapBefore: GAP }),
    maia('09:14', [p(L(e('✅'), ' SO sent. Also synced into'), 'SQL Account.')], { tail: true, gapBefore: GAP, pdf: pdf('Sales_Order_SO-2026-00312.pdf') }),
  ],
};
