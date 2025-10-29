import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { STATUS_COLORS } from '../constants';
import type { ViewMode } from '../types';

interface ControlPanelProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Legend: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="mt-4">
            <h3 className="font-bold text-sm mb-2 text-gray-700">{t('legendTitle')}</h3>
            <ul>
                {Object.entries(STATUS_COLORS).map(([status, color]) => (
                    <li key={status} className="flex items-center mb-1">
                        <span className="h-4 w-4 rounded-full mr-2 border border-gray-300" style={{ backgroundColor: color }}></span>
                        <span className="text-xs text-gray-600">{t(status.toLowerCase() as any)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export const ControlPanel: React.FC<ControlPanelProps> = ({ viewMode, setViewMode }) => {
  const { language, setLanguage, t } = useLanguage();

  const getButtonClass = (mode: ViewMode) => {
    const base = 'w-1/2 px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none rounded-md';
    if (viewMode === mode) {
      return `${base} bg-blue-600 text-white shadow-lg`;
    }
    return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };
  
  const getLangButtonClass = (lang: 'en' | 'id') => {
    const base = 'w-1/2 px-3 py-1 text-xs font-medium transition-colors duration-200 focus:outline-none rounded-md';
    if (language === lang) {
      return `${base} bg-blue-600 text-white shadow`;
    }
    return `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] p-4 bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl text-gray-800 max-w-xs border border-gray-200">
      <h1 className="text-lg font-bold mb-1">{t('title')}</h1>
      <p className="text-xs text-gray-500 mb-4">{t('subtitle')}</p>
      
      <div className="flex flex-col space-y-3">
        <div>
           <label className="text-sm font-semibold text-gray-600 block mb-1.5">{t('language')}</label>
           <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
              <button onClick={() => setLanguage('en')} className={`${getLangButtonClass('en')}`}>
                English
              </button>
              <button onClick={() => setLanguage('id')} className={`${getLangButtonClass('id')}`}>
                Bahasa Indonesia
              </button>
           </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-600 block mb-1.5">{t('viewMode')}</label>
          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            <button onClick={() => setViewMode('points')} className={`${getButtonClass('points')}`}>
              {t('points')}
            </button>
            <button onClick={() => setViewMode('polygons')} className={`${getButtonClass('polygons')}`}>
              {t('zones')}
            </button>
          </div>
        </div>
      </div>

      <Legend />
    </div>
  );
};
