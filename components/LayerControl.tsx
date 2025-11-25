import React, { useState } from 'react';

export type LayerType = 'realtime' | 'biweekly' | 'infrastructure' | 'emission';

export interface LayerControlState {
  realtime: boolean;
  biweekly: boolean;
  infrastructure: boolean;
  emission: boolean;
}

interface LayerControlProps {
  onLayerChange: (layers: LayerControlState) => void;
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const LayerControl: React.FC<LayerControlProps> = ({ 
  onLayerChange, 
  className = '',
  position = 'top-right'
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [layers, setLayers] = useState<LayerControlState>({
    realtime: true,
    biweekly: false,
    infrastructure: false,
    emission: false
  });

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const layerConfigs = [
    {
      key: 'realtime' as LayerType,
      icon: '📍',
      title: 'Real-time Water Level',
      description: 'Current TMAT readings from all devices',
      color: 'blue'
    },
    {
      key: 'biweekly' as LayerType,
      icon: '📊',
      title: 'Biweekly Status',
      description: 'Averaged TMAT data for selected period',
      color: 'green'
    },
    {
      key: 'infrastructure' as LayerType,
      icon: '🏗️',
      title: 'Canal Blocks',
      description: 'Water control structures and infrastructure',
      color: 'orange'
    },
    {
      key: 'emission' as LayerType,
      icon: '🌱',
      title: 'Emission Risk',
      description: 'CO₂ emission risk based on water levels',
      color: 'red'
    }
  ];

  const toggleLayer = (layerKey: LayerType) => {
    const newLayers = {
      ...layers,
      [layerKey]: !layers[layerKey]
    };
    setLayers(newLayers);
    onLayerChange(newLayers);
  };

  const getActiveLayerCount = () => {
    return Object.values(layers).filter(Boolean).length;
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-30 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-12 h-12'
      } ${className}`}
    >
      {/* Toggle Button */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-12 h-12 bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 flex items-center justify-center relative"
          title={isExpanded ? 'Hide Layers' : 'Show Layer Control'}
        >
          <span className="text-lg">🗂️</span>
          {getActiveLayerCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getActiveLayerCount()}
            </span>
          )}
        </button>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="absolute top-0 left-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Map Layers</h3>
                  <p className="text-xs text-gray-600">Toggle visibility for different data layers</p>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Layer Controls */}
            <div className="p-4 space-y-3">
              {layerConfigs.map((layerConfig) => (
                <div
                  key={layerConfig.key}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-lg">{layerConfig.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800 text-sm">
                        {layerConfig.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {layerConfig.description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={layers[layerConfig.key]}
                      onChange={() => toggleLayer(layerConfig.key)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>

            {/* Layer Info */}
            <div className="px-4 pb-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-500">ℹ️</span>
                  <span className="text-sm font-medium text-blue-800">Layer Tips</span>
                </div>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Multiple layers can be active simultaneously</li>
                  <li>• Use biweekly view for trend analysis</li>
                  <li>• Infrastructure layer shows canal blocks and pumps</li>
                  <li>• Emission layer indicates peatland CO₂ risk</li>
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const allOn = { realtime: true, biweekly: true, infrastructure: true, emission: true };
                    setLayers(allOn);
                    onLayerChange(allOn);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Show All
                </button>
                <button
                  onClick={() => {
                    const allOff = { realtime: false, biweekly: false, infrastructure: false, emission: false };
                    setLayers(allOff);
                    onLayerChange(allOff);
                  }}
                  className="flex-1 px-3 py-2 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Hide All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LayerControl;