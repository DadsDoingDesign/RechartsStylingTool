import React, { useState } from 'react';
import { Palette, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { tailwindColors, tailwindPresets, getColorNames } from '../utils/tailwindColors';

export default function TailwindColorPicker({ onColorsImport, currentColors }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('presets');
  const [selectedColorFamily, setSelectedColorFamily] = useState('blue');
  const [selectedShades, setSelectedShades] = useState([]);

  const colorNames = getColorNames();

  // Handle preset selection
  const handlePresetSelect = (presetName) => {
    const colors = tailwindPresets[presetName];
    onColorsImport(colors);
    setIsOpen(false);
  };

  // Handle individual shade selection
  const toggleShade = (shade, hex) => {
    const exists = selectedShades.find(s => s.hex === hex);
    if (exists) {
      setSelectedShades(selectedShades.filter(s => s.hex !== hex));
    } else {
      setSelectedShades([...selectedShades, { shade, hex }]);
    }
  };

  // Apply selected shades
  const applySelectedShades = () => {
    if (selectedShades.length > 0) {
      const colors = selectedShades.map(s => s.hex);
      onColorsImport(colors);
      setSelectedShades([]);
      setIsOpen(false);
    }
  };

  // Get all shades for a color family
  const getShadeButtons = (colorFamily) => {
    const shades = tailwindColors[colorFamily];
    return Object.entries(shades).map(([shade, hex]) => {
      const isSelected = selectedShades.find(s => s.hex === hex);
      return (
        <button
          key={shade}
          onClick={() => toggleShade(shade, hex)}
          className={`relative group transition-all ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
          title={`${colorFamily}-${shade}: ${hex}`}
        >
          <div
            className="w-12 h-12 rounded-lg shadow-md hover:scale-110 transition-transform cursor-pointer"
            style={{ backgroundColor: hex }}
          />
          {isSelected && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Check size={20} className="text-white drop-shadow-lg" strokeWidth={3} />
            </div>
          )}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {shade}
          </span>
        </button>
      );
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-md font-medium"
      >
        <Palette size={18} />
        Tailwind Colors
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-[600px] max-h-[600px] overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'presets'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Preset Palettes
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'custom'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Build Custom
            </button>
          </div>

          {/* Preset Palettes Tab */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 mb-2">Choose a Tailwind Color Preset</h4>
              {Object.entries(tailwindPresets).map(([name, colors]) => (
                <button
                  key={name}
                  onClick={() => handlePresetSelect(name)}
                  className="w-full p-3 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-800 group-hover:text-blue-700">{name}</span>
                    <span className="text-xs text-gray-500">{colors.length} colors</span>
                  </div>
                  <div className="flex gap-1">
                    {colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 h-8 rounded"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Custom Builder Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Select Color Family</h4>
                <div className="grid grid-cols-5 gap-2">
                  {colorNames.map(colorName => (
                    <button
                      key={colorName}
                      onClick={() => setSelectedColorFamily(colorName)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                        selectedColorFamily === colorName
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={
                        selectedColorFamily === colorName
                          ? {}
                          : { backgroundColor: tailwindColors[colorName][500] + '20' }
                      }
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2 capitalize">
                  {selectedColorFamily} Shades
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Click shades to build your custom palette ({selectedShades.length} selected)
                </p>
                <div className="grid grid-cols-6 gap-3 mb-4">
                  {getShadeButtons(selectedColorFamily)}
                </div>
              </div>

              {selectedShades.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-800">Selected Colors</h4>
                    <button
                      onClick={() => setSelectedShades([])}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {selectedShades.map((item, idx) => (
                      <div
                        key={idx}
                        className="w-12 h-12 rounded-lg shadow-md border-2 border-gray-300"
                        style={{ backgroundColor: item.hex }}
                        title={item.hex}
                      />
                    ))}
                  </div>
                  <button
                    onClick={applySelectedShades}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    Apply {selectedShades.length} Color{selectedShades.length !== 1 ? 's' : ''}
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
