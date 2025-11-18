import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useCompanies } from '../hooks/useApiData';

interface SettingsPanelProps {
  useMockData: boolean;
  setUseMockData: (useMock: boolean) => void;
  selectedCompany: number | null;
  setSelectedCompany: (companyId: number | null) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  useMockData,
  setUseMockData,
  selectedCompany,
  setSelectedCompany,
}) => {
  const { t } = useLanguage();
  const { data: companies, loading: companiesLoading } = useCompanies();

  const handleToggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCompany(value ? parseInt(value) : null);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Data Source Toggle */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {t('dataSource')}
        </h3>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-700">
            {useMockData ? t('useMockData') : t('liveApiData')}
          </span>
          <button
            onClick={handleToggleDataSource}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useMockData ? 'bg-gray-400' : 'bg-blue-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useMockData ? 'translate-x-1' : 'translate-x-6'
              }`}
            />
          </button>
        </div>
        
        <p className="text-sm text-gray-600">
          {useMockData 
            ? t('mockDataDescription') 
            : t('liveDataDescription')}
        </p>
      </div>

      {/* Company Filter (only visible when using live data) */}
      {!useMockData && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('companyFilter')}
          </h3>
          
          {companiesLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              <select
                value={selectedCompany ?? ''}
                onChange={handleCompanyChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('allCompanies')}</option>
                {companies?.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.nama}
                  </option>
                ))}
              </select>
              
              <p className="text-sm text-gray-600 mt-2">
                {t('companyFilterDescription')}
              </p>
            </>
          )}
        </div>
      )}

      {/* API Configuration (only visible when using live data) */}
      {!useMockData && (
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('apiConfiguration')}
          </h3>
          
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700">{t('baseUrl')}:</span>
              <p className="text-gray-600 break-all">
                {import.meta.env.VITE_API_BASE_URL || t('notConfigured')}
              </p>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">{t('apiKey')}:</span>
              <p className="text-gray-600 font-mono">
                {import.meta.env.VITE_API_KEY 
                  ? `${import.meta.env.VITE_API_KEY.substring(0, 8)}${'*'.repeat(16)}`
                  : t('notConfigured')
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
