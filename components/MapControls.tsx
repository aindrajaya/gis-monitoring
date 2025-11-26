import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface MapControlsProps {
  isLeftVisible: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({ isLeftVisible }) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className="absolute top-3 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 border border-gray-200 transition-all duration-300"
      style={{ left: isLeftVisible ? 'calc(360px + 4rem)' : '4rem' }}
      role="region"
      aria-label={t('mapControlsTitle')}
    >
      <div className="flex flex-col space-y-1 text-xs text-gray-700">
        <p className="font-semibold text-gray-900 mb-1">{t('mapControlsTitle')}</p>
        <p>{t('mapControlsZone')}</p>
        <p>{t('mapControlsMarker')}</p>
        <p>{t('mapControlsPan')}</p>
      </div>
    </div>
  );
};
