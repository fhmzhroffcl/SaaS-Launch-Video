import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, spring, Easing, delayRender, continueRender } from 'remotion';
import './chat/chat.css';
import './duo/duo.css';
import './web/web.css';
import './fonts.css';
import './chat/anim.css';
import './cards/cards.css';
import './showcase.css';
import { DuoFrame } from './duo/DuoFrame';
import { DUO } from './duo/geometry';
import { AnimatedChat, VW, CHAT_Z } from './chat/AnimatedChat';
import { MaiaWindow } from './web/MaiaWindow';
import { SalesOrdersBody } from './web/SalesOrders';
import { invDoc } from './data/web';
import { SoDoc } from './cards/SoDoc';
import { SyncedCard, DnCard, InvoiceCard } from './cards/PopCards';
import { TL, HEADLINES, POSES, FPS, DURATION } from './timeline';
import { Audio } from 'remotion';

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
const prog = (f: number, a: number, d: number, e = easeOut) => e(clamp((f - a) / d));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TAU = Math.PI * 2;
const wave = (f: number, period: number, phase = 0) => Math.sin((f / period) * TAU + phase); // periods divide 900 -> seamless loop

// ---------- layout ----------
const PHONE_S = 1.02;
const PHONE = { w: DUO.w * PHONE_S, h: DUO.h * PHONE_S };
const PHONE_POS = { x: 1080 - PHONE.w - 12, y: 520 };
const K = PHONE_S / CHAT_Z; // chat virtual px -> phone-group px
const scr = (vx: number, vy: number) => ({ x: DUO.screen.x * PHONE_S + vx * K, y: DUO.screen.y * PHONE_S + vy * K });
const DASH_POS = { x: 150, y: 1150 };
const DASH_S = 1.08;
const VH = 965 * CHAT_Z;

// ---------- fonts ----------
const useFonts = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const specs: [string, string?][] = [
      ['800 100px "Plus Jakarta Sans"'], ['600 100px "Plus Jakarta Sans"'], ['400 30px "Google Sans"'], ['500 30px "Google Sans"'],
      ['30px "Noto Color Emoji"', '🙏📄✅📝🧾❤️👍'], ['30px "Noto Sans Mono"'], ['400 13px Inter'], ['600 13px Inter'], ['700 13px Inter'], ['700 13px "Geist Mono"'],
    ];
    Promise.all(specs.map(([s, t]) => document.fonts.load(s, t))).then(() => document.fonts.ready).then(() => continueRender(h));
  }, [h]);
};

// ---------- background ----------
const Background: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill className="bg">
    <div className="glow" style={{ left: 760 + 40 * wave(f, 450), top: 120 + 30 * wave(f, 300, 1), width: 1100, height: 1100, background: 'radial-gradient(circle, rgba(238,154,0,.34) 0%, rgba(238,154,0,.12) 38%, rgba(238,154,0,0) 68%)' }} />
    <div className="glow" style={{ left: 60 + 40 * wave(f, 300, 2), top: 1250 + 40 * wave(f, 450, 0.5), width: 1200, height: 1200, background: 'radial-gradient(circle, rgba(255,164,120,.36) 0%, rgba(255,164,120,.12) 40%, rgba(255,164,120,0) 68%)' }} />
    <div className="glow" style={{ left: 300, top: 620 + 30 * wave(f, 225, 1), width: 900, height: 900, background: 'radial-gradient(circle, rgba(255,214,150,.30) 0%, rgba(255,214,150,0) 65%)' }} />
  </AbsoluteFill>
);

