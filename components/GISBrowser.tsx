import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SiteBrowser } from './SiteBrowser';
import { DeviceBrowser } from './DeviceBrowser';
import { RealtimeDataPanel } from './RealtimeDataPanel';

interface GISBrowserProps {
  onLocationClick?: (lat: number, lng: number, name: string) => void;
  onSensorSelect?: (deviceId: string) => void;
  sensorData?: any[];
}

export const GISBrowser: React.FC<GISBrowserProps> = ({ onLocationClick, onSensorSelect, sensorData }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sites' | 'devices' | 'realtime'>('sites');

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('sites')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'sites'
              ? 'border-green-600 text-green-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {t('sites')}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'devices'
              ? 'border-purple-600 text-purple-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            {t('devices')}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('realtime')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'realtime'
              ? 'border-indigo-600 text-indigo-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            {t('realtime')}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'sites' && <SiteBrowser onLocationClick={onLocationClick} onSensorSelect={onSensorSelect} sensorData={sensorData} />}
        {activeTab === 'devices' && <DeviceBrowser onLocationClick={onLocationClick} onSensorSelect={onSensorSelect} sensorData={sensorData} />}
        {activeTab === 'realtime' && <RealtimeDataPanel onLocationClick={onLocationClick} onSensorSelect={onSensorSelect} sensorData={sensorData} />}
      </div>
    </div>
  );
};
