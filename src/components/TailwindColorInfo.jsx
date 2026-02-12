import React from 'react';
import { Info } from 'lucide-react';
import { getColorName } from '../utils/tailwindColors';

export default function TailwindColorInfo({ color }) {
  const tailwindName = getColorName(color);

  if (!tailwindName) return null;

  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium border border-purple-200">
      <Info size={12} />
      <span className="font-mono">{tailwindName}</span>
    </div>
  );
}
