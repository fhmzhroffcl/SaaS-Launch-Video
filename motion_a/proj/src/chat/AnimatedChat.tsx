import React from 'react';
import { Easing, spring, staticFile } from 'remotion';
import { Bubble } from './Bubble';
import { ChatHeader } from './ChatHeader';
import { StickerSmiley, AttachIcon, CameraIcon, MicIcon, ArrowBack, PdfIcon } from './Icons';
import { DuoStatusBar } from '../duo/DuoStatusBar';
import { Row, ROWS, clockAt } from '../data/video';
import { TL, TYPED, TYPED2, TYPE_RATE, FPS } from '../timeline';
import { SoDoc } from '../cards/SoDoc';

export const CHAT_Z = 1.06; // v2: phone is smaller (salesperson beside it), so the chat is zoomed further to keep ~28.6px text
export const VW = 662 * CHAT_Z;
export const VH = 965 * CHAT_Z;

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const prog = (f: number, a: number, d: number, e = easeOut) => e(clamp((f - a) / d));
const popS = (f: number, at: number) => spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.7 } });
const BLUE = '#53BDEB';

/** Row wrapper: grid 0fr→1fr grows the row from 0 to its natural height, so the list scrolls up smoothly without measuring. */
const Grow: React.FC<{ h: number; children: React.ReactNode }> = ({ h, children }) => (
  <div className="row-wrap" style={{ gridTemplateRows: `${h}fr` }}>
    <div className="row-inner">{children}</div>
  </div>
);

const TypingBubble: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <div className="wa-row wa-row-in" style={{ marginTop: 20 }}>
    <div className="wa-stack" style={{ transformOrigin: '0 0' }}>
      <div className="wa-bubble wa-in wa-has-tail typing-bubble">
        <svg className="wa-tail wa-tail-in" width="14" height="22" viewBox="0 0 14 22"><path d="M14 0 H3 Q0 0 1.6 2.4 L14 21.5 Z" fill="#fff" /></svg>
        {[0, 1, 2].map((i) => {
          const ph = ((f - at) / 16) * Math.PI * 2 - i * 0.95;
          const up = Math.max(0, Math.sin(ph));
          return <span key={i} className="tdot" style={{ transform: `translateY(${-9 * up}px)`, opacity: 0.45 + 0.55 * up }} />;
        })}
      </div>
    </div>
  </div>
);

const WAVE = Array.from({ length: 34 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.63 + 1) * 0.35 + Math.sin(i * 3.1) * 0.2);
  return 0.18 + Math.min(1, v) * 0.82;
});

const Voice: React.FC<{ f: number; v: NonNullable<Extract<Row, { kind: 'msg' }>['voice']> }> = ({ f, v }) => {
  const p = f >= v.play[1] ? 0 : clamp((f - v.play[0]) / (v.play[1] - v.play[0]));
  const playing = f >= v.play[0] && f < v.play[1];
  const secs = playing ? Math.floor(p * 4) : 4;
  const tp = prog(f, v.transcriptAt, 10);
  return (
    <div className="vn">
      <div className="vn-top">
        <div className="vn-play">
          {playing ? (
            <svg width="30" height="34" viewBox="0 0 30 34"><rect x="3" y="2" width="8" height="30" rx="2" fill="#E9E9E9" /><rect x="19" y="2" width="8" height="30" rx="2" fill="#E9E9E9" /></svg>
          ) : (
            <svg width="30" height="34" viewBox="0 0 30 34"><path d="M4 3 L27 17 L4 31 Z" fill="#E9E9E9" strokeLinejoin="round" stroke="#E9E9E9" strokeWidth="3" /></svg>
          )}
        </div>
        <div className="vn-wave">
          {WAVE.map((a, i) => {
            const on = i / WAVE.length < p;
            const live = playing && Math.abs(i / WAVE.length - p) < 0.06;
            return <span key={i} style={{ height: 8 + a * 44 * (live ? 1.12 : 1), background: on ? '#FFFFFF' : '#8C8C8C' }} />;
          })}
          <span className="vn-dot" style={{ left: `${p * 100}%` }} />
        </div>
        <div className="vn-mic">
          <MicIcon size={34} color="#fff" bold={20} />
        </div>
      </div>
      <div className="vn-dur">0:0{secs}</div>
      <div className="row-wrap" style={{ gridTemplateRows: `${tp}fr` }}>
        <div className="row-inner" style={{ overflow: 'hidden' }}>
          <div className="vn-trans" style={{ opacity: tp, transform: `translateY(${(1 - tp) * 8}px)` }}>
            {v.transcript.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkles: React.FC<{ t: number }> = ({ t }) => {
  if (t < 0 || t > 1) return null;
  return (
    <>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
        const r = 18 + 52 * easeOut(t);
        const s = (1 - t) * (i % 2 ? 0.8 : 1.15);
        return (
          <svg key={i} className="spark" width="22" height="22" viewBox="-11 -11 22 22"
            style={{ transform: `translate(${Math.cos(a) * r}px, ${Math.sin(a) * r}px) scale(${s})`, opacity: 1 - t * 0.7 }}>
            <path d="M0 -10 Q1.6 -1.6 10 0 Q1.6 1.6 0 10 Q-1.6 1.6 -10 0 Q-1.6 -1.6 0 -10Z" fill={i % 3 === 0 ? '#EE9A00' : i % 3 === 1 ? '#FFB36B' : '#FF6B8A'} />
          </svg>
        );
      })}
    </>
  );
};

