import { Easing, spring } from 'remotion';
export const FPS = 30;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIO = Easing.bezier(0.65, 0, 0.35, 1);
export const easeSoft = Easing.bezier(0.45, 0, 0.2, 1);
export const prog = (f: number, a: number, d: number, e = easeOut) => e(clamp((f - a) / d));
export const pop = (f: number, at: number, damping = 12, stiffness = 190) => spring({ frame: f - at, fps: FPS, config: { damping, stiffness, mass: 0.7 } });
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** keyframe interpolation: pts = [frame, value][], eased per segment */
export const ip = (f: number, pts: [number, number][], e = easeIO) => {
  if (f <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [f0, v0] = pts[i], [f1, v1] = pts[i + 1];
    if (f < f1) return lerp(v0, v1, e(clamp((f - f0) / (f1 - f0))));
  }
  return pts[pts.length - 1][1];
};
export const C = { black: '#0B0B0D', orange: '#EE9A00', lav: '#D9D7F5', ink: '#16161A' };
