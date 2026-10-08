import { Message } from '../chat/types';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './helpers';
import { TL, TYPED, TYPED2 } from '../timeline';

// Chat rows for the video. Copy comes from scene1-4.ts / history.ts, re-wrapped for the larger (Z=1.2) chat.
export type Row =
  | { kind: 'date'; id: string; label: string; at?: number }
  | { kind: 'typing'; id: string; at: number; end: number }
  | {
      kind: 'msg';
      id: string;
      m: Message;
      at?: number; // undefined = history (always visible)
      readAt?: number;
      fly?: boolean; // flies up from the message bar
      reaction?: { emoji: string; at: number };
      voice?: { play: readonly [number, number]; transcriptAt: number; transcript: string[]; dur: string };
    };

const msg = (id: string, m: Message, extra: Partial<Extract<Row, { kind: 'msg' }>> = {}): Row => ({ kind: 'msg', id, m: { ...m, id }, ...extra });
const typing = (id: string, t: readonly [number, number]): Row => ({ kind: 'typing', id, at: t[0], end: t[1] });

export const ROWS: Row[] = [
  // ---- history (4 Sep, the "last order" SO-2026-00291) ----
  { kind: 'date', id: 'd0', label: 'Fri, 4 Sep' },
  msg('h1', me('15:40', [p('Selera order sama mcm last week')], { tail: true })),
  msg('h2', maia('15:40', [p('Received, processing your order…')], { tail: true, gapBefore: GAP })),
  msg('h3', maia('15:41', [
    p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00291'))),
    p('Restoran Selera Kampung Sdn Bhd'),
    lim(8, L('Total: ', b('RM 2,841.40'))),
  ], { gapBefore: GAP_IN })),
  msg('h4', maia('15:41', [p(L(e('✅'), ' SO sent. Also synced into'), 'SQL Account.')], { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00291.pdf') })),
  msg('h5', me('15:42', [p(L('tq ', e('👍')))], { tail: true, gapBefore: GAP })),
  { kind: 'date', id: 'd1', label: 'Today' },

  // ---- 1. messy forwarded order -> SO-2026-00312 ----
  msg('a1', me('09:12', [p(
    L('boss esok hantar ye ', e('🙏')),
    'minyak masak 5kg 20 ctn,',
    'beras faiza 10kg x10 bag',
    'gula 1kg 30pkt, tepng 2 ctn',
    'same add mcm last time,',
    'before 11 ok. tq',
  )], { tail: true, forwarded: true }), { at: TL.fwd, readAt: TL.read1 }),
  msg('a2', me('09:12', [p(TYPED)], { gapBefore: GAP_IN }), { at: TL.send, readAt: TL.read1, fly: true }),
  typing('t1', TL.typing1),
  msg('a3', maia('09:13', [
    p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00312'))),
    p('Restoran Selera Kampung Sdn Bhd'),
    lim(8, '20 ctn Minyak Masak 5kg @ RM 118.00'),
    li('10 bag Beras Faiza 10kg @ RM 36.50'),
    li('30 pkt Gula 1kg @ RM 2.80'),
    li('2 ctn Tepung Gandum 1kg @ RM 31.20'),
    li(L('Total: ', b('RM 2,871.40'))),
    li('Delivery: Tue 29 Sep, 11:00 AM', '— Main Branch'),
  ], { tail: true, gapBefore: GAP }), { at: TL.order, reaction: { emoji: '❤️', at: TL.heart } }),
  typing('t2', TL.typing2),
  msg('a4', maia('09:14', [p(L(e('✅'), ' SO sent. Also synced into'), 'SQL Account.')], { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00312.pdf') }), { at: TL.soPdf }),

  // ---- 2. voice note: follow last order, beras 15 bag -> rev 2 ----
  msg('b1', { id: 'b1', from: 'me', tail: true, ticks: true, time: '09:30', gapBefore: GAP }, {
    at: TL.voice, readAt: TL.voiceRead,
    voice: { play: TL.voicePlay, transcriptAt: TL.transcript, transcript: ['“ok follow last order,', 'but beras make 15 bag”'], dur: '0:04' },
  }),
  typing('t3', TL.typing3),
  msg('b2', maia('09:31', [
    p(L(e('📝'), ' ', b('Order updated — '), c('SO-2026-00312'))),
    pm(8, L(b('(rev 2)'), ' Same items as ', c('SO-2026-00291'))),
    p('beras now 15 bag:'),
    lim(8, L(b('15 bag'), ' Beras Faiza 10kg @ RM 36.50')),
    lim(6, L('Total: ', b('RM 3,053.90'))),
  ], { tail: true, gapBefore: GAP }), { at: TL.rev2 }),

  // ---- 3. confirm + delivery note ----
  msg('c1', me('09:41', [p('ok confirm. 11am at main branch')], { tail: true, gapBefore: GAP }), { at: TL.confirm, readAt: TL.confirmRead }),
  typing('t4', TL.typing4),
  msg('c2', maia('09:42', [p(L(e('✅'), ' ', b('Delivery arranged'))), p('Tue 29 Sep, 11:00 AM · Main Branch')], { tail: true, gapBefore: GAP, pdf: pdf('Delivery_Note_DN-2026-00091.pdf') }), { at: TL.dnPdf }),

  // ---- 4. invoice approve (one tap) ----
  typing('t5', TL.typing5),
  msg('d1', maia('10:05', [
    p(L(e('🧾'), ' ', b('Invoice ready — '), c('INV-2026-00147'))),
    p('RM 3,053.90 · due 28 Oct 2026'),
  ], { gapBefore: GAP_IN }), { at: TL.invReady }),
  msg('d2', me('10:05', [p(TYPED2)], { tail: true, gapBefore: GAP }), { at: TL.send2, readAt: TL.approveRead, fly: true }),
  typing('t6', TL.typing6),
  msg('d3', maia('10:05', [
    p(L(e('🧾'), ' ', b('Invoice approved — '), c('INV-2026-00147'))),
    lim(8, 'Rev 2 · RM 3,053.90'),
    li(L('Synced to SQL Account & AutoCount ', e('✅'))),
  ], { tail: true, gapBefore: GAP }), { at: TL.invApproved }),
];

// Status-bar clock and header status follow the story.
export const clockAt = (f: number) =>
  f < TL.order ? '9:12' : f < TL.soPdf ? '9:13' : f < TL.voice ? '9:14' : f < TL.rev2 ? '9:30' : f < TL.confirm ? '9:31' : f < TL.dnPdf ? '9:41' : f < TL.invReady ? '9:42' : '10:05';
