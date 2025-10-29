import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON } from 'react-leaflet';
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

/**
 * Renders an interpolated hydrological topography using Inverse Distance Weighting (IDW).
 * It creates a grid, calculates values, generates isobands (contour zones), and clips them to the boundary.
 */
const ZoneLayer: React.FC<{ data: SensorDataPoint[] }> = ({ data }) => {
    const { t } = useLanguage();
    const boundaryFeature = desaDayunBoundary.features[0] as Feature<Polygon>;

    const interpolatedPolygons = useMemo(() => {
        if (data.length < 3) return [];

        const boundaryBbox = turf.bbox(boundaryFeature);

        // 1. Create a grid of points for interpolation
        const gridCellSize = 0.01; // Degrees. Smaller is higher quality but slower.
        const pointGrid = turf.pointGrid(boundaryBbox, gridCellSize, { units: 'degrees' });

        // 2. For each grid point, calculate the interpolated value using IDW
        const power = 2; // Power parameter for IDW, 2 is common
        pointGrid.features.forEach((gridPoint: Feature) => {
            let totalWeight = 0;
            let weightedSum = 0;

            for (const sensorPoint of data) {
                const distance = turf.distance(gridPoint, [sensorPoint.lng, sensorPoint.lat], { units: 'kilometers' });
                
                if (distance === 0) {
                    weightedSum = sensorPoint.waterLevel;
                    totalWeight = 1;
                    break; // Exact match, no need to check other points
                }

                const weight = 1 / Math.pow(distance, power);
                weightedSum += sensorPoint.waterLevel * weight;
                totalWeight += weight;
            }
            
            gridPoint.properties!.waterLevel = totalWeight > 0 ? weightedSum / totalWeight : 0;
        });

        // 3. Create isobands (contour polygons) based on water level thresholds
        const breaks = [0, WATER_LEVEL_THRESHOLDS.SAFE_MAX, WATER_LEVEL_THRESHOLDS.WARNING_MAX, 10]; // 10 as an upper bound for Alert
        const isobands = turf.isobands(pointGrid, breaks, { zProperty: 'waterLevel' });

        // 4. Clip the resulting polygons to the boundary and assign status/color
        const finalPolygons = isobands.features.map((band: Feature<Polygon>) => {
            const clippedBand = turf.intersect(band, boundaryFeature);
            if (!clippedBand) return null;

            // 'band.properties.waterLevel' will be a string like '0-2' from turf.isobands
            const waterLevelRange = band.properties!.waterLevel;
            const lowerBound = parseFloat(waterLevelRange.split('-')[0]);

            let status: SensorStatus;
            if (lowerBound < WATER_LEVEL_THRESHOLDS.SAFE_MAX) {
                status = SensorStatus.Safe;
            } else if (lowerBound < WATER_LEVEL_THRESHOLDS.WARNING_MAX) {
                status = SensorStatus.Warning;
            } else {
                status = SensorStatus.Alert;
            }

            return {
                status,
                geojson: clippedBand as Feature<Polygon | MultiPolygon>,
                range: waterLevelRange,
            };
        }).filter((p): p is { status: SensorStatus; geojson: Feature<Polygon | MultiPolygon>; range: string } => p !== null);
        
        return finalPolygons;

    }, [data, boundaryFeature]);

    return (
        <>
            {interpolatedPolygons.map(({ status, geojson, range }, index) => (
                <GeoJSON
                    key={`${status}-${index}`}
                    data={geojson}
                    style={{
                        fillColor: STATUS_COLORS[status],
                        fillOpacity: 0.6,
                        stroke: false,
                    }}
                >
                    <Tooltip sticky>
                        <div className="text-center">
                            <p className="font-bold">{t(status.toLowerCase() as any)}</p>
                            <p className="text-xs">{t('waterLevel')}: {range.replace('-', ' - ')} m</p>
                        </div>
                    </Tooltip>
                </GeoJSON>
            ))}
        </>
    );
};


export const MapComponent: React.FC<MapComponentProps> = ({ sensorData, viewMode }) => {
  return (
    <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} scrollWheelZoom={true}>
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
      {viewMode === 'polygons' && <ZoneLayer data={sensorData} />}
    </MapContainer>
  );
};