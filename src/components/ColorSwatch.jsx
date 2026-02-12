import React from 'react';
import chroma from 'chroma-js';

export default function ColorSwatch({ colors }) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Visual swatches */}
      <div className="flex rounded-lg overflow-hidden shadow-lg" style={{ height: '120px' }}>
        {colors.map((color, index) => (
          <div
            key={index}
            className="flex-1 transition-all hover:flex-[1.2] cursor-pointer group relative"
            style={{ backgroundColor: color }}
            title={color}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span 
                className="text-xs font-mono px-2 py-1 rounded backdrop-blur-sm"
                style={{
                  color: chroma(color).luminance() > 0.5 ? '#000' : '#fff',
                  backgroundColor: chroma(color).luminance() > 0.5 ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)'
                }}
              >
                {color.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Color grid with hex codes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {colors.map((color, index) => (
          <div key={index} className="space-y-1">
            <div
              className="w-full h-16 rounded-lg shadow-md border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
              style={{ backgroundColor: color }}
              title={`Click to copy ${color}`}
              onClick={() => {
                navigator.clipboard.writeText(color);
              }}
            />
            <p className="text-xs font-mono text-center text-gray-600">
              {color.toUpperCase()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
