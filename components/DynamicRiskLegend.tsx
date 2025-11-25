import React, { useState } from 'react';
import { WATER_LEVEL_THRESHOLDS } from '../hooks/useJsonData';

interface DynamicRiskLegendProps {
  isVisible?: boolean;
  className?: string;
}

export const DynamicRiskLegend: React.FC<DynamicRiskLegendProps> = ({ 
  isVisible = true,
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!isVisible) return null;

  const thresholds = Object.entries(WATER_LEVEL_THRESHOLDS);

  return (
    <div 
      className={`fixed bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 z-20 transition-all duration-300 ${
        isCollapsed ? 'w-12 h-12' : 'w-80'
      } ${className}`}
    >
      {/* Header with collapse toggle */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          {!isCollapsed && (
            <h3 className="font-semibold text-gray-800">Risk Legend</h3>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          {isCollapsed ? '▲' : '▼'}
        </button>
      </div>

      {/* Legend Content */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <p className="text-xs text-gray-600 mb-3">
            Tinggi Muka Air Tanah (TMAT) - SiPPEG Classification
          </p>
          
          <div className="space-y-2">
            {thresholds.map(([key, threshold]) => (
              <div key={key} className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: threshold.color }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {threshold.label}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      {key === 'FLOODED' && '< 0.0m'}
                      {key === 'SAFE' && '0.0 - 0.4m'}
                      {key === 'WARNING' && '0.4 - 0.8m'}
                      {key === 'DANGER' && '> 0.8m'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {key === 'FLOODED' && 'Tergenang air / Basah'}
                    {key === 'SAFE' && 'Aman / Sesuai standar'}
                    {key === 'WARNING' && 'Peringatan / Perlu monitoring'}
                    {key === 'DANGER' && 'Bahaya / Risiko kebakaran'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">💡</span>
              <span className="text-xs font-medium text-gray-700">Informasi Tambahan</span>
            </div>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Nilai negatif = di bawah permukaan tanah</li>
              <li>• Nilai positif = di atas permukaan tanah</li>
              <li>• Monitoring setiap 2 minggu (biweekly)</li>
              <li>• Data dari TMAT Logger V3</li>
            </ul>
          </div>

          {/* Emission Risk Indicator */}
          <div className="mt-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">🌱</span>
              <span className="text-xs font-medium text-yellow-800">Risiko Emisi</span>
            </div>
            <p className="text-xs text-yellow-700">
              Semakin tinggi TMAT (semakin kering), semakin tinggi risiko emisi CO₂ 
              dari lahan gambut.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicRiskLegend;