import React, { useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON, useMapEvents, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MAP_CENTER, MAP_ZOOM, STATUS_COLORS, WATER_LEVEL_THRESHOLDS } from '../constants';
import { SensorStatus } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { desaDayunBoundary } from '../data/desaDayunBoundary';
import type { SensorDataPoint, ViewMode } from '../types';
import type { Feature, Polygon, MultiPolygon } from 'geojson';

// Make Turf.js globally available to TypeScript
declare var turf: any;

interface MapComponentProps {
  sensorData: SensorDataPoint[];
  viewMode: ViewMode;
  onAreaClick: (data: SensorDataPoint[] | null) => void;
  isLeftVisible: boolean;
  isRightVisible: boolean;
  selectedSensor: SensorDataPoint | null;
}

// Helper to format the date based on current language
const formatTimestamp = (date: Date, locale: string) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

// Renders individual sensor points on the map
const PointLayer: React.FC<{ data: SensorDataPoint[] }> = ({ data }) => {
  const { t, language } = useLanguage();

  return (
    <>
      {data.map((point) => (
        <CircleMarker
          key={point.id}
          center={[point.lat, point.lng]}
          radius={5}
          pathOptions={{
            color: '#1f2937', // dark-gray-800 for better contrast on light map
            weight: 1,
            fillColor: STATUS_COLORS[point.status],
            fillOpacity: 0.9,
          }}
        >
          <Tooltip>
            <div className="text-sm">
              <p className="font-bold text-base mb-1">{t('sensorId')}: {point.id}</p>
              <table className="w-full text-left">
                <tbody>
                  <tr>
                    <td className="pr-2 font-semibold">{t('deviceId')}:</td>
                    <td>{point.deviceId ?? '—'}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('waterLevel')}:</td>
                    <td>{point.waterLevel} m</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('status')}:</td>
                    <td>{t(point.status.toLowerCase() as any)}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('sensorType')}:</td>
                    <td>{point.sensorType}</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('batteryLevel')}:</td>
                    <td>{point.batteryLevel}%</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('rainfall')}:</td>
                    <td>{point.rainfall ?? '—'} mm</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('soilMoisture')}:</td>
                    <td>{point.soilMoisture ?? '—'} %</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('soilTemperature')}:</td>
                    <td>{point.soilTemperature ?? '—'} °C</td>
                  </tr>
                  <tr>
                    <td className="pr-2 font-semibold">{t('electricalConductivity')}:</td>
                    <td>{point.electricalConductivity ?? '—'}</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">{t('lastUpdated')}: {formatTimestamp(point.lastUpdated, language)}</p>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
};

const ZoneLayer: React.FC<{
  data: SensorDataPoint[];
  onAreaClick: (data: SensorDataPoint[] | null) => void;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
}> = ({ data, onAreaClick, selectedZoneId, setSelectedZoneId }) => {
    const { t } = useLanguage();
    const boundaryFeature = desaDayunBoundary.features[0] as Feature<Polygon>;

    const interpolatedPolygons = useMemo(() => {
        if (data.length < 3) return [];

        const boundaryBbox = turf.bbox(boundaryFeature);

        const gridCellSize = 0.01;
        const pointGrid = turf.pointGrid(boundaryBbox, gridCellSize, { units: 'degrees' });

        const power = 2;
        pointGrid.features.forEach((gridPoint: Feature) => {
            let totalWeight = 0;
            let weightedSum = 0;

            for (const sensorPoint of data) {
                const distance = turf.distance(gridPoint, [sensorPoint.lng, sensorPoint.lat], { units: 'kilometers' });
                
                if (distance === 0) {
                    weightedSum = sensorPoint.waterLevel;
                    totalWeight = 1;
                    break;
                }

                const weight = 1 / Math.pow(distance, power);
                weightedSum += sensorPoint.waterLevel * weight;
                totalWeight += weight;
            }
            
            gridPoint.properties!.waterLevel = totalWeight > 0 ? weightedSum / totalWeight : 0;
        });

        const breaks = [WATER_LEVEL_THRESHOLDS.SAFE.MIN, WATER_LEVEL_THRESHOLDS.WARNING.MIN, WATER_LEVEL_THRESHOLDS.ALERT.MIN, WATER_LEVEL_THRESHOLDS.CRITICAL.MIN, WATER_LEVEL_THRESHOLDS.CRITICAL.MAX];
        const isobands = turf.isobands(pointGrid, breaks, { zProperty: 'waterLevel' });

        const finalPolygons = isobands.features.map((band: Feature<Polygon>, index: number) => {
            const clippedBand = turf.intersect(band, boundaryFeature);
            if (!clippedBand) return null;

            const waterLevelRange = band.properties!.waterLevel;
            const lowerBound = parseFloat(waterLevelRange.split('-')[0]);

            let status: SensorStatus;
            if (lowerBound < WATER_LEVEL_THRESHOLDS.WARNING.MIN) {
                status = SensorStatus.Safe;
            } else if (lowerBound < WATER_LEVEL_THRESHOLDS.ALERT.MIN) {
                status = SensorStatus.Warning;
            } else if (lowerBound < WATER_LEVEL_THRESHOLDS.CRITICAL.MIN) {
                status = SensorStatus.Alert;
            } else {
                status = SensorStatus.Critical;
            }

            return {
                id: `zone-${index}`,
                status,
                geojson: clippedBand as Feature<Polygon | MultiPolygon>,
                range: waterLevelRange,
            };
        }).filter((p): p is { id: string; status: SensorStatus; geojson: Feature<Polygon | MultiPolygon>; range: string } => p !== null);
        
        return finalPolygons;

    }, [data, boundaryFeature]);

    const handleAreaClick = (polygon: { id: string, status: SensorStatus, geojson: Feature<Polygon | MultiPolygon> }) => {
      const selectedData = data.filter(p => p.status === polygon.status);
      onAreaClick(selectedData);
      setSelectedZoneId(polygon.id);
    };

    const zonesToRender = selectedZoneId
      ? interpolatedPolygons.filter(p => p.id === selectedZoneId)
      : interpolatedPolygons;

    return (
        <>
            {zonesToRender.map((polygon, index) => (
                <GeoJSON
                    key={`${polygon.status}-${index}`}
                    data={polygon.geojson}
                    style={{
                        fillColor: STATUS_COLORS[polygon.status],
                        fillOpacity: 0.6,
                        stroke: false,
                    }}
                    eventHandlers={{
                      click: (e) => {
                        L.DomEvent.stopPropagation(e);
                        handleAreaClick(polygon);
                      },
                    }}
                >
                    <Tooltip sticky>
                        <div className="text-center">
                            <p className="font-bold">{t(polygon.status.toLowerCase() as any)}</p>
                            <p className="text-xs">{t('waterLevel')}: {polygon.range.replace('-', ' - ')} m</p>
                        </div>
                    </Tooltip>
                </GeoJSON>
            ))}
        </>
    );
};

