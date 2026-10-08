import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LChat, LRow } from './LChat';
import { Bg, Ripple } from './Common';
import { Paper, DeskBg, Photo, PAPER_W, PAPER_H } from './Paper';
import { PhoneCam, PH_W, PH_H } from './PhoneCam';
import { ManualCard, MAN_W, MAN_H } from './Manual';
import { MailCard, MAIL_W, MAIL_H } from './Email';
import { Layout } from './layout';
import { ip, prog, easeOut, easeIO, clamp, pop } from './u';
import { maia, p, e, GAP, GAP_IN } from '../data/helpers';

export const S2_FRAMES = 690;
export const S2 = { texts: [42, 50, 58, 66, 74], voice: 82, play: [90, 140] as [number, number], shimmer: [98, 128] as [number, number], transAt: 128,
  paperIn: 134, write: [146, 180] as [number, number], phoneIn: 178, shutter: 236, photoFly: [242, 274], img: 275, mailIn: 286, tap: 330, send: 366, end: 690,
  manual: [[420, 500], [504, 580], [584, 650]] as [number, number][] };

const rows = (): LRow[] => [
  { kind: 'date', id: 'd', label: 'Today' },
  { kind: 'text', id: 't1', at: S2.texts[0], m: maia('10:41', [p('Salam bos, order utk', L1('Rabu ni ye ', '🙏'))], { tail: true }) },
  { kind: 'text', id: 't2', at: S2.texts[1], m: maia('10:41', [p('ayam fillet 30kg', 'mee kuning small one 10')], { gapBefore: GAP_IN }) },
  { kind: 'text', id: 't3', at: S2.texts[2], m: maia('10:41', [p('kobis 20kg jgn lupa tau')], { gapBefore: GAP_IN }) },
  { kind: 'text', id: 't4', at: S2.texts[3], m: maia('10:42', [p('udang 2 ctn')], { gapBefore: GAP_IN }) },
  { kind: 'text', id: 't5', at: S2.texts[4], m: maia('10:42', [p('lagi satu, nnt saya', 'hantar voice note')], { gapBefore: GAP_IN }) },
  { kind: 'voice', id: 'v', at: S2.voice, time: '10:43', dur: '0:23', play: S2.play, shimmer: S2.shimmer, transAt: S2.transAt, transcript: ['Ayam whole dua puluh ekor,', 'minyak masak 5kg enam tin ya.'] },
  { kind: 'image', id: 'img', at: S2.img, time: '10:46', w: 400, h: 490, node: <Photo w={400} h={490} /> },
];
function L1(...a: any[]) { return a.map((x) => (x === '🙏' ? e(x) : x)); }

