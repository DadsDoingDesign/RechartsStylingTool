import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function DataInput({ onDataChange, chartType }) {
  const [activeTab, setActiveTab] = useState('paste');
  const [textInput, setTextInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(value) ? value : parseFloat(value);
      });
      
      data.push(row);
    }

    return data;
  };

  const parseJSON = (jsonText) => {
    const parsed = JSON.parse(jsonText);
    
    if (!Array.isArray(parsed)) {
      throw new Error('JSON must be an array of objects');
    }
    
    if (parsed.length === 0) {
      throw new Error('JSON array cannot be empty');
    }

    return parsed;
  };

  const handleTextSubmit = () => {
    setError('');
    setSuccess('');
    
    if (!textInput.trim()) {
      setError('Please enter some data');
      return;
    }

    try {
      let parsedData;
      
      // Try to detect format
      const trimmed = textInput.trim();
      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        // Looks like JSON
        parsedData = parseJSON(trimmed);
      } else {
        // Assume CSV
        parsedData = parseCSV(trimmed);
      }

      onDataChange(parsedData);
      setSuccess(`Successfully loaded ${parsedData.length} rows of data`);
    } catch (err) {
      setError(`Error parsing data: ${err.message}`);
    }
  };

  const parseExcel = (arrayBuffer) => {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    if (jsonData.length === 0) {
      throw new Error('Excel file is empty');
    }
    
    return jsonData;
  };

  const handleFileUpload = (event) => {
    setError('');
    setSuccess('');
    
    const file = event.target.files?.[0];
    if (!file) return;

    const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result;
      if (!content) return;

      try {
        let parsedData;
        
        if (isExcel) {
          parsedData = parseExcel(content);
        } else if (file.name.endsWith('.json')) {
          const text = new TextDecoder().decode(content);
          parsedData = parseJSON(text);
        } else if (file.name.endsWith('.csv')) {
          const text = new TextDecoder().decode(content);
          parsedData = parseCSV(text);
        } else {
          throw new Error('Only .csv, .json, .xlsx, and .xls files are supported');
        }

        onDataChange(parsedData);
        setSuccess(`Successfully loaded ${parsedData.length} rows from ${file.name}`);
      } catch (err) {
        setError(`Error reading file: ${err.message}`);
      }
    };

    reader.onerror = () => {
      setError('Error reading file');
    };

    if (isExcel) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClearData = () => {
    onDataChange(null);
    setTextInput('');
    setError('');
    setSuccess('Data cleared. Using sample data.');
  };

  const getDataExample = () => {
    if (chartType === 'pie') {
      return `CSV Example:
name,value
Category A,400
Category B,300
Category C,250

JSON Example:
[
  {"name": "Category A", "value": 400},
  {"name": "Category B", "value": 300}
]`;
    } else if (chartType === 'waterfall') {
      return `CSV Example:
name,value,isIncrease,isTotal
Start,5000,false,true
Revenue,3000,true,false
Costs,-1500,false,false

JSON Example:
[
  {"name": "Start", "value": 5000, "isTotal": true},
  {"name": "Revenue", "value": 3000, "isIncrease": true}
]`;
    } else {
      return `CSV Example:
name,value1,value2,value3
Jan,4000,2400,2400
Feb,3000,1398,2210
Mar,2000,9800,2290

JSON Example:
[
  {"name": "Jan", "value1": 4000, "value2": 2400},
  {"name": "Feb", "value1": 3000, "value2": 1398}
]`;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Custom Data Input</h3>
        <button
          onClick={handleClearData}
          className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear Data
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('paste')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'paste'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FileText size={16} />
          Paste Data
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 rounded-t-lg font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Upload size={16} />
          Upload File
        </button>
      </div>

      {/* Paste Tab */}
      {activeTab === 'paste' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Paste CSV or JSON data
            </label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={getDataExample()}
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
          </div>
          <button
            onClick={handleTextSubmit}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Load Data
          </button>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-3">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <Upload size={48} className="mx-auto text-gray-400 mb-3" />
            <label className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700 font-medium">
                Click to upload
              </span>
              <span className="text-gray-600"> or drag and drop</span>
              <input
                type="file"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-500 mt-2">CSV, JSON, or Excel files</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-medium">Expected Format:</p>
            <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
              {getDataExample()}
            </pre>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">{success}</p>
        </div>
      )}
    </div>
  );
}
