export enum SensorStatus {
  Safe = 'Safe',
  Warning = 'Warning',
  Alert = 'Alert',
}

export interface SensorDataPoint {
  id: number;
  lat: number;
  lng: number;
  waterLevel: number; // in meters
  status: SensorStatus;
  lastUpdated: Date;
  sensorType: string;
  batteryLevel: number; // as percentage
}

export type ViewMode = 'points' | 'polygons';

// Using a type alias for LatLngExpression as it's from the Leaflet library
export type LatLngExpression = [number, number];