import React from 'react';
import { Composition, useCurrentFrame } from 'remotion';
import { Scene2, S2_FRAMES } from './Scene2';
import { Scene3, S3A_FRAMES, S3B_FRAMES } from './Scene3';
import { L916, L169 } from './layout';

const mk = (C: React.FC<any>, lay: any, part?: string) => () => { const f = useCurrentFrame(); return <C f={f} lay={lay} part={part} />; };
export const LaunchRoot: React.FC = () => (
  <>
    <Composition id="s2-9x16" component={mk(Scene2, L916)} durationInFrames={S2_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="s2-16x9" component={mk(Scene2, L169)} durationInFrames={S2_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="s3a-9x16" component={mk(Scene3, L916, 'a')} durationInFrames={S3A_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="s3a-16x9" component={mk(Scene3, L169, 'a')} durationInFrames={S3A_FRAMES} fps={30} width={1920} height={1080} />
    <Composition id="s3b-9x16" component={mk(Scene3, L916, 'b')} durationInFrames={S3B_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="s3b-16x9" component={mk(Scene3, L169, 'b')} durationInFrames={S3B_FRAMES} fps={30} width={1920} height={1080} />
  </>
);
