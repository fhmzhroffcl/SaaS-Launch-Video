import React from 'react';
import { Img, staticFile } from 'remotion';
import { Photo } from './Paper';
import { clamp, prog, easeOut } from './u';

export const PH_W = 620, PH_H = 1240, SC_IN = 18;
const SKIN1 = '#EBB896', SKIN2 = '#D69C77', SKIN3 = '#B97A57';

const Thumb: React.FC<{ side: 'l' | 'r'; press?: number }> = ({ side, press = 0 }) => (
  <Img src={staticFile(side === 'l' ? 'hand_l.png' : 'hand_r.png')} style={{ position: 'absolute', [side === 'l' ? 'left' : 'right']: -205, bottom: -400, width: 340, height: 579, transform: `translateY(${press * 8}px)` }} />
);

export const PhoneCam: React.FC<{ f: number; t0: number; shutterAt: number }> = ({ f, t0, shutterAt }) => {
  const fl = f - shutterAt;
  const grid = prog(f, t0 + 6, 14);
  const focusT = prog(f, t0 + 26, 10);
  const lock = prog(f, t0 + 36, 8);
  const shutterPress = fl >= 0 && fl < 8 ? Math.sin((fl / 8) * Math.PI) : 0;
  const frozen = fl >= 0;
  const thumbPop = prog(f, shutterAt + 4, 12);
  const innerW = PH_W - SC_IN * 2, innerH = PH_H - SC_IN * 2;
  return (
    <div style={{ position: 'relative', width: PH_W, height: PH_H }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 96, background: 'linear-gradient(140deg,#3A3A42,#121214 40%,#26262C)', boxShadow: '0 50px 100px rgba(0,0,0,.6), 0 0 0 3px #46464E' }} />
      <div style={{ position: 'absolute', left: SC_IN, top: SC_IN, width: innerW, height: innerH, borderRadius: 80, overflow: 'hidden', background: '#000' }}>
        <div style={{ position: 'absolute', inset: 0, transform: frozen ? `scale(${1 + 0.0})` : `scale(${1.04 - 0.04 * prog(f, t0, 30)})` }}>
          <Photo w={innerW} h={innerH} />
        </div>
        {/* rule of thirds */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4 * grid * (frozen ? 0 : 1) }}>
          {[1, 2].map((i) => <div key={'v' + i} style={{ position: 'absolute', left: (innerW / 3) * i, top: 0, bottom: 0, width: 2, background: '#fff' }} />)}
          {[1, 2].map((i) => <div key={'h' + i} style={{ position: 'absolute', top: (innerH / 3) * i, left: 0, right: 0, height: 2, background: '#fff' }} />)}
        </div>
        {/* focus square */}
        {!frozen && focusT > 0 ? (
          <div style={{ position: 'absolute', left: innerW / 2 - 120, top: innerH * 0.42 - 120, width: 240, height: 240, border: '4px solid #FFD60A', borderRadius: 14, opacity: focusT, transform: `scale(${1.5 - 0.5 * focusT + 0.06 * Math.sin(lock * Math.PI)})`, boxShadow: '0 0 20px rgba(255,214,10,.35)' }}>
            {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: 'absolute', [i < 2 ? 'top' : 'bottom']: -4, [i % 2 ? 'right' : 'left']: -4, width: 22, height: 22, borderTop: i < 2 ? '8px solid #FFD60A' : 'none', borderBottom: i >= 2 ? '8px solid #FFD60A' : 'none', borderLeft: i % 2 === 0 ? '8px solid #FFD60A' : 'none', borderRight: i % 2 ? '8px solid #FFD60A' : 'none' }} />)}
          </div>
        ) : null}
        {/* top bar */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 170, background: 'linear-gradient(rgba(0,0,0,.55), transparent)' }}>
          <div style={{ position: 'absolute', left: innerW / 2 - 70, top: 28, width: 140, height: 40, borderRadius: 24, background: '#000' }} />
          <svg style={{ position: 'absolute', left: 60, top: 96 }} width="40" height="40" viewBox="0 0 24 24"><path d="M13 2 L5 14 H11 L10 22 L19 9 H12.5 Z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /></svg>
          <div style={{ position: 'absolute', right: 60, top: 96, width: 40, height: 40, borderRadius: '50%', border: '3px solid #fff', opacity: 0.9 }} />
        </div>
        {/* bottom controls */}
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 330, background: 'linear-gradient(transparent, rgba(0,0,0,.65))' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 214, textAlign: 'center', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 28, letterSpacing: 4, color: '#FFD60A' }}>PHOTO</div>
          <div style={{ position: 'absolute', left: innerW / 2 - 66, bottom: 70, width: 132, height: 132, borderRadius: '50%', border: '8px solid #fff' }}>
            {fl >= 0 && fl < 16 ? <div style={{ position: 'absolute', left: -30, top: -30, right: -30, bottom: -30, borderRadius: '50%', border: '5px solid rgba(217,215,245,.95)', transform: `scale(${0.7 + fl / 16 * 0.8})`, opacity: 1 - fl / 16 }} /> : null}
            <div style={{ position: 'absolute', inset: 8, borderRadius: '50%', background: '#fff', transform: `scale(${1 - 0.18 * shutterPress})` }} />
          </div>
          <div style={{ position: 'absolute', left: 170, bottom: 86, width: 100, height: 100, borderRadius: 20, border: '3px solid rgba(255,255,255,.7)', overflow: 'hidden', background: '#222', transform: `scale(${thumbPop})` }}>
            {frozen ? <div style={{ width: 100, height: 100, overflow: 'hidden', position: 'relative' }}><div style={{ position: 'absolute', left: -(innerW - 100) / 2 * 0.2, top: -innerH * 0.18, transform: 'scale(0.2)', transformOrigin: '0 0' }}><Photo w={innerW} h={innerH} /></div></div> : null}
          </div>
        </div>
      </div>
      <Thumb side="l" press={shutterPress} />
      <Thumb side="r" press={shutterPress} />
    </div>
  );
};
