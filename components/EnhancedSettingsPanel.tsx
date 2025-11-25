import React, { useState } from 'react';

export interface EnhancedSettingsState {
  dataSource: 'json' | 'api';
  autoRefresh: boolean;
  refreshInterval: number; // in seconds
  showEmissionAlerts: boolean;
  useMetricUnits: boolean;
  mapStyle: 'standard' | 'satellite' | 'terrain';
  biweeklyAnalysis: boolean;
  showInfrastructure: boolean;
}

interface EnhancedSettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
  settings: EnhancedSettingsState;
  onSettingsChange: (settings: EnhancedSettingsState) => void;
  className?: string;
}

export const EnhancedSettingsPanel: React.FC<EnhancedSettingsPanelProps> = ({
  isVisible,
  onClose,
  settings,
  onSettingsChange,
  className = ''
}) => {
  const [localSettings, setLocalSettings] = useState<EnhancedSettingsState>(settings);

  const updateSetting = <K extends keyof EnhancedSettingsState>(
    key: K,
    value: EnhancedSettingsState[K]
  ) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">⚙️ TMAT Settings</h2>
              <p className="text-blue-100 text-sm">Configure TMAT water level monitoring preferences</p>
            </div>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="space-y-6">
            
            {/* Data Source Configuration */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Data Source</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Data Source
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="dataSource"
                        value="json"
                        checked={localSettings.dataSource === 'json'}
                        onChange={(e) => updateSetting('dataSource', e.target.value as 'json' | 'api')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">📁 Local JSON File (populate_db.json)</div>
                        <div className="text-sm text-gray-600">
                          Use local JSON data for stable operation (Default)
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          ✓ Fast loading • ✓ Offline capable • ✓ No network dependency
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="dataSource"
                        value="api"
                        checked={localSettings.dataSource === 'api'}
                        onChange={(e) => updateSetting('dataSource', e.target.value as 'json' | 'api')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">🌐 API Service</div>
                        <div className="text-sm text-gray-600">
                          Use live API endpoints for real-time data
                        </div>
                        <div className="text-xs text-yellow-600 mt-1">
                          ⚠ Requires internet • ⚠ May have connection issues
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {localSettings.dataSource === 'api' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600">⚠️</span>
                      <span className="font-medium text-yellow-800">API Mode Notice</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      API mode may experience connection issues. Consider using JSON mode for stable operation.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* TMAT Analysis Features */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🌊 TMAT Analysis</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.biweeklyAnalysis}
                    onChange={(e) => updateSetting('biweeklyAnalysis', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Enable Biweekly Analysis</div>
                    <div className="text-sm text-gray-600">Show TMAT Dwi Mingguan (2-week period analysis)</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.showInfrastructure}
                    onChange={(e) => updateSetting('showInfrastructure', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Show Infrastructure Layer</div>
                    <div className="text-sm text-gray-600">Display canal blocks and water control structures</div>
                  </div>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.showEmissionAlerts}
                    onChange={(e) => updateSetting('showEmissionAlerts', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Show Emission Risk Alerts</div>
                    <div className="text-sm text-gray-600">Display CO₂ emission risk notifications for peatland areas</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Auto Refresh */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🔄 Data Refresh</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.autoRefresh}
                    onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Enable Auto Refresh</div>
                    <div className="text-sm text-gray-600">Automatically update data at regular intervals</div>
                  </div>
                </label>

                {localSettings.autoRefresh && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Refresh Interval: {localSettings.refreshInterval} seconds
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="300"
                      step="30"
                      value={localSettings.refreshInterval}
                      onChange={(e) => updateSetting('refreshInterval', Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>30s</span>
                      <span>2min</span>
                      <span>5min</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Display Preferences */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🎨 Display Preferences</h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localSettings.useMetricUnits}
                    onChange={(e) => updateSetting('useMetricUnits', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <div className="font-medium text-gray-800">Use Metric Units</div>
                    <div className="text-sm text-gray-600">Display measurements in meters and Celsius</div>
                  </div>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Map Style
                  </label>
                  <select
                    value={localSettings.mapStyle}
                    onChange={(e) => updateSetting('mapStyle', e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standard">🗺️ Standard</option>
                    <option value="satellite">🛰️ Satellite</option>
                    <option value="terrain">🏔️ Terrain</option>
                  </select>
                </div>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">ℹ️ About TMAT System</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">TMAT Version:</span>
                    <span>2.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Logger Type:</span>
                    <span>TMAT Logger V3</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Last Updated:</span>
                    <span>{new Date().toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Devices Monitored:</span>
                    <span>100</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Data Source:</span>
                    <span>{localSettings.dataSource === 'json' ? 'JSON File' : 'Live API'}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    <strong>TMAT (Tinggi Muka Air Tanah)</strong> - Peatland groundwater level monitoring system 
                    for emission reduction and fire prevention in accordance with SiPPEG standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Reset to defaults (JSON source as default)
                const defaults: EnhancedSettingsState = {
                  dataSource: 'json',
                  autoRefresh: false,
                  refreshInterval: 60,
                  showEmissionAlerts: true,
                  useMetricUnits: true,
                  mapStyle: 'standard',
                  biweeklyAnalysis: true,
                  showInfrastructure: true
                };
                setLocalSettings(defaults);
                onSettingsChange(defaults);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSettingsPanel;