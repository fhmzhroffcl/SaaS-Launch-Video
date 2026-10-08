import React from 'react';
import { Message } from './types';
import { Blocks, LineView } from './RichText';
import { PdfCard } from './PdfCard';
import { Ticks, ForwardIcon, ForwardedGlyph } from './Icons';
import { T } from './theme';

const Tail: React.FC<{ side: 'in' | 'out'; color: string }> = ({ side, color }) => (
  <svg className={'wa-tail wa-tail-' + side} width="14" height="22" viewBox="0 0 14 22">
    {side === 'in' ? (
      <path d="M14 0 H3 Q0 0 1.6 2.4 L14 21.5 Z" fill={color} />
    ) : (
      <path d="M0 0 H11 Q14 0 12.4 2.4 L0 21.5 Z" fill={color} />
    )}
  </svg>
);

const Meta: React.FC<{ m: Message; tickColor?: string }> = ({ m, tickColor }) => (
  <div className={'wa-meta wa-meta-' + (m.from === 'me' ? 'out' : 'in')}>
    <span>{m.time}</span>
    {m.ticks ? (
      <span style={{ marginLeft: 7, marginTop: -3 }}>
        <Ticks color={tickColor || T.color.outMeta} />
      </span>
    ) : null}
  </div>
);

/** Animation hooks added for the video: the bubble "stack" (bubble + buttons + reaction) is transformed as one. */
export interface BubbleAnim {
  stackStyle?: React.CSSProperties;
  tickColor?: string;
  custom?: React.ReactNode; // replaces blocks (e.g. voice note)
  below?: React.ReactNode; // interactive buttons under the bubble
  overlay?: React.ReactNode; // reaction badge etc, positioned against the stack
  rowPadBottom?: number;
}

export const Bubble: React.FC<{ m: Message; anim?: BubbleAnim }> = ({ m, anim = {} }) => {
  const out = m.from === 'me';
  const bg = out ? T.color.outBg : T.color.inBg;
  const cap = !!(m.pdf && m.blocks);
  const cls = ['wa-bubble', out ? 'wa-out' : 'wa-in', m.tail ? 'wa-has-tail' : '', m.pdf ? (cap ? 'wa-bubble-pdf wa-pdf-cap' : 'wa-bubble-pdf') : ''].join(' ');
  return (
    <div className={'wa-row ' + (out ? 'wa-row-out' : 'wa-row-in')} style={{ marginTop: m.gapBefore ?? 0, paddingBottom: anim.rowPadBottom }}>
      <div className="wa-stack" style={{ transformOrigin: out ? '100% 0' : '0 0', ...anim.stackStyle }}>
        <div className={cls} style={{ width: m.width, paddingBottom: m.padBottom, ...(m.lineHeight ? ({ '--lh': m.lineHeight + 'px' } as any) : {}) }}>
          {m.tail ? <Tail side={out ? 'out' : 'in'} color={bg} /> : null}
          {m.quote ? (
            <div className={'wa-quote ' + (out ? 'wa-quote-out' : 'wa-quote-in')}>
              <div className="wa-quote-author">{m.quote.author}</div>
              {m.quote.lines.map((l, i) => (
                <LineView key={i} line={l} style={m.quote!.lineGaps?.[i] ? { marginTop: m.quote!.lineGaps[i] } : undefined} />
              ))}
            </div>
          ) : null}
          {m.forwarded ? (
            <div className="wa-fwd-label">
              <ForwardedGlyph color={out ? '#A9A9A9' : '#667075'} />
              <span>Forwarded</span>
            </div>
          ) : null}
          {m.pdf ? <PdfCard pdf={m.pdf} /> : null}
          {anim.custom}
          {m.blocks ? (
            <div className={cap ? 'wa-text wa-caption' : 'wa-text'}>
              <Blocks blocks={m.blocks} metaInline={m.metaInline ? (m.ticks ? m.time + '\u2003\u2002' : m.time) : undefined} />
            </div>
          ) : null}
          {m.metaLine ? <div style={{ height: m.metaLine }} /> : null}
          <Meta m={m} tickColor={anim.tickColor} />
          {m.forward ? (
            <div className="wa-fwd">
              <ForwardIcon size={40} color="#fff" bold={40} />
            </div>
          ) : null}
        </div>
        {anim.below}
        {anim.overlay}
      </div>
    </div>
  );
};
