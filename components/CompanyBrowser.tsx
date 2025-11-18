import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCompanies, useCompany } from '../hooks/useApiData';
import type { Company } from '../types';

export const CompanyBrowser: React.FC = () => {
  const { t } = useLanguage();
  const { data: companies, loading, error, refetch } = useCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const { data: selectedCompany, loading: detailLoading } = useCompany(selectedCompanyId);

  const handleCompanyClick = (company: Company) => {
    setSelectedCompanyId(company.id);
  };

  const handleBackToList = () => {
    setSelectedCompanyId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loadingCompanies')}</p>
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
  if (selectedCompanyId && selectedCompany) {
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
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <h2 className="text-xl font-bold text-gray-900">{selectedCompany.nama}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {t('companyId')}: {selectedCompany.id}
              </p>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">{t('address')}</label>
                <p className="text-sm text-gray-900 mt-1">{selectedCompany.alamat || t('notAvailable')}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('city')}</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCompany.kota || t('notAvailable')}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('province')}</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedCompany.provinsi || t('notAvailable')}</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase">{t('status')}</label>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                  selectedCompany.status === 'active' || selectedCompany.status === 'aktif'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {selectedCompany.status}
                </span>
              </div>

              {selectedCompany.created_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('createdAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedCompany.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              {selectedCompany.updated_at && (
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">{t('updatedAt')}</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {new Date(selectedCompany.updated_at).toLocaleString()}
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
          {t('companyList')} ({companies?.length || 0})
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

      {!companies || companies.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-sm text-gray-500">{t('noCompaniesFound')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => handleCompanyClick(company)}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">{company.nama}</h4>
                  {company.alamat && (
                    <p className="text-xs text-gray-600 mt-1">{company.alamat}</p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    {company.kota && <span>{company.kota}</span>}
                    {company.kota && company.provinsi && <span className="mx-2">•</span>}
                    {company.provinsi && <span>{company.provinsi}</span>}
                  </div>
                </div>
                <div className="ml-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    company.status === 'active' || company.status === 'aktif'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {company.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
