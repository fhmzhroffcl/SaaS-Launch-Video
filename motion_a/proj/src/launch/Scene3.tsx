import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LChat, LRow } from './LChat';
import { Bg } from './Common';
import { Photo } from './Paper';
import { OrderTable, TW, TH, ROW0, ROWH, rowStart } from './OrderTable';
import { FwdCards, ReadPanel } from './LandPanels';
import { Layout } from './layout';
import { ip, prog, easeIO, clamp } from './u';
import { maia, me, p, GAP, GAP_IN } from '../data/helpers';

export const S3A_FRAMES = 255, S3B_FRAMES = 660;
// part a: forward to MAIA (VO 26.7-34.6). part b: understand (VO 34.8-56.3; SKU match 44.5-50.2 = local 291-462; table 50.6-56.3 = local 474+)
const TA = { fwd: [44, 88, 132, 176], read: [1e9, 1e9, 1e9, 1e9], typing: [1e9, 1e9], reply: 1e9, table: 1e9, t0: 1e9, total: 1e9 };
const TB = { fwd: [-300, -300, -300, -300], read: [6, 51, 111, 150], typing: [172, 198], reply: 198, table: 252, t0: 300, total: 486 };

const rowsFor = (S: typeof TB): LRow[] => [
  { kind: 'date', id: 'd', label: 'Today' },
  { kind: 'text', id: 'f1', at: S.fwd[0], badge: S.read[0] < 1e8 ? { text: 'Read', at: S.read[0] } : undefined, m: me('10:47', [p('ayam fillet 30kg', 'mee kuning small one 10', 'kobis 20kg', 'udang 2 ctn')], { tail: true, forwarded: true }) },
  { kind: 'voice', id: 'v', at: S.fwd[1], out: true, fwd: true, time: '10:47', dur: '0:23', badge: S.read[1] < 1e8 ? { text: 'Transcribed', at: S.read[1] } : undefined },
  { kind: 'image', id: 'i', at: S.fwd[2], out: true, fwd: true, time: '10:47', w: 300, h: 190, node: <div style={{ position: 'absolute', left: 0, top: -150 }}><Photo w={300} h={400} /></div>, badge: S.read[2] < 1e8 ? { text: 'Handwriting read', at: S.read[2] } : undefined },
  { kind: 'mail', id: 'm', at: S.fwd[3], out: true, fwd: true, time: '10:47', subject: 'Order for Wed 7 Oct', from: 'Dapur Mak Long Catering', badge: S.read[3] < 1e8 ? { text: 'Email read', at: S.read[3] } : undefined },
  { kind: 'typing', id: 'ty', at: S.typing[0], end: S.typing[1] },
  { kind: 'text', id: 'r', at: S.reply, m: maia('10:47', [p('Got it. Draft order for', 'Dapur Mak Long Catering:', '6 items matched,', '1 needs your check.')], { tail: true, gapBefore: GAP }) },
];

export const Scene3: React.FC<{ f: number; lay: Layout; part: 'a' | 'b' }> = ({ f, lay, part }) => {
  const S = part === 'a' ? TA : TB;
  const { W, H, K, land, ex, ey } = lay;
  const es = land ? 0.76 : 0.96;
  const tIn = prog(f, S.table, 30);
  const away = land ? prog(f, S.table + 10, 30) * 0.4 : prog(f, S.table, 28);
  const enter = part === 'a' ? prog(f, 0, 22) : 1;
  const cs = ip(f, part === 'a' ? [[0, 1.0], [S3A_FRAMES, 1.08]] : [[0, 1.06], [S.read[1], 1.1], [S.typing[1], 1.1], [S.table, 1.0]]);
  const ccx = land ? lay.chatX + (662 * K) / 2 : W / 2;
  const ccy = lay.chatY + (1177 * K) / 2;
  const chatT = `translate(${ccx}px, ${ccy + (land ? 0 : 120 * away)}px) scale(${K * cs * (1 - 0.18 * away) * (0.94 + 0.06 * enter)}) translate(-331px, -588.5px)`;
  const active = clamp((f - S.t0) / 28, 0, 5);
  const zt = ip(f, [[S.t0 - 10, 0], [S.t0 + 30, 1], [S.total - 24, 1], [S.total + 16, 0]]);
  const fy = TH / 2 + (ROW0 + ROWH * Math.min(5, active) + 60 - TH / 2) * zt * 0.8;
  const z = 1 + (land ? 0.2 : 0.07) * zt;
  const tx = ex, ty = ey + (1 - tIn) * (land ? 60 : 300);
  const spawn = land ? [lay.chatX + 662 * K * 0.8, lay.chatY + 700 * K] : [W / 2, H * 0.82];
  const off = (i: number): [number, number] => {
    const rcx = tx - (TW / 2) * es * z + (TW / 2) * es * z, rcy = ey + (ROW0 + i * ROWH + 67 - fy) * es * z;
    return [(spawn[0] - rcx) / (es * z) * 0.9, (spawn[1] - rcy) / (es * z)];
  };
  return (
    <AbsoluteFill style={{ background: '#0B0B0D', overflow: 'hidden' }}>
      <Bg f={f} />
      <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', transform: chatT, opacity: enter * (1 - 0.7 * away), filter: `blur(${away * (land ? 3 : 18)}px) brightness(${1 - 0.4 * away})` }}>
        <div style={{ width: 662, height: 1177, borderRadius: 44, overflow: 'hidden', boxShadow: '0 40px 90px rgba(0,0,0,.6), 0 0 0 3px rgba(255,255,255,.07)' }}>
          <LChat f={f} rows={rowsFor(S)} title="MAIA - AI Sales Coordinator" clock="10:47" />
        </div>
      </div>
      {land && part === 'a' ? <FwdCards f={f} fwd={S.fwd} tgt={[[420, 250], [420, 400], [420, 560], [420, 700]]} /> : null}
      {land && part === 'b' ? <ReadPanel f={f} read={S.read} out={S.table - 24} /> : null}
      {tIn > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '0 0', opacity: tIn, transform: `translate(${tx}px, ${ty}px) scale(${es * z}) translate(${-TW / 2}px, ${-fy}px)` }}>
          <OrderTable f={f} t0={S.t0} off={off} totalAt={S.total} />
        </div>
      ) : null}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};
