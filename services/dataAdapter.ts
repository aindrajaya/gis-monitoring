import { SensorDataPoint, SensorStatus, RealtimeSummary, Device, Site } from '../types';
import { WATER_LEVEL_THRESHOLDS } from '../constants';

/**
 * Determines sensor status based on water level
 */
function getStatusFromWaterLevel(waterLevel: number): SensorStatus {
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
}

/**
 * Converts battery voltage to percentage (assuming 4.2V max for Li-ion)
 */
function batteryVoltageToPercentage(voltage?: number): number {
  if (!voltage) return 100; // Default to full if not provided
  const percentage = Math.min(100, Math.max(0, (voltage / 4.2) * 100));
  return Math.round(percentage);
}

/**
 * Adapts a single RealtimeSummary to SensorDataPoint
 * Uses device and site data for location if available
 */
export function adaptRealtimeToSensor(
  realtime: RealtimeSummary,
  device?: Device,
  site?: Site
): SensorDataPoint | null {
  // API returns device_id_unik, set device_id for compatibility
  const deviceId = realtime.device_id_unik || realtime.device_id;
  
  // Skip if device_id is missing
  if (!deviceId) {
    console.warn('[dataAdapter] Skipping realtime data without device_id:', realtime);
    return null;
  }

  // Normalize realtime data: convert API string values to numbers and map to expected fields
  const tmatValue = realtime.tmat_value ? parseFloat(realtime.tmat_value) : undefined;
  const suhuValue = realtime.suhu_value ? parseFloat(realtime.suhu_value) : undefined;
  const phValue = realtime.ph_value ? parseFloat(realtime.ph_value) : undefined;
  
  // Map API fields to component-expected fields
  realtime.device_id = deviceId;
  realtime.last_update = realtime.last_reading_time || realtime.last_online;
  realtime.level_air = tmatValue; // TMAT value represents water level
  realtime.temperatur_tanah = suhuValue; // Temperature
  realtime.daya_hantar_listrik = phValue; // pH as electrical conductivity for now

  // Get location from device first, then site, default to 0,0
  // API returns lat/lng as strings, convert to numbers
  const lat = parseFloat(String(device?.latitude ?? site?.latitude ?? 0));
  const lng = parseFloat(String(device?.longitude ?? site?.longitude ?? 0));
  
  // Store lat/lng in realtime object for component access
  realtime.lat = lat;
  realtime.lng = lng;
  
  // Convert level_air to waterLevel (API returns negative values for TMAT)
  const waterLevel = Math.abs(realtime.level_air ?? 0);
  
  // Generate a numeric ID from device_id
  const numericId = parseInt(deviceId.replace(/\D/g, '')) || Math.floor(Math.random() * 10000);
  
  return {
    id: numericId,
    deviceId: deviceId,
    lat,
    lng,
    waterLevel,
    status: getStatusFromWaterLevel(waterLevel),
    lastUpdated: realtime.last_update ? new Date(realtime.last_update) : new Date(),
    rainfall: realtime.curah_hujan,
    soilMoisture: realtime.kelembapan_tanah,
    soilTemperature: realtime.temperatur_tanah,
    electricalConductivity: realtime.daya_hantar_listrik,
    batteryLevel: batteryVoltageToPercentage(realtime.battery_voltage),
    sensorType: realtime.tipe_alat || device?.tipe_alat || 'TMAT Logger',
  };
}

/**
 * Adapts an array of RealtimeSummary to SensorDataPoint[]
 * Maps devices and sites for location data
 */
export function adaptRealtimeArrayToSensors(
  realtimes: RealtimeSummary[],
  devices?: Device[],
  sites?: Site[]
): SensorDataPoint[] {
  console.log('[dataAdapter] Starting adaptation...');
  console.log('[dataAdapter] Input counts:', {
    realtimes: realtimes?.length || 0,
    devices: devices?.length || 0,
    sites: sites?.length || 0
  });

  const adapted = realtimes
    .map((realtime, index) => {
      const device = devices?.find(d => d.device_id_unik === realtime.device_id);
      const site = sites?.find(s => String(s.id) === String(realtime.id_site));
      console.log("DATAAA", sites, devices)
      
      console.log(`[dataAdapter] Processing #${index}: device_id=${realtime.device_id}, found_device=${!!device}, found_site=${!!site}`);
      if (device) {
        console.log(`[dataAdapter] Device location: lat=${device.latitude}, lng=${device.longitude}`);
      }
      
      const sensor = adaptRealtimeToSensor(realtime, device, site);
      
      if (!sensor) {
        console.warn(`[dataAdapter] Skipped realtime record #${index} - returned null`);
      }
      
      return sensor;
    })
    .filter((sensor): sensor is SensorDataPoint => sensor !== null); // Filter out null values

  console.log('[dataAdapter] Adaptation complete:', {
    input: realtimes?.length || 0,
    output: adapted.length,
    filtered: (realtimes?.length || 0) - adapted.length
  });

  return adapted;
}

/**
 * Adapts Device to partial SensorDataPoint (without realtime data)
 */
export function adaptDeviceToSensor(device: Device, site?: Site): Partial<SensorDataPoint> {
  const lat = parseFloat(String(device.latitude ?? site?.latitude ?? 0));
  const lng = parseFloat(String(device.longitude ?? site?.longitude ?? 0));
  
  return {
    id: typeof device.id === 'string' ? parseInt(device.id) : device.id,
    deviceId: device.device_id_unik,
    lat,
    lng,
    sensorType: device.tipe_alat || 'Unknown',
    // Other fields will be undefined until realtime data is available
  };
}
