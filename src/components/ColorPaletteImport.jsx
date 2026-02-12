import React, { useState } from 'react';
import { Palette, Upload, Check, AlertCircle } from 'lucide-react';

export default function ColorPaletteImport({ onColorsImport, currentColors }) {
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('manual');
  const [manualInput, setManualInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const parseColorInput = (input) => {
    setError('');
    const trimmed = input.trim();

    // Try different formats
    const colors = [];

    // Format 1: Comma or newline separated hex codes
    const hexMatches = trimmed.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
    if (hexMatches && hexMatches.length > 0) {
      colors.push(...hexMatches);
    }

    // Format 2: RGB/RGBA format
    const rgbMatches = trimmed.match(/rgba?\([^)]+\)/g);
    if (rgbMatches && rgbMatches.length > 0) {
      // Convert RGB to hex
      rgbMatches.forEach(rgb => {
        const match = rgb.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (match) {
          const [, r, g, b] = match;
          const hex = '#' + [r, g, b].map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
          }).join('');
          colors.push(hex);
        }
      });
    }

    // Format 3: JSON array
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          colors.push(...parsed.filter(c => typeof c === 'string' && (c.startsWith('#') || c.startsWith('rgb'))));
        }
      } catch (e) {
        // Not valid JSON, continue
      }
    }

    return colors;
  };

  const handleManualImport = () => {
    if (!manualInput.trim()) {
      setError('Please enter some colors');
      return;
    }

    const colors = parseColorInput(manualInput);

    if (colors.length === 0) {
      setError('No valid colors found. Please use hex codes (#RRGGBB) or RGB format');
      return;
    }

    onColorsImport(colors);
    setSuccess(`Successfully imported ${colors.length} colors`);
    setTimeout(() => {
      setSuccess('');
      setShowDialog(false);
      setManualInput('');
    }, 1500);
  };

  const handleFileUpload = (event) => {
    setError('');
    setSuccess('');
    
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      try {
        const colors = parseColorInput(text);
        
        if (colors.length === 0) {
          setError('No valid colors found in file');
          return;
        }

        onColorsImport(colors);
        setSuccess(`Successfully imported ${colors.length} colors from ${file.name}`);
        setTimeout(() => {
          setSuccess('');
          setShowDialog(false);
        }, 1500);
      } catch (err) {
        setError(`Error reading file: ${err.message}`);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    reader.readAsText(file);
  };

  const handleImportFromLocalStorage = () => {
    try {
      // Check for saved palettes from other modes
      const paletteKeys = ['lastPalette', 'lastSingleHue', 'lastDivergent', 'lastRandom'];
      let foundColors = null;
      
      for (const key of paletteKeys) {
        const saved = localStorage.getItem(key);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              foundColors = parsed;
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      if (foundColors) {
        onColorsImport(foundColors);
        setSuccess(`Imported ${foundColors.length} colors from palette generator`);
        setTimeout(() => {
          setSuccess('');
          setShowDialog(false);
        }, 1500);
      } else {
        setError('No saved palette found. Generate a palette first in the Palette tab.');
      }
    } catch (err) {
      setError('Error loading palette from storage');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Palette size={18} />
        Import Colors
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Import Color Palette</h3>
            
            {/* Current Colors Preview */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Colors:</p>
              <div className="flex flex-wrap gap-2">
                {currentColors.map((color, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600 font-mono">{color}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
                  activeTab === 'manual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
                  activeTab === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
                  activeTab === 'generator'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                From Generator
              </button>
            </div>

            {/* Tab Content */}
            <div className="mb-4">
              {activeTab === 'manual' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Paste colors (hex codes, RGB, or JSON array)
                    </label>
                    <textarea
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder={`Examples:\n#FF6B6B, #4ECDC4, #45B7D1\n\n#FF6B6B\n#4ECDC4\n#45B7D1\n\nrgb(255, 107, 107)\nrgb(78, 205, 196)\n\n["#FF6B6B", "#4ECDC4", "#45B7D1"]`}
                      className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                  <button
                    onClick={handleManualImport}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Import Colors
                  </button>
                </div>
              )}

              {activeTab === 'file' && (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
                    <Upload size={48} className="mx-auto text-gray-400 mb-3" />
                    <label className="cursor-pointer">
                      <span className="text-purple-600 hover:text-purple-700 font-medium">
                        Click to upload
                      </span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <input
                        type="file"
                        accept=".txt,.json,.css"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">TXT, JSON, or CSS files</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-2 font-medium">Supported formats:</p>
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
{`• Hex codes: #FF6B6B, #4ECDC4
• RGB: rgb(255, 107, 107)
• JSON: ["#FF6B6B", "#4ECDC4"]`}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'generator' && (
                <div className="space-y-3">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-900 mb-3">
                      Import colors from a palette generated in the Palette, Single Hue, Divergent, or Random tabs.
                    </p>
                    <p className="text-sm text-purple-800 mb-4">
                      <strong>Note:</strong> Generate a palette in one of those tabs first, then return here to import it.
                    </p>
                  </div>
                  <button
                    onClick={handleImportFromLocalStorage}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <Palette size={18} />
                    Import from Last Generated Palette
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                <Check size={20} className="text-green-600" />
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            )}

            {/* Close Button */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowDialog(false);
                  setManualInput('');
                  setError('');
                  setSuccess('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
