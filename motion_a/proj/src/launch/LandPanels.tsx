import React from 'react';
import { Photo } from './Paper';
import { prog, pop, clamp, easeIO, easeOut, lerp } from './u';

const F = 'Inter, sans-serif';
const WAVE = Array.from({ length: 40 }, (_, i) => 0.2 + 0.8 * Math.min(1, Math.abs(Math.sin(i * 1.7) * 0.55 + Math.sin(i * 0.63 + 1) * 0.35 + Math.sin(i * 3.1) * 0.2)));

const Wave: React.FC<{ f: number; p: number; w: number; dark?: boolean }> = ({ f, p, w, dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: w, height: 80 }}>
    {WAVE.map((a, i) => <span key={i} style={{ display: 'block', width: 6, borderRadius: 3, height: (10 + a * 56) * (1 + 0.15 * Math.sin(f / 2.2 + i) * (Math.abs(i / WAVE.length - p) < 0.1 ? 2 : 0.5)), background: i / WAVE.length < p ? '#EE9A00' : dark ? '#6B6B78' : '#C4C9CB' }} />)}
  </div>
);

const Card: React.FC<{ label: string; w: number; h: number; hot?: number; children: React.ReactNode }> = ({ label, w, h, hot = 0, children }) => (
  <div style={{ width: w, height: h, borderRadius: 40, background: 'linear-gradient(180deg,#1C1C22,#131317)', border: `3px solid ${hot > 0.5 ? '#EE9A00' : 'rgba(255,255,255,.12)'}`, boxShadow: hot > 0.5 ? '0 0 50px rgba(238,154,0,.35), 0 40px 80px rgba(0,0,0,.5)' : '0 40px 80px rgba(0,0,0,.5)', padding: '26px 34px', fontFamily: F, color: '#fff', position: 'relative', overflow: 'hidden', boxSizing: 'border-box' }}>
    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: 1.5, color: '#D9D7F5', textTransform: 'uppercase', lineHeight: '34px' }}>{label}</div>
    {children}
  </div>
);

const CW = 530, CH = 410;
const CELLS: [number, number][] = [[770, 90], [1330, 90], [770, 540], [1330, 540]];

