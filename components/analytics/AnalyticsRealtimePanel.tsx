import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useRealtimeData } from '../../hooks/useApiData';
import type { RealtimeSummary } from '../../types';
import type { JsonDataResponse } from '../../hooks/useJsonData';

// Helper function to normalize realtime data from API
const normalizeRealtimeData = (data: RealtimeSummary): RealtimeSummary => {
  return {
    ...data,
    // Map API fields to component-expected fields
    device_id: data.device_id_unik || data.device_id,
    last_update: data.last_reading_time || data.last_online || data.last_update,
    level_air: data.tmat_value ? parseFloat(data.tmat_value) : data.level_air,
    temperatur_tanah: data.suhu_value ? parseFloat(data.suhu_value) : data.temperatur_tanah,
    daya_hantar_listrik: data.ph_value ? parseFloat(data.ph_value) : data.daya_hantar_listrik,
  };
};

interface AnalyticsRealtimePanelProps {
  rawData: JsonDataResponse | null;
  useMockData: boolean;
}

export const AnalyticsRealtimePanel: React.FC<AnalyticsRealtimePanelProps> = ({ rawData, useMockData }) => {
  const { t } = useLanguage();
  
  // Use JSON data when mock toggle is enabled
  const realtimeData = useMockData ? rawData?.data_realtime : null;
  const { data: apiRealtimeData, loading, error, refetch } = useRealtimeData();
  const displayRealtimeData = useMockData ? realtimeData : apiRealtimeData;
  
  const [selectedData, setSelectedData] = useState<RealtimeSummary | null>(null);

  const handleDataClick = (data: RealtimeSummary) => {
    setSelectedData(normalizeRealtimeData(data));
  };

  const handleBackToList = () => {
    setSelectedData(null);
  };

  if (!useMockData && loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingRealtimeData')}</p>
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
  if (selectedData) {
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

        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h3 className="text-xl font-bold text-gray-900">{t('deviceId')}: {selectedData.device_id_unik || selectedData.device_id}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {t('lastUpdated')}: {(selectedData.last_reading_time || selectedData.last_update) ? new Date(selectedData.last_reading_time || selectedData.last_update!).toLocaleString() : t('notAvailable')}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <label className="text-xs font-medium text-blue-700 uppercase">TMAT Value</label>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{selectedData.level_air ?? 'N/A'}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <label className="text-xs font-medium text-orange-700 uppercase">{t('soilTemperature')}</label>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{selectedData.temperatur_tanah ?? 'N/A'}°C</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <label className="text-xs font-medium text-purple-700 uppercase">pH Value</label>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{selectedData.daya_hantar_listrik ?? 'N/A'}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <label className="text-xs font-medium text-green-700 uppercase">{t('status')}</label>
                  <p className="text-sm font-bold text-green-900 mt-1">
                    <span className={`px-3 py-1 rounded-full ${
                      selectedData.connection_status === 'online' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedData.connection_status || selectedData.device_status || 'N/A'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <label className="text-xs font-medium text-indigo-700 uppercase">{t('siteId')}</label>
                  <p className="text-sm font-semibold text-indigo-900 mt-1">{selectedData.nama_site ?? 'N/A'}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <label className="text-xs font-medium text-blue-700 uppercase">{t('companyId')}</label>
                  <p className="text-sm font-semibold text-blue-900 mt-1">{selectedData.nama_perusahaan ?? 'N/A'}</p>
                </div>
              </div>

              {(selectedData.lat || selectedData.lng) && (
                <div className="pt-4 border-t">
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('location')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedData.lat}, {selectedData.lng}
                  </p>
                  {selectedData.lat && selectedData.lng && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedData.lat},${selectedData.lng}`}
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
      </div>
    );
  }

  // List View
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('realtimeDataList')} ({displayRealtimeData?.length || 0})
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

      {!displayRealtimeData || displayRealtimeData.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-sm text-gray-500">{t('noRealtimeDataFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {displayRealtimeData.map((data, index) => (
            <div
              key={`${data.device_id}-${index}`}
              onClick={() => handleDataClick(data)}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 font-mono">{data.device_id_unik || data.device_id}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {(data.last_reading_time || data.last_update) ? new Date(data.last_reading_time || data.last_update!).toLocaleString() : t('notAvailable')}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">TMAT:</span>
                  <span className="font-semibold text-blue-700 ml-1">{data.tmat_value ?? data.level_air ?? 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('soilTemperature')}:</span>
                  <span className="font-semibold text-orange-700 ml-1">{data.suhu_value ?? data.temperatur_tanah ?? 'N/A'}°C</span>
                </div>
                <div>
                  <span className="text-gray-500">pH:</span>
                  <span className="font-semibold text-purple-700 ml-1">{data.ph_value ?? data.daya_hantar_listrik ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
