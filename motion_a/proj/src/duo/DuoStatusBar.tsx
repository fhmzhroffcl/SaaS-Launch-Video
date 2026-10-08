import React from 'react';

/** iOS-style status bar adapted to the Duo outer display: time top-left, system icons left of the camera hole. */
export const DuoStatusBar: React.FC<{ clock: string }> = ({ clock }) => (
  <div className="duo-sb">
    <div className="duo-sb-clock">{clock}</div>
    <div className="duo-sb-icons">
      <svg width="34" height="22" viewBox="0 0 34 22">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 9} y={16 - i * 5} width={6.4} height={6 + i * 5} rx={1.6} fill="#161616" />
        ))}
      </svg>
      <svg width="31" height="22" viewBox="0 0 31 22">
        <path d="M15.5 21.2 L10.9 16.4 A6.6 6.6 0 0 1 20.1 16.4 Z" fill="#161616" />
        <path d="M7.4 12.9 A11.6 11.6 0 0 1 23.6 12.9" fill="none" stroke="#161616" strokeWidth="3.1" strokeLinecap="round" />
        <path d="M3.2 8.6 A17.6 17.6 0 0 1 27.8 8.6" fill="none" stroke="#161616" strokeWidth="3.1" strokeLinecap="round" />
      </svg>
      <svg width="46" height="22" viewBox="0 0 46 22">
        <rect x="1" y="1.5" width="38" height="19" rx="6" fill="none" stroke="#161616" strokeOpacity="0.4" strokeWidth="2" />
        <rect x="4" y="4.5" width="29" height="13" rx="3.4" fill="#161616" />
        <path d="M42 8 C44 8.5 44.5 9.5 44.5 11 C44.5 12.5 44 13.5 42 14 Z" fill="#161616" fillOpacity="0.45" />
      </svg>
    </div>
  </div>
);
