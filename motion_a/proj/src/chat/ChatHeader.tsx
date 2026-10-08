import React from 'react';
import { Img } from 'remotion';
import { ArrowBack, MoreVert } from './Icons';

export const ChatHeader: React.FC<{ name: string; subtitle: string; avatar: string }> = ({ name, subtitle, avatar }) => (
  <div className="chat-header">
    <div className="hdr-back">
      <ArrowBack size={45} color="#0B0F12" />
    </div>
    <div className="hdr-avatar">
      <Img src={avatar} alt="" />
    </div>
    <div className="hdr-name">{name}</div>
    <div className="hdr-sub">{subtitle}</div>
    <div className="hdr-more">
      <MoreVert size={45} color="#0B0F12" />
    </div>
  </div>
);
