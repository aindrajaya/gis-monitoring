import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { WATER_LEVEL_THRESHOLDS } from '../constants';
import type { SensorDataPoint } from '../types';

interface DetailsPanelProps {
  selectedLocation: SensorDataPoint | null;
  onClose: () => void;
  isVisible: boolean;
  onToggle: () => void;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ selectedLocation, onClose, isVisible, onToggle }) => {
  const { t } = useLanguage();

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  };

  const getStatusThreshold = (status: string) => {
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

  if (!selectedLocation) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        aria-label={isVisible ? 'Collapse details panel' : 'Expand details panel'}
        aria-expanded={isVisible}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-l-lg p-2 hover:bg-gray-50 transition-all"
        style={{ right: isVisible ? '384px' : '0' }}
      >
        <svg 
          className={`w-5 h-5 text-gray-600 transition-transform ${isVisible ? '' : 'rotate-180'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Details Panel */}
      <div 
        className={`absolute right-0 top-0 h-full w-96 bg-white shadow-xl z-[1000] flex flex-col transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button onClick={onClose} aria-label="Close details panel" title="Close details panel" className="p-1 hover:bg-gray-100 rounded">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 id="details-panel-title" className="text-lg font-bold text-gray-900">{t('sensorDetails')}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Sensor Name */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{t('sensorId')} #{selectedLocation.id}</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {/** clickable link: open location in Google Maps by lat,lng */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedLocation.lat.toFixed(6)},${selectedLocation.lng.toFixed(6)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                title={t('openInGoogleMaps') || 'Open in Google Maps'}
              >
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </a>
            </div>
          </div>

          {/* Coordinates */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">{t('coordinates')}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('latitude')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.lat.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('longitude')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.lng.toFixed(6)}</span>
              </div>
            </div>
          </div>

          {/* Water Level Information */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">{t('waterLevelMonitoring')}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('currentLevel')}:</span>
                <span className="font-bold text-blue-600 text-lg">{selectedLocation.waterLevel.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('status')}:</span>
                <span className={`font-semibold ${
                  selectedLocation.status === 'Safe' ? 'text-green-600' :
                  selectedLocation.status === 'Warning' ? 'text-amber-600' :
                  selectedLocation.status === 'Alert' ? 'text-red-600' : 'text-red-900'
                }`}>
                  {t(selectedLocation.status.toLowerCase() as any)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('thresholdRange')}:</span>
                <span className="font-medium text-gray-900">{getStatusThreshold(selectedLocation.status)}</span>
              </div>
            </div>
          </div>

          {/* Sensor Information */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">{t('sensorInformation')}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('deviceId')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.deviceId ?? '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('sensorType')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.sensorType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('batteryLevel')}:</span>
                <span className={`font-semibold ${
                  selectedLocation.batteryLevel > 70 ? 'text-green-600' :
                  selectedLocation.batteryLevel > 30 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {selectedLocation.batteryLevel}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('lastUpdated')}:</span>
                <span className="font-medium text-gray-900 text-xs">{formatTimestamp(selectedLocation.lastUpdated)}</span>
              </div>
            </div>
          </div>

          {/* Environmental Metrics */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3v5a9 9 0 009 9h5" />
              </svg>
              <h3 className="text-sm font-semibold text-gray-700">{t('rainfall')}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('rainfall')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.rainfall ?? '—'} mm</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('soilMoisture')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.soilMoisture ?? '—'} %</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('soilTemperature')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.soilTemperature ?? '—'} °C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('electricalConductivity')}:</span>
                <span className="font-medium text-gray-900">{selectedLocation.electricalConductivity ?? '—'}</span>
              </div>
            </div>
          </div>

          {/* Status Legend */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('statusThresholds')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="font-medium text-gray-700">{t('safe')}</span>
                </div>
                <span className="text-gray-600">{WATER_LEVEL_THRESHOLDS.SAFE.MIN} - {WATER_LEVEL_THRESHOLDS.SAFE.MAX} m</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="font-medium text-gray-700">{t('warning')}</span>
                </div>
                <span className="text-gray-600">{WATER_LEVEL_THRESHOLDS.WARNING.MIN} - {WATER_LEVEL_THRESHOLDS.WARNING.MAX} m</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="font-medium text-gray-700">{t('alert')}</span>
                </div>
                <span className="text-gray-600">{WATER_LEVEL_THRESHOLDS.ALERT.MIN} - {WATER_LEVEL_THRESHOLDS.ALERT.MAX} m</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-100 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-900 mr-2"></div>
                  <span className="font-medium text-gray-700">{t('critical')}</span>
                </div>
                <span className="text-gray-600">{WATER_LEVEL_THRESHOLDS.CRITICAL.MIN} - {WATER_LEVEL_THRESHOLDS.CRITICAL.MAX} m</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{t('description')}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              This {selectedLocation.sensorType} sensor is actively monitoring water levels at this location. 
              The sensor is currently in {selectedLocation.status} status with a reading of {selectedLocation.waterLevel.toFixed(2)} meters. 
              Battery level is at {selectedLocation.batteryLevel}%, last updated on {formatTimestamp(selectedLocation.lastUpdated)}.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
