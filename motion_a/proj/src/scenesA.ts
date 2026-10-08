import { SceneSpec } from './broll/Scene';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from './data/helpers';
import { Message } from './chat/types';

const hl = (text: string, tid: string, at: number, tone?: any) => ({ hl: text, tid, at, tone });
const M = (id: string, m: Message) => ({ ...m, id });
const hist = (label: string) => ({ kind: 'date' as const, id: 'd-' + label, label });
const Z = 1.2; // max zoom on incoming (left-hugging) bubbles
const COMP = { fy: 1050, sy: 0.82 }; // camera aimed at the composer

// ======================= A3  customer-specific price lookup =======================
const a3Reply = (id: string, t: string, name: string, at: number, tid: string, hat: number): any => ({
  kind: 'msg', id, at, m: M(id, maia(t, [
    p(L(b(name))),
    pm(6, 'Tomato Grade A'),
    pm(10, 'Maintained price:'),
    p(L(hl(name === 'Kedai Runcit Maju' ? 'RM5.20/kg' : 'RM5.00/kg', tid, hat, 'ok'))),
  ], { tail: true, gapBefore: GAP })),
});
export const a3Demo: SceneSpec = {
  id: 'a3_demo', frames: 570, clock: '10:32', clocks: [[300, '10:33']],
  types: [
    { text: "Maju's Tomato Grade A?", start: 6, send: 62, rate: 2.2 },
    { text: 'Mini Market Jaya pulak?', start: 236, send: 292, rate: 2.2 },
  ],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'q1', at: 62, fly: true, readAt: 90, m: M('q1', me('10:32', [p("Maju's Tomato Grade A?")], { tail: true })) },
    { kind: 'typing', id: 't1', at: 70, end: 108 },
    a3Reply('r1', '10:32', 'Kedai Runcit Maju', 108, 'p1', 128),
    { kind: 'msg', id: 'q2', at: 292, fly: true, readAt: 318, m: M('q2', me('10:33', [p('Mini Market Jaya pulak?')], { tail: true, gapBefore: GAP })) },
    { kind: 'typing', id: 't2', at: 300, end: 338 },
    a3Reply('r2', '10:33', 'Mini Market Jaya', 338, 'p2', 358),
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 10, z: 1.14, ...COMP }, { f: 60, z: 1.14, ...COMP }, { f: 80, z: 1.04 },
    { f: 110, z: 1.1, tid: 'r1' }, { f: 134, z: Z, tid: 'p1', sy: 0.42 }, { f: 228, z: Z, tid: 'p1', sy: 0.42 },
    { f: 248, z: 1.14, ...COMP }, { f: 290, z: 1.14, ...COMP }, { f: 310, z: 1.04 },
    { f: 340, z: 1.1, tid: 'r2' }, { f: 364, z: Z, tid: 'p2', sy: 0.42 }, { f: 456, z: Z, tid: 'p2', sy: 0.42 },
    { f: 496, z: 1.0 }, { f: 570, z: 1.0 },
  ],
};
export const a3Hook: SceneSpec = {
  id: 'a3_hook', frames: 135, clock: '10:32',
  types: [{ text: "Maju's Tomato Grade A?", start: 10, send: 74, rate: 2.4 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'q1', at: 74, fly: true, readAt: 100, m: M('q1', me('10:32', [p("Maju's Tomato Grade A?")], { tail: true })) },
    { kind: 'typing', id: 't1', at: 84, end: 400 },
  ],
  cam: [{ f: 0, z: 1.3, ...COMP }, { f: 70, z: 1.3, ...COMP }, { f: 100, z: 1.14, tid: 'q1', sy: 0.5 }, { f: 135, z: 1.1, tid: 'q1', sy: 0.5 }],
};

