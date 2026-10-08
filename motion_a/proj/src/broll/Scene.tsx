import React, { useLayoutEffect, useRef } from 'react';
import { AbsoluteFill, Easing, spring, staticFile, useCurrentFrame } from 'remotion';
import '../chat/chat.css';
import '../duo/duo.css';
import '../fonts.css';
import '../chat/anim.css';
import { Bubble } from '../chat/Bubble';
import { ChatHeader } from '../chat/ChatHeader';
import { StickerSmiley, AttachIcon, CameraIcon, MicIcon } from '../chat/Icons';
import { DuoStatusBar } from '../duo/DuoStatusBar';
import { Message } from '../chat/types';
import { HlCtx } from './ctx';

export const FPS = 30;
const VW = 662, VH = 1177, S0 = 1080 / VW;
const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
const prog = (f: number, a: number, d: number, e = easeOut) => e(clamp((f - a) / d));
const popS = (f: number, at: number) => spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 190, mass: 0.7 } });
const BLUE = '#53BDEB';

export type SRow =
  | { kind: 'date'; id: string; label: string; at?: number }
  | { kind: 'typing'; id: string; at: number; end: number }
  | { kind: 'msg'; id: string; m: Message; at?: number; readAt?: number; fly?: boolean; buttons?: { labels: string[]; at: number; press?: { i: number; at: number } } };

export interface Cam { f: number; tid?: string; z: number; sy?: number; fx?: number; fy?: number }
export interface TypeSeg { text: string; start: number; send: number; rate?: number }
export interface SceneSpec {
  id: string; frames: number; sub?: string; rows: SRow[]; types: TypeSeg[]; cam: Cam[]; clock: string; chip?: string; title?: string; avatar?: string; calm?: boolean;
  clocks?: [number, string][];
}

