import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useSites, useSite } from '../hooks/useApiData';
import type { Site } from '../types';

export const SiteBrowser: React.FC = () => {
  const { t } = useLanguage();
  const { data: sites, loading, error, refetch } = useSites();
  const [selectedSiteId, setSelectedSiteId] = useState<number | null>(null);
  const { data: selectedSite, loading: detailLoading } = useSite(selectedSiteId);

  const handleSiteClick = (site: Site) => {
    setSelectedSiteId(site.id);
  };

  const handleBackToList = () => {
    setSelectedSiteId(null);
  };

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

  // Detail View
  if (selectedSiteId && selectedSite) {
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
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-green-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedSite.nama_site}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('siteId')}: {selectedSite.id}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">{t('companyId')}</label>
                <p className="text-sm text-gray-900 mt-1">{selectedSite.id_perusahaan}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">{t('address')}</label>
                <p className="text-sm text-gray-900 mt-1">{selectedSite.alamat || t('notAvailable')}</p>
              </div>

              {(selectedSite.latitude || selectedSite.longitude) && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('coordinates')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {t('latitude')}: {selectedSite.latitude || t('notAvailable')}
                  </p>
                  <p className="text-sm text-gray-900">
                    {t('longitude')}: {selectedSite.longitude || t('notAvailable')}
                  </p>
                  {selectedSite.latitude && selectedSite.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${selectedSite.latitude},${selectedSite.longitude}`}
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

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">{t('status')}</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                  selectedSite.status === 'active' || selectedSite.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedSite.status}
                </span>
              </div>

              {selectedSite.created_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('createdAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedSite.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedSite.updated_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('updatedAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedSite.updated_at).toLocaleString()}
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
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              onClick={() => handleSiteClick(site)}
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
