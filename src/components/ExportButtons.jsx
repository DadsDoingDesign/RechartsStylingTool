import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';
import { exportAsSVG, copyToClipboard } from '../utils/colorInterpolation';

export default function ExportButtons({ colors }) {
  const [copied, setCopied] = useState(false);

  const handleCopyHex = async () => {
    const hexValues = colors.join(', ');
    const success = await copyToClipboard(hexValues);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportSVG = () => {
    const svg = exportAsSVG(colors);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={handleCopyHex}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md font-medium"
      >
        {copied ? (
          <>
            <Check size={18} />
            Copied!
          </>
        ) : (
          <>
            <Copy size={18} />
            Copy HEX Values
          </>
        )}
      </button>
      <button
        onClick={handleExportSVG}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-md font-medium"
      >
        <Download size={18} />
        Export as SVG
      </button>
    </div>
  );
}
