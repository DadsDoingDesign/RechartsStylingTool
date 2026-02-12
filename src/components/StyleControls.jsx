import React, { useState } from 'react';
import ColorPicker from './ColorPicker';
import ColorSwatch from './ColorSwatch';
import Slider from './Slider';
import TailwindColorPicker from './TailwindColorPicker';
import TailwindClassExport from './TailwindClassExport';
import { Plus, Trash2 } from 'lucide-react';

export default function StyleControls({
  chartType, setChartType,
  dataSeries, setDataSeries,
  nextSeriesId, setNextSeriesId,
  colors, setColors,
  backgroundColor, setBackgroundColor,
  colorAssignments, setColorAssignments,
  useEvenDistribution, setUseEvenDistribution,
  chartWidth, setChartWidth,
  chartHeight, setChartHeight,
  margin, setMargin,
  fontFamily, setFontFamily,
  fontSize, setFontSize,
  fontWeight, setFontWeight,
  textColor, setTextColor,
  showGrid, setShowGrid,
  gridColor, setGridColor,
  gridDashArray, setGridDashArray,
  gridOpacity, setGridOpacity,
  axisColor, setAxisColor,
  axisWidth, setAxisWidth,
  strokeWidth, setStrokeWidth,
  fillOpacity, setFillOpacity,
  borderRadius, setBorderRadius,
  dotRadius, setDotRadius,
  activeDotRadius, setActiveDotRadius,
  dotShape, setDotShape,
  lineType, setLineType,
  showLegend, setShowLegend,
  legendAlign, setLegendAlign,
  legendVerticalAlign, setLegendVerticalAlign,
  legendIconType, setLegendIconType,
  legendMargin, setLegendMargin,
  showTooltip, setShowTooltip,
  tooltipBackground, setTooltipBackground,
  tooltipBorder, setTooltipBorder,
  tooltipOpacity, setTooltipOpacity,
  cursorFill, setCursorFill,
  cursorOpacity, setCursorOpacity,
  animationDuration, setAnimationDuration,
  animationEasing, setAnimationEasing,
  waterfallNumSales, setWaterfallNumSales,
  waterfallNumCosts, setWaterfallNumCosts
}) {
  const [activeTab, setActiveTab] = useState('type');

  const tabs = [
    { id: 'type', label: 'Chart Type' },
    { id: 'colors', label: 'Colors' },
    { id: 'dimensions', label: 'Dimensions' },
    { id: 'typography', label: 'Typography' },
    { id: 'grid', label: 'Grid & Axes' },
    { id: 'elements', label: 'Elements' },
    { id: 'legend', label: 'Legend' },
    { id: 'tooltip', label: 'Tooltip' },
    { id: 'animation', label: 'Animation' },
  ];
  
  const addColor = () => {
    if (colors.length < 10) {
      setColors([...colors, '#' + Math.floor(Math.random()*16777215).toString(16)]);
    }
  };

  const removeColor = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
      {/* Chart Type Tab */}
      {activeTab === 'type' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Chart Type</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { id: 'bar', label: 'Bar Chart' },
              { id: 'stacked-bar', label: 'Stacked Bar' },
              { id: 'line', label: 'Line Chart' },
              { id: 'area', label: 'Area Chart' },
              { id: 'pie', label: 'Pie Chart' },
              { id: 'waterfall', label: 'Waterfall' }
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  chartType === type.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
          
          {/* Waterfall Specific Controls */}
          {chartType === 'waterfall' && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold text-gray-800 mb-3">Waterfall Configuration</h4>
              <p className="text-sm text-gray-600 mb-4">Configure the number of sales (increases) and costs (decreases) in your waterfall chart</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Number of Sales</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={waterfallNumSales}
                    onChange={(e) => setWaterfallNumSales(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Increases (positive bars)</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Number of Costs</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={waterfallNumCosts}
                    onChange={(e) => setWaterfallNumCosts(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Decreases (negative bars)</p>
                </div>
              </div>
            </div>
          )}

          {/* Series Management Controls */}
          {!['pie', 'waterfall'].includes(chartType) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold text-gray-800">Data Series Management</h4>
                <button
                  onClick={() => {
                    const newSeries = {
                      id: nextSeriesId,
                      dataKey: `value${nextSeriesId}`,
                      name: `Series ${dataSeries.length + 1}`,
                      visible: true
                    };
                    setDataSeries([...dataSeries, newSeries]);
                    setNextSeriesId(nextSeriesId + 1);
                  }}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus size={16} /> Add Series
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">Add, remove, or toggle visibility of data series</p>
              <div className="space-y-2">
                {dataSeries.map((series, index) => (
                  <div key={series.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={series.visible}
                      onChange={(e) => {
                        const updated = dataSeries.map(s => 
                          s.id === series.id ? { ...s, visible: e.target.checked } : s
                        );
                        setDataSeries(updated);
                      }}
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={series.name}
                        onChange={(e) => {
                          const updated = dataSeries.map(s => 
                            s.id === series.id ? { ...s, name: e.target.value } : s
                          );
                          setDataSeries(updated);
                        }}
                        className="w-full px-2 py-1 text-sm font-medium text-gray-700 border border-transparent hover:border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Series ${index + 1}`}
                      />
                      <span className="text-xs text-gray-500">Data key: {series.dataKey}</span>
                    </div>
                    <div 
                      className="w-8 h-8 rounded border-2 border-gray-300"
                      style={{ backgroundColor: colors[colorAssignments[index]] || colors[0] }}
                    />
                    {dataSeries.length > 1 && (
                      <button
                        onClick={() => {
                          setDataSeries(dataSeries.filter(s => s.id !== series.id));
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Remove series"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Colors Tab */}
      {activeTab === 'colors' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Colors</h3>
            <div className="flex gap-2 flex-wrap">
              <TailwindColorPicker 
                currentColors={colors}
                onColorsImport={setColors}
              />
              <button
                onClick={addColor}
                disabled={colors.length >= 10}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={16} /> Add Color
              </button>
            </div>
          </div>
          <div className="space-y-2">
            {colors.map((color, index) => (
              <div key={index} className="flex items-center gap-3">
                <ColorPicker
                  label={`Color ${index + 1}`}
                  color={color}
                  onChange={(newColor) => updateColor(index, newColor)}
                />
                {colors.length > 1 && (
                  <button
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ColorPicker
              label="Background Color"
              color={backgroundColor}
              onChange={setBackgroundColor}
            />
          </div>
          
          {/* Tailwind CSS Classes Export */}
          <TailwindClassExport colors={colors} backgroundColor={backgroundColor} />
          
          {/* Color Assignment Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-800 mb-3">Color Assignment to Chart Series</h4>
            
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={useEvenDistribution}
                onChange={(e) => setUseEvenDistribution(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Auto-distribute colors evenly (recommended)</span>
            </label>
            
            {!useEvenDistribution && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-3">Manually assign palette colors to each data series:</p>
                {colorAssignments.map((assignedIndex, seriesIndex) => (
                  <div key={seriesIndex} className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-700 w-24">Series {seriesIndex + 1}:</label>
                    <select
                      value={assignedIndex}
                      onChange={(e) => {
                        const newAssignments = [...colorAssignments];
                        newAssignments[seriesIndex] = parseInt(e.target.value);
                        setColorAssignments(newAssignments);
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {colors.map((color, colorIndex) => (
                        <option key={colorIndex} value={colorIndex}>
                          Color {colorIndex + 1}
                        </option>
                      ))}
                    </select>
                    <div 
                      className="w-10 h-10 rounded border-2 border-gray-300"
                      style={{ backgroundColor: colors[assignedIndex] || colors[0] }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {useEvenDistribution && (
              <div className="space-y-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900">✓ Even Distribution Active</p>
                <p>Colors are automatically selected from your palette to maximize visual distinction between data series.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dimensions Tab */}
      {activeTab === 'dimensions' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Dimensions & Spacing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Width (px)</label>
              <input
                type="number"
                min="200"
                max="1200"
                value={chartWidth}
                onChange={(e) => setChartWidth(parseInt(e.target.value) || 600)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Height (px)</label>
              <input
                type="number"
                min="200"
                max="800"
                value={chartHeight}
                onChange={(e) => setChartHeight(parseInt(e.target.value) || 400)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {['top', 'right', 'bottom', 'left'].map(side => (
              <div key={side}>
                <label className="text-sm font-medium text-gray-700 block mb-2 capitalize">Margin {side}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={margin[side]}
                  onChange={(e) => setMargin({...margin, [side]: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Typography Tab */}
      {activeTab === 'typography' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Typography</h3>
          <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Font Family</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sans-serif">Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
              <option value="'Mona Sans', sans-serif">Mona Sans</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Font Size (px)</label>
              <input
                type="number"
                min="8"
                max="24"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Font Weight</label>
              <select
                value={fontWeight}
                onChange={(e) => setFontWeight(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="300">Light (300)</option>
                <option value="400">Regular (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semi Bold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>
          </div>
          <ColorPicker
            label="Text Color"
            color={textColor}
            onChange={setTextColor}
          />
          </div>
        </div>
      )}

      {/* Grid & Axes Tab */}
      {activeTab === 'grid' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grid & Axes</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">Show Grid Lines</span>
            </label>
            {showGrid && (
              <>
                <ColorPicker
                  label="Grid Color"
                  color={gridColor}
                  onChange={setGridColor}
                />
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Grid Dash Array</label>
                  <select
                    value={gridDashArray}
                    onChange={(e) => setGridDashArray(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Solid</option>
                    <option value="3 3">Dotted (3 3)</option>
                    <option value="5 5">Dashed (5 5)</option>
                    <option value="10 5">Long Dash (10 5)</option>
                  </select>
                </div>
                <Slider
                  label="Grid Opacity"
                  value={gridOpacity}
                  onChange={setGridOpacity}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </>
            )}
            <ColorPicker
              label="Axis Color"
              color={axisColor}
              onChange={setAxisColor}
            />
            <Slider
              label="Axis Width"
              value={axisWidth}
              onChange={setAxisWidth}
              min={1}
              max={5}
              step={1}
            />
          </div>
        </div>
      )}

      {/* Chart Elements Tab */}
      {activeTab === 'elements' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Chart Elements</h3>
          <div className="space-y-4">
          {(chartType === 'line' || chartType === 'area') && (
            <>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Line Type</label>
                <select
                  value={lineType}
                  onChange={(e) => setLineType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="linear">Linear (Angular)</option>
                  <option value="monotone">Monotone (Smooth)</option>
                  <option value="natural">Natural (Curved)</option>
                  <option value="step">Step</option>
                  <option value="stepBefore">Step Before</option>
                  <option value="stepAfter">Step After</option>
                </select>
              </div>
              <Slider
                label="Stroke Width"
                value={strokeWidth}
                onChange={setStrokeWidth}
                min={1}
                max={5}
                step={0.5}
              />
            </>
          )}
          {(chartType === 'bar' || chartType === 'area') && (
            <Slider
              label="Fill Opacity"
              value={fillOpacity}
              onChange={setFillOpacity}
              min={0}
              max={1}
              step={0.1}
            />
          )}
          {(chartType === 'bar' || chartType === 'stacked-bar') && (
            <Slider
              label="Bar Roundness"
              value={borderRadius}
              onChange={setBorderRadius}
              min={0}
              max={20}
              step={1}
            />
          )}
          {chartType === 'line' && (
            <>
              <Slider
                label="Dot Radius"
                value={dotRadius}
                onChange={setDotRadius}
                min={0}
                max={10}
                step={1}
              />
              <Slider
                label="Active Dot Radius"
                value={activeDotRadius}
                onChange={setActiveDotRadius}
                min={0}
                max={12}
                step={1}
              />
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Dot Shape</label>
                <select
                  value={dotShape}
                  onChange={(e) => setDotShape(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="circle">Circle</option>
                  <option value="cross">Cross</option>
                  <option value="diamond">Diamond</option>
                  <option value="square">Square</option>
                  <option value="star">Star</option>
                  <option value="triangle">Triangle</option>
                  <option value="wye">Wye</option>
                </select>
              </div>
            </>
          )}
          </div>
        </div>
      )}

      {/* Legend Tab */}
      {activeTab === 'legend' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Legend</h3>
          <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showLegend}
              onChange={(e) => setShowLegend(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Legend</span>
          </label>
          {showLegend && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Horizontal Align</label>
                  <select
                    value={legendAlign}
                    onChange={(e) => setLegendAlign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Vertical Align</label>
                  <select
                    value={legendVerticalAlign}
                    onChange={(e) => setLegendVerticalAlign(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">Icon Type</label>
                <select
                  value={legendIconType}
                  onChange={(e) => setLegendIconType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="line">Line</option>
                  <option value="square">Square</option>
                  <option value="rect">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="cross">Cross</option>
                  <option value="diamond">Diamond</option>
                  <option value="star">Star</option>
                  <option value="triangle">Triangle</option>
                  <option value="wye">Wye</option>
                </select>
              </div>
              
              {/* Legend Margin Controls */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Legend Spacing</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['top', 'right', 'bottom', 'left'].map(side => (
                    <div key={side}>
                      <label className="text-sm font-medium text-gray-700 block mb-2 capitalize">{side}</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={legendMargin[side]}
                        onChange={(e) => setLegendMargin({...legendMargin, [side]: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">Adjust spacing around the legend for consistent breathing room</p>
              </div>
            </>
          )}
          </div>
        </div>
      )}

      {/* Tooltip Tab */}
      {activeTab === 'tooltip' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tooltip</h3>
          <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showTooltip}
              onChange={(e) => setShowTooltip(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Show Tooltip</span>
          </label>
          {showTooltip && (
            <>
              <ColorPicker
                label="Tooltip Background"
                color={tooltipBackground}
                onChange={setTooltipBackground}
              />
              <ColorPicker
                label="Tooltip Border"
                color={tooltipBorder}
                onChange={setTooltipBorder}
              />
              <Slider
                label="Tooltip Opacity"
                value={tooltipOpacity}
                onChange={setTooltipOpacity}
                min={0}
                max={1}
                step={0.1}
              />
              
              {/* Hover/Cursor Effect */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Hover Background Effect</h4>
                <p className="text-xs text-gray-500 mb-3">The vertical highlight bar that appears when hovering over the chart</p>
                <ColorPicker
                  label="Hover Fill Color"
                  color={cursorFill}
                  onChange={setCursorFill}
                />
                <Slider
                  label="Hover Opacity"
                  value={cursorOpacity}
                  onChange={setCursorOpacity}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
            </>
          )}
          </div>
        </div>
      )}

      {/* Animation Tab */}
      {activeTab === 'animation' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Animation</h3>
          <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Duration (ms)</label>
            <input
              type="number"
              min="0"
              max="3000"
              step="100"
              value={animationDuration}
              onChange={(e) => setAnimationDuration(parseInt(e.target.value) || 800)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Easing</label>
            <select
              value={animationEasing}
              onChange={(e) => setAnimationEasing(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ease">Ease</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
              <option value="ease-in-out">Ease In Out</option>
              <option value="linear">Linear</option>
            </select>
          </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