const MapCenterController: React.FC<{ selectedSensor: SensorDataPoint | null }> = ({ selectedSensor }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedSensor) {
      const currentZoom = map.getZoom();
      map.setView([selectedSensor.lat, selectedSensor.lng], currentZoom, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedSensor, map]);

  return null;
};

const MapResizeHandler: React.FC<{ isLeftVisible: boolean; isRightVisible: boolean }> = ({ isLeftVisible, isRightVisible }) => {
  const map = useMap();

  useEffect(() => {
    // Small delay to allow CSS transition to complete
    const timeout = setTimeout(() => {
      map.invalidateSize();
    }, 300); // Match the transition duration

    return () => clearTimeout(timeout);
  }, [isLeftVisible, isRightVisible, map]);

  return null;
};

const MapClickHandler: React.FC<{ setSelectedZoneId: (id: null) => void, onAreaClick: (data: null) => void }> = ({ setSelectedZoneId, onAreaClick }) => {
  useMapEvents({
    click: () => {
      setSelectedZoneId(null);
      onAreaClick(null);
    },
  });
  return null;
};

export const MapComponent: React.FC<MapComponentProps> = ({ sensorData, viewMode, onAreaClick, isLeftVisible, isRightVisible, selectedSensor }) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const { t } = useLanguage();

  // Create custom marker icon for selected sensor
  const selectedMarkerIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="#EF4444" d="M12 0C7.6 0 4 3.6 4 8c0 5.4 8 16 8 16s8-10.6 8-16c0-4.4-3.6-8-8-8zm0 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/>
        <circle fill="white" cx="12" cy="8" r="3"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const leftOffset = isLeftVisible ? 320 : 0;
  const rightOffset = isRightVisible ? 384 : 0;

  return (
    <div 
      className="absolute top-0 bottom-0 transition-all duration-300"
      style={{ 
        left: `${leftOffset}px`,
        right: `${rightOffset}px`
      }}
    >
      <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom={true} className="h-full w-full">
        <MapCenterController selectedSensor={selectedSensor} />
        <MapResizeHandler isLeftVisible={isLeftVisible} isRightVisible={isRightVisible} />
        <MapClickHandler setSelectedZoneId={setSelectedZoneId} onAreaClick={onAreaClick} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
         <GeoJSON 
          data={desaDayunBoundary}
          style={{
              fillColor: 'transparent',
              color: '#4b5563', // gray-600
              weight: 1.5,
              dashArray: '5, 5',
          }}
         />
        {viewMode === 'points' && <PointLayer data={sensorData} />}
        {viewMode === 'polygons' && <ZoneLayer data={sensorData} onAreaClick={onAreaClick} selectedZoneId={selectedZoneId} setSelectedZoneId={setSelectedZoneId} />}
        
        {/* Marker for selected sensor */}
        {selectedSensor && (
          <Marker 
            position={[selectedSensor.lat, selectedSensor.lng]}
            icon={selectedMarkerIcon}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-base mb-2">{t('sensorId')}: {selectedSensor.id}</p>
                <table className="w-full text-left">
                  <tbody>
                    <tr>
                      <td className="pr-2 font-semibold">{t('waterLevel')}:</td>
                      <td>{selectedSensor.waterLevel} m</td>
                    </tr>
                    <tr>
                      <td className="pr-2 font-semibold">{t('status')}:</td>
                      <td className={`font-semibold ${
                        selectedSensor.status === 'Safe' ? 'text-green-600' :
                        selectedSensor.status === 'Warning' ? 'text-yellow-600' :
                        selectedSensor.status === 'Alert' ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {t(selectedSensor.status.toLowerCase() as any)}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-2 font-semibold">{t('coordinates')}:</td>
                      <td>{selectedSensor.lat.toFixed(4)}, {selectedSensor.lng.toFixed(4)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};