/** 3a landscape: the four inputs sit as large cards and travel into the MAIA chat on the left. */
export const FwdCards: React.FC<{ f: number; fwd: number[]; tgt: [number, number][] }> = ({ f, fwd, tgt }) => (
  <>
    {CELLS.map(([x, y], i) => {
      const appear = pop(f, 6 + i * 12, 13, 170);
      const flyStart = fwd[i] - 14, ft = prog(f, flyStart, 22, easeIO);
      const done = f >= fwd[i] + 8;
      const ghost = prog(f, fwd[i] + 8, 14);
      const cx = lerp(x, tgt[i][0] - CW / 2, ft), cy = lerp(y, tgt[i][1] - CH / 2, ft);
      const sc = lerp(1, 0.32, ft) * (done ? 1 : 1);
      const drift = Math.sin(f / 70 + i) * 6;
      return (
        <React.Fragment key={i}>
          {ft > 0 && ft < 1 ? <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}><path d={`M ${x} ${y + CH / 2} C ${x - 120} ${y + CH / 2}, ${tgt[i][0] + 120} ${tgt[i][1]}, ${tgt[i][0]} ${tgt[i][1]}`} stroke="#EE9A00" strokeWidth="5" strokeDasharray="14 12" fill="none" opacity={0.8 * (1 - ft)} /></svg> : null}
          <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '50% 50%', opacity: (f < 6 + i * 12 ? 0 : 1) * (1 - 0.5 * ft), transform: `translate(${x}px, ${y + drift}px) scale(${appear})` }}>
            <Card label={['WhatsApp message', 'Voice note', 'Handwritten list', 'Email'][i]} w={CW} h={CH} hot={ft > 0 && !done ? 1 : 0}>
              {i === 0 ? <div style={{ marginTop: 24, fontSize: 38, lineHeight: '54px', fontWeight: 600, color: '#fff' }}>ayam fillet 30kg<br />mee kuning small one 10<br />kobis 20kg<br />udang 2 ctn</div> : null}
              {i === 1 ? <div style={{ marginTop: 28 }}><div style={{ display: 'flex', alignItems: 'center', gap: 22 }}><svg width="46" height="52" viewBox="0 0 30 34"><path d="M4 3 L27 17 L4 31 Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /></svg><Wave f={f} p={0} w={380} dark /></div><div style={{ marginTop: 18, fontSize: 36, fontWeight: 700, color: '#B9B9C6' }}>0:23</div><div style={{ marginTop: 10, fontSize: 30, color: '#B9B9C6', fontStyle: 'italic' }}>Ayam whole dua puluh ekor…</div></div> : null}
              {i === 2 ? <div style={{ position: 'absolute', left: 34, right: 34, top: 74, bottom: 0, borderRadius: '20px 20px 0 0', overflow: 'hidden' }}><Photo w={CW - 68} h={420} /></div> : null}
              {i === 3 ? <div style={{ marginTop: 30, display: 'flex', gap: 22, alignItems: 'center' }}><div style={{ width: 96, height: 96, borderRadius: 26, background: '#D9D7F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="58" height="58" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#0B0B0D" strokeWidth="2" /><path d="M3.5 7 L12 13 L20.5 7" fill="none" stroke="#0B0B0D" strokeWidth="2" strokeLinejoin="round" /></svg></div><div><div style={{ fontSize: 36, fontWeight: 800, lineHeight: '44px' }}>Order for Wed 7 Oct</div><div style={{ fontSize: 28, color: '#B9B9C6', lineHeight: '38px' }}>Dapur Mak Long Catering</div></div></div> : null}
              {i === 3 ? <div style={{ marginTop: 26, fontSize: 30, lineHeight: '44px', color: '#D9D7F5' }}>Isi ayam beku 30 kg<br />Ayam whole 1.2kg 20 ekor<br />Mee kuning 500g 10 pkt</div> : null}
            </Card>
          </div>
          {ft > 0 && ft < 1 ? <div style={{ position: 'absolute', left: 0, top: 0, transformOrigin: '50% 50%', opacity: 1 - clamp(ft - 0.7) * 3.3, transform: `translate(${cx}px, ${cy}px) scale(${sc}) rotate(${ft * -4}deg)` }}>
            <Card label={['WhatsApp message', 'Voice note', 'Handwritten list', 'Email'][i]} w={CW} h={CH} hot={ft > 0 && !done ? 1 : 0}>
              {i === 0 ? <div style={{ marginTop: 24, fontSize: 38, lineHeight: '54px', fontWeight: 600, color: '#fff' }}>ayam fillet 30kg<br />mee kuning small one 10<br />kobis 20kg<br />udang 2 ctn</div> : null}
              {i === 1 ? <div style={{ marginTop: 28 }}><div style={{ display: 'flex', alignItems: 'center', gap: 22 }}><svg width="46" height="52" viewBox="0 0 30 34"><path d="M4 3 L27 17 L4 31 Z" fill="#fff" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /></svg><Wave f={f} p={0} w={380} dark /></div><div style={{ marginTop: 18, fontSize: 36, fontWeight: 700, color: '#B9B9C6' }}>0:23</div><div style={{ marginTop: 10, fontSize: 30, color: '#B9B9C6', fontStyle: 'italic' }}>Ayam whole dua puluh ekor…</div></div> : null}
              {i === 2 ? <div style={{ position: 'absolute', left: 34, right: 34, top: 74, bottom: 0, borderRadius: '20px 20px 0 0', overflow: 'hidden' }}><Photo w={CW - 68} h={420} /></div> : null}
              {i === 3 ? <div style={{ marginTop: 30, display: 'flex', gap: 22, alignItems: 'center' }}><div style={{ width: 96, height: 96, borderRadius: 26, background: '#D9D7F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="58" height="58" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#0B0B0D" strokeWidth="2" /><path d="M3.5 7 L12 13 L20.5 7" fill="none" stroke="#0B0B0D" strokeWidth="2" strokeLinejoin="round" /></svg></div><div><div style={{ fontSize: 36, fontWeight: 800, lineHeight: '44px' }}>Order for Wed 7 Oct</div><div style={{ fontSize: 28, color: '#B9B9C6', lineHeight: '38px' }}>Dapur Mak Long Catering</div></div></div> : null}
              {i === 3 ? <div style={{ marginTop: 26, fontSize: 30, lineHeight: '44px', color: '#D9D7F5' }}>Isi ayam beku 30 kg<br />Ayam whole 1.2kg 20 ekor<br />Mee kuning 500g 10 pkt</div> : null}
            </Card>
          </div> : null}
          {done ? <div style={{ position: 'absolute', left: x + CW - 250, top: y + CH - 66, width: 220, height: 48, borderRadius: 26, background: '#EE9A00', color: '#0B0B0D', fontFamily: F, fontWeight: 800, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: ghost, transform: `scale(${0.8 + 0.2 * ghost})` }}><svg width="26" height="26" viewBox="0 0 18 18"><path d="M3 9.5 L7.2 13.5 L15 4.8" stroke="#0B0B0D" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>Sent to MAIA</div> : null}
        </React.Fragment>
      );
    })}
  </>
);

const PX = 770, PW = 1090;
const SEC = [{ y: 70, h: 240 }, { y: 330, h: 240 }, { y: 590, h: 280 }, { y: 890, h: 120 }];
const CHAT_X = 705, CHAT_Y = [260, 470, 650, 850];

const Link: React.FC<{ f: number; i: number; at: number }> = ({ f, i, at }) => {
  const t = prog(f, at, 14);
  if (t <= 0) return null;
  const y0 = SEC[i].y + SEC[i].h / 2, y1 = CHAT_Y[i];
  return (
    <svg style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, pointerEvents: 'none' }}>
      <path d={`M ${PX} ${y0} C ${PX - 40} ${y0}, ${CHAT_X + 40} ${y1}, ${CHAT_X} ${y1}`} stroke="#EE9A00" strokeWidth="5" strokeDasharray="12 10" strokeDashoffset={-f * 1.5} fill="none" opacity={0.9 * t} pathLength={1} />
      <circle cx={CHAT_X} cy={y1} r={9 * t} fill="#EE9A00" />
    </svg>
  );
};

const Tok: React.FC<{ f: number; at: number; kind: 'item' | 'qty'; children: React.ReactNode }> = ({ f, at, kind, children }) => {
  const t = prog(f, at, 8);
  const c = kind === 'item' ? '217,215,245' : '238,154,0';
  return <span style={{ background: `rgba(${c},${0.28 * t})`, boxShadow: `0 0 0 ${3 * t}px rgba(${c},${0.45 * t})`, borderRadius: 8, padding: '0 6px', margin: '0 -2px', color: t > 0.5 ? (kind === 'item' ? '#D9D7F5' : '#FFC969') : '#fff' }}>{children}</span>;
};

/** 3b landscape: MAIA reads the message, the voice note, the handwriting, the email. */
export const ReadPanel: React.FC<{ f: number; read: number[]; out: number }> = ({ f, read, out }) => {
  const enter = prog(f, 0, 18), leave = prog(f, out, 24, easeIO);
  const act = (i: number) => (f >= read[i] ? 1 : 0) * (i < 3 ? (f < read[i + 1] ? 1 : 0.0) : 1);
  const [r0, r1, r2, r3] = read;
  const vp = clamp((f - (r1 + 4)) / 60);
  const words = ['Ayam', 'whole', 'dua puluh', 'ekor,', 'minyak', 'masak', '5kg', 'enam', 'tin', 'ya.'];
  const ocr = ['Dapur Mak Long', 'Order Rabu 7/10', 'ayam fillet 30kg', 'ayam whole 20 ekor', 'mee kuning small one 10'];
  const scan = clamp((f - r2) / 70);
  const ocrP = (k: number) => prog(f, r2 + 14 + k * 9, 10);
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, opacity: enter * (1 - leave), filter: `blur(${leave * 12}px)`, transform: `translateX(${-f * 0.06 + leave * 40}px)` }}>
      {[r0, r1, r2, r3].map((r, i) => <Link key={i} f={f} i={i} at={r - 4} />)}
      {/* A: message */}
      <div style={{ position: 'absolute', left: PX, top: SEC[0].y, width: PW }}>
        <Card label="Reads the message" w={PW} h={SEC[0].h} hot={f >= r0 && f < r1 ? 1 : 0}>
          <div style={{ marginTop: 16, fontSize: 40, lineHeight: '56px', fontWeight: 600, display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 30 }}>
            <div><Tok f={f} at={r0 + 4} kind="item">ayam fillet</Tok> <Tok f={f} at={r0 + 9} kind="qty">30kg</Tok></div>
            <div><Tok f={f} at={r0 + 24} kind="item">kobis</Tok> <Tok f={f} at={r0 + 28} kind="qty">20kg</Tok></div>
            <div><Tok f={f} at={r0 + 14} kind="item">mee kuning small one</Tok> <Tok f={f} at={r0 + 18} kind="qty">10</Tok></div>
            <div><Tok f={f} at={r0 + 34} kind="item">udang</Tok> <Tok f={f} at={r0 + 38} kind="qty">2 ctn</Tok></div>
          </div>
        </Card>
      </div>
      {/* B: voice */}
      <div style={{ position: 'absolute', left: PX, top: SEC[1].y, width: PW }}>
        <Card label="Listens to the voice note" w={PW} h={SEC[1].h} hot={f >= r1 && f < r2 ? 1 : 0}>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#EE9A00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="30" height="34" viewBox="0 0 30 34"><rect x="3" y="2" width="8" height="30" rx="2" fill="#0B0B0D" /><rect x="19" y="2" width="8" height="30" rx="2" fill="#0B0B0D" /></svg></div>
            <Wave f={f} p={vp} w={780} dark />
            <div style={{ fontSize: 32, fontWeight: 700, color: '#B9B9C6' }}>0:23</div>
          </div>
          <div style={{ marginTop: 18, fontSize: 38, lineHeight: '52px', fontStyle: 'italic', color: '#fff', whiteSpace: 'nowrap' }}>
            {words.map((w, i) => <span key={i} style={{ opacity: prog(f, r1 + 10 + i * 5, 6), marginRight: 12 }}>{w}</span>)}
          </div>
        </Card>
      </div>
      {/* C: handwriting */}
      <div style={{ position: 'absolute', left: PX, top: SEC[2].y, width: PW }}>
        <Card label="Reads the handwriting" w={PW} h={SEC[2].h} hot={f >= r2 && f < r3 ? 1 : 0}>
          <div style={{ position: 'absolute', left: 34, top: 76, width: 280, height: 186, borderRadius: 18, overflow: 'hidden' }}>
            <Photo w={280} h={186} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: '#EE9A00', boxShadow: '0 0 24px #EE9A00', opacity: scan < 1 ? 1 : 0 }} />
          </div>
          <div style={{ position: 'absolute', left: 350, top: 70, right: 30, fontSize: 32, lineHeight: '34px', fontWeight: 600 }}>
            {ocr.map((l, k) => { const t = ocrP(k); return <div key={k} style={{ opacity: t, filter: `blur(${(1 - t) * 6}px)`, fontFamily: 'Geist Mono, monospace', color: k < 2 ? '#B9B9C6' : '#fff', transform: `translateX(${(1 - t) * 14}px)`, height: 34, whiteSpace: 'nowrap', marginBottom: 2 }}>{l}</div>; })}
          </div>
        </Card>
      </div>
      {/* D: email */}
      <div style={{ position: 'absolute', left: PX, top: SEC[3].y, width: PW }}>
        <Card label="" w={PW} h={SEC[3].h} hot={f >= r3 ? 1 : 0}>
          <div style={{ position: 'absolute', left: 34, right: 34, top: 0, bottom: 0, display: 'flex', alignItems: 'center', gap: 26 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: '#D9D7F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="42" height="42" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="3" fill="none" stroke="#0B0B0D" strokeWidth="2" /><path d="M3.5 7 L12 13 L20.5 7" fill="none" stroke="#0B0B0D" strokeWidth="2" strokeLinejoin="round" /></svg></div>
            <div style={{ fontSize: 34, fontWeight: 700, flex: 1 }}>Email: Order for Wed 7 Oct</div>
            <div style={{ fontSize: 28, fontWeight: 800, padding: '4px 20px', borderRadius: 24, background: '#EE9A00', color: '#0B0B0D', opacity: prog(f, r3 + 24, 10) }}>6 lines found</div>
          </div>
        </Card>
      </div>
    </div>
  );
};
