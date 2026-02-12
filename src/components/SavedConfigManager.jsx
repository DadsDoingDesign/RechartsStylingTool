import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, Edit2, Check, X } from 'lucide-react';

export default function SavedConfigManager({ currentConfig, onLoadConfig, onConfigNameChange }) {
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loadedConfigId, setLoadedConfigId] = useState(null);
  const [overwriteTarget, setOverwriteTarget] = useState(null);

  // Load saved configs from localStorage on mount
  useEffect(() => {
    loadSavedConfigs();
  }, []);

  const loadSavedConfigs = () => {
    try {
      const saved = localStorage.getItem('chartConfigs');
      if (saved) {
        setSavedConfigs(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading saved configs:', error);
    }
  };

  const saveConfigToStorage = (configs) => {
    try {
      localStorage.setItem('chartConfigs', JSON.stringify(configs));
      setSavedConfigs(configs);
    } catch (error) {
      console.error('Error saving configs:', error);
    }
  };

  const handleSaveConfig = () => {
    if (!saveName.trim()) return;

    // Check if name already exists
    const existingConfig = savedConfigs.find(c => c.name.toLowerCase() === saveName.trim().toLowerCase());
    
    if (existingConfig && !overwriteTarget) {
      setOverwriteTarget(existingConfig);
      return;
    }

    if (overwriteTarget) {
      // Overwrite existing config
      const updatedConfigs = savedConfigs.map(c =>
        c.id === overwriteTarget.id
          ? { ...c, config: currentConfig, timestamp: new Date().toISOString() }
          : c
      );
      saveConfigToStorage(updatedConfigs);
      setLoadedConfigId(overwriteTarget.id);
      if (onConfigNameChange) {
        onConfigNameChange(overwriteTarget.name);
      }
    } else {
      // Save new config
      const newConfig = {
        id: Date.now().toString(),
        name: saveName.trim(),
        config: currentConfig,
        timestamp: new Date().toISOString()
      };
      const updatedConfigs = [...savedConfigs, newConfig];
      saveConfigToStorage(updatedConfigs);
      setLoadedConfigId(newConfig.id);
      if (onConfigNameChange) {
        onConfigNameChange(newConfig.name);
      }
    }

    setSaveName('');
    setOverwriteTarget(null);
    setShowSaveDialog(false);
  };

  const handleUpdateCurrentConfig = () => {
    if (!loadedConfigId) return;
    
    const updatedConfigs = savedConfigs.map(c =>
      c.id === loadedConfigId
        ? { ...c, config: currentConfig, timestamp: new Date().toISOString() }
        : c
    );
    saveConfigToStorage(updatedConfigs);
  };

  const handleLoadConfig = (config) => {
    onLoadConfig(config.config);
    setLoadedConfigId(config.id);
    if (onConfigNameChange) {
      onConfigNameChange(config.name);
    }
    setShowLoadDialog(false);
  };

  const handleDeleteConfig = (id) => {
    const updatedConfigs = savedConfigs.filter(c => c.id !== id);
    saveConfigToStorage(updatedConfigs);
  };

  const handleStartRename = (config) => {
    setEditingId(config.id);
    setEditingName(config.name);
  };

  const handleSaveRename = (id) => {
    if (!editingName.trim()) return;

    const updatedConfigs = savedConfigs.map(c =>
      c.id === id ? { ...c, name: editingName.trim() } : c
    );
    saveConfigToStorage(updatedConfigs);
    setEditingId(null);
    setEditingName('');
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Saved Configurations</h3>
        <div className="flex gap-2">
          {loadedConfigId && savedConfigs.find(c => c.id === loadedConfigId) && (
            <button
              onClick={handleUpdateCurrentConfig}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              title="Update the currently loaded configuration"
            >
              <Save size={18} />
              Update "{savedConfigs.find(c => c.id === loadedConfigId)?.name}"
            </button>
          )}
          <button
            onClick={() => setShowSaveDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={18} />
            Save As New
          </button>
          <button
            onClick={() => setShowLoadDialog(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={savedConfigs.length === 0}
          >
            <FolderOpen size={18} />
            Load ({savedConfigs.length})
          </button>
        </div>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Save Configuration</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter configuration name..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveConfig();
                if (e.key === 'Escape') setShowSaveDialog(false);
              }}
            />
            {overwriteTarget && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  A configuration named "{overwriteTarget.name}" already exists.
                </p>
                <p className="text-sm text-yellow-700">
                  Click Save to overwrite it, or change the name to save as new.
                </p>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveName('');
                  setOverwriteTarget(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={!saveName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {overwriteTarget ? 'Overwrite' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Dialog */}
      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Load Configuration</h3>
            <div className="flex-1 overflow-y-auto">
              {savedConfigs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No saved configurations yet</p>
              ) : (
                <div className="space-y-2">
                  {savedConfigs.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        {editingId === config.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveRename(config.id);
                                if (e.key === 'Escape') handleCancelRename();
                              }}
                            />
                            <button
                              onClick={() => handleSaveRename(config.id)}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={handleCancelRename}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="font-medium text-gray-800">{config.name}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(config.timestamp).toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                      {editingId !== config.id && (
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={() => handleStartRename(config)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Rename"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleLoadConfig(config)}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleDeleteConfig(config.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <button
                onClick={() => setShowLoadDialog(false)}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
