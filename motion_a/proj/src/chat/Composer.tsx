import React from 'react';
import { StickerSmiley, AttachIcon, CameraIcon, MicIcon } from './Icons';

export const Composer: React.FC<{ cursor?: boolean; placeholder?: string }> = ({ cursor, placeholder = 'Message' }) => (
  <>
    <div className="composer">
      <div className="cmp-emoji">
        <StickerSmiley size={47} color="#5A6265" />
      </div>
      {cursor ? <div className="cmp-cursor" /> : null}
      <div className="cmp-placeholder">{placeholder}</div>
      <div className="cmp-attach">
        <AttachIcon size={48} color="#5A6265" bold={34} />
      </div>
      <div className="cmp-camera">
        <CameraIcon size={48} color="#5A6265" bold={30} />
      </div>
    </div>
    <div className="cmp-mic">
      <MicIcon size={46} color="#fff" bold={24} />
    </div>
    <div className="gesture-bar" />
  </>
);
