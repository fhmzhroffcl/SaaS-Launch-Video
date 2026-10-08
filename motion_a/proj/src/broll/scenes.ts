import { SceneSpec } from './Scene';
import { me, maia, p, pm, li, lim, c, b, e, L, pdf, GAP, GAP_IN } from '../data/helpers';
import { Message } from '../chat/types';

const hl = (text: string, tid: string, at: number, tone?: any) => ({ hl: text, tid, at, tone });
const M = (id: string, m: Message) => ({ ...m, id });
const hist = (label: string) => ({ kind: 'date' as const, id: 'd-' + label, label });

// ---------- 1. wa_price_flag (10 s) ----------
export const priceFlag: SceneSpec = {
  id: 'wa_price_flag', frames: 300, clock: '9:41',
  clocks: [[100, '9:42'], [146, '9:42']],
  types: [{ text: 'tolong process ni', start: 26, send: 66 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'a1', at: 10, m: M('a1', me('09:41', [p(
      'Dapur Mak Long: boss order sama',
      'macam last week ye. Kobis, lobak,',
      'bawang. Hantar Khamis pagi ' + '🙏',
    )], { tail: true, forwarded: true })) },
    { kind: 'msg', id: 'a2', at: 66, fly: true, readAt: 96, m: M('a2', me('09:41', [p('tolong process ni')], { gapBefore: GAP_IN })) },
    { kind: 'typing', id: 't1', at: 72, end: 100 },
    { kind: 'msg', id: 'a3', at: 100, m: M('a3', maia('09:42', [
      p(L(e('📄'), ' ', b('Draft order — '), c('SO-2026-00327'))),
      p('Dapur Mak Long Catering'),
      lim(8, '300 kg Kobis Bulat @ RM 5.00'),
      li('80 kg Lobak Merah @ RM 3.20'),
      li('50 kg Bawang Holland @ RM 4.60'),
      li(L('Total: ', b('RM 1,986.00'))),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'typing', id: 't2', at: 124, end: 146 },
    { kind: 'msg', id: 'a4', at: 146, buttons: { labels: ['Update to RM5.50', 'Keep RM5.00'], at: 164, press: { i: 0, at: 238 } }, m: M('a4', maia('09:42', [
      p(L(e('⚠️'), ' ', b('Price mismatch — Kobis Bulat'))),
      pm(6, L(hl('RM5.00 vs approved RM5.50', 'flag', 160))),
      p('(Dapur Mak Long Catering)'),
      pm(8, L('300 kg × RM0.50 = ', b('RM150.00'))),
      p('Update to RM5.50 or keep?'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'a5', at: 256, m: M('a5', maia('09:43', [
      p(L(e('✅'), ' ', b('Updated — '), c('SO-2026-00327'))),
      lim(8, 'Kobis Bulat now RM 5.50'),
      li(L('Total: ', hl('RM 2,136.00', 'ok', 262, 'ok'))),
    ], { tail: true, gapBefore: GAP })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 100, z: 1.1, tid: 'a1' }, { f: 140, z: 1.18, tid: 'a3' },
    { f: 156, z: 1.18, tid: 'a4' }, { f: 186, z: 1.26, tid: 'flag', sy: 0.42 }, { f: 228, z: 1.26, tid: 'flag', sy: 0.42 },
    { f: 250, z: 1.22, tid: 'a4', sy: 0.6 }, { f: 266, z: 1.26, tid: 'a5', sy: 0.55 }, { f: 300, z: 1.26, tid: 'a5', sy: 0.55 },
  ],
};

// ---------- 2. wa_addon_order (10 s) ----------
export const addon: SceneSpec = {
  id: 'wa_addon_order', frames: 300, clock: '10:15',
  clocks: [[118, '10:16']],
  types: [{ text: 'add on SO Pak Din ye', start: 30, send: 74 }],
  rows: [
    hist('Mon, 28 Sep'),
    { kind: 'msg', id: 'h1', m: M('h1', me('15:20', [p('SO Pak Din: ayam whole 20 ekor, minyak 5kg 4 ctn')].map((x) => ({ ...x, lines: [['SO Pak Din: ayam whole 20 ekor,'], ['minyak masak 5kg 4 ctn']] }) as any), { tail: true })) },
    { kind: 'msg', id: 'h2', m: M('h2', maia('15:21', [
      p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00320'))),
      p('Nasi Ayam Pak Din Enterprise'),
      lim(8, '20 ekor Ayam Whole @ RM 11.50'),
      li('4 ctn Minyak 5kg @ RM 118.00'),
      li(L('Total: ', b('RM 702.00'))),
    ], { tail: true, gapBefore: GAP })) },
    hist('Tuesday'),
    { kind: 'msg', id: 'a1', at: 10, m: M('a1', me('10:15', [p(
      'Pak Din: bos tambah 2 ctn Sos Cili',
      '+ 10kg Udang utk esok boleh? tq',
    )], { tail: true, forwarded: true })) },
    { kind: 'msg', id: 'a2', at: 74, fly: true, readAt: 100, m: M('a2', me('10:16', [p('add on SO Pak Din ye')], { gapBefore: GAP_IN })) },
    { kind: 'typing', id: 't1', at: 80, end: 118 },
    { kind: 'msg', id: 'a3', at: 118, buttons: undefined, m: M('a3', maia('10:16', [
      p(L(e('📎'), ' ', b('2 lines added — '), c('SO-2026-00320'))),
      lim(8, '2 ctn Sos Cili @ RM 48.00'),
      li('10 kg Udang 31/40 @ RM 38.00'),
      pm(8, L('Status: ', b('To Bill and Deliver'))),
      pm(4, L('Total: RM 702.00 → ', hl('RM 1,178.00', 'tot', 150, 'ok'))),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'a4', at: 208, m: M('a4', maia('10:16', [p(L(e('✅'), ' SO updated. Updated PDF sent.'))], { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00320.pdf') })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 90, z: 1.08, tid: 'a1' }, { f: 118, z: 1.2, tid: 'a3' }, { f: 140, z: 1.26, tid: 'a3' },
    { f: 168, z: 1.26, tid: 'tot', sy: 0.45 }, { f: 205, z: 1.26, tid: 'tot', sy: 0.45 }, { f: 230, z: 1.22, tid: 'a4', sy: 0.55 }, { f: 300, z: 1.22, tid: 'a4', sy: 0.55 },
  ],
};

// ---------- 3. wa_stock_block (two phones, 10 s) ----------
export const stockA: SceneSpec = {
  id: 'wa_stock_a', frames: 135, clock: '9:05', chip: 'HAFIZ · SALES A',
  types: [{ text: 'SO Pak Din: 1,000 ctn Ayam Whole', start: 4, send: 56, rate: 1.5 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'a1', at: 56, fly: true, readAt: 74, m: M('a1', me('09:05', [p('SO Pak Din: 1,000 ctn Ayam Whole')], { tail: true })) },
    { kind: 'typing', id: 't1', at: 60, end: 80 },
    { kind: 'msg', id: 'a2', at: 80, m: M('a2', maia('09:05', [
      p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00318'))),
      p('Nasi Ayam Pak Din Enterprise'),
      lim(8, '1,000 ctn Ayam Whole 1.2kg'),
      pm(8, L('Stock 2,000 → ', b('1,000 blocked'))),
      li(L(hl('Available: 1,000 ctn', 'avail', 98, 'ok'))),
    ], { tail: true, gapBefore: GAP })) },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 56, z: 1.06 }, { f: 84, z: 1.1, tid: 'a2' }, { f: 110, z: 1.18, tid: 'avail', sy: 0.5 }, { f: 135, z: 1.18, tid: 'avail', sy: 0.5 }],
};
export const stockB: SceneSpec = {
  id: 'wa_stock_b', frames: 180, clock: '9:12', chip: 'KUMAR · SALES B',
  types: [{ text: 'SO Selera: 1,500 ctn Ayam Whole', start: 4, send: 54, rate: 1.5 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'a1', at: 54, fly: true, readAt: 70, m: M('a1', me('09:12', [p('SO Selera: 1,500 ctn Ayam Whole')], { tail: true })) },
    { kind: 'typing', id: 't1', at: 58, end: 80 },
    { kind: 'msg', id: 'a2', at: 80, buttons: { labels: ['Offer alternative', 'Reserve 1,000', 'Notify Hafiz'], at: 112 }, m: M('a2', maia('09:12', [
      p(L(e('⛔'), ' ', b('Stock tak cukup'))),
      pm(6, L('Ayam Whole 1.2kg: ', b('1,500 ctn'), '')),
      pm(6, L(hl('Only 1,000 available', 'alert', 96))),
      p("1,000 blocked by Hafiz's", L('SO-2026-00318')),
    ], { tail: true, gapBefore: GAP })) },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 54, z: 1.06 }, { f: 84, z: 1.18, tid: 'a2' }, { f: 106, z: 1.26, tid: 'alert', sy: 0.42 }, { f: 140, z: 1.26, tid: 'alert', sy: 0.42 }, { f: 170, z: 1.22, tid: 'a2', sy: 0.62 }, { f: 180, z: 1.22, tid: 'a2', sy: 0.62 }],
};

// ---------- 4. wa_order_in (8 s) ----------
export const orderIn: SceneSpec = {
  id: 'wa_order_in', frames: 240, clock: '8:47',
  clocks: [[96, '8:48']],
  types: [{ text: 'buat SO utk Selera', start: 24, send: 62 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'a1', at: 8, m: M('a1', me('08:47', [p(
      'Selera: bos mcm biasa. isi ayam',
      'beku 200kg, ayam whole 50 ctn,',
      'udang 31/40 30kg. hantar Rabu 7am',
    )], { tail: true, forwarded: true })) },
    { kind: 'msg', id: 'a2', at: 62, fly: true, readAt: 86, m: M('a2', me('08:48', [p('buat SO utk Selera')], { gapBefore: GAP_IN })) },
    { kind: 'typing', id: 't1', at: 68, end: 96 },
    { kind: 'msg', id: 'a3', at: 96, m: M('a3', maia('08:48', [
      p(L(e('📄'), ' ', b('Order created — '), c('SO-2026-00331'))),
      p('Selera Kampung Central Kitchen'),
      lim(8, '200 kg Isi Ayam Beku @ RM 11.80'),
      li('50 ctn Ayam Whole @ RM 138.00'),
      li('30 kg Udang 31/40 @ RM 38.00'),
      li(L('Total: ', hl('RM 10,400.00', 'tot', 130, 'ok'))),
      li('Delivery: Wed 30 Sep, 7:00 AM'),
    ], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'a4', at: 172, m: M('a4', maia('08:48', [p(L(e('✅'), ' SO sent. Also synced into'), 'SQL Account.')], { gapBefore: GAP_IN, pdf: pdf('Sales_Order_SO-2026-00331.pdf') })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 62, z: 1.06, tid: 'a1', fx: 331 }, { f: 100, z: 1.22, tid: 'a3' }, { f: 124, z: 1.08, tid: 'a3', fx: 331, sy: 0.5 },
    { f: 144, z: 1.08, tid: 'tot', fx: 331, sy: 0.45 }, { f: 168, z: 1.08, tid: 'tot', fx: 331, sy: 0.45 }, { f: 190, z: 1.22, tid: 'a4', sy: 0.6 }, { f: 240, z: 1.08, tid: 'a4', fx: 331, sy: 0.6 },
  ],
};

// ---------- 5. wa_price_update (8 s) ----------
export const priceUpdate: SceneSpec = {
  id: 'wa_price_update', frames: 240, clock: '4:02',
  clocks: [[110, '4:03']],
  types: [{ text: 'Kemaskini harga hari ini:', start: 18, send: 74 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'a1', at: 74, fly: true, readAt: 96, m: M('a1', me('04:02', [p(
      'Kemaskini harga hari ini:',
      L(hl('Kobis Bulat RM5.50/kg', 'k', 98, 'dark')),
      'Lobak Merah RM3.40/kg',
      'Ayam Whole 1.2kg RM138/ctn',
    )], { tail: true })) },
    { kind: 'typing', id: 't1', at: 82, end: 112 },
    { kind: 'msg', id: 'a2', at: 112, m: M('a2', maia('04:03', [
      p(L(e('✅'), ' ', b('Harga dikemaskini (3 item)'))),
      lim(8, 'Kobis Bulat: RM5.00 → RM5.50/kg'),
      li('Lobak Merah: RM3.20 → RM3.40/kg'),
      li('Ayam Whole: RM135 → RM138/ctn'),
      pm(8, 'Applied to Hafiz, Kumar & Aina'),
      p(L('Sofea ', e('✔'))),
    ], { tail: true, gapBefore: GAP })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 74, z: 1.1 }, { f: 100, z: 1.26, tid: 'k', fx: 360, sy: 0.45 }, { f: 130, z: 1.26, tid: 'k', fx: 360, sy: 0.45 },
    { f: 150, z: 1.22, tid: 'a2', sy: 0.5 }, { f: 190, z: 1.26, tid: 'a2', sy: 0.5 }, { f: 240, z: 1.26, tid: 'a2', sy: 0.5 },
  ],
};

// ================= Round 2 =================
const avatar = (txt: string, col: string) =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="134" height="134"><rect width="134" height="134" fill="${col}"/><text x="67" y="88" font-family="Arial" font-size="58" font-weight="700" fill="#fff" text-anchor="middle">${txt}</text></svg>`);
const th = (text: string, tid: string, at: number, tone: any = 'bad') => hl(text, tid, at, tone);
const cu = (t: string, lines: string[], x: Partial<Message> = {}) => maia(t, [p(...lines)], { tail: true, ...x });
const ad = (t: string, blocks: any, x: Partial<Message> = {}) => me(t, blocks, x);

export const painMistakes: SceneSpec = {
  id: 'wa_pain_mistakes', frames: 560, clock: '8:15', title: 'Dapur Mak Long Catering', avatar: avatar('DM', '#8A6A3B'),
  clocks: [[120, '8:44'], [300, '9:30'], [346, '7:20'], [470, '7:41']],
  types: [{ text: 'ok boss noted', start: 90, send: 118 }],
  rows: [
    hist('Mon, 28 Sep'),
    { kind: 'msg', id: 'c1', at: 14, m: M('c1', cu('08:15', ['Morning Aina, order utk Khamis ye'])) },
    { kind: 'msg', id: 'c2', at: 40, m: M('c2', cu('08:15', ['kobis bulat 300kg'], { gapBefore: GAP_IN, tail: false })) },
    { kind: 'msg', id: 'c3', at: 62, m: M('c3', cu('08:16', ['lobak merah 80kg'], { gapBefore: GAP_IN, tail: false })) },
    { kind: 'msg', id: 'c4', at: 84, m: M('c4', cu('08:17', ['bawang holland 50kg', 'hantar pagi tau 🙏'], { gapBefore: GAP_IN, tail: false })) },
    { kind: 'msg', id: 'm1', at: 118, fly: true, m: M('m1', ad('08:41', [p('ok boss noted')], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'm2', at: 152, m: M('m2', ad('08:44', [
      p(L(e('✅'), ' Confirm boss, order Khamis:')),
      lim(8, L('Kobis 300kg @ ', th('RM5.00', 'bad1', 190, 'badd'))),
      li('Lobak Merah 80kg @ RM3.20'),
      li(L('Bawang ', th('15kg', 'bad2', 205, 'badd'), ' @ RM4.60')),
      li('Total RM1,986'),
    ], { gapBefore: GAP_IN })) },
    { kind: 'msg', id: 'c6', at: 318, m: M('c6', cu('09:30', ['Aina tambah 2 ctn sos cili', '+ 20kg tomato ye'], { gapBefore: GAP })) },
    { kind: 'date', id: 'd2', label: 'Thu, 1 Oct', at: 340 },
    { kind: 'msg', id: 'c7', at: 352, m: M('c7', cu('07:20', ['lori dah sampai tapi', 'barang tak lengkap!'], {})) },
    { kind: 'msg', id: 'c8', at: 378, m: M('c8', cu('07:21', [], { gapBefore: GAP_IN, tail: false, })) },
    { kind: 'msg', id: 'c9', at: 420, m: M('c9', cu('07:22', ['bawang pun 15kg je', 'saya order 50kg!!'], { gapBefore: GAP_IN, tail: false })) },
    { kind: 'msg', id: 'm3', at: 475, m: M('m3', ad('07:41', [p(L('sorry boss ', th('lupa', 'lupa', 482, 'badd'), ' 🙏'))], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'c10', at: 520, m: M('c10', cu('07:42', ['dah 3 hari saya tunggu Aina 😤'], { gapBefore: GAP })) },
  ],
  cam: [
    { f: 0, z: 1.0 }, { f: 80, z: 1.08, tid: 'c3' }, { f: 140, z: 1.1, tid: 'm1' }, { f: 185, z: 1.3, tid: 'm2' }, { f: 300, z: 1.3, tid: 'm2' },
    { f: 345, z: 1.1, tid: 'c6' }, { f: 395, z: 1.28, tid: 'c8' }, { f: 440, z: 1.28, tid: 'c9' }, { f: 490, z: 1.28, tid: 'm3' }, { f: 560, z: 1.3, tid: 'm3' },
  ],
};
// c8 text carries a highlight
(painMistakes.rows.find((r: any) => r.id === 'c8') as any).m.blocks = [p(L(th('mana barang tambahan saya??', 'c8t', 392, 'bad')), 'sos cili tomato takde!')];

const wh = avatar('GD', '#3B6E8A');
export const painStockA: SceneSpec = {
  id: 'ps_a', frames: 125, clock: '7:55', title: 'Gudang FreezeFood', avatar: wh, chip: 'GUDANG',
  types: [], rows: [
    hist('Today'),
    { kind: 'msg', id: 'w1', at: 12, m: M('w1', cu('07:55', ['Bos, stok hari ni:'])) },
    { kind: 'msg', id: 'w2', at: 34, m: M('w2', cu('07:55', ['Ayam Whole 1.2kg =', th('2,000 ctn je', 'stk', 60, 'warn')].map((x, i) => i ? L(x as any) : x as any), { gapBefore: GAP_IN, tail: false })) },
    { kind: 'msg', id: 'w3', at: 70, m: M('w3', cu('07:56', ['tu je tau, jgn over jual'], { gapBefore: GAP_IN, tail: false })) },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 40, z: 1.08, tid: 'w1' }, { f: 70, z: 1.3, tid: 'stk' }, { f: 125, z: 1.3, tid: 'stk' }],
};
export const painStockB: SceneSpec = {
  id: 'ps_b', frames: 170, clock: '9:05', title: 'Nasi Ayam Pak Din', avatar: avatar('PD', '#B5651D'), chip: 'HAFIZ · SALES A',
  types: [{ text: 'boleh bos 1,000 ctn', start: 40, send: 80 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'p1', at: 10, m: M('p1', cu('09:05', ['Hafiz, ada ayam whole 1.2kg', '1,000 ctn tak? utk Sabtu'])) },
    { kind: 'msg', id: 'p2', at: 80, fly: true, readAt: 100, m: M('p2', ad('09:06', [p(L(th('boleh bos 1,000 ctn', 'h1', 92, 'badd')))], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'p3', at: 122, m: M('p3', cu('09:06', ['ok confirm 👍 tq Hafiz'], { gapBefore: GAP })) },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 30, z: 1.08, tid: 'p1' }, { f: 85, z: 1.3, tid: 'h1' }, { f: 170, z: 1.3, tid: 'h1' }],
};
export const painStockC: SceneSpec = {
  id: 'ps_c', frames: 170, clock: '9:12', title: 'Selera Kampung', avatar: avatar('SK', '#4B7F52'), chip: 'KUMAR · SALES B',
  types: [{ text: 'ok 1,500 ctn confirm', start: 40, send: 82 }],
  rows: [
    hist('Today'),
    { kind: 'msg', id: 'q1', at: 10, m: M('q1', cu('09:12', ['Kumar, minggu ni saya nak', '1,500 ctn ayam whole ye'])) },
    { kind: 'msg', id: 'q2', at: 82, fly: true, readAt: 102, m: M('q2', ad('09:13', [p(L(th('ok 1,500 ctn confirm', 'k1', 94, 'badd')))], { tail: true, gapBefore: GAP })) },
    { kind: 'msg', id: 'q3', at: 124, m: M('q3', cu('09:13', ['tq Kumar 🙏 hantar Sabtu'], { gapBefore: GAP })) },
  ],
  cam: [{ f: 0, z: 1.0 }, { f: 30, z: 1.08, tid: 'q1' }, { f: 88, z: 1.3, tid: 'k1' }, { f: 170, z: 1.3, tid: 'k1' }],
};

// ---- time-warp for long variants ----
export const longify = (spec: SceneSpec, k: number, id: string, holdMin = 105): SceneSpec => {
  const holds: [number, number, number][] = [];
  const cam = spec.cam;
  for (let i = 0; i < cam.length - 1; i++) {
    const a = cam[i], b = cam[i + 1];
    if (a.tid && a.tid === b.tid && a.z === b.z && b.f - a.f > 8) holds.push([a.f, b.f, Math.min(4, Math.max(k, holdMin / (b.f - a.f)))]);
  }
  const W = (f: number): number => {
    let out = 0, cur = 0;
    for (const [a, b, kk] of holds) {
      if (f <= a) break;
      out += (a - cur) * k; cur = a;
      const e = Math.min(f, b);
      out += (e - cur) * kk; cur = e;
      if (f <= b) return Math.round(out);
    }
    return Math.round(out + (f - cur) * k);
  };
  const walk = (o: any): any => {
    if (Array.isArray(o)) return o.map(walk);
    if (o && typeof o === 'object') {
      const r: any = {};
      for (const key of Object.keys(o)) r[key] = walk(o[key]);
      if (typeof o.hl === 'string' && typeof o.at === 'number') r.at = W(o.at);
      if (typeof r.kind === 'string' && r.kind !== 'date') {
        for (const f of ['at', 'end', 'readAt']) if (typeof o[f] === 'number') r[f] = W(o[f]);
      }
      if (o.labels && typeof o.at === 'number') { r.at = W(o.at); if (o.press) r.press = { ...o.press, at: W(o.press.at) }; }
      return r;
    }
    return o;
  };
  const rows = walk(spec.rows);
  return {
    ...spec, id, frames: W(spec.frames) + 20, rows,
    types: spec.types.map((t) => ({ ...t, start: W(t.start), send: W(t.send), rate: (t.rate ?? 2) * k })),
    cam: spec.cam.map((c) => ({ ...c, f: W(c.f) })),
    clocks: spec.clocks?.map(([f, c]) => [W(f), c] as [number, string]),
  };
};