// ======================= A1  different order formats =======================
const a1Pdf = pdf('Hotel_Seri_Melaka_PO.pdf', '1 page • 86 kB • PDF');
const draftHead = (no: string, cust: string) => [
  p(L(e('📄'), ' ', b('Draft for review'))),
  p(L(c(no))),
  pm(6, cust),
];
export const a1Demo: SceneSpec = {
  id: 'a1_demo', frames: 640, clock: '10:05', clocks: [[140, '10:06'], [356, '10:07'], [546, '10:08']],
  types: [
    { text: 'Draft SO utk Runcit Maju', start: 56, send: 104, rate: 2 },
    { text: 'Draft from this PO', start: 286, send: 322, rate: 2 },
    { text: 'Checked, confirm order', start: 472, send: 516, rate: 2 },
  ],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'f1', at: 8, fly: true, m: M('f1', me('10:05', [p('Kedai Runcit Maju:', 'Tomato 20 kg.')], { tail: true, forwarded: true })) },
    { kind: 'msg', id: 'f2', at: 30, fly: true, m: M('f2', me('10:05', [p('Tambah frozen prawns,', 'medium, 2 cartons.')], { forwarded: true, gapBefore: GAP_IN })) },
    { kind: 'msg', id: 's1', at: 104, fly: true, readAt: 128, m: M('s1', me('10:05', [p('Draft SO utk Runcit Maju')], { gapBefore: GAP_IN })) },
    { kind: 'typing', id: 't1', at: 112, end: 142 },
    { kind: 'msg', id: 'd1', at: 142, m: M('d1', maia('10:06', [
      p(L(e('📄'), ' ', b('Draft for review'))),
      pm(4, L(c('SO-2026-00332'))),
      pm(6, 'Kedai Runcit Maju'),
      lim(8, L(hl('20 kg Tomato Grade A', 'i1', 160, 'ok'))),
      li(L(hl('2 ctn Frozen prawns, medium', 'i2', 178, 'ok'))),
      pm(10, 'Please check the customer,'),
      p('items and units.'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'f3', at: 266, fly: true, m: M('f3', me('10:07', [], { forwarded: true, pdf: a1Pdf, tail: true, gapBefore: GAP }) as any) },
    { kind: 'msg', id: 's2', at: 322, fly: true, readAt: 344, m: M('s2', me('10:07', [p('Draft from this PO')], { gapBefore: GAP_IN })) },
    { kind: 'typing', id: 't2', at: 330, end: 358 },
    { kind: 'msg', id: 'd2', at: 358, m: M('d2', maia('10:07', [
      p(L(e('📄'), ' ', b('Draft for review'))),
      pm(4, L(c('SO-2026-00333'))),
      pm(6, 'Hotel Seri Melaka Banquet'),
      lim(8, L(hl('30 kg Tomato Grade A', 'k1', 376, 'ok'))),
      li(L(hl('15 kg Timun', 'k2', 392, 'ok'))),
      pm(10, 'Please review the'),
      p('extracted details.'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 's3', at: 516, fly: true, readAt: 540, m: M('s3', me('10:08', [p('Checked, confirm order')], { gapBefore: GAP })) },
    { kind: 'typing', id: 't3', at: 524, end: 552 },
    { kind: 'msg', id: 'c1', at: 552, m: M('c1', maia('10:08', [
      p(L(e('✅'), ' ', b('Confirmed'))),
      pm(4, L(c('SO-2026-00333'))),
      pm(6, L('Status: ', hl('To Bill and Deliver', 'cf', 568, 'ok'))),
    ], { tail: true, gapBefore: GAP })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 10, z: 1.1, tid: 'f1', fx: 331 }, { f: 40, z: 1.14, tid: 'f1', fx: 331 }, { f: 52, z: 1.14, ...COMP }, { f: 100, z: 1.14, ...COMP }, { f: 118, z: 1.04 },
    { f: 144, z: 1.1, tid: 'd1' }, { f: 168, z: Z, tid: 'd1', sy: 0.5 }, { f: 258, z: Z, tid: 'd1', sy: 0.5 },
    { f: 270, z: 1.12, tid: 'f3', sy: 0.5 }, { f: 282, z: 1.12, ...COMP }, { f: 318, z: 1.12, ...COMP }, { f: 340, z: 1.04 },
    { f: 360, z: 1.1, tid: 'd2' }, { f: 384, z: Z, tid: 'd2', sy: 0.5 }, { f: 460, z: Z, tid: 'd2', sy: 0.5 },
    { f: 470, z: 1.12, ...COMP }, { f: 512, z: 1.12, ...COMP }, { f: 532, z: 1.04 },
    { f: 554, z: 1.12, tid: 'c1' }, { f: 574, z: Z, tid: 'cf', sy: 0.45 }, { f: 640, z: Z, tid: 'cf', sy: 0.45 },
  ],
};
export const a1Hook: SceneSpec = {
  id: 'a1_hook', frames: 140, clock: '10:05',
  types: [],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'f1', at: 10, fly: true, m: M('f1', me('10:05', [p('Kedai Runcit Maju:', 'Tomato 20 kg.')], { tail: true, forwarded: true })) },
    { kind: 'msg', id: 'f2', at: 34, fly: true, m: M('f2', me('10:05', [p('Tambah frozen prawns,', 'medium, 2 cartons.')], { forwarded: true, gapBefore: GAP_IN })) },
    { kind: 'msg', id: 'f3', at: 72, fly: true, m: M('f3', me('10:05', [], { forwarded: true, pdf: a1Pdf, tail: true, gapBefore: GAP }) as any) },
  ],
  cam: [{ f: 0, z: 1.14, tid: 'f1', fx: 331, sy: 0.42 }, { f: 60, z: 1.12, tid: 'f2', fx: 331, sy: 0.45 }, { f: 100, z: 1.1, tid: 'f3', sy: 0.52 }, { f: 140, z: 1.14, tid: 'f3', sy: 0.52 }],
};

// ======================= A7  picked weights -> notify coordinator =======================
const BOX = ['19.8', '20.1', '19.7', '20.0', '19.6'];
const a7Ctx = (): any => ({ kind: 'msg', id: 'h1', m: M('h1', maia('14:18', [
  p(L(e('📦'), ' ', b('Pick list '))),
  pm(4, L(c('PL-2026-00101'))),
  pm(6, 'Selera Kampung Central Kitchen'),
  lim(8, 'Isi Ayam Beku — 5 ctn'),
  li('Linked SO-2026-00334'),
], { tail: true })) });
const a7Weights = (at: number, hat: number): any => ({ kind: 'msg', id: 'w1', at, fly: true, readAt: at + 30, m: M('w1', me('14:20', [
  p('Record these box weights on', 'PL-2026-00101:'),
  pm(6, L(hl('19.8, 20.1, 19.7, 20.0', 'wa', hat, 'dark'))),
  p(L(hl('and 19.6 kg.', 'wb', hat, 'dark'))),
], { tail: true, gapBefore: GAP })) });
export const a7Demo: SceneSpec = {
  id: 'a7_demo', frames: 590, clock: '14:20', clocks: [[140, '14:21'], [300, '14:22']],
  types: [],
  rows: [
    hist('Today'),
    a7Ctx(),
    a7Weights(28, 48),
    { kind: 'typing', id: 't1', at: 100, end: 140 },
    { kind: 'msg', id: 'r1', at: 140, m: M('r1', maia('14:21', [
      p(L(e('✅'), ' ', c('PL-2026-00101'))),
      pm(4, '5 box weights recorded'),
      ...BOX.map((w, i) => (i === 0 ? lim(8, `Box ${i + 1} — ${w} kg`) : li(`Box ${i + 1} — ${w} kg`))),
      pm(8, L('Total picked: ', hl('99.2 kg', 'tot', 166, 'ok'))),
      pm(6, 'Please review the weights.'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'n1', at: 300, fly: true, readAt: 328, m: M('n1', me('14:22', [
      p('Notify the coordinator: update', 'SO-2026-00334 to the actual', L(hl('picked weight of 99.2 kg.', 'nw', 318, 'dark'))),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'typing', id: 't2', at: 312, end: 352 },
    { kind: 'msg', id: 'r2', at: 352, m: M('r2', maia('14:22', [
      p(L(e('🔔'), ' ', b('Coordinator notified'))),
      pm(6, L(hl('Aina Sofea', 'ai', 372, 'ok'))),
      pm(6, 'With your comment and', L(c('SO-2026-00334'))),
      p('reference.'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'r3', at: 430, m: M('r3', maia('14:22', [
      p(L(b('Next action'))),
      pm(4, 'Coordinator edits and', 'reviews the original SO.'),
    ], { gapBefore: GAP_IN })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 12, z: 1.1, tid: 'h1' }, { f: 26, z: 1.1, tid: 'h1' },
    { f: 52, z: 1.14, tid: 'w1', fx: 355, sy: 0.5 }, { f: 130, z: 1.14, tid: 'w1', fx: 355, sy: 0.5 },
    { f: 150, z: 1.06, tid: 'r1', sy: 0.5 }, { f: 172, z: 1.08, tid: 'tot', fx: 290, sy: 0.48 }, { f: 264, z: 1.08, tid: 'tot', fx: 290, sy: 0.48 },
    { f: 284, z: 1.0 }, { f: 300, z: 1.0 },
    { f: 306, z: 1.14, tid: 'n1', fx: 355, sy: 0.5 }, { f: 346, z: 1.14, tid: 'n1', fx: 355, sy: 0.5 },
    { f: 356, z: 1.08, tid: 'r2', sy: 0.5 }, { f: 380, z: Z, tid: 'ai', sy: 0.46 }, { f: 424, z: Z, tid: 'ai', sy: 0.46 },
    { f: 440, z: 1.14, tid: 'r3', sy: 0.55 }, { f: 462, z: Z, tid: 'r3', sy: 0.5 }, { f: 550, z: Z, tid: 'r3', sy: 0.5 }, { f: 590, z: 1.1, tid: 'r3', sy: 0.5 },
  ],
};
export const a7Hook: SceneSpec = {
  id: 'a7_hook', frames: 140, clock: '14:20',
  types: [],
  rows: [
    hist('Today'),
    a7Ctx(),
    a7Weights(56, 76),
  ],
  cam: [{ f: 0, z: 1.14, tid: 'h1', sy: 0.5 }, { f: 40, z: 1.14, tid: 'h1', sy: 0.5 }, { f: 66, z: 1.14, tid: 'w1', fx: 355, sy: 0.5 }, { f: 140, z: 1.2, tid: 'w1', fx: 355, sy: 0.5 }],
};

// ======================= A2  quotation =======================
const a2Pdf = pdf('Quote_Hotel_Melaka.pdf', '1 page • 64 kB • PDF');
const a2Prompt = (at: number, id = 'u1'): any => ({ kind: 'msg', id, at, fly: true, readAt: at + 28, m: M(id, me('11:15', [
  p('Prepare a quotation for Hotel', 'Seri Melaka Banquet:'),
  pm(6, 'Tomato Grade A — 30 kg'),
  p('Frozen prawns, medium — 5 ctn.'),
], { tail: true })) });
export const a2Demo: SceneSpec = {
  id: 'a2_demo', frames: 600, clock: '11:15', clocks: [[150, '11:16'], [330, '11:17']],
  types: [{ text: 'Show quotation PDF', start: 262, send: 298, rate: 2 }],
  rows: [
    hist('Today'),
    a2Prompt(14),
    { kind: 'typing', id: 't1', at: 44, end: 92 },
    { kind: 'msg', id: 'd1', at: 92, m: M('d1', maia('11:16', [
      p(L(e('📝'), ' ', b('Quotation draft ready'))),
      p('for review.'),
      pm(8, L(hl('Hotel Seri Melaka Banquet', 'hn', 110, 'ok'))),
      lim(8, '30 kg Tomato Grade A'),
      li('5 ctn Frozen prawns, medium'),
      pm(10, L(hl('Please check the maintained', 'pc', 130, 'ok'))),
      p(L(hl('prices and details.', 'pc2', 130, 'ok'))),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'u2', at: 298, fly: true, readAt: 322, m: M('u2', me('11:17', [p('Show quotation PDF')], { tail: true, gapBefore: GAP })) },
    { kind: 'typing', id: 't2', at: 306, end: 342 },
    { kind: 'msg', id: 'd2', at: 342, m: M('d2', maia('11:17', [p('Quotation_Hotel_Seri_Melaka')], { tail: true, gapBefore: GAP, pdf: a2Pdf }) as any) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 16, z: 1.12, tid: 'u1', fx: 350, sy: 0.5 }, { f: 40, z: 1.12, tid: 'u1', fx: 350, sy: 0.5 },
    { f: 96, z: 1.06, tid: 'd1', sy: 0.5 }, { f: 120, z: Z, tid: 'hn', sy: 0.4 }, { f: 160, z: Z, tid: 'hn', sy: 0.4 },
    { f: 176, z: Z, tid: 'pc', sy: 0.5 }, { f: 250, z: Z, tid: 'pc', sy: 0.5 },
    { f: 262, z: 1.1, ...COMP }, { f: 298, z: 1.1, ...COMP }, { f: 316, z: 1.0 },
    { f: 346, z: 1.1, tid: 'd2' }, { f: 372, z: Z, tid: 'd2', sy: 0.5 }, { f: 480, z: Z, tid: 'd2', sy: 0.5 }, { f: 600, z: 1.1, tid: 'd2', sy: 0.5 },
  ],
};
export const a2Hook: SceneSpec = {
  id: 'a2_hook', frames: 140, clock: '11:14',
  types: [],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'f1', at: 12, fly: true, m: M('f1', me('11:14', [p('Hotel Seri Melaka: boleh quote', 'tomato gred A 30 kg + udang', 'medium 5 ctn? tq')], { tail: true, forwarded: true })) },
    { kind: 'typing', id: 't1', at: 400, end: 500 },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 14, z: 1.1, tid: 'f1', fx: 340, sy: 0.45 }, { f: 140, z: 1.2, tid: 'f1', fx: 340, sy: 0.45 }],
};

// ======================= A4  stock across warehouses =======================
const a4Reply = (id: string, t: string, loc: string, n: number, at: number, tid: string): any => ({ kind: 'msg', id, at, m: M(id, maia(t, [
  p(L(b('Frozen prawns, medium'))),
  pm(10, `${loc} recorded balance:`),
  p(L(hl(`${n} cartons`, tid, at + 18, 'ok'))),
], { tail: true, gapBefore: GAP })) });
export const a4Demo: SceneSpec = {
  id: 'a4_demo', frames: 520, clock: '15:40', clocks: [[290, '15:41']],
  types: [{ text: 'Prawns medium at HQ?', start: 6, send: 50, rate: 2.2 }, { text: 'Branch B pulak?', start: 212, send: 244, rate: 2.2 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'q1', at: 50, fly: true, readAt: 76, m: M('q1', me('15:40', [p('Prawns medium at HQ?')], { tail: true })) },
    { kind: 'typing', id: 't1', at: 58, end: 96 },
    a4Reply('r1', '15:40', 'HQ', 18, 96, 's1'),
    { kind: 'msg', id: 'q2', at: 244, fly: true, readAt: 270, m: M('q2', me('15:41', [p('Branch B pulak?')], { tail: true, gapBefore: GAP })) },
    { kind: 'typing', id: 't2', at: 252, end: 290 },
    a4Reply('r2', '15:41', 'Branch B', 12, 290, 's2'),
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 8, z: 1.14, ...COMP }, { f: 48, z: 1.14, ...COMP }, { f: 64, z: 1.04 },
    { f: 98, z: 1.1, tid: 'r1' }, { f: 120, z: Z, tid: 's1', sy: 0.42 }, { f: 204, z: Z, tid: 's1', sy: 0.42 },
    { f: 214, z: 1.14, ...COMP }, { f: 242, z: 1.14, ...COMP }, { f: 258, z: 1.04 },
    { f: 292, z: 1.1, tid: 'r2' }, { f: 314, z: Z, tid: 's2', sy: 0.42 }, { f: 410, z: Z, tid: 's2', sy: 0.42 },
    { f: 450, z: 1.0 }, { f: 520, z: 1.0 },
  ],
};
export const a4Hook: SceneSpec = {
  id: 'a4_hook', frames: 135, clock: '15:40',
  types: [{ text: 'Prawns medium at HQ?', start: 8, send: 62, rate: 2.4 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'q1', at: 62, fly: true, readAt: 90, m: M('q1', me('15:40', [p('Prawns medium at HQ?')], { tail: true })) },
    { kind: 'typing', id: 't1', at: 72, end: 400 },
  ],
  cam: [{ f: 0, z: 1.3, ...COMP }, { f: 60, z: 1.3, ...COMP }, { f: 90, z: 1.14, tid: 'q1', sy: 0.5 }, { f: 135, z: 1.1, tid: 'q1', sy: 0.5 }],
};
