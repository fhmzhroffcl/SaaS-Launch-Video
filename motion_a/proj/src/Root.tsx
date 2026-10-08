import React from 'react';
import { Composition, Sequence, AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { WaScene, SceneSpec } from './broll/Scene';
import * as S from './broll/scenes';

const single = (s: SceneSpec) => () => <WaScene spec={s} />;
/** sequential chats with cross-fade; each next scene starts `ov` frames before the previous ends */
const chain = (specs: SceneSpec[], ov: number) => {
  const starts: number[] = [];
  let t = 0;
  specs.forEach((s, i) => { starts.push(t); t += s.frames - ov; });
  const total = starts[specs.length - 1] + specs[specs.length - 1].frames;
  const C: React.FC = () => {
    const f = useCurrentFrame();
    return (
      <AbsoluteFill>
        {specs.map((s, i) => {
          const x = i === 0 ? 1 : interpolate(f, [starts[i], starts[i] + ov], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return <Sequence key={s.id} from={starts[i]} durationInFrames={s.frames}><AbsoluteFill style={{ opacity: x, transform: `translateX(${(1 - x) * 60}px)` }}><WaScene spec={s} /></AbsoluteFill></Sequence>;
        })}
      </AbsoluteFill>
    );
  };
  return { C, total };
};
const lg = S.longify;
const stockOld = chain([S.stockA, S.stockB], 15);
const A2 = lg(S.stockA, 1.45, 'sa'), B2 = lg(S.stockB, 1.45, 'sb');
const stockLong = chain([A2, B2], 22);
const pain = chain([S.painStockA, S.painStockB, S.painStockC], 15);
const list: [string, SceneSpec][] = [
  ['wa_pain_mistakes', S.painMistakes],
  ['wa_price_flag_long', lg(S.priceFlag, 1.55, 'x')], ['wa_addon_order_long', lg(S.addon, 1.45, 'x')],
  ['wa_price_update_long', lg(S.priceUpdate, 1.3, 'x')], ['wa_order_in_long', lg(S.orderIn, 1.3, 'x')],
  ['wa_price_flag', S.priceFlag], ['wa_addon_order', S.addon], ['wa_order_in', S.orderIn], ['wa_price_update', S.priceUpdate],
];
export const RemotionRoot: React.FC = () => (
  <>
    {list.map(([id, s]) => <Composition key={id} id={id.replace(/_/g, '-')} component={single(s)} durationInFrames={s.frames} fps={30} width={1080} height={1920} />)}
    <Composition id="wa-pain-stock" component={pain.C} durationInFrames={pain.total} fps={30} width={1080} height={1920} />
    <Composition id="wa-stock-block-long" component={stockLong.C} durationInFrames={stockLong.total} fps={30} width={1080} height={1920} />
    <Composition id="wa-stock-block" component={stockOld.C} durationInFrames={stockOld.total} fps={30} width={1080} height={1920} />
  </>
);
