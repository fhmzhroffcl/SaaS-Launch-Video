import React from 'react';
import { Check, ArrowRight } from 'lucide-react';

export interface SyncCardData {
  title: string; // dark title bar
  number: string;
  tag?: string;
  customer: string;
  sub?: string;
  targets: { name: string; mark: string; status: string }[];
  noteLabel: string;
  note: string;
  pill: string;
}

/** Concept card (browser-window style) showing a document syncing from MAIA into accounting systems. */
export const SyncCard: React.FC<{ data: SyncCardData; width: number; style?: React.CSSProperties; id?: string }> = ({ data, width, style, id }) => (
  <div className="sc" id={id} style={{ width, ...style }}>
    <div className="sc-chrome">
      <span className="sc-dot" style={{ background: '#F2615A' }} />
      <span className="sc-dot" style={{ background: '#F6BD3B' }} />
      <span className="sc-dot" style={{ background: '#3FC54E' }} />
      <span className="sc-url" />
    </div>
    <div className="sc-bar">{data.title}</div>
    <div className="sc-body">
      <div className="sc-no">{data.number}{data.tag ? <span className="sc-tag">{data.tag}</span> : null}</div>
      <div className="sc-cust">{data.customer}</div>
      {data.sub ? <div className="sc-sub">{data.sub}</div> : null}
      <div className="sc-table">
        <div className="sc-th"><span>SYNCED TO</span><span>STATUS</span></div>
        {data.targets.map((t) => (
          <div key={t.name} className="sc-tr">
            <span className="sc-sys"><span className="sc-mark">{t.mark}</span>{t.name}</span>
            <span className="sc-ok"><Check size={13} strokeWidth={3} />{t.status}</span>
          </div>
        ))}
      </div>
      <div className="sc-note">
        <div className="sc-note-label">{data.noteLabel}</div>
        <div className="sc-note-text">{data.note}</div>
      </div>
      <span className="sc-pill">{data.pill}</span>
    </div>
  </div>
);
