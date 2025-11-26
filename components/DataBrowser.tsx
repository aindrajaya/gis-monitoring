import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { CompanyBrowser } from './CompanyBrowser';
import { AnalyticsSiteBrowser } from './analytics/AnalyticsSiteBrowser';
import { AnalyticsDeviceBrowser } from './analytics/AnalyticsDeviceBrowser';
import { AnalyticsRealtimePanel } from './analytics/AnalyticsRealtimePanel';
import { useCompanies, useSites, useDevices, useRealtimeData } from '../hooks/useApiData';
import { useJsonData } from '../hooks/useJsonData';
import type { SensorDataPoint } from '../types';

interface DataBrowserProps {
  sensorData: SensorDataPoint[];
  useMockData: boolean;
}

export const DataBrowser: React.FC<DataBrowserProps> = ({ sensorData, useMockData }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'companies' | 'sites' | 'devices' | 'realtime'>('companies');
  
  // Fetch data for summary card
  const { data: companies } = useCompanies();
  const { data: sites } = useSites();
  const { data: devices } = useDevices();
  const { data: realtimeData } = useRealtimeData();
  
  // Use JSON data when mock toggle is enabled
  const { rawData } = useJsonData();
  
  // Derive counts from JSON data when using mock data
  const mockCompanies = rawData?.master_perusahaan || [];
  const mockSites = rawData?.master_site || [];
  const mockDevices = rawData?.master_device || [];
  const mockRealtime = rawData?.data_realtime || [];
  
  // Use appropriate data source based on toggle
  const displayCompanies = useMockData ? mockCompanies : companies;
  const displaySites = useMockData ? mockSites : sites;
  const displayDevices = useMockData ? mockDevices : devices;
  const displayRealtime = useMockData ? mockRealtime : realtimeData;

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('companies')}
          className={`flex-1 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'companies'
              ? 'border-blue-600 text-blue-600 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span className="inline-flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {t('companies')}
          </span>
        </button>
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
        {/* Analytics Summary Card */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {t('analytics')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('companies')}</p>
                  <p className="text-2xl font-bold text-blue-600">{displayCompanies?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('sites')}</p>
                  <p className="text-2xl font-bold text-green-600">{displaySites?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('devices')}</p>
                  <p className="text-2xl font-bold text-purple-600">{displayDevices?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('realtime')}</p>
                  <p className="text-2xl font-bold text-indigo-600">{displayRealtime?.length || 0}</p>
                </div>
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'companies' && <CompanyBrowser />}
        {activeTab === 'sites' && <AnalyticsSiteBrowser rawData={rawData} useMockData={useMockData} />}
        {activeTab === 'devices' && <AnalyticsDeviceBrowser rawData={rawData} useMockData={useMockData} />}
        {activeTab === 'realtime' && <AnalyticsRealtimePanel rawData={rawData} useMockData={useMockData} />}
      </div>
    </div>
  );
};
