// Data model for a recreated WhatsApp screen.
// Every visual line is given explicitly so wraps match the original 1:1
// (Android breaks long URLs / file names mid-token, which CSS can't reproduce).

export type CodePart = string | { link: string };
export type Seg =
  | string // plain text (emoji allowed inline)
  | { b: string } // *bold* heading text
  | { link: string } // auto-linked / underlined text
  | { code: CodePart[]; openLeft?: boolean; openRight?: boolean } // `inline code` chip; open* = chip continues on prev/next line (no padding on that side)
  | { emoji: string; size?: number }
  | { hl: string; tid: string; at: number; tone?: 'warn' | 'ok' | 'dark' | 'bad' | 'badd' } // animated highlight (broll); // emoji rendered with Noto Color Emoji

export type Line = Seg[];

export type Block =
  | { type: 'p'; lines: Line[]; lineGaps?: number[]; mt?: number }
  | { type: 'li'; marker: string; lines: Line[]; lineGaps?: number[]; mt?: number; indent?: number; markerX?: number };

export interface Quote {
  author: string;
  lines: Line[];
  lineGaps?: number[];
}

export interface PdfAttachment {
  nameLines: string[];
  meta: string; // e.g. "19 kB • PDF"
}

export interface Message {
  id: string;
  from: 'me' | 'them';
  tail?: boolean; // first bubble of a group (shows the tail)
  time: string;
  ticks?: boolean; // outgoing double ticks
  quote?: Quote;
  blocks?: Block[];
  pdf?: PdfAttachment; // with blocks = document sent with a caption (card first, caption below)
  forwarded?: boolean; // "Forwarded" label above the text
  width?: number; // bubble body width in px (omit = fit content)
  metaInline?: boolean; // fit-content bubble: reserve room after the last line for the timestamp
  metaLine?: number; // extra bottom space when timestamp sits on its own line
  gapBefore?: number; // vertical gap above this bubble
  forward?: boolean; // grey forward button beside the bubble
  padBottom?: number;
  lineHeight?: number; // per-bubble line pitch override (px)
}

export interface ScreenData {
  id: string;
  width: number;
  height: number;
  clock: string;
  statusIcons: string; // image asset for right-hand system icons
  notifIcons?: string; // image asset for left notification icons
  messages: Message[];
  listBottom: number; // y (in screen coords) of the bottom edge of the last bubble
  scrollDown?: boolean;
  cursor?: boolean;
}
