import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import ColorSwatch from './ColorSwatch';
import ExportButtons from './ExportButtons';
import Slider from './Slider';
import ChartExamples from './ChartExamples';
import { generateSingleHueScale } from '../utils/colorInterpolation';

export default function SingleHueScale() {
  const [baseColor, setBaseColor] = useState('#E74C3C');
  const [steps, setSteps] = useState(7);
  const [saturation, setSaturation] = useState(1);
  const [lightness, setLightness] = useState(0.7);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const scale = generateSingleHueScale(baseColor, steps, saturation, lightness);
    setColors(scale);
    // Save to localStorage for importing into Chart Styler
    localStorage.setItem('lastSingleHue', JSON.stringify(scale));
  }, [baseColor, steps, saturation, lightness]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Single Hue Scale</h2>
        <p className="text-gray-600 mb-6">
          Generate sequential color scales for visualizing single variables. Perfect for heatmaps, choropleth maps, and intensity visualizations.
        </p>
        
        <div className="space-y-4">
          <ColorPicker
            label="Base Color"
            color={baseColor}
            onChange={setBaseColor}
          />
          
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
            <h4 className="text-sm font-semibold text-gray-700">Modify Color Scale</h4>
            <Slider
              label="Saturation"
              value={saturation}
              onChange={setSaturation}
              min={0}
              max={1.5}
            />
            <Slider
              label="Lightness"
              value={lightness}
              onChange={setLightness}
              min={0}
              max={1}
            />
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 Tip: Set Saturation to 0% for a gray endpoint</p>
              <p>💡 Tip: Set Lightness high and Saturation to 0% for a white endpoint</p>
            </div>
          </div>
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