// ---------- headline ----------
const HeadlineText: React.FC<{ lines: (string | { g: string })[][] }> = ({ lines }) => (
  <>
    {lines.map((l, i) => (
      <div key={i} className="hl-line">
        {l.map((seg, j) => (typeof seg === 'string' ? <span key={j}>{seg}</span> : <span key={j} className="hl-g">{seg.g}</span>))}
      </div>
    ))}
  </>
);
const Headline: React.FC<{ f: number }> = ({ f }) => {
  let idx = 0;
  HEADLINES.forEach((h, i) => { if (f >= h.from) idx = i; });
  const cur = HEADLINES[idx];
  const prev = idx > 0 ? HEADLINES[idx - 1] : null;
  const tOut = prev ? prog(f, cur.from, 10, easeInOut) : 1;
  const tIn = prev ? prog(f, cur.from + 5, 18) : 1;
  return (
    <div className="hl-wrap">
      {prev && tOut < 1 ? (
        <div className={prev.small ? 'hl hl-s' : 'hl'} style={{ opacity: 1 - tOut, transform: `translateY(${-26 * tOut}px)`, filter: `blur(${6 * tOut}px)` }}><HeadlineText lines={prev.lines} /></div>
      ) : null}
      <div className={cur.small ? 'hl hl-s' : 'hl'} style={{ opacity: tIn, transform: `translateY(${34 * (1 - tIn)}px)`, filter: tIn < 1 ? `blur(${8 * (1 - tIn)}px)` : undefined }}>
        <HeadlineText lines={cur.lines} />
      </div>
    </div>
  );
};

