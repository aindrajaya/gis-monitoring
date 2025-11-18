import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDevices, useDevice } from '../hooks/useApiData';
import type { Device } from '../types';

export const DeviceBrowser: React.FC = () => {
  const { t } = useLanguage();
  const { data: devices, loading, error, refetch } = useDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { data: selectedDevice, loading: detailLoading } = useDevice(selectedDeviceId);

  const handleDeviceClick = (device: Device) => {
    setSelectedDeviceId(device.device_id);
  };

  const handleBackToList = () => {
    setSelectedDeviceId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingDevices')}</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  // Detail View
  if (selectedDeviceId && selectedDevice) {
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

        {detailLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-purple-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedDevice.nama_device || selectedDevice.device_id}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('deviceId')}: {selectedDevice.device_id}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('deviceType')}</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDevice.tipe_device || t('notAvailable')}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('status')}</label>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                    selectedDevice.status === 'active' || selectedDevice.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedDevice.status}
                  </span>
                </div>
              </div>

              {(selectedDevice.latitude || selectedDevice.longitude) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('location')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedDevice.latitude}, {selectedDevice.longitude}
                  </p>
                  {selectedDevice.latitude && selectedDevice.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedDevice.latitude},${selectedDevice.longitude}`}
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

              {selectedDevice.id_site && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('siteId')}</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedDevice.id_site}</p>
                </div>
              )}

              {selectedDevice.created_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('createdAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedDevice.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedDevice.updated_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('updatedAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedDevice.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
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
          {t('deviceList')} ({devices?.length || 0})
        </h3>
        <button
          onClick={refetch}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {t('refresh')}
        </button>
      </div>

      {!devices || devices.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <p className="text-sm text-gray-500">{t('noDevicesFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {devices.map((device) => (
            <div
              key={device.device_id}
              onClick={() => handleDeviceClick(device)}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-purple-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {device.nama_device || device.device_id}
                    </h4>
                    <span className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      device.status === 'active' || device.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 font-mono">{device.device_id}</p>
                  {device.tipe_device && (
                    <p className="text-xs text-gray-500 mt-1">{device.tipe_device}</p>
                  )}
                  {(device.latitude || device.longitude) && (
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {device.latitude}, {device.longitude}
                    </p>
                  )}
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