const RowView: React.FC<{ row: Row; f: number }> = ({ row, f }) => {
  if (row.kind === 'date') return <div className="wa-date-row"><span className="wa-date">{row.label}</span></div>;
  if (row.kind === 'typing') {
    if (f < row.at || f >= row.end + 6) return null;
    const h = Math.min(prog(f, row.at, 6), 1 - prog(f, row.end, 6, easeInOut));
    const s = popS(f, row.at);
    return (
      <Grow h={h}>
        <div style={{ transformOrigin: '24px 0', transform: `scale(${(0.4 + 0.6 * s) * (f >= row.end ? h : 1)})`, opacity: f >= row.end ? h : 1 }}>
          <TypingBubble f={f} at={row.at} />
        </div>
      </Grow>
    );
  }
  const { m, at } = row;
  if (at !== undefined && f < at) return null;
  const live = at !== undefined;
  const h = live ? prog(f, at!, 7) : 1;
  const s = live ? popS(f, at!) : 1;
  let stackStyle: React.CSSProperties = {};
  if (live) {
    if (row.fly) {
      const e = prog(f, at!, 10);
      stackStyle = { transform: `translate(${(1 - e) * -170}px, ${(1 - e) * 150}px) scale(${0.82 + 0.18 * s})`, opacity: clamp((f - at!) / 2) };
    } else {
      stackStyle = { transform: `scale(${0.3 + 0.7 * s})`, opacity: clamp((f - at!) / 3) };
    }
  }
  let overlay: React.ReactNode = null;
  let rowPadBottom: number | undefined;
  if (row.reaction && f >= row.reaction.at) {
    const rs = popS(f, row.reaction.at);
    rowPadBottom = 34 * prog(f, row.reaction.at, 6);
    overlay = (
      <div className="wa-react" style={{ transform: `scale(${rs})` }}>
        <span className="wa-react-emoji">{row.reaction.emoji}</span>
        <div className="spark-wrap"><Sparkles t={(f - row.reaction.at) / 16} /></div>
      </div>
    );
  }
  const below: React.ReactNode = null;
  const tickColor = row.readAt !== undefined && f >= row.readAt ? BLUE : undefined;
  const custom = row.voice ? <Voice f={f} v={row.voice} /> : undefined;
  return (
    <Grow h={h}>
      <Bubble m={m} anim={{ stackStyle, tickColor, overlay, below, custom, rowPadBottom }} />
    </Grow>
  );
};

const SendIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24"><path d="M3.4 20.4 L21 12 L3.4 3.6 L3.4 10 L15 12 L3.4 14 Z" fill="#fff" /></svg>
);

const TYPE_SEGS = [
  { text: TYPED, start: TL.typeStart, send: TL.send },
  { text: TYPED2, start: TL.type2Start, send: TL.send2 },
];

