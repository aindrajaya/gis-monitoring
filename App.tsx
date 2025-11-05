import React, { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { ControlPanel } from './components/ControlPanel';
import { InfoPanel } from './components/InfoPanel';
import { useSensorData } from './hooks/useSensorData';
import { LanguageProvider } from './context/LanguageContext';
import type { ViewMode, SensorDataPoint } from './types';

const App: React.FC = () => {
  const sensorData = useSensorData(50);
  const [viewMode, setViewMode] = useState<ViewMode>('points');
  const [isInfoPanelVisible, setInfoPanelVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<SensorDataPoint[] | null>(null);

  const handleAreaClick = (data: SensorDataPoint[] | null) => {
    setSelectedArea(data);
    setInfoPanelVisible(!!data && data.length > 0);
  };

  const toggleInfoPanel = () => {
    if (isInfoPanelVisible) {
      setInfoPanelVisible(false);
    } else {
      setInfoPanelVisible(true);
      if (!selectedArea) {
        setSelectedArea(sensorData);
      }
    }
  };

  return (
    <LanguageProvider>
      <div className="relative h-screen w-screen bg-gray-100">
        <MapComponent 
          sensorData={sensorData} 
          viewMode={viewMode} 
          onAreaClick={handleAreaClick} 
        />
        <ControlPanel 
          viewMode={viewMode} 
          setViewMode={setViewMode}
          onToggleInfoPanel={toggleInfoPanel}
        />
        {isInfoPanelVisible && <InfoPanel onClose={toggleInfoPanel} data={selectedArea} />}
      </div>
    </LanguageProvider>
  );
};

export default App;