import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';
import { getColorName } from '../utils/tailwindColors';

export default function TailwindClassExport({ colors, backgroundColor }) {
  const [copied, setCopied] = useState(false);

  const generateTailwindClasses = () => {
    const classes = [];
    
    // Generate color classes
    colors.forEach((color, index) => {
      const tailwindName = getColorName(color);
      if (tailwindName) {
        classes.push(`// Color ${index + 1}: ${tailwindName}`);
        classes.push(`text-${tailwindName}`);
        classes.push(`bg-${tailwindName}`);
        classes.push(`border-${tailwindName}`);
        classes.push('');
      }
    });

    // Background color
    const bgTailwindName = getColorName(backgroundColor);
    if (bgTailwindName) {
      classes.push(`// Background: ${bgTailwindName}`);
      classes.push(`bg-${bgTailwindName}`);
    }

    return classes.length > 0 ? classes.join('\n') : 'No Tailwind colors detected in your palette.';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateTailwindClasses());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const classes = generateTailwindClasses();
  const hasTailwindColors = !classes.includes('No Tailwind colors');

  if (!hasTailwindColors) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-purple-600" />
          <h4 className="font-semibold text-purple-900">Tailwind CSS Classes</h4>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy
            </>
          )}
        </button>
      </div>
      <p className="text-xs text-purple-700 mb-3">
        Use these Tailwind classes in your app for consistent styling
      </p>
      <pre className="bg-white/50 p-3 rounded text-xs font-mono text-gray-800 max-h-40 overflow-y-auto border border-purple-200">
        {classes}
      </pre>
    </div>
  );
}
