import React from 'react';
import { staticFile } from 'remotion';
import '../chat/chat.css';
import '../duo/duo.css';
import '../fonts.css';
import '../chat/anim.css';
import { Bubble } from '../chat/Bubble';
import { ChatHeader } from '../chat/ChatHeader';
import { StickerSmiley, AttachIcon, CameraIcon, MicIcon, ForwardedGlyph, Ticks } from '../chat/Icons';
import { DuoStatusBar } from '../duo/DuoStatusBar';
import { Message } from '../chat/types';
import { prog, pop, clamp, easeIO, easeOut } from './u';

export const VW = 662, VH = 1177;
const BLUE = '#53BDEB';

export type LRow =
  | { kind: 'date'; id: string; label: string }
  | { kind: 'typing'; id: string; at: number; end: number }
  | { kind: 'text'; id: string; at: number; m: Message; fly?: boolean; badge?: Badge; ping?: boolean }
  | { kind: 'voice'; id: string; at: number; out?: boolean; fwd?: boolean; time: string; dur: string; play?: [number, number]; shimmer?: [number, number]; transcript?: string[]; transAt?: number; badge?: Badge; gapBefore?: number }
  | { kind: 'image'; id: string; at: number; out?: boolean; fwd?: boolean; time: string; w: number; h: number; node: React.ReactNode; badge?: Badge; gapBefore?: number }
  | { kind: 'mail'; id: string; at: number; out?: boolean; fwd?: boolean; time: string; subject: string; from: string; badge?: Badge; gapBefore?: number };
export interface Badge { text: string; at: number }

const Grow: React.FC<{ h: number; children: React.ReactNode }> = ({ h, children }) => (
  <div className="row-wrap" style={{ gridTemplateRows: `${h}fr` }}><div className="row-inner">{children}</div></div>
);

const Typing: React.FC<{ f: number; at: number }> = ({ f, at }) => (
  <div className="wa-row wa-row-in" style={{ marginTop: 20 }}>
    <div className="wa-stack">
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

const WAVE = Array.from({ length: 36 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.63 + 1) * 0.35 + Math.sin(i * 3.1) * 0.2);
  return 0.18 + Math.min(1, v) * 0.82;
});

const Tail: React.FC<{ out: boolean }> = ({ out }) => (
  <svg className={'wa-tail wa-tail-' + (out ? 'out' : 'in')} width="14" height="22" viewBox="0 0 14 22">
    {out ? <path d="M0 0 H11 Q14 0 12.4 2.4 L0 21.5 Z" fill="#333333" /> : <path d="M14 0 H3 Q0 0 1.6 2.4 L14 21.5 Z" fill="#fff" />}
  </svg>
);

const FwdLabel: React.FC<{ out: boolean }> = ({ out }) => (
  <div className="wa-fwd-label" style={{ margin: '0 0 6px 2px' }}><ForwardedGlyph color={out ? '#A9A9A9' : '#667075'} /><span>Forwarded</span></div>
);

const BadgeView: React.FC<{ f: number; b: Badge; out: boolean }> = ({ f, b, out }) => {
  const t = pop(f, b.at, 13, 210);
  if (f < b.at) return null;
  return (
    <div style={{ position: 'absolute', [out ? 'left' : 'right']: -6, top: -18, transform: `scale(${t})`, transformOrigin: out ? '0 100%' : '100% 100%', zIndex: 5,
      background: '#EE9A00', color: '#0B0B0D', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 21, lineHeight: '30px', padding: '3px 14px', borderRadius: 20, whiteSpace: 'nowrap', boxShadow: '0 4px 14px rgba(238,154,0,.45)', display: 'flex', alignItems: 'center', gap: 6 } as React.CSSProperties}>
      <svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9.5 L7.2 13.5 L15 4.8" stroke="#0B0B0D" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>{b.text}
    </div>
  );
};

const Scan: React.FC<{ f: number; b?: Badge }> = ({ f, b }) => {
  if (!b) return null;
  const t = (f - (b.at - 18)) / 18;
  if (t < 0 || t > 1) return null;
  return <div style={{ position: 'absolute', inset: 0, borderRadius: 26, overflow: 'hidden', pointerEvents: 'none', zIndex: 4 }}>
    <div style={{ position: 'absolute', top: 0, bottom: 0, width: 120, left: `${-20 + t * 130}%`, background: 'linear-gradient(90deg, rgba(238,154,0,0), rgba(238,154,0,.55), rgba(238,154,0,0))' }} />
  </div>;
};

