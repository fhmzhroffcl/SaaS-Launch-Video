import React from 'react';
import { Img, staticFile } from 'remotion';
import { prog, clamp, pop, easeOut } from './u';

export const MAIL_W = 900, MAIL_H = 1240;
const F = 'Inter, sans-serif';
const BODY = ['Hi team,', 'Please prepare for delivery', 'on Wednesday 7 Oct:', '', 'Isi ayam beku  30 kg', 'Ayam whole 1.2kg  20 ekor', 'Mee kuning 500g  10 pkt', 'Kobis bulat  20 kg', 'Udang 31/40  2 ctn', 'Minyak masak 5kg  6 tin', '', 'Thank you, Mak Long'];

const Icon: React.FC<{ d: string; c?: string }> = ({ d, c = '#6B6F76' }) => (
  <svg width="44" height="44" viewBox="0 0 24 24"><path d={d} fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

/** Generic mail client card (no brand marks). f local frame, tap = frame the Forward button is pressed, sendAt = frame Send pressed. */
export const MailCard: React.FC<{ f: number; tap: number; sendAt: number }> = ({ f, tap, sendAt }) => {
  const press = prog(f, tap - 3, 6);
  const sheet = prog(f, tap + 6, 16);
  const typed = 'MAIA';
  const nTyped = clamp(Math.floor((f - (tap + 18)) / 3) + 1, 0, typed.length);
  const chip = prog(f, tap + 18 + 3 * typed.length + 2, 8);
  const sendP = prog(f, sendAt - 3, 6);
  return (
    <div style={{ width: MAIL_W, height: MAIL_H, borderRadius: 56, background: '#F6F6F8', overflow: 'hidden', position: 'relative', fontFamily: F, color: '#16161A', boxShadow: '0 60px 120px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.08)' }}>
      <div style={{ height: 120, borderBottom: '2px solid #E4E4EA', display: 'flex', alignItems: 'center', padding: '0 40px', gap: 24 }}>
        <Icon d="M15 5 L8 12 L15 19" c="#16161A" />
        <div style={{ fontSize: 36, fontWeight: 700, flex: 1 }}>Inbox</div>
        <Icon d="M4 7h16M6 7l1 12h10l1-12M9 7V4h6v3" />
        <Icon d="M4 6h16v12H4zM4 7l8 6 8-6" />
      </div>
      <div style={{ padding: '36px 48px 0' }}>
        <div style={{ fontSize: 54, fontWeight: 800, lineHeight: '64px', letterSpacing: -0.5 }}>Order for Wed 7 Oct</div>
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 22 }}>
          <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#D9D7F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800 }}>DM</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 36, fontWeight: 700, lineHeight: '44px' }}>Dapur Mak Long Catering</div>
            <div style={{ fontSize: 30, color: '#6B6F76', lineHeight: '38px' }}>to FreezeFood Sdn. Bhd.</div>
          </div>
          <div style={{ fontSize: 30, color: '#6B6F76' }}>9:02</div>
        </div>
        <div style={{ marginTop: 30, borderTop: '2px solid #E4E4EA', paddingTop: 26 }}>
          {BODY.map((l, i) => <div key={i} style={{ fontSize: 38, lineHeight: '58px', height: l ? 58 : 30, color: l.startsWith('Isi') || l.startsWith('Ayam') || l.startsWith('Mee') || l.startsWith('Kobis') || l.startsWith('Udang') || l.startsWith('Minyak') ? '#16161A' : '#3C3F46', fontWeight: 500 }}>{l}</div>)}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 40, right: 40, bottom: 44, height: 112, display: 'flex', gap: 20 }}>
        {['Reply', 'Reply all', 'Forward'].map((t, i) => {
          const fw = i === 2;
          const hot = fw ? press : 0;
          return (
            <div key={t} style={{ flex: 1, borderRadius: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: 32, fontWeight: 700,
              background: fw ? `rgb(${255 - 17 * hot},${255 - 101 * hot},${255 - 255 * hot})` : '#fff', border: `3px solid ${fw ? C2(hot) : '#DADAE2'}`, color: fw && hot > 0.5 ? '#0B0B0D' : '#16161A', transform: fw ? `scale(${1 - 0.05 * Math.sin(hot * Math.PI)})` : undefined }}>
              <svg width="38" height="38" viewBox="0 0 24 24"><path d={fw ? 'M14 4 L21 11 L14 18 M21 11 H8 Q4 11 4 16 V20' : 'M10 4 L3 11 L10 18 M3 11 H16 Q20 11 20 16 V20'} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              {t}
            </div>
          );
        })}
      </div>
      {sheet > 0 ? (
        <>
          <div style={{ position: 'absolute', inset: 0, background: `rgba(11,11,13,${0.45 * sheet})` }} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 640, background: '#fff', borderTopLeftRadius: 56, borderTopRightRadius: 56, transform: `translateY(${(1 - sheet) * 660}px)`, padding: '40px 48px', boxShadow: '0 -20px 60px rgba(0,0,0,.25)' }}>
            <div style={{ width: 90, height: 8, borderRadius: 4, background: '#D3D3DA', margin: '0 auto 30px' }} />
            <div style={{ fontSize: 42, fontWeight: 800, marginBottom: 30 }}>Forward</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, height: 112, borderRadius: 28, border: '3px solid #E4E4EA', padding: '0 28px', fontSize: 34 }}>
              <span style={{ color: '#6B6F76', fontSize: 32 }}>To</span>
              {chip > 0.02 ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 76, borderRadius: 38, background: '#EFEEFB', padding: '0 24px 0 8px', transform: `scale(${0.7 + 0.3 * pop(f, tap + 18 + 3 * typed.length + 2)})`, transformOrigin: '0 50%' }}>
                  <Img src={staticFile('avatar.png')} style={{ width: 60, height: 60, borderRadius: '50%' }} />
                  <div style={{ fontWeight: 700, fontSize: 32, lineHeight: '36px' }}>MAIA</div>
                </div>
              ) : <div style={{ fontWeight: 500 }}>{typed.slice(0, nTyped)}<span style={{ display: 'inline-block', width: 3, height: 38, background: '#EE9A00', verticalAlign: 'middle', marginLeft: 3 }} /></div>}
            </div>
            <div style={{ marginTop: 22, height: 96, borderRadius: 28, border: '3px solid #E4E4EA', padding: '0 28px', display: 'flex', alignItems: 'center', fontSize: 33, color: '#3C3F46', whiteSpace: 'nowrap', overflow: 'hidden' }}>Fwd: Order for Wed 7 Oct</div>
            <div style={{ position: 'absolute', right: 48, bottom: 56, height: 112, padding: '0 56px', borderRadius: 56, background: '#EE9A00', color: '#0B0B0D', display: 'flex', alignItems: 'center', gap: 16, fontSize: 36, fontWeight: 800, transform: `scale(${1 - 0.06 * Math.sin(sendP * Math.PI)})`, boxShadow: '0 12px 30px rgba(238,154,0,.4)' }}>
              Send
              <svg width="40" height="40" viewBox="0 0 24 24"><path d="M3 11 L21 3 L13 21 L11 13 Z" fill="#0B0B0D" /></svg>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
const C2 = (h: number) => (h > 0.02 ? '#EE9A00' : '#DADAE2');
