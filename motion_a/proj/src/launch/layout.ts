export type Layout = { id: '9x16' | '16x9'; W: number; H: number; K: number; chatX: number; chatY: number; ex: number; ey: number; es: number; land: boolean };
export const L916: Layout = { id: '9x16', W: 1080, H: 1920, K: 1.36, chatX: 90, chatY: 150, ex: 540, ey: 960, es: 1, land: false };
// landscape: chat on the left, input elements (paper / phone / email / order table) on the right
export const L169: Layout = { id: '16x9', W: 1920, H: 1080, K: 0.88, chatX: 110, chatY: 10, ex: 1280, ey: 540, es: 0.82, land: true };
