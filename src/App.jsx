import React from 'react';
import ChartStyler from './components/ChartStyler';
import './index.css';

function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Recharts Styling Studio</h1>
              <p className="text-gray-600 mt-1">Professional chart customization tool - Design beautiful, export-ready charts with complete control over styling</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChartStyler />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Built with React, Recharts, and Tailwind CSS - Professional chart styling with export-ready code
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
