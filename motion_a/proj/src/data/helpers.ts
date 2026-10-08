import { Block, Line, Seg, Message } from '../chat/types';
// Tiny authoring helpers so chat copy reads close to the final text.
export const c = (s: string): Seg => ({ code: [s] }); // `code chip`
export const b = (s: string): Seg => ({ b: s }); // bold
export const e = (s: string): Seg => ({ emoji: s }); // colour emoji
export const L = (...segs: (Seg | string)[]): Line => segs as Line;
/** Paragraph; each argument is one visual line (string or Line). */
export const p = (...lines: (string | Line)[]): Block => ({ type: 'p', lines: lines.map((l) => (typeof l === 'string' ? [l] : l)) });
export const pm = (mt: number, ...lines: (string | Line)[]): Block => ({ ...p(...lines), mt } as Block);
/** Bullet item; each argument is one visual line. */
export const li = (...lines: (string | Line)[]): Block => ({ type: 'li', marker: '•', lines: lines.map((l) => (typeof l === 'string' ? [l] : l)) });
export const lim = (mt: number, ...lines: (string | Line)[]): Block => ({ ...li(...lines), mt } as Block);
export const ol = (n: number, ...lines: (string | Line)[]): Block => ({ type: 'li', marker: n + '.', markerX: 29, indent: 56, lines: lines.map((l) => (typeof l === 'string' ? [l] : l)) });

let n = 0;
/** Outgoing (sales admin, right, dark). */
export const me = (time: string, blocks: Block[], extra: Partial<Message> = {}): Message => ({ id: 'm' + n++, from: 'me', ticks: true, time, blocks, metaInline: true, ...extra });
/** Incoming (MAIA, left, light). */
export const maia = (time: string, blocks: Block[] | undefined, extra: Partial<Message> = {}): Message => ({ id: 'm' + n++, from: 'them', time, blocks, metaInline: !!blocks, ...extra });
export const pdf = (name: string, meta = '1 page • 21 kB • PDF') => {
  // Android wraps the file name at the card width (24 chars on the first line in the reference)
  const cut = 24;
  return { nameLines: name.length > cut ? [name.slice(0, cut), name.slice(cut)] : [name], meta };
};
// Group spacing like WhatsApp: 20px between sender changes, 7px inside a group.
export const GAP = 20, GAP_IN = 7;
