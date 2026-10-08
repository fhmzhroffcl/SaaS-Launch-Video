import React from 'react';
import { DUO } from './geometry';

/** Rounded rect with independent left/right corner radii (circular arcs). */
const rr = (x: number, y: number, w: number, h: number, rl: number, rR: number) => {
  rl = Math.max(0, rl); rR = Math.max(0, rR);
  return `M${x + rl},${y} H${x + w - rR} A${rR},${rR} 0 0 1 ${x + w},${y + rR} V${y + h - rR} A${rR},${rR} 0 0 1 ${x + w - rR},${y + h} H${x + rl} A${rl},${rl} 0 0 1 ${x},${y + h - rl} V${y + rl} A${rl},${rl} 0 0 1 ${x + rl},${y} Z`;
};
const inset = (d: number) => rr(DUO.bodyX + d, d, DUO.w - DUO.bodyX - 2 * d, DUO.h - 2 * d, DUO.bodyRL - d, DUO.bodyRR - d);

/**
 * iPhone Duo, closed, outer display. Vector frame (champagne titanium band, black bezel, hinge strip,
 * punch-hole camera). `scale` scales the whole device; children render in 662x965 screen units.
 */
export const DuoFrame: React.FC<{ scale: number; children?: React.ReactNode; style?: React.CSSProperties; id?: string }> = ({ scale, children, style, id }) => {
  const s = DUO.screen;
  const c = DUO.camera;
  return (
    <div className="duo" id={id} style={{ width: DUO.w * scale, height: DUO.h * scale, ...style }}>
      <div className="duo-shadow" style={{ left: DUO.bodyX * scale, width: (DUO.w - DUO.bodyX) * scale, borderRadius: `${DUO.bodyRL * scale}px ${DUO.bodyRR * scale}px ${DUO.bodyRR * scale}px ${DUO.bodyRL * scale}px` }} />
      <div className="duo-inner" style={{ transform: `scale(${scale})` }}>
        <svg className="duo-svg" width={DUO.w + 8} height={DUO.h + 4} viewBox={`0 -2 ${DUO.w + 8} ${DUO.h + 4}`} style={{ top: -2 }}>
          <defs>
            <linearGradient id="duoBand" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#CFC8BD" />
              <stop offset="0.35" stopColor="#E2DDD4" />
              <stop offset="0.7" stopColor="#BDB5AA" />
              <stop offset="1" stopColor="#D3CDC3" />
            </linearGradient>
            <linearGradient id="duoHinge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#8F8A82" />
              <stop offset="0.3" stopColor="#C9C3BA" />
              <stop offset="0.55" stopColor="#E4DFD7" />
              <stop offset="0.85" stopColor="#A9A39A" />
              <stop offset="1" stopColor="#5D5850" />
            </linearGradient>
            <linearGradient id="duoBtn" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#B7B0A6" />
              <stop offset="0.5" stopColor="#DCD6CD" />
              <stop offset="1" stopColor="#8E887F" />
            </linearGradient>
          </defs>
          {/* buttons (drawn first so the body overlaps their inner edge) */}
          <rect x={DUO.w - 6} y={DUO.sideButton.y} width={10.5} height={DUO.sideButton.h} rx={3} fill="url(#duoBtn)" stroke="#6F6961" strokeWidth={0.8} />
          {DUO.topButtons.map((b, i) => (
            <rect key={i} x={b.x} y={-1.9} width={b.w} height={8} rx={2.5} fill="#CDC7BE" stroke="#77716A" strokeWidth={0.7} />
          ))}
          {/* hinge strip + groove */}
          <rect x={DUO.hinge.x} y={DUO.hinge.y} width={DUO.bodyX + 8} height={DUO.hinge.h} rx={5.5} fill="#3E3A35" />
          <rect x={DUO.hinge.x + 0.4} y={DUO.hinge.y + 1} width={DUO.hinge.w} height={DUO.hinge.h - 2} rx={5} fill="url(#duoHinge)" />
          {/* body: metal band with polished highlight lines */}
          <path d={inset(0)} fill="url(#duoBand)" />
          <path d={inset(0.6)} fill="none" stroke="#3B3530" strokeWidth={1.2} />
          <path d={inset(2.2)} fill="none" stroke="#9D968C" strokeWidth={1.4} />
          <path d={inset(4)} fill="none" stroke="#FBF8F2" strokeWidth={1.8} />
          <path d={inset(6.6)} fill="none" stroke="#8C857C" strokeWidth={1.1} />
          <path d={inset(8.8)} fill="none" stroke="#E9E4DC" strokeWidth={1.6} />
          {/* antenna breaks */}
          {DUO.notchesTop.map((x) => (
            <rect key={'t' + x} x={x - 2.2} y={0} width={4.4} height={DUO.band} fill="#8A847C" />
          ))}
          {DUO.notchesRight.map((y) => (
            <rect key={'r' + y} x={DUO.w - DUO.band} y={y - 2.2} width={DUO.band} height={4.4} fill="#8A847C" />
          ))}
          {/* black bezel */}
          <path d={inset(DUO.band)} fill="#030303" />
          <path d={inset(DUO.band + 0.5)} fill="none" stroke="#2A2A2A" strokeWidth={1} />
        </svg>
        <div className="duo-screen" style={{ left: s.x, top: s.y, width: s.w, height: s.h, borderRadius: `${s.rl}px ${s.rr}px ${s.rr}px ${s.rl}px` }}>
          {children}
          <div className="duo-camera" style={{ left: c.cx - c.r, top: c.cy - c.r, width: c.r * 2, height: c.r * 2 }}>
            <div className="duo-lens" />
          </div>
        </div>
      </div>
    </div>
  );
};
