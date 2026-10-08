import React from 'react';
import { Plus, Check, RefreshCw, Filter, ChevronDown } from 'lucide-react';
import { I } from './MaiaWindow';
import { STORY } from '../data/story';

/** Sales Orders list view (same chrome/CSS as the MAIA web app) with the new WhatsApp order syncing in. */
const ROWS = [
  { no: 'SO-2026-00311', cust: 'Kedai Runcit Ah Seng', date: '27 Sep', total: 'RM 1,204.00' },
  { no: 'SO-2026-00310', cust: 'Warung Mak Teh', date: '27 Sep', total: 'RM 986.50' },
  { no: STORY.pastOrders[0].no, cust: 'Restoran Selera Kampung', date: STORY.pastOrders[0].date, total: STORY.pastOrders[0].total },
  { no: STORY.pastOrders[1].no, cust: 'Restoran Selera Kampung', date: STORY.pastOrders[1].date, total: STORY.pastOrders[1].total },
  { no: 'SO-2026-00255', cust: 'Kafe Seri Melati', date: '9 Aug', total: 'RM 1,530.20' },
];
const ACT = [
  { text: 'Created by MAIA via WhatsApp', time: 'Sep 28, 2026, 9:13 AM' },
  { text: 'SO PDF sent in chat', time: 'Sep 28, 2026, 9:14 AM' },
  { text: 'Synced to SQL Account', time: 'Sep 28, 2026, 9:14 AM', green: true },
];

const SyncCell: React.FC<{ state: 'syncing' | 'synced'; spin?: number }> = ({ state, spin = 0 }) =>
  state === 'synced' ? (
    <span className="sol-sync ok">{I(Check, 12, 3)}Synced</span>
  ) : (
    <span className="sol-sync wait"><span style={{ display: 'flex', transform: `rotate(${spin}deg)` }}>{I(RefreshCw, 12, 2.6)}</span>Syncing…</span>
  );

export const SalesOrdersBody: React.FC<{ rowP: number; synced: boolean; spin: number; hl: number; actP: number[] }> = ({ rowP, synced, spin, hl, actP }) => (
  <>
    <div className="w-toolbar">
      <div className="sol-title">Sales Orders <span className="sol-count">{rowP > 0.5 ? 312 : 311}</span></div>
      <div className="w-actions">
        <span className="sol-conn"><span className="sol-conn-dot" />SQL Account · AutoCount</span>
        <span className="w-btn-dark">{I(Filter, 13, 2)}Filter{I(ChevronDown, 13, 2)}</span>
        <span className="w-btn-orange"><span className="w-btn-main">{I(Plus, 14, 2.4)}New</span></span>
      </div>
    </div>
    <div className="w-body">
      <div className="w-form">
        <div className="sol-table">
          <div className="sol-tr sol-th"><span>SO No.</span><span>Customer</span><span>Date</span><span className="r">Total</span><span>Accounting</span></div>
          <div className="sol-grow" style={{ gridTemplateRows: `${rowP}fr` }}>
            <div style={{ minHeight: 0 }}>
              <div className="sol-tr sol-new" style={{ background: `rgba(255, 236, 204, ${hl})`, boxShadow: `inset 3px 0 0 rgba(238,154,0,${hl})` }}>
                <span className="sol-no">{STORY.so}</span><span><b>Restoran Selera Kampung</b></span><span>28 Sep</span><span className="r"><b>RM 2,871.40</b></span>
                <SyncCell state={synced ? 'synced' : 'syncing'} spin={spin} />
              </div>
            </div>
          </div>
          {ROWS.map((r) => (
            <div key={r.no} className="sol-tr"><span className="sol-no">{r.no}</span><span>{r.cust}</span><span>{r.date}</span><span className="r">{r.total}</span><SyncCell state="synced" /></div>
          ))}
        </div>
        <section className="w-card sol-act">
          <div className="w-card-title">Activity <span className="w-card-sub">{actP.filter((x) => x > 0.5).length} events · live</span></div>
          <div className="w-act-list">
            {ACT.map((a, i) => (
              <div key={i} className="w-act" style={{ opacity: Math.min(1, actP[i]), transform: `translateY(${(1 - Math.min(1, actP[i])) * 14}px)` }}>
                <span className={'w-dot' + (a.green ? ' green' : '')} />
                {i < ACT.length - 1 ? <span className="w-act-line" /> : null}
                <div className="w-act-text">{i === 0 ? <><b>{STORY.so}</b> · </> : null}{a.text}</div>
                <div className="w-act-time">{a.time}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </>
);
