import React from 'react';
import { Block, Line, Seg } from './types';
import { HlCtx } from '../broll/ctx';

export type Tone = 'in' | 'out';

const HlSeg: React.FC<{ seg: Extract<Seg, { hl: string }> }> = ({ seg }) => {
  const f = React.useContext(HlCtx);
  const t = Math.min(1, Math.max(0, (f - seg.at) / 10));
  const col = seg.tone === 'ok' ? '34,160,90' : seg.tone === 'dark' ? '255,170,30' : (seg.tone === 'bad' || seg.tone === 'badd') ? '226,70,50' : '238,154,0';
  return (
    <span data-tid={seg.tid} className="wa-bold" style={{ background: `rgba(${col},${0.34 * t})`, boxShadow: `0 0 0 ${4 * t}px rgba(${col},${0.34 * t}), 0 0 ${26 * t}px rgba(${col},${0.55 * t})`, borderRadius: 6, color: t > 0.5 ? (seg.tone === 'dark' ? '#FFC969' : seg.tone === 'badd' ? '#FFD8CF' : seg.tone === 'bad' ? '#A3200F' : '#7A4A00') : undefined }}>{seg.hl}</span>
  );
};

const SegView: React.FC<{ seg: Seg }> = ({ seg }) => {
  if (typeof seg === 'string') return <>{seg}</>;
  if ('hl' in seg) return <HlSeg seg={seg} />;
  if ('b' in seg) return <span className="wa-bold">{seg.b}</span>;
  if ('link' in seg) return <span className="wa-link">{seg.link}</span>;
  if ('emoji' in seg)
    return (
      <span className="wa-emoji" style={seg.size ? { fontSize: seg.size } : undefined}>
        {seg.emoji}
      </span>
    );
  // inline code chip; parts that WhatsApp auto-linked get the link style (white bg + underline)
  return (
    <span className={'wa-code' + (seg.openLeft ? ' open-l' : '') + (seg.openRight ? ' open-r' : '')}>
      {seg.code.map((p, i) =>
        typeof p === 'string' ? (
          <span key={i} className="wa-code-txt">{p}</span>
        ) : (
          <span key={i} className="wa-code-link">{p.link}</span>
        ),
      )}
    </span>
  );
};

const hasEmoji = (line: Line) => line.some((s) => typeof s === 'object' && 'emoji' in s);
const hasCode = (line: Line) => line.some((s) => typeof s === 'object' && 'code' in s);

/** One visual line. Android grows a line's ascent/descent when it contains an emoji or a code chip; mirrored via classes. */
export const LineView: React.FC<{ line: Line; style?: React.CSSProperties; extra?: React.ReactNode }> = ({ line, style, extra }) => (
  <div className={'wa-line' + (hasEmoji(line) ? ' has-emoji' : hasCode(line) ? ' has-code' : '')} style={style}>
    {line.map((s, i) => (
      <SegView key={i} seg={s} />
    ))}
    {extra}
  </div>
);

const markerTop = (l: Line) => (hasEmoji(l) ? 6 : hasCode(l) ? 2 : 0);

/** metaInline: reserve room on the last line for the timestamp (an invisible copy keeps widths exact). */
export const Blocks: React.FC<{ blocks: Block[]; metaInline?: string }> = ({ blocks, metaInline }) => (
  <>
    {blocks.map((b, bi) => {
      const isLastBlock = bi === blocks.length - 1;
      const lines = b.lines.map((l, li) => {
        const last = isLastBlock && li === b.lines.length - 1;
        return (
          <LineView
            key={li}
            line={l}
            style={b.lineGaps && b.lineGaps[li] ? { marginTop: b.lineGaps[li] } : undefined}
            extra={last && metaInline ? <span className="wa-meta-spacer">{metaInline}</span> : null}
          />
        );
      });
      if (b.type === 'p') return <div key={bi} className="wa-p" style={{ marginTop: b.mt ?? 0 }}>{lines}</div>;
      return (
        <div key={bi} className="wa-li" style={{ marginTop: b.mt ?? 0, paddingLeft: b.indent ?? 35 }}>
          <span className={'wa-li-marker' + (b.marker === '•' ? '' : ' ol')} style={{ left: b.markerX ?? 0, top: markerTop(b.lines[0]) }}>
            {b.marker}
          </span>
          {lines}
        </div>
      );
    })}
  </>
);
