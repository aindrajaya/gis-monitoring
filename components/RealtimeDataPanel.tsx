import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useRealtimeData } from '../hooks/useApiData';
import type { RealtimeSummary } from '../types';

export const RealtimeDataPanel: React.FC = () => {
  const { t } = useLanguage();
  const { data: realtimeData, loading, error, refetch } = useRealtimeData();
  const [selectedData, setSelectedData] = useState<RealtimeSummary | null>(null);

  const handleDataClick = (data: RealtimeSummary) => {
    setSelectedData(data);
  };

  const handleBackToList = () => {
    setSelectedData(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingRealtimeData')}</p>
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

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-indigo-100">
              <h2 className="text-xl font-bold text-gray-900">{t('deviceId')}: {selectedData.device_id}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('lastUpdated')}: {selectedData.last_update ? new Date(selectedData.last_update).toLocaleString() : t('notAvailable')}
              </p>
            </div>            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <label className="text-xs font-medium text-blue-700 uppercase">{t('waterLevel')}</label>
                  <p className="text-2xl font-bold text-blue-900 mt-1">{selectedData.level_air ?? 'N/A'} m</p>
                </div>
                <div className="p-3 bg-cyan-50 rounded-lg">
                  <label className="text-xs font-medium text-cyan-700 uppercase">{t('rainfall')}</label>
                  <p className="text-2xl font-bold text-cyan-900 mt-1">{selectedData.curah_hujan ?? 'N/A'} mm</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <label className="text-xs font-medium text-green-700 uppercase">{t('soilMoisture')}</label>
                  <p className="text-2xl font-bold text-green-900 mt-1">{selectedData.kelembapan_tanah ?? 'N/A'}%</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <label className="text-xs font-medium text-orange-700 uppercase">{t('soilTemperature')}</label>
                  <p className="text-2xl font-bold text-orange-900 mt-1">{selectedData.temperatur_tanah ?? 'N/A'}°C</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <label className="text-xs font-medium text-purple-700 uppercase">{t('electricalConductivity')}</label>
                  <p className="text-2xl font-bold text-purple-900 mt-1">{selectedData.daya_hantar_listrik ?? 'N/A'}</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <label className="text-xs font-medium text-yellow-700 uppercase">{t('batteryVoltage')}</label>
                  <p className="text-2xl font-bold text-yellow-900 mt-1">{selectedData.battery_voltage ?? 'N/A'} V</p>
                </div>
              </div>            {(selectedData.lat || selectedData.lng) && (
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
      </div>
    );
  }

  // List View
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {t('realtimeDataList')} ({realtimeData?.length || 0})
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

      {!realtimeData || realtimeData.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <p className="text-sm text-gray-500">{t('noRealtimeDataFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {realtimeData.map((data, index) => (
            <div
              key={`${data.device_id}-${index}`}
              onClick={() => handleDataClick(data)}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 font-mono">{data.device_id}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {data.last_update ? new Date(data.last_update).toLocaleString() : t('notAvailable')}
                  </p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-gray-500">{t('waterLevel')}:</span>
                  <span className="font-semibold text-blue-700 ml-1">{data.level_air ?? 'N/A'}m</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('rainfall')}:</span>
                  <span className="font-semibold text-cyan-700 ml-1">{data.curah_hujan ?? 'N/A'}mm</span>
                </div>
                <div>
                  <span className="text-gray-500">{t('soilMoisture')}:</span>
                  <span className="font-semibold text-green-700 ml-1">{data.kelembapan_tanah ?? 'N/A'}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
