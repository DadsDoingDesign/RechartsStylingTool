import React, { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

export default function ExportStyleConfig({ styleConfig, loadedConfigName }) {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const generateJSONConfig = () => {
    return JSON.stringify(styleConfig, null, 2);
  };

  const generateReactCode = () => {
    const { chartType, colors, dimensions, margin, typography, grid, axis, chartStyles, legend, tooltip, animation } = styleConfig;
    
    // Determine if we need Symbols for custom dot shapes
    const needsSymbols = chartType === 'line' && chartStyles.dotShape !== 'circle';
    
    return `import { ${chartType === 'pie' ? 'PieChart, Pie' : chartType === 'bar' ? 'BarChart, Bar' : chartType === 'line' ? 'LineChart, Line' : 'AreaChart, Area'}, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer${chartType === 'pie' ? ', Cell' : ''}${needsSymbols ? ', Symbols' : ''} } from 'recharts';

const data = [
  { name: 'Jan', value1: 4000, value2: 2400, value3: 2400 },
  { name: 'Feb', value1: 3000, value2: 1398, value3: 2210 },
  // ... more data
];

export default function StyledChart() {
  const colors = ${JSON.stringify(colors)};
  ${needsSymbols ? `
  // Custom dot renderer for non-circle shapes
  const renderCustomDot = (props) => {
    const { cx, cy, fill } = props;
    return (
      <Symbols
        cx={cx}
        cy={cy}
        type="${chartStyles.dotShape}"
        size={${chartStyles.dotRadius} * ${chartStyles.dotRadius} * Math.PI}
        fill={fill}
        stroke={fill}
        strokeWidth={1}
      />
    );
  };

  // Custom active dot renderer
  const renderActiveDot = (props) => {
    const { cx, cy, fill } = props;
    return (
      <Symbols
        cx={cx}
        cy={cy}
        type="${chartStyles.dotShape}"
        size={${chartStyles.activeDotRadius} * ${chartStyles.activeDotRadius} * Math.PI}
        fill={fill}
        stroke={fill}
        strokeWidth={2}
      />
    );
  };
` : ''}
  return (
    <div style={{ backgroundColor: '${styleConfig.backgroundColor}', padding: '20px', borderRadius: '12px' }}>
      <ResponsiveContainer width={${dimensions.width}} height={${dimensions.height}}>
        <${chartType === 'pie' ? 'PieChart' : chartType === 'bar' ? 'BarChart' : chartType === 'line' ? 'LineChart' : 'AreaChart'}
          data={data}
          margin={{ top: ${margin.top}, right: ${margin.right}, bottom: ${margin.bottom}, left: ${margin.left} }}
        >
          ${grid.show ? `<CartesianGrid strokeDasharray="${grid.dashArray}" stroke="${grid.color}" opacity={${grid.opacity}} />` : ''}
          ${chartType !== 'pie' ? `<XAxis 
            dataKey="name"
            tick={{ fontSize: ${typography.fontSize}, fontFamily: '${typography.fontFamily}', fontWeight: ${typography.fontWeight}, fill: '${typography.textColor}' }}
            stroke="${axis.color}"
            strokeWidth={${axis.width}}
          />
          <YAxis 
            tick={{ fontSize: ${typography.fontSize}, fontFamily: '${typography.fontFamily}', fontWeight: ${typography.fontWeight}, fill: '${typography.textColor}' }}
            stroke="${axis.color}"
            strokeWidth={${axis.width}}
          />` : ''}
          ${tooltip.show ? `<Tooltip 
            contentStyle={{
              backgroundColor: '${tooltip.background}',
              border: '1px solid ${tooltip.border}',
              borderRadius: '6px',
              opacity: ${tooltip.opacity},
              fontSize: ${typography.fontSize},
              fontFamily: '${typography.fontFamily}'
            }}
            cursor={{ 
              fill: '${tooltip.cursorFill || '#f3f4f6'}',
              opacity: ${tooltip.cursorOpacity !== undefined ? tooltip.cursorOpacity : 0.5},
              strokeDasharray: '3 3'
            }}
          />` : ''}
          ${legend.show ? `<Legend 
            iconType="${legend.iconType}"
            align="${legend.align}"
            verticalAlign="${legend.verticalAlign}"
            wrapperStyle={{ fontSize: ${typography.fontSize}, fontFamily: '${typography.fontFamily}', fontWeight: ${typography.fontWeight} }}
          />` : ''}
          ${chartType === 'bar' ? `<Bar dataKey="value1" fill={colors[0]} radius={[${chartStyles.borderRadius}, ${chartStyles.borderRadius}, 0, 0]} fillOpacity={${chartStyles.fillOpacity}} animationDuration={${animation.duration}} animationEasing="${animation.easing}" />` : ''}
          ${chartType === 'line' ? `<Line type="${chartStyles.lineType || 'monotone'}" dataKey="value1" stroke={colors[0]} strokeWidth={${chartStyles.strokeWidth}} ${needsSymbols ? 'dot={renderCustomDot} activeDot={renderActiveDot}' : `dot={{ fill: colors[0], r: ${chartStyles.dotRadius} }} activeDot={{ r: ${chartStyles.activeDotRadius} }}`} animationDuration={${animation.duration}} animationEasing="${animation.easing}" />` : ''}
          ${chartType === 'area' ? `<Area type="${chartStyles.lineType || 'monotone'}" dataKey="value1" stackId="1" stroke={colors[0]} fill={colors[0]} strokeWidth={${chartStyles.strokeWidth}} fillOpacity={${chartStyles.fillOpacity}} animationDuration={${animation.duration}} animationEasing="${animation.easing}" />` : ''}
          ${chartType === 'pie' ? `<Pie data={data} cx="50%" cy="50%" outerRadius={80} fill={colors[0]} dataKey="value" animationDuration={${animation.duration}} animationEasing="${animation.easing}">
            {data.map((entry, index) => (
              <Cell key={\`cell-\${index}\`} fill={colors[index % colors.length]} fillOpacity={${chartStyles.fillOpacity}} />
            ))}
          </Pie>` : ''}
        </${chartType === 'pie' ? 'PieChart' : chartType === 'bar' ? 'BarChart' : chartType === 'line' ? 'LineChart' : 'AreaChart'}>
      </ResponsiveContainer>
    </div>
  );
}`;
  };

  const generateCSSVariables = () => {
    return `:root {
  /* Colors */
${styleConfig.colors.map((color, i) => `  --chart-color-${i + 1}: ${color};`).join('\n')}
  --chart-background: ${styleConfig.backgroundColor};
  --chart-text-color: ${styleConfig.typography.textColor};
  
  /* Grid & Axes */
  --chart-grid-color: ${styleConfig.grid.color};
  --chart-grid-opacity: ${styleConfig.grid.opacity};
  --chart-grid-dash-array: ${styleConfig.grid.dashArray};
  --chart-axis-color: ${styleConfig.axis.color};
  --chart-axis-width: ${styleConfig.axis.width}px;
  
  /* Typography */
  --chart-font-family: ${styleConfig.typography.fontFamily};
  --chart-font-size: ${styleConfig.typography.fontSize}px;
  --chart-font-weight: ${styleConfig.typography.fontWeight};
  
  /* Chart Element Styles */
  --chart-stroke-width: ${styleConfig.chartStyles.strokeWidth}px;
  --chart-fill-opacity: ${styleConfig.chartStyles.fillOpacity};
  --chart-border-radius: ${styleConfig.chartStyles.borderRadius}px;
  --chart-dot-radius: ${styleConfig.chartStyles.dotRadius}px;
  --chart-active-dot-radius: ${styleConfig.chartStyles.activeDotRadius}px;
  --chart-dot-shape: ${styleConfig.chartStyles.dotShape};
  --chart-line-type: ${styleConfig.chartStyles.lineType};
  
  /* Legend */
  --chart-legend-icon-type: ${styleConfig.legend.iconType};
  --chart-legend-align: ${styleConfig.legend.align};
  --chart-legend-vertical-align: ${styleConfig.legend.verticalAlign};
  
  /* Tooltip */
  --chart-tooltip-bg: ${styleConfig.tooltip.background};
  --chart-tooltip-border: ${styleConfig.tooltip.border};
  --chart-tooltip-opacity: ${styleConfig.tooltip.opacity};
  
  /* Hover/Cursor Effect */
  --chart-cursor-fill: ${styleConfig.tooltip.cursorFill || '#f3f4f6'};
  --chart-cursor-opacity: ${styleConfig.tooltip.cursorOpacity !== undefined ? styleConfig.tooltip.cursorOpacity : 0.5};
  
  /* Animation */
  --chart-animation-duration: ${styleConfig.animation.duration}ms;
  --chart-animation-easing: ${styleConfig.animation.easing};
  
  /* Dimensions */
  --chart-width: ${styleConfig.dimensions.width}px;
  --chart-height: ${styleConfig.dimensions.height}px;
  
  /* Spacing */
  --chart-margin-top: ${styleConfig.margin.top}px;
  --chart-margin-right: ${styleConfig.margin.right}px;
  --chart-margin-bottom: ${styleConfig.margin.bottom}px;
  --chart-margin-left: ${styleConfig.margin.left}px;
}`;
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case 'json':
        return generateJSONConfig();
      case 'react':
        return generateReactCode();
      case 'css':
        return generateCSSVariables();
      default:
        return generateJSONConfig();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getExportContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = () => {
    const content = getExportContent();
    const extension = exportFormat === 'json' ? 'json' : exportFormat === 'react' ? 'jsx' : 'css';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Use loaded config name if available, otherwise use default
    const baseFilename = loadedConfigName 
      ? loadedConfigName.toLowerCase().replace(/\s+/g, '-') 
      : 'chart-style-config';
    link.download = `${baseFilename}.${extension}`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {['json', 'react', 'css'].map(format => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`px-4 py-2 rounded-lg font-medium uppercase text-sm transition-colors ${
                exportFormat === format
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {format}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={downloadFile}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={18} />
            Download
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96">
          <code>{getExportContent()}</code>
        </pre>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Export Options:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>JSON:</strong> Pure configuration object for programmatic use</li>
          <li><strong>React:</strong> Ready-to-use React component code</li>
          <li><strong>CSS:</strong> CSS variables for consistent theming</li>
        </ul>
      </div>
    </div>
  );
}
