import React from 'react';
import {
  Search, ChevronDown, ChevronRight, ChevronLeft, Package, Hash, ScanLine, Warehouse, FileSignature, ShoppingCart, ReceiptText,
  Banknote, FileMinus, FilePlus2, Receipt, Ticket, Truck, Undo2, CircleAlert, PanelLeft, Building2, ChevronsUpDown, Bell,
  Download, Check, PanelRight, Calendar, Clock, CircleCheck, FileText, Box, CreditCard, Link2, History, RefreshCw, Monitor, Sun, Moon,
} from 'lucide-react';
import { WebDoc, WebField } from './types';

export const I = (C: any, size = 15, sw = 1.8) => <C size={size} strokeWidth={sw} />;

export const NAV: { title: string; items: [string, any, boolean?][] }[] = [
  { title: 'Catalogue', items: [['Items', Package, true], ['Batches', Hash], ['Warehouses', Warehouse]] },
  { title: 'Selling', items: [['Quotations', FileSignature], ['Sales Orders', ShoppingCart]] },
  { title: 'Billing', items: [['Invoices', ReceiptText], ['Cash Sales', Banknote], ['Credit Notes', FileMinus]] },
  { title: 'Payments', items: [['Receipts', Receipt], ['Vouchers', Ticket]] },
  { title: 'Fulfillment', items: [['Delivery Notes', Truck], ['Return Notes', Undo2]] },
];

const chipIcon = { progress: CircleCheck, billed: FileText, box: Box, truck: Truck, paid: CreditCard, link: Link2 };

const Field: React.FC<{ f: WebField }> = ({ f }) => (
  <div className="w-field" style={f.span ? { gridColumn: `span ${f.span}` } : undefined}>
    <div className="w-label">
      {f.label}
      {f.req ? <span className="w-req">*</span> : null}
      {f.tag ? <span className="w-tag">{f.tag}</span> : null}
    </div>
    <div className={'w-input' + (f.tag ? ' w-input-hl' : '')}>
      <span className="w-input-val">{f.value}</span>
      {f.icon === 'none' ? null : f.icon === 'cal' ? I(Calendar, 14) : f.icon === 'clock' ? I(Clock, 14) : f.icon === 'link' ? I(Link2, 14) : I(ChevronDown, 14)}
    </div>
  </div>
);

/** Recreated MAIA web app (ERP-style), showing one document. Pure HTML/CSS so any document can be shown. */
/** Video additions: `anim` reveals the status pill / synced chip / activity rows; `body` replaces the document area (e.g. a list view). */
export interface WindowAnim { pillP?: number; chipP?: number; actP?: number[] }
const pop = (p: number | undefined): React.CSSProperties | undefined =>
  p === undefined ? undefined : { transform: `scale(${Math.max(0, p)})`, opacity: Math.min(1, Math.max(0, p * 2)), display: 'inline-flex' };
const rise = (p: number | undefined): React.CSSProperties | undefined =>
  p === undefined ? undefined : { opacity: Math.min(1, Math.max(0, p)), transform: `translateY(${(1 - Math.min(1, p)) * 14}px)` };
