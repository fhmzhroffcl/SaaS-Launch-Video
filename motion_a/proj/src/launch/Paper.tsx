import React from 'react';
import { staticFile } from 'remotion';
import { clamp } from './u';

export const PAPER_W = 760, PAPER_H = 1000;
export const HAND_LINES = [
  { t: 'Dapur Mak Long', big: true },
  { t: 'Order Rabu 7/10' },
  { t: '- ayam fillet 30kg' },
  { t: '- ayam whole 20 ekor' },
  { t: '- mee kuning small one 10' },
  { t: '- kobis 20kg' },
  { t: '- udang 2 ctn' },
  { t: '- minyak masak 5kg 6 tin' },
  { t: 'tq!' },
];
const PITCH = 84, TOP = 92;
const INK = '#1F3B8F';

const Pen: React.FC = () => (
  <svg width="150" height="150" viewBox="0 0 150 150" style={{ position: 'absolute', overflow: 'visible' }}>
    <path d="M6 144 L22 112 L38 128 Z" fill="#CFCFD4" />
    <path d="M18 120 L132 8" stroke="#26262B" strokeWidth="20" strokeLinecap="round" />
    <path d="M60 78 L112 26" stroke="#EE9A00" strokeWidth="21" strokeLinecap="butt" />
    <path d="M125 15 L140 0" stroke="#D9D7F5" strokeWidth="13" strokeLinecap="round" />
  </svg>
);

/** The handwritten order. p = writing progress 0..1 (pen wipes each line in turn). */
export const Paper: React.FC<{ p: number; pen?: boolean }> = ({ p, pen = true }) => {
  const total = HAND_LINES.reduce((s, l) => s + l.t.length + 3, 0);
  let acc = 0;
  return (
    <div style={{ width: PAPER_W, height: PAPER_H, position: 'relative', borderRadius: 10, overflow: 'visible',
      background: `#F4EEDC`, boxShadow: '0 40px 80px rgba(0,0,0,.55), 0 10px 24px rgba(0,0,0,.35)' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 10, overflow: 'hidden',
        background: `linear-gradient(100deg, rgba(255,255,255,.35), rgba(255,255,255,0) 40%, rgba(120,90,40,.10)), repeating-linear-gradient(to bottom, transparent 0 ${PITCH - 2}px, rgba(70,110,190,.30) ${PITCH - 2}px ${PITCH}px)`,
        backgroundPosition: `0 ${TOP}px`, backgroundSize: '100% 100%' }}>
        <div style={{ position: 'absolute', left: 92, top: 0, bottom: 0, width: 3, background: 'rgba(210,70,60,.45)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: TOP - 6, background: '#F4EEDC' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, right: 0, height: 5, background: 'linear-gradient(rgba(0,0,0,.10), transparent)' }} />
      </div>
      <div style={{ position: 'absolute', left: 120, top: TOP, right: 40 }}>
        {HAND_LINES.map((l, i) => {
          const len = l.t.length + 3;
          const lp = clamp((p * total - acc) / len);
          acc += len;
          const rot = ((i * 37) % 7 - 3) * 0.28;
          const wiping = lp > 0 && lp < 1;
          return (
            <div key={i} style={{ height: PITCH, position: 'relative', transform: `rotate(${rot}deg) translateX(${((i * 53) % 5) * 3}px)`, transformOrigin: '0 100%' }}>
              <div style={{ position: 'relative', width: 'fit-content', fontFamily: 'BradleyHand, "Bradley Hand", cursive', fontWeight: 700, fontSize: l.big ? 58 : 46, lineHeight: `${PITCH - 8}px`, color: INK, whiteSpace: 'nowrap',
                WebkitMaskImage: `linear-gradient(90deg, #000 ${lp * 100}%, transparent ${lp * 100 + 2.5}%)`, opacity: 0.94 }}>
                {l.t}
                {l.big ? <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, height: 4, background: INK, borderRadius: 3, opacity: 0.8, transform: `scaleX(${clamp((lp - 0.7) / 0.3)})`, transformOrigin: '0 0' }} /> : null}
              </div>
              {pen && wiping ? (
                <div style={{ position: 'absolute', left: 0, top: 0, width: 'fit-content', whiteSpace: 'nowrap', fontFamily: 'BradleyHand', fontWeight: 700, fontSize: l.big ? 58 : 46, lineHeight: `${PITCH - 8}px`, visibility: 'hidden' }}>
                  {l.t}
                  <div style={{ position: 'absolute', left: `${lp * 100}%`, top: PITCH - 24, visibility: 'visible' }}><div style={{ position: 'absolute', left: -6, top: -142 }}><Pen /></div></div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DeskBg: React.FC<{ glow?: number }> = ({ glow = 1 }) => (
  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 38%, rgba(70,56,40,${0.9 * glow}) 0%, #17140F 55%, #0B0B0D 100%)` }}>
    <div style={{ position: 'absolute', inset: 0, opacity: 0.18, background: 'repeating-linear-gradient(92deg, rgba(255,255,255,.05) 0 2px, transparent 2px 38px)' }} />
  </div>
);

export const PHOTO_W = 520, PHOTO_H = 640;
/** What the phone camera captured: the desk + the paper, a little off-axis. */
export const Photo: React.FC<{ w?: number; h?: number }> = ({ w = PHOTO_W, h = PHOTO_H }) => (
  <div style={{ width: w, height: h, position: 'relative', overflow: 'hidden', background: '#17140F' }}>
    <DeskBg />
    <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: `translate(${w * 0.07}px, ${h * 0.045}px) rotate(-2.6deg) scale(${(w * 0.88) / PAPER_W})` }}>
      <Paper p={1} pen={false} />
    </div>
  </div>
);
