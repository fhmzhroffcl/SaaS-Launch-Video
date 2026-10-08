// iPhone "Duo" (closed, outer display) geometry, in device units where the screen is 662 wide
// (same unit system as the 1:1 WhatsApp recreation, so chat CSS is reused unchanged).
// Measured from the 1254px reference render (screen 650x948 px -> k = 662/650).
export const DUO = {
  w: 725, h: 1014,
  bodyX: 16.3, // left edge of the main body (hinge strip + groove sit left of it)
  bodyRL: 12.5, bodyRR: 107, // outer corner radii (left / right)
  band: 11, // polished metal band thickness
  screen: { x: 39.7, y: 24.4, w: 662, h: 965, rl: 12.5, rr: 82 },
  camera: { cx: 600.9, cy: 73.4, r: 27.5 }, // screen coords
  hinge: { x: 0, w: 10.2, y: 12, h: 990 },
  sideButton: { y: 309.6, h: 142.6 },
  topButtons: [ { x: 338, w: 89 }, { x: 493, w: 43 } ],
  notchesTop: [164, 606], notchesRight: [140.5, 927.8],
};