export const MaiaWindow: React.FC<{ doc: WebDoc; width: number; height: number; scale?: number; tenant?: string; style?: React.CSSProperties; id?: string; anim?: WindowAnim; body?: React.ReactNode; crumbTail?: string }> = ({ doc, width, height, scale = 1, tenant = 'Standard Food Solutions', style, id, anim = {}, body, crumbTail }) => (
  <div className="w-outer" id={id} style={{ width: width * scale, height: height * scale, ...style }}>
  <div className="w-window" style={{ width, height, transform: `scale(${scale})` }}>
    <div className="w-app">
      <aside className="w-side">
        <div className="w-search">{I(Search, 14)}<span>Search</span></div>
        <div className="w-nav">
          {NAV.map((s) => (
            <div key={s.title} className="w-sec">
              <div className="w-sec-title"><span>{s.title}</span>{I(ChevronDown, 13)}</div>
              {s.items.map(([name, Icon, more]) => (
                <div key={name} className={'w-nav-item' + (name === doc.sidebarActive ? ' active' : '')}>
                  {I(Icon, 15)}<span>{name}</span>{more ? <span className="w-nav-more">{I(ChevronRight, 13)}</span> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="w-side-foot">
          <div className="w-nav-item">{I(CircleAlert, 15)}<span>Issues</span></div>
          <div className="w-sysmode"><span>System Mode</span><span className="w-sysmode-ic">{I(Monitor, 11)}{I(Sun, 11)}{I(Moon, 11)}</span></div>
        </div>
      </aside>
      <main className="w-main">
        <div className="w-top">
          <span className="w-ic-btn">{I(PanelLeft, 15)}</span>
          <span className="w-tenant">{I(Building2, 14)}<b>{tenant}</b>{I(ChevronsUpDown, 12)}</span>
          <span className="w-crumb"><span className="w-crumb-dim">{doc.crumb}</span>{I(ChevronRight, 12)}<span>{crumbTail ?? doc.number}</span></span>
          <span className="w-top-right"><span className="w-user"><span className="w-avatar">M</span><b>MAIA</b>{I(ChevronDown, 13)}</span></span>
        </div>
        {body ? body : (<>
        <div className="w-toolbar">
          <div className="w-tabs"><span className="w-tab active">Details</span><span className="w-tab">Document Trail</span></div>
          <div className="w-actions">
            <span className="w-btn-dark sq">{I(ChevronLeft, 14, 2.2)}</span>
            <span className="w-btn-dark sq">{I(ChevronRight, 14, 2.2)}</span>
            <span className="w-btn-dark">{I(Download, 14, 2)}Generate PDF{I(ChevronDown, 13, 2)}</span>
            <span className="w-btn-orange"><span className="w-btn-main">{I(Check, 14, 2.4)}Submit</span><span className="w-btn-split">{I(ChevronDown, 13, 2.2)}</span></span>
            <span className="w-ic-btn">{I(PanelRight, 15)}</span>
          </div>
        </div>
        <div className="w-body">
          <div className="w-form">
            <section className="w-card">
              <div className="w-doc-head">
                <span className="w-doc-no doc-title">#{doc.number}</span>
                <span className={'w-pill tone-' + doc.status.tone} style={pop(anim.pillP)}>{doc.status.label}</span>
                {doc.synced ? <span className="w-synced" style={pop(anim.chipP)}>{I(RefreshCw, 11, 2.4)}{doc.synced}</span> : null}
                {doc.updatedBy ? <span className="w-updated">{I(History, 12)}Updated by <b>{doc.updatedBy}</b>{I(ChevronDown, 12)}</span> : null}
              </div>
              <div className="w-chips">
                {doc.chips.map((c, i) => {
                  const C = chipIcon[c.icon];
                  return <span key={i} className="w-chip">{I(C, 12)}{c.label}</span>;
                })}
              </div>
              <div className="w-grid">
                {doc.fields.map((f) => <Field key={f.label} f={f} />)}
              </div>
            </section>
            <section className="w-card">
              <div className="w-card-title">Customer Information <span className="w-card-sub">Credit (RM): <b>50,000.00</b></span></div>
              <div className="w-field">
                <div className="w-label">Customer<span className="w-req">*</span></div>
                <div className="w-input"><span className="w-input-val">{doc.customer}</span>{I(ChevronDown, 14)}</div>
              </div>
              <div className="w-addr-row">
                {doc.addresses.map((a) => (
                  <div key={a.label} className="w-field">
                    <div className="w-label">{a.label}{a.req ? <span className="w-req">*</span> : null}{a.tag ? <span className="w-tag">{a.tag}</span> : null}</div>
                    <div className={'w-input w-addr' + (a.tag ? ' w-input-hl' : '')}>
                      <div>{a.lines.map((l, i) => <div key={i} className={i === 0 ? 'w-addr-first' : ''}>{l}</div>)}</div>{I(ChevronDown, 14)}
                    </div>
                    {a.note ? <div className="w-addr-note">{a.note}</div> : null}
                  </div>
                ))}
              </div>
            </section>
            <section className="w-card">
              <div className="w-card-title">Items</div>
              <table className="w-table">
                <colgroup>{doc.items.widths.map((w, i) => <col key={i} style={{ width: w }} />)}</colgroup>
                <thead><tr>{doc.items.cols.map((c, i) => <th key={i} className={doc.items.align[i]}>{c}</th>)}</tr></thead>
                <tbody>
                  {doc.items.rows.map((r, ri) => (
                    <tr key={ri}>{r.map((c, i) => <td key={i} className={doc.items.align[i]}>{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
              {doc.items.total ? <div className="w-total"><span>{doc.items.total[0]}</span><b>{doc.items.total[1]}</b></div> : null}
            </section>
          </div>
          <div className="w-activity">
            <div className="w-act-tabs"><span className="active">Activity ({anim.actP ? anim.actP.filter((x) => x > 0.5).length : doc.activity.length})</span><span>Attachments</span><span>Comments</span></div>
            <div className="w-act-list">
              {doc.activity.map((a, i) => (
                <div key={i} className="w-act" style={rise(anim.actP?.[i])}>
                  <span className={'w-dot' + (a.tone === 'green' ? ' green' : '')} />
                  {i < doc.activity.length - 1 ? <span className="w-act-line" /> : null}
                  <div className="w-act-text">{a.text}{a.bold ? <b> {a.bold}</b> : null}</div>
                  <div className="w-act-time">{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </>)}
      </main>
    </div>
  </div>
  </div>
);
