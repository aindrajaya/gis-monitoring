import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useDevices, useDevice } from '../../hooks/useApiData';
import type { Device } from '../../types';
import type { JsonDataResponse } from '../../hooks/useJsonData';

interface AnalyticsDeviceBrowserProps {
  rawData: JsonDataResponse | null;
  useMockData: boolean;
}

export const AnalyticsDeviceBrowser: React.FC<AnalyticsDeviceBrowserProps> = ({ rawData, useMockData }) => {
  const { t } = useLanguage();
  
  // Use JSON data when mock toggle is enabled
  const devices = useMockData ? rawData?.master_device : null;
  const { data: apiDevices, loading, error, refetch } = useDevices();
  const displayDevices = useMockData ? devices : apiDevices;
  
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { data: selectedDevice, loading: detailLoading } = useDevice(selectedDeviceId);

  const handleDeviceClick = (device: any) => {
    setSelectedDeviceId(device.device_id_unik || device.id?.toString());
  };

  const handleBackToList = () => {
    setSelectedDeviceId(null);
  };

  if (!useMockData && loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingDevices')}</p>
        </div>
      </div>
    );
  }

  if (!useMockData && error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">{t('errorLoadingData')}</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={refetch}
                className="mt-3 text-sm font-medium text-red-600 hover:text-red-500"
              >
                {t('retry')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail View with Charts
  if (selectedDeviceId && (selectedDevice || useMockData)) {
    const displaySelectedDevice = useMockData ? displayDevices?.find(d => (d.device_id_unik || d.id?.toString()) === selectedDeviceId) : selectedDevice;
    
    if (!displaySelectedDevice) return null;
    
    return (
      <div className="p-4">
        <button
          onClick={handleBackToList}
          className="flex items-center text-sm text-blue-600 hover:text-blue-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToList')}
        </button>

        {(!useMockData && detailLoading) ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
                <h3 className="text-xl font-bold text-gray-900">{displaySelectedDevice.device_id_unik || `DEV-${displaySelectedDevice.id}`}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t('deviceId')}: {displaySelectedDevice.device_id_unik || displaySelectedDevice.id}
                </p>
              </div>

              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('deviceType')}</label>
                    <p className="text-sm text-gray-900 mt-1">{displaySelectedDevice.tipe_alat || t('notAvailable')}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('status')}</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                      displaySelectedDevice.status === 'active' || displaySelectedDevice.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {displaySelectedDevice.status || 'aktif'}
                    </span>
                  </div>
                </div>

                {(displaySelectedDevice.latitude || displaySelectedDevice.longitude) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('location')}</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {displaySelectedDevice.latitude}, {displaySelectedDevice.longitude}
                    </p>
                    {displaySelectedDevice.latitude && displaySelectedDevice.longitude && (
                      <a
                        href={`https://www.google.com/maps?q=${displaySelectedDevice.latitude},${displaySelectedDevice.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center mt-1"
                      >
                        {t('openInGoogleMaps')}
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}

                {displaySelectedDevice.id_site && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('siteId')}</label>
                    <p className="text-sm text-gray-900 mt-1">{displaySelectedDevice.id_site}</p>
                  </div>
                )}

                {displaySelectedDevice.created_at && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('createdAt')}</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(displaySelectedDevice.created_at).toLocaleString()}
                    </p>
                  </div>
                )}

                {displaySelectedDevice.updated_at && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">{t('updatedAt')}</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(displaySelectedDevice.updated_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">{t('analytics')}</h3>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-gray-500">{t('notAvailable')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // List View
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('deviceList')} ({displayDevices?.length || 0})
        </h3>
        {!useMockData && (
          <button
            onClick={refetch}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('refresh')}
          </button>
        )}
      </div>

      {!displayDevices || displayDevices.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <p className="text-sm text-gray-500">{t('noDevicesFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayDevices.map((device) => (
            <div
              key={device.device_id_unik || device.id}
              onClick={() => handleDeviceClick(device)}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 font-mono">{device.device_id_unik || `DEV-${device.id}`}</h4>
                  <div className="flex items-center mt-2">
                    {device.tipe_alat && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {device.tipe_alat}
                      </span>
                    )}
                    {device.status && (
                      <span className={`ml-2 text-xs px-2 py-1 rounded ${
                        device.status === 'active' || device.status === 'aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {device.status}
                      </span>
                    )}
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