export const Scene2: React.FC<{ f: number; lay: Layout }> = ({ f, lay }) => {
  const { W, H, K, land, ex, ey, es } = lay;
  // ---- chat camera ----
  const away = land
    ? ip(f, [[S2.paperIn, 0], [S2.paperIn + 22, 0.35], [S2.photoFly[1] - 4, 0.35], [S2.photoFly[1] + 10, 0], [S2.mailIn, 0], [S2.mailIn + 20, 0.35], [S2.send + 30, 0.35], [S2.manual[0][0] - 6, 0.5]])
    : ip(f, [[S2.paperIn, 0], [S2.paperIn + 24, 1], [S2.photoFly[0] + 6, 1], [S2.photoFly[1] + 10, 0], [S2.mailIn - 4, 0], [S2.mailIn + 20, 0.85], [S2.manual[0][0], 1]]);
  const cs = ip(f, [[0, 1.0], [S2.voice - 10, 1.05], [S2.play[1], 1.12], [S2.paperIn, 1.0], [S2.img, 1.04], [S2.send + 20, 1.0], [S2.end, 1.0]]);
  const cy = ip(f, [[0, 640], [S2.voice, 720], [S2.play[1], 780], [S2.paperIn, 620]]);
  const chatEnter = prog(f, 0, 24);
  const chatScale = K * (land ? 1 + (cs - 1) * 0.4 : cs) * (1 - 0.16 * away) * (0.94 + 0.06 * chatEnter);
  const side = ip(f, [[0, 0], [S2.paperIn - 14, 0], [S2.paperIn + 10, 1], [S2.photoFly[1] + 14, 1], [S2.photoFly[1] + 36, 0], [S2.mailIn - 22, 0], [S2.mailIn + 6, 1]]);
  const ccx = land ? (lay.chatX + (662 * K) / 2) * side + (W / 2) * (1 - side) : W / 2;
  const ccy = land ? lay.chatY + (1177 * K) / 2 : lay.chatY + (1177 * K) / 2;
  const chatT = `translate(${ccx}px, ${ccy + 70 * away}px) scale(${chatScale}) translate(-331px, -588.5px)`;
  const writeP = ip(f, [[S2.write[0], 0], [S2.write[1], 1]], (x) => x);
  const paperIn = prog(f, S2.paperIn, 24);
  const paperOut = prog(f, S2.phoneIn + 30, 24);
  const phone = prog(f, S2.phoneIn, 34);
  const phoneOut = prog(f, S2.photoFly[0] + 4, 26, easeIO);
  const flash = f >= S2.shutter && f < S2.shutter + 12 ? 0.92 * (1 - (f - S2.shutter) / 12) : 0;
  const flyT = prog(f, S2.photoFly[0], S2.photoFly[1] - S2.photoFly[0], easeIO);
  const mailEnter = prog(f, S2.mailIn, 30);
  const mailOut = prog(f, S2.send + 4, 30, easeIO);
  const el = (cxm = 0): React.CSSProperties => ({ position: 'absolute', left: ex + cxm, top: ey, transformOrigin: '0 0' });
  const photoVisible = f >= S2.photoFly[0] && f < S2.photoFly[1] + 3;
  // image bubble target (approx stage position of the image bubble)
  const tgt = land ? { x: lay.chatX + 330 * K, y: lay.chatY + 760 * K, s: 0.6 * K } : { x: W / 2 - 20, y: 1080, s: 0.62 * K };
  return (
    <AbsoluteFill style={{ background: '#0B0B0D', overflow: 'hidden' }}>
      <Bg f={f} />
      {/* chat layer */}
      <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: chatT, opacity: chatEnter * (1 - 0.55 * away), filter: `blur(${away * (land ? 3 : 16)}px) brightness(${1 - 0.45 * away})` }}>
        <div style={{ width: 662, height: 1177, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 0 3px rgba(255,255,255,.07)' }}>
          <LChat f={f} rows={rows()} title="Mak Long Kitchen" avatar={undefined} clock="10:43" />
        </div>
      </div>
      {/* desk + paper */}
      {paperIn > 0 && paperOut < 1 ? (
        <AbsoluteFill style={{ opacity: paperIn * (1 - paperOut * 0.0) * (1 - clamp((f - (S2.photoFly[0] + 6)) / 20)) }}>
          {land ? <div style={{ position: 'absolute', left: 560, top: 0, right: 0, bottom: 0, overflow: 'hidden' }}><DeskBg /></div> : <DeskBg />}
          <div style={{ ...el(), transform: `translate(${-PAPER_W * es * 0.5 * (1 + 0.1 * (1 - paperIn))}px, ${-PAPER_H * es * 0.5 + (1 - paperIn) * 200 + paperOut * 40}px) rotate(${-2 + 2 * paperIn}deg) scale(${es * (1 + 0.06 * (1 - paperIn)) * (1 - 0.12 * paperOut)})`, filter: `blur(${paperOut * 10}px)`, transformOrigin: '0 0' }}>
            <Paper p={writeP} />
          </div>
        </AbsoluteFill>
      ) : null}
      {/* phone with hand */}
      {phone > 0 && phoneOut < 1 ? (
        <div style={{ ...el(), transform: `translate(${-PH_W * es * 0.5}px, ${-PH_H * es * 0.5 + (1 - phone) * (H * 0.7) + phoneOut * H * 0.55}px) scale(${es * (1 - 0.1 * phoneOut)}) rotate(${(1 - phone) * 6}deg)`, transformOrigin: '0 0', opacity: 1 - phoneOut * 0.8 }}>
          <PhoneCam f={f} t0={S2.phoneIn + 18} shutterAt={S2.shutter} />
        </div>
      ) : null}
      {/* photo flying into chat */}
      {photoVisible ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', opacity: 1 - clamp((f - (S2.photoFly[1] - 1)) / 3), borderRadius: 28 / Math.max(0.3, 1), overflow: 'hidden',
          transform: `translate(${ex + (tgt.x - ex) * flyT - 280 * es * (1 - flyT) - 200 * flyT}px, ${ey + (tgt.y - ey) * flyT - 560 * es * (1 - flyT) - 245 * flyT}px) scale(${es * 1 + (tgt.s - es * 1) * flyT})`, boxShadow: '0 30px 80px rgba(0,0,0,.5)' }}>
          <Photo w={560} h={1120} />
        </div>
      ) : null}
      {/* email */}
      {mailEnter > 0 && mailOut < 1 ? (
        <div style={{ ...el(), transformOrigin: '0 0', perspective: 1800,
          transform: `translate(${-MAIL_W * es * 0.5 + mailOut * (land ? 500 : 0)}px, ${-MAIL_H * es * 0.5 + (1 - mailEnter) * 260 - mailOut * (H * 0.9)}px) scale(${es * (0.94 + 0.06 * mailEnter) * (1 - 0.3 * mailOut)}) rotate(${mailOut * 6}deg)`, opacity: mailEnter * (1 - clamp(mailOut * 1.3 - 0.3)) }}>
          <MailCard f={f} tap={S2.tap} sendAt={S2.send} />
        </div>
      ) : null}
      {(() => { const mi = prog(f, S2.manual[0][0] - 8, 26); return mi > 0 ? (
        <div style={{ ...el(), transformOrigin: '0 0', opacity: mi, transform: `translate(${-MAN_W * es * 0.5}px, ${-MAN_H * es * 0.5 + (1 - mi) * 240}px) scale(${es * (0.94 + 0.06 * mi)})` }}>
          <ManualCard f={f} tabs={S2.manual} />
        </div>) : null; })()}
      <Ripple x={ex - MAIL_W * es * 0.5 + (MAIL_W - 40 - 160) * es} y={ey - MAIL_H * es * 0.5 + (MAIL_H - 100) * es} t={(f - S2.tap + 2) / 20} />
      <AbsoluteFill style={{ background: '#fff', opacity: flash, pointerEvents: 'none' }} />
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
