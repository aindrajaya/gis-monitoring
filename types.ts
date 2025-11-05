export enum SensorStatus {
  Safe = 'Safe',
  Warning = 'Warning',
  Alert = 'Alert',
  Critical = 'Critical',
}

export interface SensorDataPoint {
  id: number;
  deviceId?: string;
  lat: number;
  lng: number;
  waterLevel: number; // in meters
  // Environmental metrics
  rainfall?: number; // mm
  soilMoisture?: number; // percent
  soilTemperature?: number; // °C
  electricalConductivity?: number; // µS/cm or similar unit
  status: SensorStatus;
  lastUpdated: Date;
  sensorType: string;
  batteryLevel: number; // as percentage
}

export type ViewMode = 'points' | 'polygons';

// Using a type alias for LatLngExpression as it's from the Leaflet library
export type LatLngExpression = [number, number];