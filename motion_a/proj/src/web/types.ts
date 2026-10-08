export type Tone = 'blue' | 'green' | 'orange' | 'grey';
export interface WebField { label: string; value: string; req?: boolean; icon?: 'cal' | 'chev' | 'clock' | 'link' | 'none'; tag?: string; span?: number }
export interface WebAddress { label: string; lines: string[]; req?: boolean; tag?: string; note?: string }
export interface WebActivity { text: string; bold?: string; time: string; tone?: 'orange' | 'green' }
export interface WebDoc {
  sidebarActive: string;
  crumb: string;
  number: string;
  status: { label: string; tone: Tone };
  synced?: string; // small orange chip next to the status
  chips: { icon: 'progress' | 'billed' | 'box' | 'truck' | 'paid' | 'link'; label: string }[];
  updatedBy?: string;
  fields: WebField[];
  customer: string;
  addresses: WebAddress[];
  items: { cols: string[]; align: ('l' | 'r')[]; widths: string[]; rows: string[][]; total?: [string, string] };
  activity: WebActivity[];
  attachments?: number;
}
