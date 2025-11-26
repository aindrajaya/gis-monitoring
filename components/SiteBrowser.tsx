import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSites, useSite } from '../hooks/useApiData';
import type { Site } from '../types';

interface SiteBrowserProps {
  onLocationClick?: (lat: number, lng: number, name: string) => void;
  onSensorSelect?: (deviceId: string) => void;
  sensorData?: any[];
}

export const SiteBrowser: React.FC<SiteBrowserProps> = ({ onLocationClick, onSensorSelect, sensorData }) => {
  const { t } = useLanguage();
  const { data: sites, loading, error, refetch } = useSites();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingSites')}</p>
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
          {t('siteList')} ({sites?.length || 0})
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

      {!sites || sites.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm text-gray-500">{t('noSitesFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sites.map((site) => (
            <div
              key={site.id}
              onClick={() => {
                // Find sensor by site ID
                const sensor = sensorData?.find(s => String(s.id) === String(site.id) || s.deviceId?.includes(String(site.id)));
                
                if (onLocationClick && site.latitude && site.longitude) {
                  onLocationClick(
                    parseFloat(String(site.latitude)),
                    parseFloat(String(site.longitude)),
                    site.nama_site
                  );
                }
                
                // Select sensor to show in right panel
                if (onSensorSelect && sensor) {
                  onSensorSelect(sensor.deviceId);
                }
              }}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{site.nama_site}</h4>
                  {site.alamat && (
                    <p className="text-xs text-gray-600 mt-1">{site.alamat}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="font-medium">{t('companyId')}: {site.id_perusahaan}</span>
                    {(site.latitude || site.longitude) && (
                      <>
                        <span className="mx-2">•</span>
                        <span>📍 {site.latitude}, {site.longitude}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    site.status === 'active' || site.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {site.status}
                  </span>
                  <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