const VoiceBody: React.FC<{ f: number; r: Extract<LRow, { kind: 'voice' }> }> = ({ f, r }) => {
  const out = !!r.out;
  const [p0, p1] = r.play ?? [1e9, 1e9];
  const p = clamp((f - p0) / (p1 - p0));
  const playing = f >= p0 && f < p1;
  const base = out ? '#8C8C8C' : '#C4C9CB', on = out ? '#fff' : '#3E4548', ic = out ? '#E9E9E9' : '#5A6264';
  const sh = r.shimmer, tAt = r.transAt ?? 1e9;
  const sk = sh ? clamp((f - sh[0]) / 8) * (1 - clamp((f - tAt) / 10)) : 0;
  const tp = prog(f, tAt, 12);
  const secs = playing ? Math.floor(p * 11) : f >= p1 ? 11 : 0;
  return (
    <div className="vn" style={{ width: 500, padding: '4px 4px 38px 2px' }}>
      <div className="vn-top">
        <div className="vn-play">
          {playing ? <svg width="30" height="34" viewBox="0 0 30 34"><rect x="3" y="2" width="8" height="30" rx="2" fill={ic} /><rect x="19" y="2" width="8" height="30" rx="2" fill={ic} /></svg>
            : <svg width="30" height="34" viewBox="0 0 30 34"><path d="M4 3 L27 17 L4 31 Z" fill={ic} stroke={ic} strokeWidth="3" strokeLinejoin="round" /></svg>}
        </div>
        <div className="vn-wave">
          {WAVE.map((a, i) => {
            const frac = i / WAVE.length, isOn = frac < p;
            const live = playing && Math.abs(frac - p) < 0.07;
            const bounce = playing ? 1 + 0.18 * Math.sin(f / 2.2 + i) * (live ? 2.2 : 0.6) : 1;
            return <span key={i} style={{ height: (8 + a * 44) * bounce, background: isOn ? on : base }} />;
          })}
          <span className="vn-dot" style={{ left: `${p * 100}%`, background: BLUE }} />
        </div>
        <div className="vn-mic" style={{ background: out ? '#4A4A4A' : '#E4E7E8' }}><MicIcon size={34} color={out ? '#fff' : '#5A6264'} bold={20} /></div>
      </div>
      <div className="vn-dur" style={{ color: out ? '#9A9A9A' : '#5A6264' }}>{playing || f >= p1 ? `0:${String(secs).padStart(2, '0')}` : r.dur}</div>
      {sk > 0 ? (
        <div style={{ marginTop: 14, opacity: sk }}>
          {[100, 82, 56].map((w, i) => (
            <div key={i} style={{ height: 20, width: `${w}%`, borderRadius: 10, marginTop: i ? 12 : 0, overflow: 'hidden', background: out ? '#464646' : '#E2E5E6', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, width: 160, left: `${((f * 4 + i * 60) % 520) - 160}px`, background: `linear-gradient(90deg, transparent, ${out ? 'rgba(255,255,255,.25)' : 'rgba(238,154,0,.35)'}, transparent)` }} />
            </div>
          ))}
        </div>
      ) : null}
      {r.transcript && tp > 0 ? (
        <div className="row-wrap" style={{ gridTemplateRows: `${tp}fr` }}><div className="row-inner" style={{ overflow: 'hidden' }}>
          <div className="vn-trans" style={{ opacity: tp, color: out ? '#D7D7D7' : '#3E4548', marginTop: 10 }}>{r.transcript.map((l, i) => <div key={i}>{l}</div>)}</div>
        </div></div>
      ) : null}
    </div>
  );
};

