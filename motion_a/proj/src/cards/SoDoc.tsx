import React from 'react';
import { STORY, rm } from '../data/story';

// Sales Order as issued in scene 1 (rev 1: 10 bag beras) — used for the in-phone PDF page and the pop-out card.
const ITEMS = STORY.items.map((it) => (it.sku === 'BRS-FZ10' ? { ...it, qty: 10 } : it));
const money = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const TOTAL = ITEMS.reduce((s, i) => s + i.qty * i.price, 0); // 2,871.40

export const SO_W = 600, SO_H = 640;
export const SoDoc: React.FC<{ width: number }> = ({ width }) => {
  const k = width / SO_W;
  return (
    <div style={{ width, height: SO_H * k, position: 'relative' }}>
      <div className="sod" style={{ transform: `scale(${k})` }}>
        <div className="sod-head">
          <div>
            <div className="sod-co">{STORY.distributor}</div>
            <div className="sod-co-sub">Lot 12, Jalan Utas 15/7, Shah Alam</div>
          </div>
          <div className="sod-no-wrap">
            <div className="sod-label">SALES ORDER</div>
            <div className="sod-no">{STORY.so}</div>
          </div>
        </div>
        <div className="sod-cols">
          <div>
            <div className="sod-k">Bill to</div>
            <div className="sod-v"><b>{STORY.customer}</b></div>
            <div className="sod-v dim">No. 18, Jalan SS 15/4B, Subang Jaya</div>
          </div>
          <div>
            <div className="sod-k">Delivery</div>
            <div className="sod-v"><b>Tue, 29 Sep 2026</b></div>
            <div className="sod-v dim">11:00 AM · Main Branch</div>
          </div>
        </div>
        <div className="sod-table">
          <div className="sod-tr sod-th"><span>Item</span><span>Qty</span><span>Rate</span><span>Amount</span></div>
          {ITEMS.map((it) => (
            <div key={it.sku} className="sod-tr"><span>{it.name}</span><span>{it.qty} {it.uom}</span><span>{it.price.toFixed(2)}</span><span>{money(it.qty * it.price)}</span></div>
          ))}
        </div>
        <div className="sod-total"><span>Total (tax exempt)</span><b>{rm(TOTAL)}</b></div>
        <div className="sod-foot"><span className="sod-dot" />Created by MAIA from WhatsApp · Synced to SQL Account</div>
      </div>
    </div>
  );
};
