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

// API Response Types
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

// Company (Perusahaan) Types
export interface Company {
  id: number;
  nama: string;
  alamat?: string;
  kota?: string;
  provinsi?: string;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Site Types
export interface Site {
  id: number;
  id_perusahaan: number;
  nama_site: string;
  alamat?: string;
  latitude?: number;
  longitude?: number;
  status: string;
  created_at?: string;
  updated_at?: string;
}

// Device Types
export interface Device {
  id: string | number;
  device_id_unik: string; // API returns device_id_unik, not device_id
  id_perusahaan: string | number;
  id_site: string | number;
  tipe_alat?: string; // API returns tipe_alat, not tipe_device
  latitude?: string | number;
  longitude?: string | number;
  status: string;
  last_online?: string;
  created_at?: string;
  updated_at?: string;
}

// Realtime Data Types
export interface RealtimeSummary {
  device_id: string;
  nama_device?: string;
  id_site: number;
  nama_site?: string;
  last_update?: string;
  level_air?: number;
  curah_hujan?: number;
  kelembapan_tanah?: number;
  temperatur_tanah?: number;
  daya_hantar_listrik?: number;
  battery_voltage?: number;
  status?: string;
}

export interface RealtimePoint {
  id: number;
  device_id: string;
  timestamp: string;
  level_air?: number;
  curah_hujan?: number;
  kelembapan_tanah?: number;
  temperatur_tanah?: number;
  daya_hantar_listrik?: number;
  battery_voltage?: number;
}