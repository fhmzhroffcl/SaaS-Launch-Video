import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from './u';

export const Bg: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: C.black }}>
    <div style={{ position: 'absolute', left: -300 + Math.sin(f / 90) * 40, top: -260, width: 1000, height: 1000, borderRadius: '50%', background: 'radial-gradient(circle, rgba(217,215,245,.20), rgba(217,215,245,0) 65%)' }} />
    <div style={{ position: 'absolute', right: -360 + Math.cos(f / 110) * 40, bottom: -300, width: 1200, height: 1200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(238,154,0,.20), rgba(238,154,0,0) 65%)' }} />
    <div style={{ position: 'absolute', inset: 0, opacity: 0.5, backgroundImage: 'radial-gradient(rgba(255,255,255,.07) 2px, transparent 2.5px)', backgroundSize: '60px 60px', backgroundPosition: `${-f * 0.3}px ${-f * 0.2}px` }} />
  </AbsoluteFill>
);

export const Ripple: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 1) return null;
  return (
    <div style={{ position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, pointerEvents: 'none', zIndex: 50 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid rgba(217,215,245,.95)', transform: `scale(${0.4 + t * 1.2})`, opacity: 1 - t }} />
      <div style={{ position: 'absolute', inset: 30, borderRadius: '50%', background: 'rgba(217,215,245,.55)', transform: `scale(${1 - t * 0.5})`, opacity: 1 - t * 0.6 }} />
    </div>
  );
};
