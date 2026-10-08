// Single timeline for picture AND sound (scripts/sfx-events.ts reads the same constants).
export const FPS = 30;
export const DURATION = 900; // 30.000 s = 13 bars at 104 bpm
export const W = 1080;
export const H = 1920;

export const TYPED = 'pls process this for Selera';
export const TYPE_RATE = 2; // frames per character
export const TYPED2 = 'ok approve invoice';

export const TL = {
  fwd: 14, // forwarded messy order pops in
  typeStart: 34, // letters start appearing in the message bar
  send: 34 + TYPED.length * TYPE_RATE + 8, // 96
  read1: 110, // ticks of both admin messages turn blue
  typing1: [114, 138] as const,
  order: 138, // SO-2026-00312 structured
  heart: 164,
  typing2: [172, 190] as const,
  soPdf: 190,
  fingerPdf: { in: 196, tap: 212, out: 228 },
  viewer: { in: 216, out: 272 }, // PDF viewer navigation (slide in / back)
  soCard: { in: 230, out: 260 },
  dash1: { in: 282, out: 364 },
  soRow: 300,
  soSynced: 322,
  act1: [306, 314, 324],
  syncCard: { in: 328, out: 354 },
  mic: { fingerIn: 380, press: 392, release: 432, fingerOut: 444 },
  voice: 432,
  voicePlay: [446, 490] as const,
  voiceRead: 448,
  transcript: 466,
  typing3: [492, 510] as const,
  rev2: 510,
  confirm: 540,
  confirmRead: 552,
  typing4: [554, 570] as const,
  dnPdf: 570,
  dnCard: { in: 582, out: 612 },
  typing5: [614, 628] as const,
  invReady: 628,
  type2Start: 638, // "ok approve invoice" typed into the message bar
  send2: 638 + TYPED2.length * TYPE_RATE + 6, // 680
  approveRead: 692,
  typing6: [694, 708] as const,
  invApproved: 708,
  dash2: { in: 716, out: 788 },
  invPill: 734,
  invChip: 744,
  invAct: [730, 740, 750, 760],
  invCard: { in: 752, out: 780 },
  end: { in: 790, logo: 798, tag: 808, url: 816, out: 866 },
  reset: 820, // chat silently resets while hidden
};

const HOOK: (string | { g: string })[][] = [['What if your'], ['salespeople could be'], [{ g: 'this efficient' }, '?']];
export const HEADLINES: { from: number; lines: (string | { g: string })[][]; small?: boolean }[] = [
  { from: -999, lines: HOOK, small: true },
  { from: TL.order, lines: [['Structured'], ['by ', { g: 'MAIA' }, '.']] },
  { from: TL.dash1.in, lines: [['Synced to ', { g: 'SQL' }], [{ g: '& AutoCount' }, '.']] },
  { from: TL.mic.fingerIn, lines: [['Changes by'], [{ g: 'voice note' }, '.']] },
  { from: TL.confirm, lines: [['Delivery'], [{ g: 'arranged' }, '.']] },
  { from: TL.typing5[0], lines: [['Approve with'], [{ g: 'one text' }, '.']] },
  { from: TL.end.in, lines: [] },
  { from: TL.end.out + 6, lines: HOOK, small: true },
];

// Salesperson pose schedule (crossfades at story beats)
export const POSES: { from: number; pose: 'a' | 'b' | 'c' | 'd' }[] = [
  { from: -999, pose: 'a' }, // typing the order
  { from: TL.order, pose: 'b' }, // pleased: MAIA structured it
  { from: TL.dash1.in + 8, pose: 'c' }, // smile at the sync
  { from: TL.mic.fingerIn, pose: 'a' }, // voice note / on the phone
  { from: TL.rev2, pose: 'b' },
  { from: TL.type2Start - 6, pose: 'a' }, // typing "ok approve invoice"
  { from: TL.invApproved, pose: 'c' },
  { from: TL.end.in, pose: 'd' }, // thumbs up on the end card
  { from: TL.end.out, pose: 'a' },
];
