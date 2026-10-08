import React from 'react';
import { Message } from '../chat/types';
import { Bubble } from '../chat/Bubble';
import { ChatHeader } from '../chat/ChatHeader';
import { Composer } from '../chat/Composer';
import { DuoStatusBar } from './DuoStatusBar';

export interface DuoChatData {
  clock: string;
  messages: Message[];
  /** extra px the list is pushed down (>0 hides part of the newest bubble; normally 0) */
  listOffset?: number;
}

const base = () => (typeof window !== 'undefined' && (window as any).__ASSET_BASE__) || '';

/** WhatsApp chat laid out for the Duo's 662x965 outer screen; the message list is bottom-anchored and cut at the top. */
/** Chat density: 1 = the 1:1 reference scale (text 4.5% of screen width); 1.5 ≈ real WhatsApp on a ~6.3" outer display. */
export const CHAT_Z = 1.55;

export const DuoChat: React.FC<{ data: DuoChatData; z?: number }> = ({ data, z = CHAT_Z }) => (
  <div className="wa-screen duo-chat" data-maxw={Math.round(662 * z * 0.8)}
    style={{ '--W': 662 * z + 'px', '--H': 965 * z + 'px', '--Z': z, transform: `scale(${1 / z})` } as React.CSSProperties}>
    <div className="duo-wall" style={{ backgroundImage: `url(${base()}wallpaper.png)` }} />
    <div className="duo-list" style={{ transform: data.listOffset ? `translateY(${data.listOffset}px)` : undefined }}>
      {data.messages.map((m) => (
        <Bubble key={m.id} m={m} />
      ))}
    </div>
    <div className="duo-top">
      <DuoStatusBar clock={data.clock} />
      <ChatHeader name="MAIA - AI Sales Coordinator" subtitle="Mindhive Demo" avatar={base() + 'avatar.png'} />
    </div>
    <Composer />
  </div>
);
