import React from 'react';
// Material Symbols (outlined/rounded, weight 400) paths, viewBox 0 -960 960 960.
const P = {
  arrowBack: 'm274-450 248 248-42 42-320-320 320-320 42 42-248 248h526v60H274Z',
  moreVert:
    'M479.86-160Q460-160 446-174.14t-14-34Q432-228 446.14-242t34-14Q500-256 514-241.86t14 34Q528-188 513.86-174t-34 14Zm0-272Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm0-272Q460-704 446-718.14t-14-34Q432-772 446.14-786t34-14Q500-800 514-785.86t14 34Q528-732 513.86-718t-34 14Z',
  attach:
    'M728-326q0 103-72.18 174.5-72.17 71.5-175 71.5Q378-80 305.5-151.5T233-326v-380q0-72.5 51.5-123.250T408-880q72 0 123.5 50.75T583-706v360q0 42-30 72t-72.5 30q-42.5 0-72.5-29.67-30-29.68-30-72.33v-370h60v370q0 17 12.5 29.5t30.64 12.5q18.14 0 30-12.5T523-346v-360q0-48-33.5-81t-81.71-33q-48.21 0-81.5 33.060T293-706v380q0 78 54.97 132T481-140q77.92 0 132.46-54Q668-248 668-326v-390h60v390Z',
  camera:
    'M479.5-267q72.5 0 121.5-49t49-121.5q0-72.5-49-121T479.5-607q-72.5 0-121 48.5t-48.5 121q0 72.5 48.5 121.5t121 49Zm0-60q-47.5 0-78.5-31.5t-31-79q0-47.5 31-78.5t78.5-31q47.5 0 79 31t31.5 78.5q0 47.5-31.5 79t-79 31.5ZM140-120q-24 0-42-18t-18-42v-513q0-23 18-41.5t42-18.5h147l73-87h240l73 87h147q23 0 41.5 18.5T880-693v513q0 24-18.5 42T820-120H140Zm0-60h680v-513H645l-73-87H388l-73 87H140v513Z',
  mic: 'M408-453.92q-29-30.91-29-75.08v-251q0-41.67 29.44-70.83Q437.88-880 479.940-880t71.56 29.17Q581-821.67 581-780v251q0 44.17-29 75.08Q523-423 480-423t-72-30.92ZM450-120v-136q-106-11-178-89t-72-184h60q0 91 64.29 153t155.5 62q91.21 0 155.71-62Q700-438 700-529h60q0 106-72 184t-178 89v136h-60Z',
  dblDown:
    'm480-284 177-177q9-9 21-9t21 9q9 9 9 21t-9 21L501-221q-5 5-10 7t-11 2q-6 0-11-2t-10-7L261-419q-9-9-9-21t9-21q9-9 21-9t21 9l177 177Zm0-253 177-177q9-9 21-9t21 9q9 9 9 21t-9 21L501-474q-5 5-10 7t-11 2q-6 0-11-2t-10-7L261-672q-9-9-9-21t9-21q9-9 21-9t21 9l177 177Z',
  forward:
    'm644-288-43-43 193-193-193-193 43-43 236 236-236 236ZM81-200v-156q0-85 56.5-141.5T279-554h305L421-717l43-43 236 236-236 236-43-43 163-163H279q-60 0-99 39t-39 99v156H81Z',
};

type IconProps = { size: number; color: string; style?: React.CSSProperties; flipX?: boolean; bold?: number };
// `bold` adds a same-colour stroke (viewBox units) to approximate heavier Material Symbols weights.
const mk = (d: string) => ({ size, color, style, flipX, bold }: IconProps) => (
  <svg width={size} height={size} viewBox="0 -960 960 960" overflow="visible" style={{ display: 'block', transform: flipX ? 'scaleX(-1)' : undefined, ...style }}>
    <path d={d} fill={color} stroke={bold ? color : undefined} strokeWidth={bold || 0} strokeLinejoin="round" />
  </svg>
);
// Back arrow drawn as strokes (source glyph is heavier than Material weight 400).
export const ArrowBack = ({ color }: { size?: number; color: string }) => (
  <svg width={32} height={32} viewBox="0 0 32 32" style={{ display: 'block' }}>
    <path d="M3.2 16 H30.5 M16.5 2.6 L3.2 16 L16.5 29.4" fill="none" stroke={color} strokeWidth="3.4" strokeLinejoin="miter" />
  </svg>
);
export const MoreVert = ({ color }: { size?: number; color: string }) => (
  <svg width={8} height={30} viewBox="0 0 8 30" style={{ display: 'block' }}>
    <circle cx="4" cy="4" r="4" fill={color} /><circle cx="4" cy="15" r="4" fill={color} /><circle cx="4" cy="26" r="4" fill={color} />
  </svg>
);
export const AttachIcon = mk(P.attach);
export const CameraIcon = mk(P.camera);
export const MicIcon = mk(P.mic);
export const DoubleDown = mk(P.dblDown);
export const ForwardIcon = mk(P.forward);

// WhatsApp double tick (read-receipt style, grey).
export const Ticks = ({ color }: { color: string }) => (
  <svg width={31} height={20} viewBox="0 0 31 20" style={{ display: 'block' }}>
    <path d="M1.6 10.6 L8 16.8 L22 2.2" fill="none" stroke={color} strokeWidth="2.9" strokeLinecap="butt" strokeLinejoin="miter" />
    <path d="M13.2 16 L14.4 16.8 L28.8 2.2" fill="none" stroke={color} strokeWidth="2.9" strokeLinecap="butt" strokeLinejoin="miter" />
  </svg>
);

// WhatsApp "emoji / sticker" composer glyph: smiley with tongue in a peeled sticker outline.
export const StickerSmiley = ({ size, color }: { size: number; color: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path
      d="M12 3.2c-4.86 0-8.8 3.94-8.8 8.8 0 4.86 3.94 8.8 8.8 8.8h.9l7.9-7.9V12c0-4.86-3.94-8.8-8.8-8.8Z"
      fill="none" stroke={color} strokeWidth="1.9" strokeLinejoin="round"
    />
    <circle cx="8.6" cy="9.9" r="1.35" fill={color} />
    <circle cx="15.4" cy="9.9" r="1.35" fill={color} />
    <path d="M7.4 13.6c1.1 1.3 2.8 2 4.6 2s3.5-.7 4.6-2" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10.6 15.4v1.6a1.5 1.5 0 0 0 3 0v-1.8" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// Red PDF document icon used in attachment cards (37x45 in the source).
export const PdfIcon = () => (
  <svg width={37} height={45} viewBox="0 0 37 45" style={{ display: 'block' }}>
    <path d="M4.5 0H24.5L37 12.5V40.5A4.5 4.5 0 0 1 32.5 45H4.5A4.5 4.5 0 0 1 0 40.5V4.5A4.5 4.5 0 0 1 4.5 0Z" fill="#D00334" />
    <path d="M24.5 0L37 12.5H28.5A4 4 0 0 1 24.5 8.5Z" fill="#E4758F" />
    <text x="18.5" y="34" textAnchor="middle" fontFamily="'Google Sans', Roboto, sans-serif" fontWeight="700" fontSize="14.5" fill="#fff">PDF</text>
  </svg>
);

// Small curved "forwarded" arrow shown before the Forwarded label.
export const ForwardedGlyph = ({ color }: { color: string }) => (
  <svg width={26} height={22} viewBox="0 0 26 22" style={{ display: 'block' }}>
    <path d="M15 2.5 L24 10 L15 17.5 V13 C9 13 5 15 2 20 C3 13 7 8 15 7 Z" fill={color} />
  </svg>
);
