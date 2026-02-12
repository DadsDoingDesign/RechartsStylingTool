import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';
import ColorSwatch from './ColorSwatch';
import ExportButtons from './ExportButtons';
import Slider from './Slider';
import ChartExamples from './ChartExamples';
import { generateRandomPalette } from '../utils/colorInterpolation';

export default function RandomPalette() {
  const [steps, setSteps] = useState(7);
  const [saturation, setSaturation] = useState(0.65);
  const [lightness, setLightness] = useState(0.55);
  const [colors, setColors] = useState([]);

  const generateNew = () => {
    const palette = generateRandomPalette(steps, saturation, lightness);
    setColors(palette);
    // Save to localStorage for importing into Chart Styler
    localStorage.setItem('lastRandom', JSON.stringify(palette));
  };

  useEffect(() => {
    generateNew();
  }, [steps, saturation, lightness]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Palette Generator</h2>
        <p className="text-gray-600 mb-6">
          Generate random, visually distinct color palettes using the golden ratio for optimal hue distribution.
          Perfect for quick prototypes or finding color inspiration.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">
              Number of Colors
            </label>
            <input
              type="number"
              min="2"
              max="20"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 2)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="range"
              min="2"
              max="20"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Adjust Colors</h4>
            <Slider
              label="Saturation"
              value={saturation}
              onChange={setSaturation}
              min={0.1}
              max={1}
            />
            <Slider
              label="Lightness"
              value={lightness}
              onChange={setLightness}
              min={0.2}
              max={0.8}
            />
          </div>

          <button
            onClick={generateNew}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-md font-medium w-full sm:w-auto justify-center"
          >
            <Shuffle size={20} />
            Generate New Random Palette
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview</h3>
        <ColorSwatch colors={colors} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <ChartExamples colors={colors} />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Export</h3>
        <ExportButtons colors={colors} />
      </div>
    </div>
  );
}
