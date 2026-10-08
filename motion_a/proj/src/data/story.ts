// Single source of truth for the MAIA marketing story (all scenes read from here).
export const STORY = {
  distributor: 'Standard Food Solutions',
  customer: 'Restoran Selera Kampung Sdn Bhd',
  customerShort: 'Selera Kampung',
  customerCode: '300-R018',
  contact: { name: 'Encik Hafiz Rahman', email: 'hafiz@selerakampung.my', phone: '+6012 338 4471' },
  so: 'SO-2026-00312',
  dn: 'DN-2026-00091',
  inv: 'INV-2026-00147',
  pastOrders: [
    { no: 'SO-2026-00291', date: '4 Sep', total: 'RM 2,841.40' },
    { no: 'SO-2026-00268', date: '14 Aug', total: 'RM 2,946.80' },
  ],
  // Final (rev 2) order lines — scene 2 bumps beras from 10 to 15 bags.
  items: [
    { sku: 'OIL-5KG', name: 'Minyak Masak 5kg', pack: '4 x 5kg', qty: 20, uom: 'ctn', price: 118.0 },
    { sku: 'BRS-FZ10', name: 'Beras Faiza 10kg', pack: '10kg', qty: 15, uom: 'bag', price: 36.5 },
    { sku: 'GUL-1KG', name: 'Gula Pasir 1kg', pack: '1kg', qty: 30, uom: 'pkt', price: 2.8 },
    { sku: 'TPG-1KG', name: 'Tepung Gandum 1kg', pack: '12 x 1kg', qty: 2, uom: 'ctn', price: 31.2 },
  ],
  deliveryDate: '29/09/2026',
  deliveryDateLong: 'Tue, 29 Sep 2026',
  deliveryTime: '11:00 AM',
  mainBranch: ['Restoran Selera Kampung (Main Branch)', 'No. 18, Jalan SS 15/4B,', '47500 Subang Jaya, Selangor'],
  hq: ['Restoran Selera Kampung Sdn Bhd (HQ)', 'Lot 3A-1, Jalan Kenari 5,', 'Bandar Puchong Jaya,', '47100 Puchong, Selangor'],
};
export const rm = (n: number) => 'RM ' + n.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const total = (items = STORY.items) => items.reduce((s, i) => s + i.qty * i.price, 0);
