import React from 'react';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, Symbols
} from 'recharts';
import chroma from 'chroma-js';

// Generate sample data dynamically based on number of series
const generateSampleData = (numSeries) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseValues = [
    [4000, 2400, 2400, 3200, 2800, 3500],
    [3000, 1398, 2210, 2900, 3100, 2700],
    [2000, 9800, 2290, 4500, 3800, 4200],
    [2780, 3908, 2000, 3300, 2500, 3000],
    [1890, 4800, 2181, 3700, 4100, 3400],
    [2390, 3800, 2500, 2800, 3200, 2900],
  ];
  
  return months.map((month, monthIndex) => {
    const dataPoint = { name: month };
    for (let i = 0; i < numSeries; i++) {
      const valueKey = `value${i + 1}`;
      // Use base values for first 6 series, then generate random values
      if (i < 6) {
        dataPoint[valueKey] = baseValues[i][monthIndex];
      } else {
        dataPoint[valueKey] = Math.floor(Math.random() * 8000) + 1000;
      }
    }
    return dataPoint;
  });
};

const pieData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
  { name: 'Category E', value: 278 },
];

// Generate waterfall data dynamically based on number of sales and costs
const generateWaterfallData = (numSales, numCosts) => {
  const data = [{ name: 'Start', value: 5000, isTotal: true }];
  
  // Generate sales (increases)
  for (let i = 0; i < numSales; i++) {
    data.push({
      name: `Sale ${i + 1}`,
      value: Math.floor(Math.random() * 2000) + 1000,
      isIncrease: true
    });
  }
  
  // Generate costs (decreases)
  for (let i = 0; i < numCosts; i++) {
    data.push({
      name: `Cost ${i + 1}`,
      value: -(Math.floor(Math.random() * 1500) + 500),
      isIncrease: false
    });
  }
  
  data.push({ name: 'End', value: 0, isTotal: true });
  return data;
};

// Calculate cumulative values and bar positions for waterfall
const processWaterfallData = (data) => {
  let cumulative = 0;
  const processed = [];
  
  data.forEach((item, index) => {
    if (item.isTotal) {
      // Total bars start from 0
      if (index === 0) {
        cumulative = item.value;
        processed.push({
          ...item,
          start: 0,
          end: item.value,
          displayValue: item.value
        });
      } else {
        // End total - calculate final value
        processed.push({
          ...item,
          start: 0,
          end: cumulative,
          displayValue: cumulative
        });
      }
    } else {
      // Regular bars
      const previousValue = cumulative;
      cumulative += item.value;
      processed.push({
        ...item,
        start: item.value > 0 ? previousValue : cumulative,
        end: item.value > 0 ? cumulative : previousValue,
        displayValue: item.value
      });
    }
  });
  
  return processed;
};

