import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface ClassificationItem {
  level: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

interface LegendInfoPanelProps {
  isRightVisible?: boolean;
}

export const LegendInfoPanel: React.FC<LegendInfoPanelProps> = ({ isRightVisible = false }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const classifications: ClassificationItem[] = [
    {
      level: t('safe') || 'Aman',
      min: 0,
      max: 2,
      color: '#10b981',
      description: 'Normal water level - Safe',
    },
    {
      level: t('warning') || 'Peringatan',
      min: 2,
      max: 3.5,
      color: '#fbbf24',
      description: 'Moderate water level - Warning',
    },
    {
      level: t('alert') || 'Bahaya',
      min: 3.5,
      max: 5,
      color: '#f97316',
      description: 'High water level - Danger',
    },
    {
      level: t('critical') || 'Kritis',
      min: 5,
      max: 10,
      color: '#ef4444',
      description: 'Critical water level - Emergency',
    },
  ];

  return (
    <div className="absolute bottom-4 z-[1000] transition-all duration-300" style={{ right: isRightVisible ? '424px' : '16px' }}>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow flex items-center justify-center"
        title={t('toggleInfoPanel') || 'Toggle Information Panel'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>

      {/* Legend Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-2">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-800">{t('legendTitle') || 'Water Level Classification'}</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Classification Items */}
          <div className="space-y-3">
            {classifications.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                {/* Color Indicator */}
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 mt-1 border-2 border-gray-300"
                  style={{ backgroundColor: item.color }}
                />

                {/* Content */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{item.level}</h4>
                  <p className="text-xs text-gray-600 mb-1">{item.min} - {item.max} m</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 italic">
              {t('legendFooter') || 'Water levels are continuously monitored and updated in real-time'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
