import React, { useMemo } from 'react';
import { ProcessedWaterLevelData, WATER_LEVEL_THRESHOLDS } from '../hooks/useJsonData';

interface EmissionAnalyticsPanelProps {
  data: ProcessedWaterLevelData[];
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

interface EmissionData {
  deviceId: string;
  waterLevel: number;
  emissionRisk: 'low' | 'medium' | 'high';
  estimatedCO2: number; // tons/hectare/year
  co2Reduction: number; // compared to baseline (drained condition)
  riskLevel: string;
  location: string;
}

export const EmissionAnalyticsPanel: React.FC<EmissionAnalyticsPanelProps> = ({
  data,
  isVisible,
  onClose,
  className = ''
}) => {
  const emissionAnalysis = useMemo(() => {
    if (!data.length) return null;

    // Calculate emission data for each device
    const emissionData: EmissionData[] = data.map(device => {
      const waterLevel = device.waterLevel;
      
      // Emission calculation based on water level
      // Reference: Peatland emission rates (simplified model)
      // Baseline: drained peatland (-80cm) = ~80 tCO2/ha/year
      // Target: rewetted peatland (-20cm) = ~10 tCO2/ha/year
      
      const baselineEmission = 80; // tCO2/ha/year at -80cm
      const targetEmission = 10;   // tCO2/ha/year at -20cm
      
      // Calculate current emission based on water level
      let currentEmission: number;
      if (waterLevel <= -0.8) {
        currentEmission = baselineEmission;
      } else if (waterLevel >= -0.2) {
        currentEmission = targetEmission;
      } else {
        // Linear interpolation between baseline and target
        const factor = (waterLevel + 0.8) / (0.6); // 0.6 = difference between -0.2 and -0.8
        currentEmission = baselineEmission - (factor * (baselineEmission - targetEmission));
      }
      
      const co2Reduction = Math.max(0, baselineEmission - currentEmission);
      
      // Determine emission risk
      let emissionRisk: 'low' | 'medium' | 'high';
      if (currentEmission <= 20) emissionRisk = 'low';
      else if (currentEmission <= 50) emissionRisk = 'medium';
      else emissionRisk = 'high';

      return {
        deviceId: device.deviceId,
        waterLevel: device.waterLevel,
        emissionRisk,
        estimatedCO2: Number(currentEmission.toFixed(1)),
        co2Reduction: Number(co2Reduction.toFixed(1)),
        riskLevel: device.riskLevel,
        location: `${device.siteName} - ${device.block}`
      };
    });

    // Calculate aggregate statistics
    const totalDevices = emissionData.length;
    const highRiskDevices = emissionData.filter(d => d.emissionRisk === 'high').length;
    const mediumRiskDevices = emissionData.filter(d => d.emissionRisk === 'medium').length;
    const lowRiskDevices = emissionData.filter(d => d.emissionRisk === 'low').length;
    
    const totalCO2Emissions = emissionData.reduce((sum, d) => sum + d.estimatedCO2, 0);
    const totalCO2Reduction = emissionData.reduce((sum, d) => sum + d.co2Reduction, 0);
    const averageCO2 = totalCO2Emissions / totalDevices;
    const averageReduction = totalCO2Reduction / totalDevices;

    // Calculate potential if all areas were optimally managed (-20cm)
    const potentialTotalReduction = totalDevices * (80 - 10); // 70 tCO2/ha/year per device
    const currentEfficiency = (totalCO2Reduction / potentialTotalReduction) * 100;

    return {
      emissionData,
      statistics: {
        totalDevices,
        highRiskDevices,
        mediumRiskDevices,
        lowRiskDevices,
        totalCO2Emissions: Number(totalCO2Emissions.toFixed(1)),
        totalCO2Reduction: Number(totalCO2Reduction.toFixed(1)),
        averageCO2: Number(averageCO2.toFixed(1)),
        averageReduction: Number(averageReduction.toFixed(1)),
        potentialTotalReduction: Number(potentialTotalReduction.toFixed(1)),
        currentEfficiency: Number(currentEfficiency.toFixed(1))
      }
    };
  }, [data]);

  if (!isVisible || !emissionAnalysis) return null;

  const { emissionData, statistics } = emissionAnalysis;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🌱 Emission Analytics Dashboard</h2>
              <p className="text-green-100 text-sm">CO₂ emission analysis for peatland management</p>
            </div>
            <button
              onClick={onClose}
              className="text-green-200 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600">High Risk Areas</p>
                  <p className="text-2xl font-bold text-red-800">{statistics.highRiskDevices}</p>
                </div>
                <div className="text-red-500 text-2xl">🔥</div>
              </div>
              <p className="text-xs text-red-600 mt-1">
                {((statistics.highRiskDevices / statistics.totalDevices) * 100).toFixed(1)}% of total areas
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600">Medium Risk Areas</p>
                  <p className="text-2xl font-bold text-yellow-800">{statistics.mediumRiskDevices}</p>
                </div>
                <div className="text-yellow-500 text-2xl">⚠️</div>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                {((statistics.mediumRiskDevices / statistics.totalDevices) * 100).toFixed(1)}% of total areas
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Low Risk Areas</p>
                  <p className="text-2xl font-bold text-green-800">{statistics.lowRiskDevices}</p>
                </div>
                <div className="text-green-500 text-2xl">✅</div>
              </div>
              <p className="text-xs text-green-600 mt-1">
                {((statistics.lowRiskDevices / statistics.totalDevices) * 100).toFixed(1)}% of total areas
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Management Efficiency</p>
                  <p className="text-2xl font-bold text-blue-800">{statistics.currentEfficiency}%</p>
                </div>
                <div className="text-blue-500 text-2xl">📈</div>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                of optimal reduction potential
              </p>
            </div>
          </div>

          {/* CO2 Emission Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">💨 Current CO₂ Emissions</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Annual Emissions:</span>
                  <span className="text-xl font-bold text-red-600">
                    {statistics.totalCO2Emissions} tCO₂/year
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per Area:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {statistics.averageCO2} tCO₂/ha/year
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(statistics.totalCO2Emissions / (statistics.totalDevices * 80)) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Compared to worst-case scenario (fully drained peatland)
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📉 CO₂ Reduction Achieved</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Annual Reduction:</span>
                  <span className="text-xl font-bold text-green-600">
                    {statistics.totalCO2Reduction} tCO₂/year
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average per Area:</span>
                  <span className="text-lg font-semibold text-gray-800">
                    {statistics.averageReduction} tCO₂/ha/year
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(statistics.totalCO2Reduction / statistics.potentialTotalReduction) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">
                  Progress towards optimal peatland management
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Device Analysis */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">📊 Device-Level Emission Analysis</h3>
              <p className="text-sm text-gray-600">Detailed CO₂ emission data for each monitoring device</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water Level</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Emission Risk</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current CO₂</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CO₂ Reduction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {emissionData.map((device) => (
                    <tr key={device.deviceId} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {device.deviceId}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {device.location}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span className="font-mono">{device.waterLevel.toFixed(2)}m</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          device.emissionRisk === 'high' ? 'bg-red-100 text-red-800' :
                          device.emissionRisk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {device.emissionRisk.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold">{device.estimatedCO2}</span>
                        <span className="text-gray-500 ml-1">tCO₂/ha/yr</span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold text-green-600">{device.co2Reduction}</span>
                        <span className="text-gray-500 ml-1">tCO₂/ha/yr</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Methodology */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">🔬 Calculation Methodology</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• <strong>Baseline Emission:</strong> 80 tCO₂/ha/year (drained peatland at -80cm water level)</p>
              <p>• <strong>Target Emission:</strong> 10 tCO₂/ha/year (rewetted peatland at -20cm water level)</p>
              <p>• <strong>Current Emission:</strong> Linear interpolation based on actual water level</p>
              <p>• <strong>CO₂ Reduction:</strong> Difference between baseline and current emission rates</p>
              <p>• <strong>Risk Classification:</strong> High (>50 tCO₂/ha/yr), Medium (20-50), Low (<20)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionAnalyticsPanel;