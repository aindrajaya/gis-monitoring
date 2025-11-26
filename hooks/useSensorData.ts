import { useState, useEffect, useCallback } from 'react';
import { WATER_LEVEL_THRESHOLDS } from '../constants';
import { SensorStatus } from '../types';
import type { SensorDataPoint } from '../types';
import { apiClient } from '../services/api';
import { adaptRealtimeArrayToSensors } from '../services/dataAdapter';
import { useJsonData } from './useJsonData';

const getStatus = (waterLevel: number): SensorStatus => {
  if (waterLevel >= WATER_LEVEL_THRESHOLDS.CRITICAL.MIN) {
    return SensorStatus.Critical;
  }
  if (waterLevel >= WATER_LEVEL_THRESHOLDS.ALERT.MIN) {
    return SensorStatus.Alert;
  }
  if (waterLevel >= WATER_LEVEL_THRESHOLDS.WARNING.MIN) {
    return SensorStatus.Warning;
  }
  return SensorStatus.Safe;
};

// No generated mock data used: JSON (`public/populate_db.json`) or API are supported sources.

export const useSensorData = (count: number = 50) => {
  const [data, setData] = useState<SensorDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'api' | 'json'>('json'); // Default to JSON
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);

  // Use our JSON data hook
  const { data: jsonData, loading: jsonLoading, error: jsonError } = useJsonData();

  // no generated mock data; JSON loader will provide data from `public/populate_db.json`

  // Convert JSON data to SensorDataPoint format
  const convertJsonToSensorData = useCallback((jsonData: any[]): SensorDataPoint[] => {
    return jsonData.map((device, index) => ({
      id: index + 1,
      deviceId: device.deviceId,
      lat: device.lat,
      lng: device.lng,
      waterLevel: device.waterLevel,
      status: device.status === 'flooded' ? SensorStatus.Safe : // Flooded is good for peat
              device.status === 'safe' ? SensorStatus.Safe :
              device.status === 'warning' ? SensorStatus.Warning :
              device.status === 'danger' ? SensorStatus.Critical : SensorStatus.Safe,
      lastUpdated: device.lastUpdated,
      sensorType: device.deviceType || 'TMAT Logger V3',
      batteryLevel: 85 + Math.random() * 15, // Simulate good battery
      rainfall: Math.random() * 10,
      soilMoisture: 40 + Math.random() * 40,
      soilTemperature: device.temperature || (25 + Math.random() * 10),
      electricalConductivity: 500 + Math.random() * 1000,
    }));
  }, []);

  const fetchApiData = useCallback(async () => {
    // Handle different data sources: JSON (local file) or API
    if (dataSource === 'json') {
      console.log('[useSensorData] Using JSON data from populate_db.json');
      setLoading(jsonLoading);
      setError(jsonError);
      if (jsonData && jsonData.length > 0) {
        const convertedData = convertJsonToSensorData(jsonData);
        setData(convertedData);
        console.log('[useSensorData] Loaded', convertedData.length, 'sensors from JSON');
      } else {
        setData([]);
      }
      return;
    }

    console.log('[useSensorData] Fetching API data...');
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data in parallel
      const [devicesRes, sitesRes, realtimeRes] = await Promise.all([
        apiClient.getAllDevices(),
        apiClient.getAllSites(selectedCompany ?? undefined),
        apiClient.getRealtimeAll(selectedCompany ?? undefined),
      ]);

      console.log('[useSensorData] API Response:', {
        devices: devicesRes.data?.length || 0,
        sites: sitesRes.data?.length || 0,
        realtime: realtimeRes.data?.length || 0,
      });
      
      // Log sample data to debug
      console.log('[useSensorData] Sample realtime data:', realtimeRes.data?.[0]);
      console.log('[useSensorData] Sample device data:', devicesRes.data?.[0]);
      console.log('[useSensorData] Sample site data:', sitesRes.data?.[0]);

      // Check if all requests were successful
      if (!devicesRes.status || !sitesRes.status) {
        throw new Error('One or more API requests failed');
      }

      // Check if we have device data
      if (!devicesRes.data || devicesRes.data.length === 0) {
        console.warn('[useSensorData] No device data available from API');
        setData([]);
        return;
      }

      console.log('[useSensorData] Using device data only (not filtering by realtime)');
      console.log('[useSensorData] Device count:', devicesRes.data.length);

      // Convert all devices to sensors (with or without realtime data)
      const sensors = devicesRes.data.map((device, index) => {
        const site = sitesRes.data?.find(s => String(s.id) === String(device.id_site));
        const realtime = realtimeRes.data?.find(r => r.device_id === device.device_id_unik);
        
        const lat = parseFloat(String(device.latitude ?? site?.latitude ?? 0));
        const lng = parseFloat(String(device.longitude ?? site?.longitude ?? 0));
        const waterLevel = realtime ? Math.abs(realtime.level_air ?? 0) : 0;
        
        // Determine status based on water level
        let status: SensorStatus;
        if (waterLevel >= 5) status = SensorStatus.Critical;
        else if (waterLevel >= 3) status = SensorStatus.Alert;
        else if (waterLevel >= 1) status = SensorStatus.Warning;
        else status = SensorStatus.Safe;
        
        return {
          id: typeof device.id === 'string' ? parseInt(device.id) : device.id,
          deviceId: device.device_id_unik,
          lat,
          lng,
          waterLevel,
          status,
          lastUpdated: realtime?.last_update ? new Date(realtime.last_update) : new Date(device.last_online || device.created_at || Date.now()),
          rainfall: realtime?.curah_hujan,
          soilMoisture: realtime?.kelembapan_tanah,
          soilTemperature: realtime?.temperatur_tanah,
          electricalConductivity: realtime?.daya_hantar_listrik,
          batteryLevel: realtime?.battery_voltage ? Math.min(100, Math.max(0, Math.round((realtime.battery_voltage / 4.2) * 100))) : 100,
          sensorType: device.tipe_alat || 'Hydrology Monitor',
        };
      });

      console.log('[useSensorData] Total sensors from devices:', sensors.length);
      console.log('[useSensorData] First 3 sensors:', sensors.slice(0, 3));
      
      setData(sensors);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch sensor data';
      setError(message);
      console.error('[useSensorData] Failed to fetch sensor data:', err);
      
      // DON'T fallback to mock data - show error instead
      console.error('[useSensorData] Keeping data empty due to API error');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dataSource, selectedCompany, jsonData, jsonLoading, jsonError, convertJsonToSensorData]);

  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  return {
    sensorData: data,
    loading,
    error,
    dataSource,
    setDataSource,
    selectedCompany,
    setSelectedCompany,
    refetch: fetchApiData,
    // Backward compatibility: treat settings toggle as JSON (true) vs API (false)
    useMockData: dataSource === 'json',
    setUseMockData: (useMock: boolean) => setDataSource(useMock ? 'json' : 'api'),
  };
};