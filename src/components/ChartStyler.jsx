import React, { useState, useEffect } from 'react';
import StyledChartPreview from './StyledChartPreview';
import StyleControls from './StyleControls';
import ExportStyleConfig from './ExportStyleConfig';
import SavedConfigManager from './SavedConfigManager';
import DataInput from './DataInput';
import ColorPaletteImport from './ColorPaletteImport';
import { getEvenlyDistributedColorIndices } from '../utils/colorDistribution';

export default function ChartStyler() {
  // Chart type selection
  const [chartType, setChartType] = useState('bar');

  // Data series management - dynamic array of series
  const [dataSeries, setDataSeries] = useState([
    { id: 1, dataKey: 'value1', name: 'Series 1', visible: true },
    { id: 2, dataKey: 'value2', name: 'Series 2', visible: true },
    { id: 3, dataKey: 'value3', name: 'Series 3', visible: true }
  ]);
  const [nextSeriesId, setNextSeriesId] = useState(4);

  // Color settings
  const [colors, setColors] = useState(['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1']);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [colorAssignments, setColorAssignments] = useState([0, 1, 2]); // Maps data series to palette indices
  const [useEvenDistribution, setUseEvenDistribution] = useState(true);
  
  // Dimensions and spacing
  const [chartWidth, setChartWidth] = useState(600);
  const [chartHeight, setChartHeight] = useState(400);
  const [margin, setMargin] = useState({ top: 20, right: 30, bottom: 20, left: 20 });

  // Typography
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState(12);
  const [fontWeight, setFontWeight] = useState(400);
  const [textColor, setTextColor] = useState('#666666');

  // Grid and axes
  const [showGrid, setShowGrid] = useState(true);
  const [gridColor, setGridColor] = useState('#e5e7eb');
  const [gridDashArray, setGridDashArray] = useState('3 3');
  const [gridOpacity, setGridOpacity] = useState(1);
  const [axisColor, setAxisColor] = useState('#666666');
  const [axisWidth, setAxisWidth] = useState(1);

  // Chart-specific styles
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fillOpacity, setFillOpacity] = useState(1);
  const [borderRadius, setBorderRadius] = useState(4);
  const [dotRadius, setDotRadius] = useState(4);
  const [activeDotRadius, setActiveDotRadius] = useState(6);
  const [dotShape, setDotShape] = useState('circle');
  const [lineType, setLineType] = useState('monotone');

  // Legend
  const [showLegend, setShowLegend] = useState(true);
  const [legendAlign, setLegendAlign] = useState('center');
  const [legendVerticalAlign, setLegendVerticalAlign] = useState('bottom');
  const [legendIconType, setLegendIconType] = useState('circle');
  const [legendMargin, setLegendMargin] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

  // Tooltip
  const [showTooltip, setShowTooltip] = useState(true);
  const [tooltipBackground, setTooltipBackground] = useState('#ffffff');
  const [tooltipBorder, setTooltipBorder] = useState('#cccccc');
  const [tooltipOpacity, setTooltipOpacity] = useState(0.9);
  
  // Cursor/Hover effect
  const [cursorFill, setCursorFill] = useState('#f3f4f6');
  const [cursorOpacity, setCursorOpacity] = useState(0.5);

  // Animation
  const [animationDuration, setAnimationDuration] = useState(800);
  const [animationEasing, setAnimationEasing] = useState('ease');

  // Waterfall specific settings
  const [waterfallNumSales, setWaterfallNumSales] = useState(3);
  const [waterfallNumCosts, setWaterfallNumCosts] = useState(2);

  // Loaded config tracking
  const [loadedConfigName, setLoadedConfigName] = useState(null);

  // Custom data
  const [customData, setCustomData] = useState(null);

  // Auto-distribute colors when palette changes, series count changes, or even distribution is enabled
  useEffect(() => {
    if (useEvenDistribution && colors.length > 0) {
      const numSeries = dataSeries.length;
      const indices = getEvenlyDistributedColorIndices(colors, numSeries);
      setColorAssignments(indices);
    }
  }, [colors, useEvenDistribution, dataSeries.length]);

  // Adjust color assignments when series are added/removed manually
  useEffect(() => {
    if (!useEvenDistribution) {
      // Ensure colorAssignments array matches series count
      if (colorAssignments.length < dataSeries.length) {
        const newAssignments = [...colorAssignments];
        while (newAssignments.length < dataSeries.length) {
          newAssignments.push(newAssignments.length % colors.length);
        }
        setColorAssignments(newAssignments);
      } else if (colorAssignments.length > dataSeries.length) {
        setColorAssignments(colorAssignments.slice(0, dataSeries.length));
      }
    }
  }, [dataSeries.length, useEvenDistribution]);

  const styleConfig = {
    chartType,
    dataSeries,
    colors,
    backgroundColor,
    colorAssignments,
    useEvenDistribution,
    dimensions: { width: chartWidth, height: chartHeight },
    margin,
    typography: { fontFamily, fontSize, fontWeight, textColor },
    grid: { show: showGrid, color: gridColor, dashArray: gridDashArray, opacity: gridOpacity },
    axis: { color: axisColor, width: axisWidth },
    chartStyles: { strokeWidth, fillOpacity, borderRadius, dotRadius, activeDotRadius, dotShape, lineType },
    legend: { show: showLegend, align: legendAlign, verticalAlign: legendVerticalAlign, iconType: legendIconType, margin: legendMargin },
    tooltip: { show: showTooltip, background: tooltipBackground, border: tooltipBorder, opacity: tooltipOpacity, cursorFill, cursorOpacity },
    animation: { duration: animationDuration, easing: animationEasing },
    waterfall: { numSales: waterfallNumSales, numCosts: waterfallNumCosts },
    customData
  };

  // Function to download chart as SVG
  const handleDownloadSVG = () => {
    // Find the recharts container which includes both chart and legend
    const chartContainer = document.querySelector('.recharts-wrapper');
    if (!chartContainer) {
      alert('No chart found to export');
      return;
    }

    // Get the SVG element
    const svgElement = chartContainer.querySelector('svg');
    if (!svgElement) {
      alert('No chart SVG found to export');
      return;
    }

    // Clone the SVG to avoid modifying the original
    const clonedSvg = svgElement.cloneNode(true);
    
    // Get computed dimensions from the actual SVG
    const bbox = svgElement.getBoundingClientRect();
    const width = clonedSvg.getAttribute('width') || bbox.width || chartWidth;
    const height = clonedSvg.getAttribute('height') || bbox.height || chartHeight;
    
    // Set explicit dimensions
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    clonedSvg.setAttribute('viewBox', clonedSvg.getAttribute('viewBox') || `0 0 ${width} ${height}`);
    
    // Add XML namespace if not present
    clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    
    // Inline styles to ensure they're preserved in the SVG
    const styleElements = clonedSvg.querySelectorAll('[style]');
    styleElements.forEach(el => {
      const computedStyle = window.getComputedStyle(svgElement.querySelector(`[style="${el.getAttribute('style')}"]`) || el);
      const inlineStyles = el.getAttribute('style');
      el.setAttribute('style', inlineStyles);
    });
    
    // Serialize the SVG
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(clonedSvg);
    
    // Add XML declaration
    svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Use loaded config name or default
    const filename = loadedConfigName 
      ? `${loadedConfigName.toLowerCase().replace(/\s+/g, '-')}-chart.svg`
      : 'chart.svg';
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to load a saved configuration
  const handleLoadConfig = (config) => {
    setChartType(config.chartType);
    // Handle both old format (visibleSeries) and new format (dataSeries)
    if (config.dataSeries) {
      setDataSeries(config.dataSeries);
      const maxId = Math.max(...config.dataSeries.map(s => s.id), 0);
      setNextSeriesId(maxId + 1);
    } else if (config.visibleSeries) {
      // Convert old format to new format
      const converted = Object.entries(config.visibleSeries).map(([key, visible], index) => ({
        id: index + 1,
        dataKey: key,
        name: `Series ${index + 1}`,
        visible
      }));
      setDataSeries(converted);
      setNextSeriesId(converted.length + 1);
    }
    setColors(config.colors);
    setBackgroundColor(config.backgroundColor);
    if (config.colorAssignments) setColorAssignments(config.colorAssignments);
    if (config.useEvenDistribution !== undefined) setUseEvenDistribution(config.useEvenDistribution);
    setChartWidth(config.dimensions.width);
    setChartHeight(config.dimensions.height);
    setMargin(config.margin);
    setFontFamily(config.typography.fontFamily);
    setFontSize(config.typography.fontSize);
    setFontWeight(config.typography.fontWeight);
    setTextColor(config.typography.textColor);
    setShowGrid(config.grid.show);
    setGridColor(config.grid.color);
    setGridDashArray(config.grid.dashArray);
    setGridOpacity(config.grid.opacity);
    setAxisColor(config.axis.color);
    setAxisWidth(config.axis.width);
    setStrokeWidth(config.chartStyles.strokeWidth);
    setFillOpacity(config.chartStyles.fillOpacity);
    setBorderRadius(config.chartStyles.borderRadius);
    setDotRadius(config.chartStyles.dotRadius);
    setActiveDotRadius(config.chartStyles.activeDotRadius);
    setDotShape(config.chartStyles.dotShape);
    setLineType(config.chartStyles.lineType || 'monotone');
    setShowLegend(config.legend.show);
    setLegendAlign(config.legend.align);
    setLegendVerticalAlign(config.legend.verticalAlign);
    setLegendIconType(config.legend.iconType);
    if (config.legend.margin) setLegendMargin(config.legend.margin);
    setShowTooltip(config.tooltip.show);
    setTooltipBackground(config.tooltip.background);
    setTooltipBorder(config.tooltip.border);
    setTooltipOpacity(config.tooltip.opacity);
    if (config.tooltip.cursorFill !== undefined) setCursorFill(config.tooltip.cursorFill);
    if (config.tooltip.cursorOpacity !== undefined) setCursorOpacity(config.tooltip.cursorOpacity);
    setAnimationDuration(config.animation.duration);
    setAnimationEasing(config.animation.easing);
    if (config.waterfall) {
      setWaterfallNumSales(config.waterfall.numSales || 3);
      setWaterfallNumCosts(config.waterfall.numCosts || 2);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Saved Configurations Manager */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1">
            <SavedConfigManager 
              currentConfig={styleConfig}
              onLoadConfig={handleLoadConfig}
              onConfigNameChange={setLoadedConfigName}
            />
          </div>
        </div>
      </div>

      {/* Data Input Section */}
      <div className="lg:col-span-2">
        <DataInput onDataChange={setCustomData} chartType={chartType} />
      </div>

      {/* Sticky Preview Section */}
      <div className="lg:col-span-2">
        <div className="bg-white p-4 rounded-xl shadow-md sticky top-20 z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Live Preview</h3>
            <button
              onClick={handleDownloadSVG}
              className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Download chart as SVG"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              SVG
            </button>
          </div>
          <StyledChartPreview styleConfig={styleConfig} compact={true} />
        </div>
      </div>

      {/* Main Settings Section */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Chart Styler</h2>
          <p className="text-gray-600 mb-6">
            Customize every aspect of your Recharts charts - colors, dimensions, typography, grids, and more.
          </p>

          <StyleControls
            chartType={chartType}
            setChartType={setChartType}
            dataSeries={dataSeries}
            setDataSeries={setDataSeries}
            nextSeriesId={nextSeriesId}
            setNextSeriesId={setNextSeriesId}
            colors={colors}
            setColors={setColors}
            backgroundColor={backgroundColor}
            setBackgroundColor={setBackgroundColor}
            colorAssignments={colorAssignments}
            setColorAssignments={setColorAssignments}
            useEvenDistribution={useEvenDistribution}
            setUseEvenDistribution={setUseEvenDistribution}
            chartWidth={chartWidth}
            setChartWidth={setChartWidth}
            chartHeight={chartHeight}
            setChartHeight={setChartHeight}
            margin={margin}
            setMargin={setMargin}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontWeight={fontWeight}
            setFontWeight={setFontWeight}
            textColor={textColor}
            setTextColor={setTextColor}
            showGrid={showGrid}
            setShowGrid={setShowGrid}
            gridColor={gridColor}
            setGridColor={setGridColor}
            gridDashArray={gridDashArray}
            setGridDashArray={setGridDashArray}
            gridOpacity={gridOpacity}
            setGridOpacity={setGridOpacity}
            axisColor={axisColor}
            setAxisColor={setAxisColor}
            axisWidth={axisWidth}
            setAxisWidth={setAxisWidth}
            strokeWidth={strokeWidth}
            setStrokeWidth={setStrokeWidth}
            fillOpacity={fillOpacity}
            setFillOpacity={setFillOpacity}
            borderRadius={borderRadius}
            setBorderRadius={setBorderRadius}
            dotRadius={dotRadius}
            setDotRadius={setDotRadius}
            activeDotRadius={activeDotRadius}
            setActiveDotRadius={setActiveDotRadius}
            dotShape={dotShape}
            setDotShape={setDotShape}
            lineType={lineType}
            setLineType={setLineType}
            showLegend={showLegend}
            setShowLegend={setShowLegend}
            legendAlign={legendAlign}
            setLegendAlign={setLegendAlign}
            legendVerticalAlign={legendVerticalAlign}
            setLegendVerticalAlign={setLegendVerticalAlign}
            legendIconType={legendIconType}
            setLegendIconType={setLegendIconType}
            legendMargin={legendMargin}
            setLegendMargin={setLegendMargin}
            showTooltip={showTooltip}
            setShowTooltip={setShowTooltip}
            tooltipBackground={tooltipBackground}
            setTooltipBackground={setTooltipBackground}
            tooltipBorder={tooltipBorder}
            setTooltipBorder={setTooltipBorder}
            tooltipOpacity={tooltipOpacity}
            setTooltipOpacity={setTooltipOpacity}
            cursorFill={cursorFill}
            setCursorFill={setCursorFill}
            cursorOpacity={cursorOpacity}
            setCursorOpacity={setCursorOpacity}
            animationDuration={animationDuration}
            setAnimationDuration={setAnimationDuration}
            animationEasing={animationEasing}
            setAnimationEasing={setAnimationEasing}
            waterfallNumSales={waterfallNumSales}
            setWaterfallNumSales={setWaterfallNumSales}
            waterfallNumCosts={waterfallNumCosts}
            setWaterfallNumCosts={setWaterfallNumCosts}
          />
        </div>
      </div>

      {/* Export Section */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Configuration</h3>
          <ExportStyleConfig styleConfig={styleConfig} loadedConfigName={loadedConfigName} />
        </div>
      </div>
    </div>
  );
}
