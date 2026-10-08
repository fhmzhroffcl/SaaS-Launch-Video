import React from 'react';
import { LINES, fmt } from './OrderTable';
import { clamp, prog, easeOut } from './u';

export const MAN_W = 900, MAN_H = 1240;
const F = 'Inter, sans-serif';
const TABS = [{ n: 'Quotation', t: 'New quotation' }, { n: 'Sales Order', t: 'New sales order' }, { n: 'Invoice', t: 'New invoice' }];
const CUST = 'Dapur Mak Long Catering', DEL = '07/10/2026';

/** staff retyping the same order by hand into three different forms. tabs[k] = [start,end] frames of typing. */
export const ManualCard: React.FC<{ f: number; tabs: [number, number][] }> = ({ f, tabs }) => {
  let k = 0;
  tabs.forEach((t, i) => { if (f >= t[0] - 4) k = i; });
  const [a, b] = tabs[k];
  const p = clamp((f - a) / (b - a));
  const cells: string[] = [CUST, DEL];
  LINES.forEach((l) => cells.push(l.sku, l.name, `${l.qty} ${l.uom}`, fmt(l.price)));
  cells.push('RM ' + fmt(LINES.reduce((s, l) => s + l.total, 0)));
  const total = cells.reduce((s, c) => s + c.length + 2, 0);
  let acc = 0, caret: [number, number] | null = null;
  const typed = cells.map((c, i) => {
    const n = clamp(Math.floor(p * total - acc), 0, c.length);
    const active = p * total - acc >= 0 && p * total - acc < c.length + 2 && p < 1;
    acc += c.length + 2;
    return { s: c.slice(0, n), active };
  });
  const flip = prog(f, a - 4, 10);
  const blink = Math.floor(f / 8) % 2 === 0;
  const Cell: React.FC<{ i: number; w: number; bold?: boolean; align?: 'right' }> = ({ i, w, bold, align }) => (
    <div style={{ width: w, fontSize: 29, lineHeight: '44px', fontWeight: bold ? 700 : 500, whiteSpace: 'nowrap', textAlign: align, fontVariantNumeric: 'tabular-nums', color: '#16161A', paddingRight: 10, overflow: 'hidden' }}>
      {typed[i].s}{typed[i].active && blink ? <span style={{ display: 'inline-block', width: 3, height: 32, background: '#EE9A00', verticalAlign: 'middle', marginLeft: 2 }} /> : null}
    </div>
  );
  return (
    <div style={{ width: MAN_W, height: MAN_H, borderRadius: 48, background: '#F2F2F5', overflow: 'hidden', position: 'relative', fontFamily: F, boxShadow: '0 60px 120px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.08)' }}>
      <div style={{ height: 96, background: '#26262D', display: 'flex', alignItems: 'flex-end', padding: '0 28px', gap: 10 }}>
        {TABS.map((t, i) => (
          <div key={t.n} style={{ height: 66, padding: '0 26px', borderRadius: '20px 20px 0 0', display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700, background: i === k ? '#F2F2F5' : 'rgba(255,255,255,.08)', color: i === k ? '#16161A' : '#B9B9C6' }}>{t.n}</div>
        ))}
      </div>
      <div style={{ padding: '30px 40px 0', opacity: 0.4 + 0.6 * flip }}>
        <div style={{ fontSize: 44, fontWeight: 800, lineHeight: '52px' }}>{TABS[k].t}</div>
        {[['Customer', 0], ['Delivery date', 1]].map(([lab, i]) => (
          <div key={lab as string} style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 230, fontSize: 28, fontWeight: 600, color: '#6B6F76' }}>{lab}</div>
            <div style={{ flex: 1, height: 64, borderRadius: 14, background: '#fff', border: `3px solid ${typed[i as number].active ? '#EE9A00' : '#DADAE2'}`, padding: '10px 18px' }}><Cell i={i as number} w={500} bold /></div>
          </div>
        ))}
        <div style={{ marginTop: 30, display: 'flex', height: 52, alignItems: 'center', fontSize: 25, fontWeight: 700, color: '#6B6F76', borderBottom: '3px solid #DADAE2', paddingLeft: 10 }}>
          <div style={{ width: 200 }}>CODE</div><div style={{ width: 300 }}>ITEM</div><div style={{ width: 150 }}>QTY</div><div>PRICE</div>
        </div>
        {LINES.map((_, r) => (
          <div key={r} style={{ display: 'flex', height: 80, alignItems: 'center', borderBottom: '2px solid #E4E4EA', paddingLeft: 10 }}>
            <Cell i={2 + r * 4} w={200} /><Cell i={3 + r * 4} w={300} bold /><Cell i={4 + r * 4} w={150} /><Cell i={5 + r * 4} w={150} />
          </div>
        ))}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#6B6F76' }}>Total</div>
          <div style={{ minWidth: 330, height: 80, borderRadius: 16, background: '#fff', border: `3px solid ${typed[26].active ? '#EE9A00' : '#DADAE2'}`, padding: '14px 18px' }}><Cell i={26} w={300} bold align="right" /></div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 90, background: '#E4E4EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 700, color: '#3C3F46' }}>Typing it in by hand…</div>
    </div>
  );
};