const MailBody: React.FC<{ r: Extract<LRow, { kind: 'mail' }> }> = ({ r }) => (
  <div style={{ width: 420, display: 'flex', gap: 16, alignItems: 'center', padding: '6px 4px 36px 2px' }}>
    <div style={{ width: 66, height: 66, borderRadius: 18, background: '#D9D7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="40" height="40" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#0B0B0D" strokeWidth="2" /><path d="M3.5 7 L12 13 L20.5 7" fill="none" stroke="#0B0B0D" strokeWidth="2" strokeLinejoin="round" /></svg>
    </div>
    <div style={{ minWidth: 0 }}>
      <div className="wa-pdf-name" style={{ fontSize: 28, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap' }}>{r.subject}</div>
      <div className="wa-pdf-meta" style={{ fontSize: 23, marginTop: 6, color: '#A9A9A9' }}>{r.from}</div>
    </div>
  </div>
);

const RowView: React.FC<{ row: LRow; f: number }> = ({ row, f }) => {
  if (row.kind === 'date') return <div className="wa-date-row"><span className="wa-date">{row.label}</span></div>;
  if (row.kind === 'typing') {
    if (f < row.at || f >= row.end + 6) return null;
    const h = Math.min(prog(f, row.at, 6), 1 - prog(f, row.end, 6, easeIO));
    const s = pop(f, row.at);
    return <Grow h={h}><div style={{ transformOrigin: '24px 0', transform: `scale(${(0.4 + 0.6 * s) * (f >= row.end ? h : 1)})`, opacity: f >= row.end ? h : 1 }}><Typing f={f} at={row.at} /></div></Grow>;
  }
  if (f < row.at) return null;
  const h = prog(f, row.at, 7), s = pop(f, row.at);
  const fly = row.kind === 'text' ? row.fly : false;
  const out = row.kind === 'text' ? row.m.from === 'me' : !!(row as any).out;
  let stack: React.CSSProperties;
  if (fly) { const e = prog(f, row.at, 10); stack = { transform: `translate(${(1 - e) * -170}px, ${(1 - e) * 150}px) scale(${0.82 + 0.18 * s})`, opacity: clamp((f - row.at) / 2) }; }
  else stack = { transform: `scale(${0.3 + 0.7 * s})`, opacity: clamp((f - row.at) / 3) };
  stack.transformOrigin = out ? '100% 0' : '0 0';
  if (row.kind === 'text') {
    const b = row.badge;
    return <Grow h={h}><Bubble m={row.m} anim={{ stackStyle: stack, overlay: b ? <><BadgeView f={f} b={b} out={out} /><Scan f={f} b={b} /></> : undefined, tickColor: b ? BLUE : undefined }} /></Grow>;
  }
  const b = row.badge;
  const timeEl = <div className={'wa-meta wa-meta-' + (out ? 'out' : 'in')}><span>{row.time}</span>{out ? <span style={{ marginLeft: 7, marginTop: -3 }}><Ticks color={BLUE} /></span> : null}</div>;
  return (
    <Grow h={h}>
      <div className={'wa-row ' + (out ? 'wa-row-out' : 'wa-row-in')} style={{ marginTop: row.gapBefore ?? 7 }}>
        <div className="wa-stack" style={stack}>
          <div className={'wa-bubble ' + (out ? 'wa-out' : 'wa-in') + ' wa-has-tail'} style={row.kind === 'image' ? { padding: 8, borderRadius: 28, borderTopLeftRadius: out ? 28 : 0, borderTopRightRadius: out ? 0 : 28 } : undefined}>
            <Tail out={out} />
            {row.fwd ? <FwdLabel out={out} /> : null}
            {row.kind === 'voice' ? <VoiceBody f={f} r={row} /> : null}
            {row.kind === 'mail' ? <MailBody r={row} /> : null}
            {row.kind === 'image' ? (
              <div style={{ width: row.w, height: row.h, borderRadius: 22, overflow: 'hidden', position: 'relative' }}>
                {row.node}
                <div style={{ position: 'absolute', right: 0, bottom: 0, left: 0, height: 70, background: 'linear-gradient(transparent, rgba(0,0,0,.45))' }} />
              </div>
            ) : null}
            {row.kind === 'image' ? <div className={'wa-meta wa-meta-' + (out ? 'out' : 'in')} style={{ color: '#fff', right: 20, bottom: 14 }}><span>{row.time}</span>{out ? <span style={{ marginLeft: 7 }}><Ticks color="#fff" /></span> : null}</div> : timeEl}
            {b ? <><BadgeView f={f} b={b} out={out} /><Scan f={f} b={b} /></> : null}
          </div>
        </div>
      </div>
    </Grow>
  );
};

export const Composer: React.FC = () => (
  <>
    <div className="composer">
      <div className="cmp-emoji"><StickerSmiley size={47} color="#5A6265" /></div>
      <div className="cmp-placeholder">Message</div>
      <div className="cmp-attach"><AttachIcon size={48} color="#5A6265" bold={34} /></div>
      <div className="cmp-camera"><CameraIcon size={48} color="#5A6265" bold={30} /></div>
    </div>
    <div className="cmp-mic"><MicIcon size={46} color="#fff" bold={24} /></div>
    <div className="gesture-bar" />
  </>
);

export const LChat: React.FC<{ f: number; rows: LRow[]; title: string; avatar?: string; clock: string; subtitle?: string; typingNow?: boolean }> = ({ f, rows, title, avatar, clock, subtitle = 'online' }) => {
  const typingNow = rows.some((r) => r.kind === 'typing' && f >= r.at && f < r.end);
  return (
    <div className="wa-screen duo-chat" style={{ '--W': VW + 'px', '--H': VH + 'px', '--Z': 1 } as React.CSSProperties}>
      <div className="duo-wall" style={{ backgroundImage: `url(${staticFile('wallpaper.png')})` }} />
      <div className="duo-list">{rows.map((r) => <RowView key={r.id} row={r} f={f} />)}</div>
      <div className="duo-top">
        <DuoStatusBar clock={clock} />
        <ChatHeader name={title} subtitle={typingNow ? 'typing…' : subtitle} avatar={avatar ?? staticFile('avatar.png')} />
      </div>
      <Composer />
    </div>
  );
};
