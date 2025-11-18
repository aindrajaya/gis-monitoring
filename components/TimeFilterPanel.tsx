import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface TimeFilterPanelProps {
  onFilterChange: (startDate: Date | null, endDate: Date | null) => void;
  isLeftVisible: boolean;
}

export const TimeFilterPanel: React.FC<TimeFilterPanelProps> = ({ onFilterChange, isLeftVisible }) => {
  const { t } = useLanguage();
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
  
  const months = [
    { value: '1', label: 'January', labelId: 'january' },
    { value: '2', label: 'February', labelId: 'february' },
    { value: '3', label: 'March', labelId: 'march' },
    { value: '4', label: 'April', labelId: 'april' },
    { value: '5', label: 'May', labelId: 'may' },
    { value: '6', label: 'June', labelId: 'june' },
    { value: '7', label: 'July', labelId: 'july' },
    { value: '8', label: 'August', labelId: 'august' },
    { value: '9', label: 'September', labelId: 'september' },
    { value: '10', label: 'October', labelId: 'october' },
    { value: '11', label: 'November', labelId: 'november' },
    { value: '12', label: 'December', labelId: 'december' },
  ];

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    applyFilter(year, selectedMonth);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    applyFilter(selectedYear, month);
  };

  const applyFilter = (year: string, month: string) => {
    if (!year) {
      onFilterChange(null, null);
      return;
    }

    const startDate = new Date(parseInt(year), month ? parseInt(month) - 1 : 0, 1);
    const endDate = month 
      ? new Date(parseInt(year), parseInt(month), 0, 23, 59, 59) // Last day of selected month
      : new Date(parseInt(year), 11, 31, 23, 59, 59); // Last day of year
    
    onFilterChange(startDate, endDate);
  };

  const clearFilter = () => {
    setSelectedYear('2025');
    setSelectedMonth('');
    onFilterChange(null, null);
  };

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className="absolute top-[120px] z-[1000] transition-all duration-300"
      style={{ left: isLeftVisible ? 'calc(360px + 4rem)' : '4rem' }}
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white cursor-pointer hover:bg-blue-700 transition-colors"
          onClick={togglePanel}
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="font-semibold">{t('timeFilter')}</span>
          </div>
          <svg 
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Filter Content */}
        {isOpen && (
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              {/* Year Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('year')}
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selector */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('month')}
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="">{t('allMonths')}</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {t(month.labelId as any)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Button */}
              <div className="pt-6">
                <button
                  onClick={clearFilter}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
                  title={t('clearFilter')}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Active Filter Display */}
            {(selectedYear || selectedMonth) && (
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>
                  {t('filteringBy')}: {selectedYear}
                  {selectedMonth && ` - ${t(months.find(m => m.value === selectedMonth)?.labelId as any)}`}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