export default function StyledChartPreview({ styleConfig, compact = false }) {
  const {
    chartType,
    dataSeries: configSeries = [
      { id: 1, dataKey: 'value1', name: 'Series 1', visible: true },
      { id: 2, dataKey: 'value2', name: 'Series 2', visible: true },
      { id: 3, dataKey: 'value3', name: 'Series 3', visible: true }
    ],
    colors,
    backgroundColor,
    colorAssignments = [0, 1, 2],
    dimensions,
    margin,
    typography,
    grid,
    axis,
    chartStyles,
    legend,
    tooltip,
    animation,
    waterfall = { numSales: 3, numCosts: 2 },
    customData
  } = styleConfig;

  // Get high-contrast colors for waterfall chart (increase, decrease, total)
  const getHighContrastColors = (palette) => {
    if (palette.length < 3) return [palette[0] || '#82ca9d', palette[1] || '#ff7c7c', palette[2] || '#ffc658'];
    
    // Use chroma to find most contrasting colors
    const sortedByLuminance = palette
      .map((color, index) => ({ color, index, luminance: chroma(color).luminance() }))
      .sort((a, b) => a.luminance - b.luminance);
    
    // Pick colors from absolute extremes and exact middle for maximum contrast
    const increaseColor = sortedByLuminance[sortedByLuminance.length - 1].color; // Brightest (top end)
    const decreaseColor = sortedByLuminance[0].color; // Darkest (bottom end)
    const totalColor = sortedByLuminance[Math.floor(sortedByLuminance.length / 2)].color; // Exact middle
    
    return [increaseColor, decreaseColor, totalColor];
  };

  const waterfallColors = getHighContrastColors(colors);

  // Get the actual colors to use based on assignments
  const assignedColors = colorAssignments.map(index => colors[index] || colors[0]);
  
  // Combine series data with colors
  const renderableSeries = configSeries.map((series, index) => ({
    ...series,
    color: assignedColors[index] || colors[0]
  }));

  // Use custom data if available, otherwise generate sample data based on number of series
  const chartData = customData || generateSampleData(configSeries.length);
  const chartPieData = customData || pieData;
  const chartWaterfallData = customData || generateWaterfallData(waterfall.numSales, waterfall.numCosts);

  // Use smaller dimensions in compact mode
  const displayWidth = compact ? Math.min(dimensions.width * 0.6, 500) : dimensions.width;
  const displayHeight = compact ? Math.min(dimensions.height * 0.6, 250) : dimensions.height;

  const commonProps = {
    data: chartData,
    margin: margin,
  };

  const textColor = typography.textColor;

  const axisStyle = {
    fontSize: typography.fontSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight,
    fill: textColor,
  };

  const gridProps = grid.show ? {
    strokeDasharray: grid.dashArray,
    stroke: grid.color,
    opacity: grid.opacity
  } : null;

  const legendProps = legend.show ? {
    iconType: legend.iconType,
    align: legend.align,
    verticalAlign: legend.verticalAlign,
    wrapperStyle: {
      fontSize: typography.fontSize,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight,
      marginTop: legend.margin?.top || 0,
      marginRight: legend.margin?.right || 0,
      marginBottom: legend.margin?.bottom || 0,
      marginLeft: legend.margin?.left || 0,
    },
    formatter: (value, entry) => {
      return <span style={{ color: textColor }}>{value}</span>;
    }
  } : null;

  const tooltipProps = tooltip.show ? {
    contentStyle: {
      backgroundColor: tooltip.background,
      border: `1px solid ${tooltip.border}`,
      borderRadius: '6px',
      opacity: tooltip.opacity,
      fontSize: typography.fontSize,
      fontFamily: typography.fontFamily,
      color: textColor,
    },
    itemStyle: {
      color: textColor,
    },
    labelStyle: {
      color: textColor,
      fontWeight: typography.fontWeight,
    },
    offset: 20,
    cursor: { 
      fill: tooltip.cursorFill || '#f3f4f6',
      opacity: tooltip.cursorOpacity !== undefined ? tooltip.cursorOpacity : 0.5,
      strokeDasharray: '3 3' 
    }
  } : null;

  const animationProps = {
    animationDuration: animation.duration,
    animationEasing: animation.easing
  };

  // Custom dot renderer for line charts
  const renderCustomDot = (props, color) => {
    const { cx, cy } = props;
    return (
      <Symbols
        cx={cx}
        cy={cy}
        type={chartStyles.dotShape}
        size={chartStyles.dotRadius * chartStyles.dotRadius * Math.PI}
        fill={color}
        stroke={color}
        strokeWidth={1}
      />
    );
  };

  // Custom active dot renderer for line charts
  const renderActiveDot = (props, color) => {
    const { cx, cy } = props;
    // Increase saturation by 10% for active dots
    const saturatedColor = chroma(color).saturate(0.1).hex();
    return (
      <Symbols
        cx={cx}
        cy={cy}
        type={chartStyles.dotShape}
        size={chartStyles.activeDotRadius * chartStyles.activeDotRadius * Math.PI}
        fill={saturatedColor}
        stroke={saturatedColor}
        strokeWidth={2}
      />
    );
  };

  return (
    <div
      style={{
        backgroundColor: backgroundColor,
        padding: compact ? '12px' : '20px',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        width: displayWidth,
        height: displayHeight
      }}
    >
        {(chartType === 'bar' || chartType === 'stacked-bar') && (
          <BarChart {...commonProps} width={displayWidth} height={displayHeight}>
            {grid.show && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            <YAxis tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            {tooltip.show && <Tooltip {...tooltipProps} />}
            {legend.show && <Legend {...legendProps} />}
            {renderableSeries.map((series) => 
              series.visible && (
                <Bar
                  key={series.id}
                  dataKey={series.dataKey}
                  name={series.name}
                  fill={series.color}
                  stackId={chartType === 'stacked-bar' ? 'stack' : undefined}
                  radius={[chartStyles.borderRadius, chartStyles.borderRadius, 0, 0]}
                  fillOpacity={chartStyles.fillOpacity}
                  {...animationProps}
                />
              )
            )}
          </BarChart>
        )}

        {chartType === 'line' && (
          <LineChart {...commonProps} width={displayWidth} height={displayHeight}>
            {grid.show && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            <YAxis tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            {tooltip.show && <Tooltip {...tooltipProps} />}
            {legend.show && <Legend {...legendProps} />}
            {renderableSeries.map((series) => 
              series.visible && (
                <Line
                  key={series.id}
                  type={chartStyles.lineType}
                  dataKey={series.dataKey}
                  name={series.name}
                  stroke={series.color}
                  strokeWidth={chartStyles.strokeWidth}
                  dot={(props) => renderCustomDot(props, series.color)}
                  activeDot={(props) => renderActiveDot(props, series.color)}
                  {...animationProps}
                />
              )
            )}
          </LineChart>
        )}

        {chartType === 'area' && (
          <AreaChart {...commonProps} width={displayWidth} height={displayHeight}>
            {grid.show && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            <YAxis tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
            {tooltip.show && <Tooltip {...tooltipProps} />}
            {legend.show && <Legend {...legendProps} />}
            {renderableSeries.map((series) => 
              series.visible && (
                <Area
                  key={series.id}
                  type={chartStyles.lineType}
                  dataKey={series.dataKey}
                  name={series.name}
                  stackId="1"
                  stroke={series.color}
                  fill={series.color}
                  strokeWidth={chartStyles.strokeWidth}
                  fillOpacity={chartStyles.fillOpacity}
                  {...animationProps}
                />
              )
            )}
          </AreaChart>
        )}

        {chartType === 'pie' && (
          <PieChart width={displayWidth} height={displayHeight}>
            <Pie
              data={chartPieData.slice(0, Math.max(colors.length, chartPieData.length))}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={Math.min(displayWidth, displayHeight) * 0.3}
              fill="#8884d8"
              dataKey="value"
              {...animationProps}
            >
              {chartPieData.slice(0, Math.max(colors.length, chartPieData.length)).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} fillOpacity={chartStyles.fillOpacity} />
              ))}
            </Pie>
            {tooltip.show && <Tooltip {...tooltipProps} />}
            {legend.show && <Legend {...legendProps} />}
          </PieChart>
        )}

        {chartType === 'waterfall' && (() => {
          const processedData = processWaterfallData(chartWaterfallData);
          return (
            <BarChart {...commonProps} data={processedData} width={displayWidth} height={displayHeight}>
              {grid.show && <CartesianGrid {...gridProps} />}
              <XAxis dataKey="name" tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
              <YAxis tick={axisStyle} stroke={axis.color} strokeWidth={axis.width} />
              {tooltip.show && <Tooltip 
                {...tooltipProps}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div style={{
                        backgroundColor: tooltip.background,
                        border: `1px solid ${tooltip.border}`,
                        borderRadius: '6px',
                        padding: '8px',
                        opacity: tooltip.opacity,
                        fontSize: typography.fontSize,
                        fontFamily: typography.fontFamily,
                        color: textColor,
                      }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: textColor }}>{data.name}</p>
                        <p style={{ margin: 0, color: textColor, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            display: 'inline-block',
                            width: '10px',
                            height: '10px',
                            borderRadius: '2px',
                            backgroundColor: data.isIncrease ? waterfallColors[0] : data.isIncrease === false ? waterfallColors[1] : waterfallColors[2]
                          }}></span>
                          {data.isTotal ? `Total: ${data.displayValue}` : 
                           data.isIncrease ? `+${data.displayValue}` : data.displayValue}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />}
              {legend.show && (
                <Legend 
                  {...legendProps}
                  payload={[
                    { value: 'Sales (Increase)', type: legend.iconType, color: waterfallColors[0] },
                    { value: 'Costs (Decrease)', type: legend.iconType, color: waterfallColors[1] },
                    { value: 'Totals', type: legend.iconType, color: waterfallColors[2] }
                  ]}
                />
              )}
              {/* Invisible bars to establish the baseline */}
              <Bar dataKey="start" stackId="a" fill="transparent" />
              {/* Visible bars showing the change */}
              <Bar 
                dataKey={(entry) => entry.end - entry.start}
                stackId="a"
                radius={[chartStyles.borderRadius, chartStyles.borderRadius, 0, 0]}
                fillOpacity={chartStyles.fillOpacity}
                {...animationProps}
              >
                {processedData.map((entry, index) => {
                  let fillColor;
                  if (entry.isTotal) {
                    fillColor = waterfallColors[2]; // Total bars - middle contrast color
                  } else if (entry.isIncrease) {
                    fillColor = waterfallColors[0]; // Increase bars - bright color
                  } else {
                    fillColor = waterfallColors[1]; // Decrease bars - dark color
                  }
                  return <Cell key={`cell-${index}`} fill={fillColor} />;
                })}
              </Bar>
            </BarChart>
          );
        })()}
    </div>
  );
}
