import React, { useState } from 'react';

export interface BiweeklyPeriod {
  year: number;
  period: string;
  startDate: Date;
  endDate: Date;
}

interface BiweeklySelectorProps {
  onPeriodChange: (period: BiweeklyPeriod) => void;
  className?: string;
}

export const BiweeklySelector: React.FC<BiweeklySelectorProps> = ({ 
  onPeriodChange, 
  className = '' 
}) => {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState('Nov II');

  // Generate available years (current year and previous 3 years)
  const availableYears = Array.from({ length: 4 }, (_, i) => currentYear - i);

  // Generate biweekly periods for each month
  const generatePeriods = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const periods: { value: string; label: string; startDate: Date; endDate: Date }[] = [];
    
    months.forEach((month, monthIndex) => {
      // First half of month (I)
      const firstStart = new Date(selectedYear, monthIndex, 1);
      const firstEnd = new Date(selectedYear, monthIndex, 15, 23, 59, 59);
      
      periods.push({
        value: `${month} I`,
        label: `${month} I (1-15)`,
        startDate: firstStart,
        endDate: firstEnd
      });
      
      // Second half of month (II)
      const secondStart = new Date(selectedYear, monthIndex, 16);
      const secondEnd = new Date(selectedYear, monthIndex + 1, 0, 23, 59, 59); // Last day of month
      
      periods.push({
        value: `${month} II`,
        label: `${month} II (16-${secondEnd.getDate()})`,
        startDate: secondStart,
        endDate: secondEnd
      });
    });
    
    return periods;
  };

  const periods = generatePeriods();

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    // Trigger period change with current period
    const currentPeriod = periods.find(p => p.value === selectedPeriod);
    if (currentPeriod) {
      onPeriodChange({
        year,
        period: selectedPeriod,
        startDate: currentPeriod.startDate,
        endDate: currentPeriod.endDate
      });
    }
  };

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    const selectedPeriodData = periods.find(p => p.value === period);
    if (selectedPeriodData) {
      onPeriodChange({
        year: selectedYear,
        period,
        startDate: selectedPeriodData.startDate,
        endDate: selectedPeriodData.endDate
      });
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border ${className}`}>
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📅 TMAT Dwi Mingguan</h3>
        <p className="text-sm text-gray-600 mb-3">
          Pilih periode dua mingguan untuk analisis tinggi muka air tanah
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Year Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tahun
          </label>
          <select
            value={selectedYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Period Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Periode
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Selection Display */}
      <div className="mt-3 p-2 bg-blue-50 rounded-md">
        <p className="text-sm text-blue-800">
          <span className="font-medium">Periode Terpilih:</span>{' '}
          {selectedPeriod} {selectedYear}
        </p>
        {(() => {
          const currentPeriod = periods.find(p => p.value === selectedPeriod);
          if (currentPeriod) {
            return (
              <p className="text-xs text-blue-600 mt-1">
                {currentPeriod.startDate.toLocaleDateString('id-ID')} - {' '}
                {currentPeriod.endDate.toLocaleDateString('id-ID')}
              </p>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default BiweeklySelector;