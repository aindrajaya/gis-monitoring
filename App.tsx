import React, { useState, useMemo } from 'react';
import { MapComponent } from './components/MapComponent';
import { Sidebar } from './components/Sidebar';
import { DetailsPanel } from './components/DetailsPanel';
import { MapControls } from './components/MapControls';
import { TimeFilterPanel } from './components/TimeFilterPanel';
import { LegendInfoPanel } from './components/LegendInfoPanel';
import { useSensorData } from './hooks/useSensorData';
import { LanguageProvider } from './context/LanguageContext';
import type { ViewMode, SensorDataPoint } from './types';

const App: React.FC = () => {
  const { 
    sensorData: allSensorData, 
    loading, 
    error,
    useMockData,
    setUseMockData,
    selectedCompany,
    setSelectedCompany 
  } = useSensorData(50);
  const [viewMode, setViewMode] = useState<ViewMode>('polygons');
  const [selectedLocation, setSelectedLocation] = useState<SensorDataPoint | null>(null);
  const [selectedAreaData, setSelectedAreaData] = useState<SensorDataPoint[] | null>(null);
  const [isLeftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [isRightPanelVisible, setRightPanelVisible] = useState(true);
  const [timeFilterStart, setTimeFilterStart] = useState<Date | null>(null);
  const [timeFilterEnd, setTimeFilterEnd] = useState<Date | null>(null);
  const [targetLocation, setTargetLocation] = useState<{ lat: number; lng: number; name: string } | null>(null);

  // Filter sensor data by time range
  const sensorData = useMemo(() => {
    if (!timeFilterStart || !timeFilterEnd) {
      return allSensorData;
    }
    
    return allSensorData.filter(sensor => {
      const sensorDate = new Date(sensor.lastUpdated);
      return sensorDate >= timeFilterStart && sensorDate <= timeFilterEnd;
    });
  }, [allSensorData, timeFilterStart, timeFilterEnd]);

  const handleTimeFilterChange = (startDate: Date | null, endDate: Date | null) => {
    setTimeFilterStart(startDate);
    setTimeFilterEnd(endDate);
  };

  const handleLocationClick = (lat: number, lng: number, name: string) => {
    setTargetLocation({ lat, lng, name });
    // Reset after a delay to allow multiple clicks to the same location
    setTimeout(() => setTargetLocation(null), 2000);
  };

  const handleAreaClick = (data: SensorDataPoint[] | null) => {
    setSelectedAreaData(data);
    if (data && data.length > 0) {
      // Don't auto-select first sensor, just show the list
      setSelectedLocation(null);
    }
  };

  const handleLocationSelect = (location: SensorDataPoint | null) => {
    setSelectedLocation(location);
    if (location) {
      setRightPanelVisible(true);
    }
  };

  const handleAreaDataSelect = (areaData: SensorDataPoint[] | null) => {
    setSelectedAreaData(areaData);
  };

  const handleCloseDetails = () => {
    setSelectedLocation(null);
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarVisible(!isLeftSidebarVisible);
  };

  const toggleRightPanel = () => {
    setRightPanelVisible(!isRightPanelVisible);
  };

  return (
    <LanguageProvider>
      <div className="relative h-screen w-screen bg-gray-100">
        <MapComponent 
          sensorData={sensorData} 
          viewMode={viewMode} 
          onAreaClick={handleAreaClick}
          isLeftVisible={isLeftSidebarVisible}
          isRightVisible={isRightPanelVisible && selectedLocation !== null}
          selectedSensor={selectedLocation}
          targetLocation={targetLocation}
          onSensorClick={handleLocationSelect}
        />
        <Sidebar 
          sensorData={sensorData}
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          onAreaDataSelect={handleAreaDataSelect}
          selectedAreaData={selectedAreaData}
          isVisible={isLeftSidebarVisible}
          onToggle={toggleLeftSidebar}
          useMockData={useMockData}
          setUseMockData={setUseMockData}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          onLocationClick={handleLocationClick}
        />
        <MapControls isLeftVisible={isLeftSidebarVisible} />
        <TimeFilterPanel onFilterChange={handleTimeFilterChange} isLeftVisible={isLeftSidebarVisible} />
        <LegendInfoPanel isRightVisible={isRightPanelVisible && selectedLocation !== null} />
        <DetailsPanel 
          selectedLocation={selectedLocation}
          onClose={handleCloseDetails}
          isVisible={isRightPanelVisible && selectedLocation !== null}
          onToggle={toggleRightPanel}
        />
      </div>
    </LanguageProvider>
  );
};

export default App;