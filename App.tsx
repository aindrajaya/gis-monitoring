import React, { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { Sidebar } from './components/Sidebar';
import { DetailsPanel } from './components/DetailsPanel';
import { MapControls } from './components/MapControls';
import { useSensorData } from './hooks/useSensorData';
import { LanguageProvider } from './context/LanguageContext';
import type { ViewMode, SensorDataPoint } from './types';

const App: React.FC = () => {
  const sensorData = useSensorData(50);
  const [viewMode, setViewMode] = useState<ViewMode>('polygons');
  const [selectedLocation, setSelectedLocation] = useState<SensorDataPoint | null>(null);
  const [selectedAreaData, setSelectedAreaData] = useState<SensorDataPoint[] | null>(null);
  const [isLeftSidebarVisible, setLeftSidebarVisible] = useState(true);
  const [isRightPanelVisible, setRightPanelVisible] = useState(true);

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
        />
        <Sidebar 
          sensorData={sensorData}
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          onAreaDataSelect={handleAreaDataSelect}
          selectedAreaData={selectedAreaData}
          isVisible={isLeftSidebarVisible}
          onToggle={toggleLeftSidebar}
        />
        <MapControls isLeftVisible={isLeftSidebarVisible} />
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