const ComposerAnim: React.FC<{ f: number }> = ({ f }) => {
  const seg = TYPE_SEGS.find((t) => f >= t.start && f < t.send);
  const typing = !!seg;
  const n = seg ? clamp(Math.floor((f - seg.start) / TYPE_RATE) + 1, 0, seg.text.length) : 0;
  const text = seg ? seg.text.slice(0, n) : '';
  const rec = f >= TL.mic.press && f < TL.mic.release;
  const recT = rec ? Math.min(4, Math.floor(((f - TL.mic.press) / (TL.mic.release - TL.mic.press)) * 4.6)) : 0;
  const micScale = rec ? 1 + 0.42 * prog(f, TL.mic.press, 6) : f >= TL.mic.release && f < TL.mic.release + 8 ? 1.42 - 0.42 * prog(f, TL.mic.release, 8) : 1;
  const cursorOn = typing ? true : Math.floor(f / 9) % 2 === 0;
  return (
    <>
      <div className="composer">
        {rec ? (
          <>
            <div className="rec-dot" style={{ opacity: 0.45 + 0.55 * Math.abs(Math.cos((f - TL.mic.press) / 7)) }} />
            <div className="rec-time">0:0{recT}</div>
            <div className="rec-hint">‹  Slide to cancel</div>
          </>
        ) : (
          <>
            <div className="cmp-emoji"><StickerSmiley size={47} color="#5A6265" /></div>
            {text ? (
              <div className="cmp-text">{text}<span className="cmp-caret" style={{ opacity: cursorOn ? 1 : 0 }} /></div>
            ) : (
              <div className="cmp-placeholder">Message</div>
            )}
            <div className="cmp-attach" style={text ? { right: 20 } : undefined}><AttachIcon size={48} color="#5A6265" bold={34} /></div>
            {text ? null : <div className="cmp-camera"><CameraIcon size={48} color="#5A6265" bold={30} /></div>}
          </>
        )}
      </div>
      <div className="cmp-mic" style={{ transform: `scale(${micScale})`, background: rec ? '#EE9A00' : undefined }}>
        {text ? <SendIcon /> : <MicIcon size={46} color="#fff" bold={24} />}
      </div>
      <div className="gesture-bar" />
    </>
  );
};

const Viewer: React.FC = () => (
  <div className="pdfv">
    <div className="pdfv-top">
      <DuoStatusBar clock="9:14" />
      <div className="pdfv-bar">
        <div className="pdfv-back"><ArrowBack color="#0B0F12" /></div>
        <div className="pdfv-icon"><PdfIcon /></div>
        <div className="pdfv-title">Sales_Order_SO-2026-00312.pdf</div>
        <div className="pdfv-sub">1 page · 21 kB · PDF</div>
      </div>
    </div>
    <div className="pdfv-body">
      <div className="pdfv-page"><SoDoc width={VW - 80} /></div>
    </div>
  </div>
);

/** WhatsApp chat on the Duo screen, driven by the frame number. */
export const AnimatedChat: React.FC<{ f: number }> = ({ f }) => {
  const typingNow = ROWS.some((r) => r.kind === 'typing' && f >= r.at && f < r.end);
  const nav = f < TL.viewer.in ? 0 : f < TL.viewer.out ? prog(f, TL.viewer.in, 13, easeInOut) : 1 - prog(f, TL.viewer.out, 13, easeInOut);
  return (
    <div className="wa-screen duo-chat" style={{ '--W': VW + 'px', '--H': VH + 'px', '--Z': CHAT_Z, transform: `scale(${1 / CHAT_Z})` } as React.CSSProperties}>
      <div className="nav-layer" style={{ transform: `translateX(${-28 * nav}%)` }}>
        <div className="duo-wall" style={{ backgroundImage: `url(${staticFile('wallpaper.png')})` }} />
        <div className="duo-list">
          {ROWS.map((r) => <RowView key={r.id} row={r} f={f} />)}
        </div>
        <div className="duo-top">
          <DuoStatusBar clock={clockAt(f)} />
          <ChatHeader name="MAIA - AI Sales Coordinator" subtitle={typingNow ? 'typing…' : 'Mindhive Demo'} avatar={staticFile('avatar.png')} />
        </div>
        <ComposerAnim f={f} />
        {nav > 0 ? <div className="nav-dim" style={{ opacity: 0.18 * nav }} /> : null}
      </div>
      {nav > 0 ? (
        <div className="nav-layer nav-top" style={{ transform: `translateX(${(1 - nav) * 100}%)` }}>
          <Viewer />
        </div>
      ) : null}
    </div>
  );
};