// ---------- fingertip + ripple ----------
const Finger: React.FC<{ f: number; tap: { in: number; tap: number; out: number }; at: { x: number; y: number }; hold?: number }> = ({ f, tap, at, hold = 0 }) => {
  if (f < tap.in || f > tap.out + 16) return null;
  const inP = prog(f, tap.in, tap.tap - tap.in - 2, easeOut);
  const outP = prog(f, tap.out, 16, Easing.bezier(0.5, 0, 0.75, 0));
  const press = f < tap.tap - 2 ? 0 : f < tap.tap + 3 + hold ? prog(f, tap.tap - 2, 4) : 1 - prog(f, tap.tap + 3 + hold, 5);
  const off = (1 - inP) + outP;
  const x = at.x + 360 * off, y = at.y + 620 * off;
  return (
    <div className="finger" style={{ transform: `translate3d(${x}px, ${y}px, ${150 - 60 * press}px) scale(${1 - 0.05 * press})`, opacity: clamp(1 - outP * 1.2) }}>
      <div className="finger-shadow" style={{ transform: `translate(${34 - 22 * press}px, ${46 - 30 * press}px)`, opacity: 0.26 + 0.12 * press }} />
      <svg className="finger-svg" width="260" height="560" viewBox="-130 -20 260 560">
        <defs>
          <linearGradient id="skin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#D69A76" /><stop offset="0.35" stopColor="#F2C6A6" /><stop offset="0.7" stopColor="#EDB894" /><stop offset="1" stopColor="#C9876A" />
          </linearGradient>
          <linearGradient id="nail" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FBE6DA" /><stop offset="1" stopColor="#F0C9B6" />
          </linearGradient>
        </defs>
        <g transform="rotate(-24)">
          <path d="M-62 60 Q-62 -8 0 -8 Q62 -8 62 60 L66 560 L-66 560 Z" fill="url(#skin)" />
          <path d="M-38 34 Q-38 6 0 6 Q38 6 38 34 L36 96 Q0 108 -36 96 Z" fill="url(#nail)" stroke="#D9A690" strokeWidth="2" />
          <path d="M-40 250 Q0 262 40 250" fill="none" stroke="#C28466" strokeWidth="3" strokeLinecap="round" opacity=".55" />
          <path d="M-34 268 Q0 278 34 268" fill="none" stroke="#C28466" strokeWidth="2.5" strokeLinecap="round" opacity=".4" />
        </g>
      </svg>
    </div>
  );
};
const Ripple: React.FC<{ f: number; at: number; pos: { x: number; y: number } }> = ({ f, at, pos }) => {
  const t = (f - at) / 18;
  if (t < 0 || t > 1) return null;
  return (
    <div className="ripple" style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 3px)` }}>
      <div className="ripple-fill" style={{ transform: `scale(${0.15 + 1.1 * easeOut(t)})`, opacity: 0.32 * (1 - t) }} />
      <div className="ripple-ring" style={{ transform: `scale(${0.25 + 1.35 * easeOut(t)})`, opacity: 0.7 * (1 - t) }} />
    </div>
  );
};

// ---------- pop-out card ----------
type PT = { x: number; y: number; s: number };
const PopCard: React.FC<{ f: number; t: { in: number; out: number }; from: PT; to: PT & { z: number }; w: number; children: React.ReactNode }> = ({ f, t, from, to, w, children }) => {
  if (f < t.in || f > t.out + 16) return null;
  const a = spring({ frame: f - t.in, fps: FPS, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  const b = prog(f, t.out, 16, easeInOut);
  const k = a * (1 - b);
  const hold = f - t.in;
  const x = lerp(from.x, to.x, k), y = lerp(from.y, to.y, k) + 7 * wave(hold, 45) * k;
  const z = to.z * k;
  const s = lerp(from.s, to.s, k);
  const rx = (8 * (1 - clamp(a)) + 3 * wave(hold, 60)) * k;
  const ry = -4 * wave(hold, 90) * k;
  const op = clamp((f - t.in) / 4) * (1 - prog(f, t.out + 8, 8));
  return (
    <div className="pop" style={{ width: w, transform: `translate3d(${x - w / 2}px, ${y}px, ${z}px) translateY(-50%) rotateX(${rx}deg) rotateY(${ry}deg) scale(${s})`, opacity: op }}>
      <div className="pop-inner" style={{ boxShadow: `0 ${16 + z * 0.16}px ${30 + z * 0.22}px rgba(90,52,10,${0.14 + z * 0.00035}), 0 ${4 + z * 0.03}px ${10 + z * 0.03}px rgba(90,52,10,.10)` }}>
        {children}
      </div>
    </div>
  );
};


// ---------- salesperson (photo-real cutouts, one layer in the 3D stage) ----------
const POSE_IMG = {
  a: { file: 'pose-a-typing', cx: 550, cy: 399, ht: 311 },
  b: { file: 'pose-b-pleased', cx: 536, cy: 316, ht: 235 },
  c: { file: 'pose-c-smile', cx: 550, cy: 330, ht: 271 },
  d: { file: 'pose-d-thumbsup', cx: 578, cy: 323, ht: 229 },
} as const;
const HEAD = 150; // face centre -> hair top, in frame px at scale 1
const IMG_W = 1136, IMG_H = 1408;
const SP_SCENE = { x: 178, y: 905, s: 1 };
const SP_END = { x: 540, y: 1235, s: 1.22 };
const PoseImg: React.FC<{ pose: keyof typeof POSE_IMG; op: number; dx: number; ds: number }> = ({ pose, op, dx, ds }) => {
  const p = POSE_IMG[pose];
  const k = HEAD / p.ht;
  const box: React.CSSProperties = { position: 'absolute', left: -p.cx * k, top: -p.cy * k, width: IMG_W * k, height: IMG_H * k };
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, opacity: op, transform: `translateX(${dx}px) scale(${ds})`, transformOrigin: '0 0' }}>
      <Img src={staticFile(`salesperson/${p.file}-shadow.png`)} style={{ ...box, left: box.left as number + 26, top: box.top as number + 16, opacity: 0.55 }} />
      <Img src={staticFile(`salesperson/${p.file}-cutout.png`)} style={box} />
    </div>
  );
};
const Salesperson: React.FC<{ f: number; e: number; d: number }> = ({ f, e, d }) => {
  let idx = 0;
  POSES.forEach((p, i) => { if (f >= p.from) idx = i; });
  const cur = POSES[idx];
  const prev = idx > 0 ? POSES[idx - 1] : null;
  const t = prev ? prog(f, cur.from, 12, easeInOut) : 1;
  const x = lerp(SP_SCENE.x, SP_END.x, e) + 7 * wave(f, 450, 0.7) - 14 * d;
  const y = lerp(SP_SCENE.y, SP_END.y, e) + 5 * wave(f, 225, 1.3);
  const s = lerp(SP_SCENE.s, SP_END.s, e) * (1 + 0.012 * d);
  const breath = 1 + 0.006 * (0.5 + 0.5 * wave(f, 112.5));
  const ry = 3 * wave(f, 300, 0.4);
  // mask in face-centred local px: body fades out toward the bottom
  const mask = 'linear-gradient(to bottom, #000 0px, #000 1000px, transparent 1170px)';
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 0, height: 0, transformStyle: 'preserve-3d', transform: `translate3d(${x}px, ${y}px, -60px) rotateY(${ry}deg) scale(${s})` }}>
      <div className="sp-contact" style={{ opacity: 0.8 * (1 - 0.3 * e) }} />
      <div style={{ position: 'absolute', left: -700, top: -700, width: 1400, height: 1500, WebkitMaskImage: mask, maskImage: mask }}>
        <div style={{ position: 'absolute', left: 700, top: 700, transform: `scaleY(${breath})`, transformOrigin: '0 600px' }}>
          {prev && t < 1 ? <PoseImg pose={prev.pose} op={1} dx={-8 * t} ds={1} /> : null}
          <PoseImg pose={cur.pose} op={t} dx={10 * (1 - t)} ds={1 - 0.015 * (1 - t)} />
        </div>
      </div>
    </div>
  );
};
const SpLabel: React.FC<{ f: number; e: number; d: number }> = ({ f, e, d }) => {
  const inP = 1;
  const op = 1 - e;
  if (op <= 0.001) return null;
  const x = 54 + 7 * wave(f, 450, 0.7) - 14 * d, y = 648 + 5 * wave(f, 225, 1.3);
  return (
    <div className="sp-label" style={{ transform: `translate(${x}px, ${y + 16 * (1 - inP)}px)`, opacity: op }}>
      <div className="sp-pill"><span className="sp-dot" />Salesperson</div>
      <svg className="sp-line" width="120" height="120" viewBox="0 0 120 120">
        <path d="M60 2 C 64 40, 92 58, 104 96" fill="none" stroke="#EE9A00" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="160" strokeDashoffset={160 * (1 - clamp(inP))} />
        <circle cx="104" cy="96" r="7" fill="#EE9A00" stroke="#fff" strokeWidth="3" opacity={clamp(inP)} />
      </svg>
    </div>
  );
};

// ---------- end card ----------
const EndCard: React.FC<{ f: number }> = ({ f }) => {
  const e = TL.end;
  if (f < e.in || f > e.out + 30) return null;
  const bgIn = prog(f, e.in, 14, easeInOut);
  const bgOut = prog(f, e.out + 8, 22, easeInOut);
  const cOut = prog(f, e.out, 8, easeInOut);
  const logo = spring({ frame: f - e.logo, fps: FPS, config: { damping: 13, stiffness: 140 } });
  const tag = prog(f, e.tag, 16);
  const url = spring({ frame: f - e.url, fps: FPS, config: { damping: 12, stiffness: 160 } });
  return (
    <AbsoluteFill className="end" style={{ opacity: bgIn * (1 - bgOut) }}>
      <div className="end-c" style={{ opacity: 1 - cOut, transform: `translateY(${-30 * cOut}px)` }}>
        <Img src={staticFile('maia-wordmark-ink.png')} className="end-logo" style={{ transform: `scale(${0.6 + 0.4 * logo})`, opacity: clamp((f - e.logo) / 5) }} />
        <div className="end-tag" style={{ opacity: tag, transform: `translateY(${24 * (1 - tag)}px)` }}>
          Your AI sales coordinator<br />in <span className="hl-g">WhatsApp</span>.
        </div>
        <div className="end-url" style={{ transform: `scale(${url})`, opacity: clamp((f - e.url) / 4) }}>maia.wasap.my</div>
        <div className="end-sub" style={{ opacity: tag }}>Syncs with SQL Account &amp; AutoCount</div>
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  useFonts();
  const f = useCurrentFrame();
  const chatF = f >= TL.reset ? -1 : f; // chat resets while the end card covers it

  // dashboard presence
  const dashIn = (a: number, b: number) => (f < a || f > b + 20 ? 0 : Math.min(prog(f, a, 22, easeOut), 1 - prog(f, b, 18, easeInOut)));
  const d1 = dashIn(TL.dash1.in, TL.dash1.out);
  const d2 = dashIn(TL.dash2.in, TL.dash2.out);
  const d = Math.max(d1, d2);
  // end card: phone recedes, then returns for the loop
  const eAway = prog(f, TL.end.in - 4, 18, easeInOut);
  const eBack = prog(f, TL.end.out + 6, 24, easeOut);
  const e = f < TL.end.in - 4 ? 0 : eAway * (1 - eBack);

  const bob = 10 * wave(f, 225);
  const ry = 4.5 * wave(f, 300) - 14 * d;
  const rx = 2.5 * wave(f, 450, 1.1) + 2 * d;
  const rz = 0.6 * wave(f, 300, 2);
  const ps = (1 - 0.34 * d) * (1 - 0.1 * e);
  const tx = 70 * d + 60 * e, ty = bob - 270 * d + 90 * e;

  // finger targets (phone-group px)
  const pdfCard = scr(270, VH - 137 - 172);
  const micBtn = scr(VW - 64, VH - 81);

  return (
    <AbsoluteFill className="root">
      <Img src={staticFile('wallpaper.png')} style={{ display: 'none' }} />
      <Background f={f} />
      <Headline f={f} />
      <Audio src={staticFile('audio/mix.wav')} />
      <div className="floor" style={{ left: PHONE_POS.x + PHONE.w / 2 - 290, top: PHONE_POS.y + PHONE.h + 26, width: 580, transform: `translate(${tx * 0.9}px, ${-270 * d}px) scale(${(1 - 0.012 * bob) * ps})`, opacity: (0.9 - 0.02 * bob) * (1 - e) * (1 - 0.6 * d) }} />
      <div className="stage">
        <Salesperson f={f} e={e} d={d} />
        <div className="phone-g" style={{ left: PHONE_POS.x, top: PHONE_POS.y, width: PHONE.w, height: PHONE.h, opacity: 1 - e,
          transform: `translate3d(${tx}px, ${ty}px, 0) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${ps})` }}>
          <DuoFrame scale={PHONE_S} style={{ left: 0, top: 0 }}>
            <AnimatedChat f={chatF} />
          </DuoFrame>
          <Ripple f={f} at={TL.fingerPdf.tap} pos={pdfCard} />
          <Ripple f={f} at={TL.mic.press} pos={micBtn} />
          <PopCard f={f} t={TL.soCard} w={640} from={{ ...scr(VW / 2, 224 + 44 + 332), s: 0.935 }} to={{ x: 300, y: 540, z: 330, s: 0.98 }}>
            <SoDoc width={640} />
          </PopCard>
          <PopCard f={f} t={TL.dnCard} w={720} from={{ ...scr(300, VH - 137 - 180), s: 0.5 }} to={{ x: 300, y: 540, z: 330, s: 0.92 }}>
            <DnCard />
          </PopCard>
          <Finger f={f} tap={TL.fingerPdf} at={pdfCard} />
          <Finger f={f} tap={{ in: TL.mic.fingerIn, tap: TL.mic.press, out: TL.mic.fingerOut }} at={micBtn} hold={TL.mic.release - TL.mic.press - 3} />
        </div>
      </div>
      <div className="stage">
        {d > 0 ? (
          <div className="dash-g" style={{ left: DASH_POS.x, top: DASH_POS.y, width: 780 * DASH_S, height: 704 * DASH_S, transform: `translate3d(${(1 - d) * 1150}px, ${(1 - d) * 60}px, 90px) rotateY(${-6 - 22 * (1 - d)}deg) rotateX(3deg)` }}>
            {d1 > 0 ? (
              <MaiaWindow doc={{ ...invDoc, sidebarActive: 'Sales Orders', crumb: 'Selling' }} crumbTail="Sales Orders" width={780} height={690} scale={DASH_S}
                body={<SalesOrdersBody rowP={prog(f, TL.soRow, 12)} synced={f >= TL.soSynced} spin={(f - TL.soRow) * 14} hl={f < TL.soRow ? 1 : 1 - 0.55 * prog(f, TL.soSynced + 20, 30)} actP={TL.act1.map((a) => prog(f, a, 10))} />} />
            ) : (
              <MaiaWindow doc={invDoc} width={780} height={704} scale={DASH_S}
                anim={{ pillP: spring({ frame: f - TL.invPill, fps: FPS, config: { damping: 11, stiffness: 180 } }), chipP: spring({ frame: f - TL.invChip, fps: FPS, config: { damping: 11, stiffness: 180 } }), actP: TL.invAct.map((a) => prog(f, a, 10)) }} />
            )}
            <PopCard f={f} t={TL.syncCard} w={760} from={{ x: 460, y: 200, s: 0.5 }} to={{ x: 560, y: 20, z: 280, s: 0.88 }}>
              <SyncedCard />
            </PopCard>
            <PopCard f={f} t={TL.invCard} w={720} from={{ x: 330, y: 150, s: 0.45 }} to={{ x: 570, y: 60, z: 290, s: 0.88 }}>
              <InvoiceCard />
            </PopCard>
          </div>
        ) : null}
      </div>
      <SpLabel f={f} e={e} d={d} />
      <EndCard f={f} />
    </AbsoluteFill>
  );
};
export { DURATION };
