import React from 'react';
import { Composition } from 'remotion';
import { WaScene, SceneSpec } from './broll/Scene';
import * as S from './scenesA';

const single = (s: SceneSpec) => () => <WaScene spec={s} />;
const list: [string, SceneSpec][] = Object.values(S).filter((s: any) => s && s.rows).map((s: any) => [s.id, s]);
export const RemotionRoot: React.FC = () => (
  <>{list.map(([id, s]) => <Composition key={id} id={id.replace(/_/g, '-')} component={single(s)} durationInFrames={s.frames} fps={30} width={1080} height={1920} />)}</>
);
