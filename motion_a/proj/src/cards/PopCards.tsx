import React from 'react';
import { Check, Truck, CalendarDays, MapPin, Package, RefreshCw, FileText } from 'lucide-react';
import { STORY } from '../data/story';

const CheckCircle: React.FC<{ size: number }> = ({ size }) => (
  <div className="pc-check" style={{ width: size, height: size }}>
    <Check size={size * 0.56} strokeWidth={3.2} color="#fff" />
  </div>
);

export const SyncedCard: React.FC = () => (
  <div className="pc pc-sync">
    <CheckCircle size={92} />
    <div>
      <div className="pc-title">Synced to SQL Account</div>
      <div className="pc-sub"><span className="mono">{STORY.so}</span> · RM 2,871.40 · 9:14 AM</div>
    </div>
  </div>
);

export const DnCard: React.FC = () => (
  <div className="pc pc-dn">
    <div className="pc-row-head">
      <div className="pc-ic"><Truck size={40} strokeWidth={2} /></div>
      <div>
        <div className="pc-label">DELIVERY NOTE</div>
        <div className="pc-no mono">{STORY.dn}</div>
      </div>
    </div>
    <div className="pc-line"><CalendarDays size={30} strokeWidth={2} /><span><b>Tue 29 Sep</b> · 11:00 AM</span></div>
    <div className="pc-line"><MapPin size={30} strokeWidth={2} /><span><b>Main Branch</b> · SS 15 Subang Jaya</span></div>
    <div className="pc-line"><Package size={30} strokeWidth={2} /><span>4 items · from <span className="mono">{STORY.so}</span></span></div>
  </div>
);

export const InvoiceCard: React.FC = () => (
  <div className="pc pc-inv">
    <div className="pc-row-head">
      <div className="pc-ic"><FileText size={38} strokeWidth={2} /></div>
      <div>
        <div className="pc-label">INVOICE · TOTAL</div>
        <div className="pc-no mono">{STORY.inv}</div>
      </div>
    </div>
    <div className="pc-amount">RM 3,053.90</div>
    <div className="pc-chips">
      <span className="pc-chip green"><Check size={24} strokeWidth={3} />Approved</span>
      <span className="pc-chip orange"><RefreshCw size={22} strokeWidth={2.6} />Rev 2 · Synced</span>
    </div>
    <div className="pc-targets">
      <span><span className="pc-mark">SQL</span>SQL Account<Check size={26} strokeWidth={3} color="#1E9A4B" /></span>
      <span><span className="pc-mark">AC</span>AutoCount<Check size={26} strokeWidth={3} color="#1E9A4B" /></span>
    </div>
  </div>
);
