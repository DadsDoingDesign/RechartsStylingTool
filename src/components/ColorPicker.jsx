import React from 'react';
import TailwindColorInfo from './TailwindColorInfo';

export default function ColorPicker({ label, color, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 min-w-[100px]">
        {label}
      </label>
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-16 h-10 rounded cursor-pointer border-2 border-gray-300 hover:border-gray-400 transition-colors"
        />
        <input
          type="text"
          value={color.toUpperCase()}
          onChange={(e) => {
            const value = e.target.value;
            if (/^#[0-9A-F]{0,6}$/i.test(value)) {
              onChange(value);
            }
          }}
          className="w-24 px-2 py-1 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#FFFFFF"
        />
        <TailwindColorInfo color={color} />
      </div>
    </div>
  );
}
