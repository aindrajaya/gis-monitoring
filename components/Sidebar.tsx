import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SensorStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import type { SensorDataPoint } from '../types';

interface SidebarProps {
  sensorData: SensorDataPoint[];
  onLocationSelect: (location: SensorDataPoint | null) => void;
  selectedLocation: SensorDataPoint | null;
  onAreaDataSelect: (areaData: SensorDataPoint[] | null) => void;
  selectedAreaData: SensorDataPoint[] | null;
  isVisible: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  sensorData, 
  onLocationSelect, 
  selectedLocation,
  onAreaDataSelect,
  selectedAreaData,
  isVisible,
  onToggle
}) => {
  const { t, language, setLanguage } = useLanguage();
//   const [activeTab, setActiveTab] = useState<'mapping' | 'analytics' | 'settings'>('mapping');
  const [activeTab, setActiveTab] = useState('mapping');

  const totalLocations = sensorData.length;
  
  const getStatusCount = (status: SensorStatus) => {
    return sensorData.filter(s => s.status === status).length;
  };

  const getAverageWaterLevel = () => {
    const total = sensorData.reduce((sum, s) => sum + s.waterLevel, 0);
    return (total / sensorData.length).toFixed(2);
  };

  const handleSensorClick = (sensor: SensorDataPoint) => {
    onLocationSelect(sensor);
  };

  const handleClearAreaData = () => {
    onAreaDataSelect(null);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-[1001] bg-white shadow-lg rounded-r-lg p-2 hover:bg-gray-50 transition-all"
        style={{ left: isVisible ? '320px' : '0' }}
      >
        <svg 
          className={`w-5 h-5 text-gray-600 transition-transform ${isVisible ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div 
        className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl z-[1000] flex flex-col transition-transform duration-300 ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-xs text-gray-500 mt-1">{t('subtitle')}</p>
            </div>
            {/* Language Selector */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'en' 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('id')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  language === 'id' 
                    ? 'bg-blue-600 text-white shadow' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ID
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('mapping')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'mapping'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              {t('gisMapping')}
            </span>
          </button>
          {/* <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analytics'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t('analytics')}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('settings')}
            </span>
          </button> */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'mapping' && (
            <div className="p-4">
              {/* Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('summary')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('totalLocations')}:</span>
                    <span className="font-semibold text-gray-900">{totalLocations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('averageWaterLevel')}:</span>
                    <span className="font-semibold text-gray-900">{getAverageWaterLevel()} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('safe')}:</span>
                    <span className="font-semibold text-green-600">{getStatusCount(SensorStatus.Safe)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('warning')}:</span>
                    <span className="font-semibold text-amber-600">{getStatusCount(SensorStatus.Warning)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('alert')}:</span>
                    <span className="font-semibold text-red-600">{getStatusCount(SensorStatus.Alert)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('critical')}:</span>
                    <span className="font-semibold text-red-900">{getStatusCount(SensorStatus.Critical)}</span>
                  </div>
                </div>
              </div>

              {/* Show Area Data List if available */}
              {selectedAreaData && selectedAreaData.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      {t('areaData')} ({selectedAreaData.length})
                    </h3>
                    <button 
                      onClick={handleClearAreaData}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {t('showAll')}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedAreaData.map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick(sensor)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedLocation?.id === sensor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: STATUS_COLORS[sensor.status] }}
                            ></div>
                            <h4 className="text-sm font-semibold text-gray-900">{t('sensorId')} #{sensor.id}</h4>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>{t('waterLevel')}:</span>
                            <span className="font-medium">{sensor.waterLevel.toFixed(2)} m</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{t('status')}:</span>
                            <span className="font-medium">{t(sensor.status.toLowerCase() as any)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{t('battery')}:</span>
                            <span className="font-medium">{sensor.batteryLevel}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* All Sensors List */
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('sensors')}</h3>
                  <div className="space-y-2">
                    {sensorData.slice(0, 15).map((sensor) => (
                      <div
                        key={sensor.id}
                        onClick={() => handleSensorClick(sensor)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedLocation?.id === sensor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center">
                            <div 
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: STATUS_COLORS[sensor.status] }}
                            ></div>
                            <h4 className="text-sm font-semibold text-gray-900">{t('sensorId')} #{sensor.id}</h4>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center justify-between">
                            <span>{t('waterLevel')}:</span>
                            <span className="font-medium">{sensor.waterLevel.toFixed(2)} m</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>{t('status')}:</span>
                            <span className="font-medium">{t(sensor.status.toLowerCase() as any)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-4">
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-gray-500">{t('analyticsComingSoon')}</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4">
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-sm text-gray-500">{t('settingsComingSoon')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
