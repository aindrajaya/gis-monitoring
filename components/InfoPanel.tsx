import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { SensorDataPoint } from '../types';
import { WATER_LEVEL_THRESHOLDS } from '../constants';

interface InfoPanelProps {
  onClose: () => void;
  data: SensorDataPoint[] | null;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ onClose, data }) => {
  const { t } = useLanguage();

  const getCategoryRange = (status: string) => {
    switch (status) {
      case 'Safe':
        return `${WATER_LEVEL_THRESHOLDS.SAFE.MIN} - ${WATER_LEVEL_THRESHOLDS.SAFE.MAX} m`;
      case 'Warning':
        return `${WATER_LEVEL_THRESHOLDS.WARNING.MIN} - ${WATER_LEVEL_THRESHOLDS.WARNING.MAX} m`;
      case 'Alert':
        return `${WATER_LEVEL_THRESHOLDS.ALERT.MIN} - ${WATER_LEVEL_THRESHOLDS.ALERT.MAX} m`;
      case 'Critical':
        return `${WATER_LEVEL_THRESHOLDS.CRITICAL.MIN} - ${WATER_LEVEL_THRESHOLDS.CRITICAL.MAX} m`;
      default:
        return '';
    }
  };

  return (
    <div
      role="region"
      aria-labelledby="info-panel-title"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl text-gray-800 max-w-4xl w-full border border-gray-200"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 id="info-panel-title" className="text-lg font-bold">{t('informationPanel')}</h2>
        <button onClick={onClose} aria-label="Close information panel" title="Close information panel" className="text-gray-500 hover:text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {data && data.length > 0 ? (
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">{t('sensorId')}</th>
                <th scope="col" className="px-6 py-3">{t('waterLevel')}</th>
                <th scope="col" className="px-6 py-3">{t('status')}</th>
                <th scope="col" className="px-6 py-3">{t('category')}</th>
                <th scope="col" className="px-6 py-3">{t('batteryLevel')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((point) => (
                <tr key={point.id} className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {point.id}
                  </th>
                  <td className="px-6 py-4">{point.waterLevel} m</td>
                  <td className="px-6 py-4">{t(point.status.toLowerCase() as any)}</td>
                  <td className="px-6 py-4">{getCategoryRange(point.status)}</td>
                   <td className="px-6 py-4">{point.batteryLevel}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>{t('noData')}</p>
        )}
      </div>
    </div>
  );
};
