import { WebDoc } from '../web/types';
import { STORY, rm, total } from './story';

const custSel = STORY.customer.toUpperCase();
const money = (n: number) => n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Scene 3 — Delivery Note created by MAIA from WhatsApp.
export const dnDoc: WebDoc = {
  sidebarActive: 'Delivery Notes',
  crumb: 'Delivery Notes',
  number: STORY.dn,
  status: { label: 'Draft', tone: 'blue' },
  synced: 'Synced from WhatsApp',
  chips: [
    { icon: 'link', label: `Sales Order: ${STORY.so}` },
    { icon: 'truck', label: 'Delivered: 0%' },
  ],
  fields: [
    { label: 'Delivery Date', value: `${STORY.deliveryDate} (Tue)`, req: true, icon: 'cal' },
    { label: 'Delivery Time', value: STORY.deliveryTime, req: true, icon: 'clock' },
  ],
  customer: custSel,
  addresses: [
    { label: 'Shipping Address', req: true, lines: ['Main Branch', 'No. 18, Jalan SS 15/4B, SS 15,', '47500 Subang Jaya, Selangor'] },
  ],
  items: {
    cols: ['#', 'Item', 'Qty', 'UOM'],
    align: ['l', 'l', 'r', 'l'],
    widths: ['28px', 'auto', '46px', '52px'],
    rows: STORY.items.map((it, i) => [String(i + 1), `${it.sku} · ${it.name}`, String(it.qty), it.uom]),
  },
  activity: [
    { text: 'Created by MAIA via WhatsApp', time: 'Sep 28, 2026, 9:42 AM' },
    { text: 'Checked against', bold: STORY.so, time: 'Sep 28, 2026, 9:42 AM', tone: 'green' },
    { text: 'Delivery: 29 Sep, 11:00 AM · Main Branch', time: 'Sep 28, 2026, 9:42 AM' },
  ],
  attachments: 1,
};

// Scene 4 — Invoice approved, billing address edited to HQ (rev 2), synced to accounting.
export const invDoc: WebDoc = {
  sidebarActive: 'Invoices',
  crumb: 'Invoices',
  number: STORY.inv,
  status: { label: 'Approved', tone: 'green' },
  synced: 'Rev 2 · Synced',
  chips: [
    { icon: 'link', label: `SO: ${STORY.so}` },
    { icon: 'truck', label: `DN: ${STORY.dn}` },
  ],
  fields: [
    { label: 'Invoice Date', value: '28/09/2026', req: true, icon: 'cal' },
    { label: 'Due Date', value: '28/10/2026', req: true, icon: 'cal' },
  ],
  customer: custSel,
  addresses: [
    { label: 'Billing Address', req: true, tag: 'Updated', lines: ['HQ — Selera Kampung Sdn Bhd', 'Lot 3A-1, Jalan Kenari 5, Bandar', 'Puchong Jaya, 47100 Puchong, Selangor'], note: 'Was: Main Branch, SS 15 Subang Jaya' },
  ],
  items: {
    cols: ['Item', 'Qty', 'Rate', 'Amount'],
    align: ['l', 'r', 'r', 'r'],
    widths: ['auto', '58px', '58px', '74px'],
    rows: STORY.items.map((it) => [it.name, `${it.qty} ${it.uom}`, it.price.toFixed(2), money(it.qty * it.price)]),
    total: ['Total (tax exempt)', rm(total())],
  },
  activity: [
    { text: 'Created by MAIA', time: 'Sep 28, 2026, 10:05 AM' },
    { text: 'Approved via WhatsApp', time: 'Sep 28, 2026, 10:05 AM', tone: 'green' },
    { text: 'Bill-to → HQ (rev 2)', time: 'Sep 28, 2026, 10:08 AM' },
    { text: 'Synced to SQL & AutoCount', time: 'Sep 28, 2026, 10:08 AM', tone: 'green' },
  ],
  attachments: 2,
};
