import React from 'react';
import { clamp, prog, pop, easeOut, easeIO, lerp } from './u';

export const TW = 1000, TH = 1300;
export const ROW0 = 236, ROWH = 148;
export type OLine = { sku: string; name: string; messy: string; qty: number; uom: string; price: number; total: number; ambig?: boolean };
export const LINES: OLine[] = [
  { sku: 'FF-CHK-110', name: 'Isi Ayam Beku 1kg', messy: 'ayam fillet 30kg', qty: 30, uom: 'KG', price: 14.5, total: 435 },
  { sku: 'FF-CHK-010', name: 'Ayam Whole 1.2kg', messy: 'ayam whole 20 ekor', qty: 20, uom: 'EKOR', price: 11.5, total: 230 },
  { sku: 'FF-NDL-020', name: 'Mee Kuning 500g', messy: 'mee kuning small one 10', qty: 10, uom: 'PKT', price: 3.8, total: 38 },
  { sku: 'FF-VEG-030', name: 'Kobis Bulat', messy: 'kobis 20kg', qty: 20, uom: 'KG', price: 2.8, total: 56 },
  { sku: 'FF-SEA-040', name: 'Udang 31/40 10kg', messy: 'udang 2 ctn', qty: 2, uom: 'CTN', price: 168, total: 336, ambig: true },
  { sku: 'FF-OIL-050', name: 'Minyak Masak 5kg', messy: 'minyak masak 5kg 6 tin', qty: 6, uom: 'TIN', price: 32.5, total: 195 },
];
export const fmt = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const F = 'Inter, sans-serif';
const GREEN = '#22A05A';

export const rowStart = (i: number, t0: number) => t0 + i * 28;

