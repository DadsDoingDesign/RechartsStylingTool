import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Sample data for different chart types
const barData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 },
];

const pieData = [
  { name: 'Category A', value: 400 },
  { name: 'Category B', value: 300 },
  { name: 'Category C', value: 300 },
  { name: 'Category D', value: 200 },
  { name: 'Category E', value: 278 },
  { name: 'Category F', value: 189 },
];

const multiLineData = [
  { name: 'Jan', series1: 4000, series2: 2400, series3: 2400, series4: 1800 },
  { name: 'Feb', series1: 3000, series2: 1398, series3: 2210, series4: 2200 },
  { name: 'Mar', series1: 2000, series2: 9800, series3: 2290, series4: 2800 },
  { name: 'Apr', series1: 2780, series2: 3908, series3: 2000, series4: 1900 },
  { name: 'May', series1: 1890, series2: 4800, series3: 2181, series4: 2300 },
  { name: 'Jun', series1: 2390, series2: 3800, series3: 2500, series4: 2100 },
];

export default function ChartExamples({ colors, type = 'palette' }) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Examples in Context</h4>
        <p className="text-xs text-gray-500 mb-4">
          See how your colors look in real charts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 className="text-xs font-semibold text-gray-600 mb-3 text-center">Pie Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData.slice(0, colors.length)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.slice(0, colors.length).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 className="text-xs font-semibold text-gray-600 mb-3 text-center">Bar Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 className="text-xs font-semibold text-gray-600 mb-3 text-center">Line Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={multiLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {colors.slice(0, 4).map((color, index) => (
                <Line
                  key={`line-${index}`}
                  type="monotone"
                  dataKey={`series${index + 1}`}
                  stroke={color}
                  strokeWidth={2}
                  dot={{ fill: color, r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Area Chart */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h5 className="text-xs font-semibold text-gray-600 mb-3 text-center">Area Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={multiLineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {colors.slice(0, 4).map((color, index) => (
                <Area
                  key={`area-${index}`}
                  type="monotone"
                  dataKey={`series${index + 1}`}
                  stackId="1"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
