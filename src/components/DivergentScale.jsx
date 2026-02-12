import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import ColorSwatch from './ColorSwatch';
import ExportButtons from './ExportButtons';
import Slider from './Slider';
import ChartExamples from './ChartExamples';
import { generateDivergentScale } from '../utils/colorInterpolation';

export default function DivergentScale() {
  const [startColor, setStartColor] = useState('#3B82F6');
  const [endColor, setEndColor] = useState('#EF4444');
  const [steps, setSteps] = useState(9);
  const [saturation, setSaturation] = useState(1);
  const [lightness, setLightness] = useState(1);
  const [midpointSaturation, setMidpointSaturation] = useState(0.1);
  const [midpointLightness, setMidpointLightness] = useState(0.9);
  const [colors, setColors] = useState([]);

  useEffect(() => {
    const scale = generateDivergentScale(
      startColor, 
      endColor, 
      steps, 
      saturation,
      lightness,
      midpointSaturation, 
      midpointLightness
    );
    setColors(scale);
    // Save to localStorage for importing into Chart Styler
    localStorage.setItem('lastDivergent', JSON.stringify(scale));
  }, [startColor, endColor, steps, saturation, lightness, midpointSaturation, midpointLightness]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Divergent Color Scale</h2>
        <p className="text-gray-600 mb-6">
          Create divergent color scales that transition from one extreme through a neutral midpoint to an opposite extreme. 
          Ideal for political maps, temperature variations, or any bipolar data.
        </p>
        
        <div className="space-y-4">
          <ColorPicker
            label="Start Color"
            color={startColor}
            onChange={setStartColor}
          />
          <ColorPicker
            label="End Color"
            color={endColor}
            onChange={setEndColor}
          />
          
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 min-w-[100px]">
              Number of Colors
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 3)}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="range"
              min="3"
              max="20"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Adjust Main Colors</h4>
            <Slider
              label="Saturation"
              value={saturation}
              onChange={setSaturation}
              min={0.1}
              max={1.5}
            />
            <Slider
              label="Lightness"
              value={lightness}
              onChange={setLightness}
              min={0.5}
              max={1.5}
            />
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-4">
            <h4 className="text-sm font-semibold text-gray-700">Modify Midpoint Color</h4>
            <Slider
              label="Midpoint Saturation"
              value={midpointSaturation}
              onChange={setMidpointSaturation}
              min={0}
              max={1}
            />
            <Slider
              label="Midpoint Lightness"
              value={midpointLightness}
              onChange={setMidpointLightness}
              min={0}
              max={1}
            />
            <div className="text-xs text-gray-500">
              <p>💡 Tip: Keep Midpoint Saturation low when endpoints have very different hues to avoid muddy middle tones</p>
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
