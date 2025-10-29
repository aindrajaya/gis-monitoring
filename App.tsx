import React, { useState } from 'react';
import { MapComponent } from './components/MapComponent';
import { ControlPanel } from './components/ControlPanel';
import { useSensorData } from './hooks/useSensorData';
import { LanguageProvider } from './context/LanguageContext';
import type { ViewMode } from './types';

const App: React.FC = () => {
  const sensorData = useSensorData(50);
  const [viewMode, setViewMode] = useState<ViewMode>('points');

  return (
    <LanguageProvider>
      <div className="relative h-screen w-screen bg-gray-100">
        <MapComponent sensorData={sensorData} viewMode={viewMode} />
        <ControlPanel viewMode={viewMode} setViewMode={setViewMode} />
      </div>
    </LanguageProvider>
  );
};

export default App;