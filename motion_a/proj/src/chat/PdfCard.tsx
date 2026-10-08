import React from 'react';
import { PdfAttachment } from './types';
import { PdfIcon } from './Icons';

export const PdfCard: React.FC<{ pdf: PdfAttachment }> = ({ pdf }) => (
  <div className="wa-pdf">
    <div className="wa-pdf-icon">
      <PdfIcon />
    </div>
    <div className="wa-pdf-body">
      {pdf.nameLines.map((l, i) => (
        <div key={i} className="wa-pdf-name">{l}</div>
      ))}
      <div className="wa-pdf-meta">
        {pdf.meta.split(' • ').map((part, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <span className="wa-pdf-dot">•</span> : null}
            {part}
          </React.Fragment>
        ))}
      </div>
    </div>
  </div>
);