const Row: React.FC<{ f: number; i: number; s: number; off: [number, number]; l: OLine }> = ({ f, i, s, off, l }) => {
  const slot = prog(f, s - 30, 14);
  const fly = prog(f, s - 14, 16, easeIO);   // chip arrives
  const m = prog(f, s + 4, 14);              // morph chip -> clean row
  const tick = pop(f, s + 14, 11, 230);
  const amb = !!l.ambig;
  const ac = amb ? '#EE9A00' : GREEN;
  const H = ROWH - 14;
  const chipW = lerp(Math.min(760, 150 + l.messy.length * 21), TW - 56, m);
  const chipOpacity = clamp(prog(f, s - 14, 4));
  const pulse = amb ? 0.5 + 0.5 * Math.sin((f - s) / 6) : 0;
  return (
    <div style={{ position: 'absolute', left: 28, top: ROW0 + i * ROWH, width: TW - 56, height: H, opacity: slot }}>
      {/* empty slot */}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 26, border: '2px dashed rgba(255,255,255,.14)', opacity: 1 - m }} />
      {/* chip (messy -> clean container) */}
      <div style={{ position: 'absolute', left: 0, top: 0, height: H, width: chipW, borderRadius: lerp(H / 2, 26, m), opacity: chipOpacity,
        transform: `translate(${(1 - fly) * off[0]}px, ${(1 - fly) * off[1]}px) rotate(${(1 - fly) * -6}deg) scale(${1 + 0.1 * Math.sin(fly * Math.PI)})`,
        background: m < 0.5 ? `rgba(217,215,245,${0.16})` : `rgba(255,255,255,${0.07})`,
        border: `3px ${m > 0.5 ? 'solid' : 'dashed'} ${m > 0.6 ? (amb ? `rgba(238,154,0,${0.55 + 0.45 * pulse})` : 'rgba(255,255,255,.14)') : '#D9D7F5'}`,
        boxShadow: m > 0.6 && amb ? `0 0 ${30 * pulse}px rgba(238,154,0,.5)` : undefined, overflow: 'hidden' }}>
        {/* messy text */}
        <div style={{ position: 'absolute', left: 36, right: 24, top: 0, bottom: 0, display: 'flex', alignItems: 'center', fontFamily: F, fontSize: 38, fontWeight: 600, color: '#D9D7F5', whiteSpace: 'nowrap', opacity: 1 - clamp(m * 2.2), filter: `blur(${m * 6}px)` }}>{l.messy}</div>
        {/* clean content */}
        <div style={{ position: 'absolute', inset: 0, opacity: clamp((m - 0.35) / 0.5), transform: `translateX(${(1 - m) * 24}px)` }}>
          <div style={{ position: 'absolute', left: 26, top: H / 2 - 30, width: 60, height: 60, borderRadius: '50%', background: ac, transform: `scale(${tick})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 24px ${ac}88` }}>
            {amb ? <div style={{ fontFamily: F, fontWeight: 900, fontSize: 38, color: '#0B0B0D' }}>?</div> : <svg width="34" height="34" viewBox="0 0 18 18"><path d="M3 9.5 L7.2 13.5 L15 4.8" stroke="#0B0B0D" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </div>
          <div style={{ position: 'absolute', left: 112, top: 14, right: 250, fontFamily: F, color: '#fff' }}>
            <div style={{ fontSize: 36, fontWeight: 700, lineHeight: '44px', whiteSpace: 'nowrap' }}>{l.name}</div>
            <div style={{ fontSize: 28, fontWeight: 500, lineHeight: '38px', color: '#B9B9C6', whiteSpace: 'nowrap' }}>{l.sku}<span style={{ color: '#EE9A00', fontWeight: 700 }}>{'  ·  '}{l.qty} {l.uom}</span>{'  ×  RM '}{fmt(l.price)}</div>
          </div>
          <div style={{ position: 'absolute', right: 30, top: 14, textAlign: 'right', fontFamily: F, color: '#fff' }}>
            <div style={{ fontSize: 38, fontWeight: 800, lineHeight: '44px' }}>RM {fmt(l.total)}</div>
            {amb ? <div style={{ marginTop: 4, display: 'inline-block', fontSize: 24, fontWeight: 800, lineHeight: '34px', padding: '0 14px', borderRadius: 18, background: '#EE9A00', color: '#0B0B0D', whiteSpace: 'nowrap' }}>Needs your check</div> : <div style={{ fontSize: 24, fontWeight: 600, color: GREEN, lineHeight: '34px' }}>Price list</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

/** f = frame of the table's own timeline; t0 = first row start; off(i) = chip origin offset (table px) */
export const OrderTable: React.FC<{ f: number; t0: number; off: (i: number) => [number, number]; totalAt: number }> = ({ f, t0, off, totalAt }) => {
  const tt = prog(f, totalAt, 26, easeOut);
  const shown = LINES.reduce((s, l) => s + l.total, 0) * tt;
  const sumDone = f >= totalAt + 26;
  return (
    <div style={{ width: TW, height: TH, borderRadius: 56, background: 'linear-gradient(180deg,#1A1A20,#121216)', border: '2px solid rgba(255,255,255,.10)', boxShadow: '0 60px 120px rgba(0,0,0,.6)', position: 'relative', fontFamily: F, color: '#fff' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 5, borderRadius: '56px 56px 0 0', background: 'linear-gradient(90deg,#D9D7F5,#EE9A00)' }} />
      <div style={{ position: 'absolute', left: 44, top: 36, right: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 44, fontWeight: 800, lineHeight: '52px' }}>Draft order</div>
          <div style={{ fontSize: 26, fontWeight: 800, lineHeight: '38px', padding: '0 18px', borderRadius: 20, background: 'rgba(238,154,0,.16)', color: '#EE9A00', border: '2px solid rgba(238,154,0,.5)' }}>For review</div>
        </div>
        <div style={{ marginTop: 14, fontSize: 36, fontWeight: 700, lineHeight: '44px', color: '#D9D7F5' }}>Dapur Mak Long Catering</div>
        <div style={{ marginTop: 6, fontSize: 28, fontWeight: 500, lineHeight: '36px', color: '#B9B9C6' }}>Deliver Wed 7 Oct 2026  ·  Price list: Dapur Mak Long</div>
      </div>
      {LINES.map((l, i) => <Row key={i} f={f} i={i} s={rowStart(i, t0)} off={off(i)} l={l} />)}
      <div style={{ position: 'absolute', left: 28, right: 28, bottom: 24, height: 128, borderRadius: 30, background: 'rgba(217,215,245,.08)', border: '2px solid rgba(217,215,245,.2)', display: 'flex', alignItems: 'center', padding: '0 34px', opacity: prog(f, totalAt - 10, 14) }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>Total</div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#B9B9C6', lineHeight: '34px' }}>6 lines · <span style={{ color: '#EE9A00', fontWeight: 800 }}>1 needs your check</span></div>
        </div>
        <div style={{ fontSize: 56, fontWeight: 800, color: sumDone ? '#fff' : '#D9D7F5', fontVariantNumeric: 'tabular-nums' }}>RM {fmt(shown)}</div>
      </div>
    </div>
  );
};