const Grow: React.FC<{ h: number; children: React.ReactNode }> = ({ h, children }) => (
  <div className="row-wrap" style={{ gridTemplateRows: `${h}fr` }}><div className="row-inner">{children}</div></div>
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

const Buttons: React.FC<{ f: number; b: NonNullable<Extract<SRow, { kind: 'msg' }>['buttons']> }> = ({ f, b }) => {
  const t = prog(f, b.at, 8);
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * 10}px)` }}>
      {b.labels.map((l, i) => {
        const pr = b.press && b.press.i === i ? prog(f, b.press.at, 14) : 0;
        return (
          <div key={i} className="wa-btn" style={pr > 0 ? { background: `rgba(238,154,0,${0.25 * (1 - pr)})` } : undefined}>
            {pr > 0 && pr < 1 ? <div className="wa-btn-ripple" style={{ transform: `scale(${pr * 7})`, opacity: 0.35 * (1 - pr) }} /> : null}
            {l}
          </div>
        );
      })}
    </div>
  );
};

const RowView: React.FC<{ row: SRow; f: number }> = ({ row, f }) => {
  if (row.kind === 'date') { if (row.at !== undefined && f < row.at) return null; }
  if (row.kind === 'date') return <div className="wa-date-row"><span className="wa-date">{row.label}</span></div>;
  if (row.kind === 'typing') {
    if (f < row.at || f >= row.end + 6) return null;
    const h = Math.min(prog(f, row.at, 6), 1 - prog(f, row.end, 6, easeIO));
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
    } else stackStyle = { transform: `scale(${0.3 + 0.7 * s})`, opacity: clamp((f - at!) / 3) };
  }
  const tickColor = row.readAt !== undefined && f >= row.readAt ? BLUE : undefined;
  const below = row.buttons ? <Buttons f={f} b={row.buttons} /> : null;
  return (
    <Grow h={h}>
      <div data-tid={row.id}><Bubble m={m} anim={{ stackStyle, tickColor, below }} /></div>
    </Grow>
  );
};

const SendIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24"><path d="M3.4 20.4 L21 12 L3.4 3.6 L3.4 10 L15 12 L3.4 14 Z" fill="#fff" /></svg>
);

const Composer: React.FC<{ f: number; types: TypeSeg[] }> = ({ f, types }) => {
  const seg = types.find((t) => f >= t.start && f < t.send);
  const n = seg ? clamp(Math.floor((f - seg.start) / (seg.rate ?? 2)) + 1, 0, seg.text.length) : 0;
  const text = seg ? seg.text.slice(0, n) : '';
  const cursorOn = seg ? true : Math.floor(f / 9) % 2 === 0;
  return (
    <>
      <div className="composer">
        <div className="cmp-emoji"><StickerSmiley size={47} color="#5A6265" /></div>
        {text ? <div className="cmp-text">{text}<span className="cmp-caret" style={{ opacity: cursorOn ? 1 : 0 }} /></div> : <div className="cmp-placeholder">Message</div>}
        <div className="cmp-attach" style={text ? { right: 20 } : undefined}><AttachIcon size={48} color="#5A6265" bold={34} /></div>
        {text ? null : <div className="cmp-camera"><CameraIcon size={48} color="#5A6265" bold={30} /></div>}
      </div>
      <div className="cmp-mic">{text ? <SendIcon /> : <MicIcon size={46} color="#fff" bold={24} />}</div>
      <div className="gesture-bar" />
    </>
  );
};

export const WaScene: React.FC<{ spec: SceneSpec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const rootRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const typingNow = spec.rows.some((r) => r.kind === 'typing' && f >= r.at && f < r.end);
  const clock = (spec.clocks ?? []).filter(([ff]) => f >= ff).pop()?.[1] ?? spec.clock;

  useLayoutEffect(() => {
    const cam = camRef.current!, root = rootRef.current!;
    cam.style.transform = 'none';
    const rr = root.getBoundingClientRect();
    const pt = (k: Cam): [number, number] => {
      const el = k.tid ? root.querySelector(`[data-tid="${k.tid}"]`) : null;
      if (el) {
        const r = el.getBoundingClientRect();
        return [k.fx ?? 331 - (k.z - 1) * 110, k.fy ?? r.top - rr.top + r.height / 2];
      }
      return [k.fx ?? VW / 2, k.fy ?? VH / 2];
    };
    const ks = spec.cam;
    let i = 0;
    while (i < ks.length - 1 && f >= ks[i + 1].f) i++;
    const a = ks[i], b = ks[Math.min(i + 1, ks.length - 1)];
    let t = b.f === a.f ? 1 : clamp((f - a.f) / (b.f - a.f));
    if (i === ks.length - 1) t = 1;
    const e = a.z === b.z && !a.tid && !b.tid ? t : easeIO(t);
    const pa = pt(a), pb = b.tid && !root.querySelector(`[data-tid="${b.tid}"]`) ? pa : pt(b);
    const fx = pa[0] + (pb[0] - pa[0]) * e, fy = pa[1] + (pb[1] - pa[1]) * e;
    const z = a.z + (b.z - a.z) * e;
    const sy = (a.sy ?? 0.47) + ((b.sy ?? 0.47) - (a.sy ?? 0.47)) * e;
    let tx = VW / 2 - fx * z, ty = VH * sy - fy * z;
    tx = Math.min(0, Math.max(VW * (1 - z), tx));
    ty = Math.min(0, Math.max(VH * (1 - z), ty));
    cam.style.transform = `scale(${S0}) translate(${tx}px, ${ty}px) scale(${z})`;
  });

  return (
    <AbsoluteFill style={{ background: '#EAECEB', overflow: 'hidden' }}>
      {spec.chip ? <div style={{ position: 'absolute', left: 0, right: 0, top: 6, zIndex: 20, display: 'flex', justifyContent: 'center' }}><div style={{ background: 'rgba(11,11,13,.82)', color: '#D9D7F5', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 24, letterSpacing: 2, padding: '5px 20px', borderRadius: 40, border: '2px solid #EE9A00' }}>{spec.chip}</div></div> : null}
      <div ref={camRef} style={{ position: 'absolute', left: 0, top: 0, width: VW, height: VH, transformOrigin: '0 0' }}>
        <HlCtx.Provider value={f}>
          <div ref={rootRef} className="wa-screen duo-chat" style={{ '--W': VW + 'px', '--H': VH + 'px', '--Z': 1 } as React.CSSProperties}>
            <div className="duo-wall" style={{ backgroundImage: `url(${staticFile('wallpaper.png')})` }} />
            <div className="duo-list">{spec.rows.map((r) => <RowView key={r.id} row={r} f={f} />)}</div>
            <div className="duo-top">
              <DuoStatusBar clock={clock} />
              <ChatHeader name={spec.title ?? "MAIA - AI Sales Coordinator"} subtitle={typingNow ? 'typing…' : 'online'} avatar={spec.avatar ?? staticFile('avatar.png')} />
            </div>
            <Composer f={f} types={spec.types} />
          </div>
        </HlCtx.Provider>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 350, background: 'linear-gradient(rgba(11,11,13,.5) 55%, rgba(11,11,13,0))', zIndex: 15 }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 450, background: 'linear-gradient(rgba(11,11,13,0), rgba(11,11,13,.5) 45%)', zIndex: 15 }} />
      <AbsoluteFill style={{ pointerEvents: 'none', background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.16) 100%)' }} />
    </AbsoluteFill>
  );
};
