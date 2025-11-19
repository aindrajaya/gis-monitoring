import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useDevices, useDevice } from '../hooks/useApiData';
import type { Device } from '../types';

interface DeviceBrowserProps {
  onLocationClick?: (lat: number, lng: number, name: string) => void;
  onSensorSelect?: (deviceId: string) => void;
  sensorData?: any[];
}

export const DeviceBrowser: React.FC<DeviceBrowserProps> = ({ onLocationClick, onSensorSelect, sensorData }) => {
  const { t } = useLanguage();
  const { data: devices, loading, error, refetch } = useDevices();

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
              key={device.device_id_unik}
              onClick={() => {
                // Find sensor by device_id_unik
                const sensor = sensorData?.find(s => s.deviceId === device.device_id_unik);
                
                if (onLocationClick && device.latitude && device.longitude) {
                  onLocationClick(
                    parseFloat(String(device.latitude)),
                    parseFloat(String(device.longitude)),
                    device.nama_device || device.device_id_unik
                  );
                }
                
                // Select sensor to show in right panel
                if (onSensorSelect && sensor) {
                  onSensorSelect(sensor.deviceId);
                }
              }}
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
