import { useState, useEffect } from 'react';

// Enhanced types for JSON data structure
export interface JsonCompany {
  id: number;
  nama_perusahaan: string;
  pic_kontak: string;
  email_kontak: string;
  telepon: string;
  alamat: string;
  status: string;
  created_at: string;
  kode_perusahaan: string;
  jenis_perusahaan: string;
}

export interface JsonSite {
  id: number;
  nama_site: string;
  id_perusahaan: number;
  alamat: string;
  provinsi: string;
  kabupaten: string;
  kota: string;
  latitude: string;
  longitude: string;
  status: string;
  created_at: string;
}

export interface JsonDevice {
  id: number;
  device_id_unik: string;
  id_perusahaan: number;
  id_site: number;
  tipe_alat: string;
  alamat: string | null;
  provinsi: string;
  kabupaten: string;
  kota: string;
  latitude: number;
  longitude: number;
  status: string;
  last_online: string;
  created_at: string;
  kode_titik: string;
  kode_blok: string;
}

export interface JsonRealtime {
  id: number;
  device_id_unik: string;
  timestamp_data: string;
  tmat_value: number; // Water level in meters
  suhu_value: number; // Temperature
  ph_value: number;
  api_key_used: string | null;
}

export interface ProcessedWaterLevelData {
  id: string;
  deviceId: string;
  lat: number;
  lng: number;
  companyName: string;
  siteName: string;
  waterLevel: number; // TMAT value in meters
  temperature: number;
  ph: number;
  lastUpdated: Date;
  status: 'safe' | 'warning' | 'alert' | 'danger' | 'flooded';
  riskLevel: string;
  block: string;
  province: string;
  city: string;
  deviceType: string;
}

export interface JsonDataResponse {
  master_perusahaan: JsonCompany[];
  master_site: JsonSite[];
  master_device: JsonDevice[];
  data_realtime: JsonRealtime[];
}

// Water level risk thresholds based on SiPPEG specification
export const WATER_LEVEL_THRESHOLDS = {
  FLOODED: { min: -Infinity, max: 0.0, color: '#0066CC', label: 'Wet/Flooded' },
  SAFE: { min: 0.0, max: 0.4, color: '#00AA00', label: 'Safe/Compliant' },
  WARNING: { min: 0.4, max: 0.8, color: '#FFAA00', label: 'Warning' },
  DANGER: { min: 0.8, max: Infinity, color: '#FF0000', label: 'Danger/Fire Risk' }
};

const determineWaterLevelStatus = (waterLevel: number): 'safe' | 'warning' | 'alert' | 'danger' | 'flooded' => {
  if (waterLevel < 0.0) return 'flooded'; // Below ground - wet/flooded
  if (waterLevel <= 0.4) return 'safe'; // 0.0-0.4m - safe/compliant
  if (waterLevel <= 0.8) return 'warning'; // 0.4-0.8m - warning
  return 'danger'; // >0.8m - danger/fire risk
};

export const useJsonData = () => {
  const [data, setData] = useState<ProcessedWaterLevelData[]>([]);
  const [rawData, setRawData] = useState<JsonDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processJsonData = (jsonData: JsonDataResponse): ProcessedWaterLevelData[] => {
    const { master_perusahaan, master_site, master_device, data_realtime } = jsonData;

    // Create lookup maps for better performance
    const companyMap = new Map(master_perusahaan.map(c => [c.id, c]));
    const siteMap = new Map(master_site.map(s => [s.id, s]));
    
    // Group realtime data by device_id_unik and get latest reading
    const latestRealtimeMap = new Map<string, JsonRealtime>();
    data_realtime.forEach(rt => {
      const existing = latestRealtimeMap.get(rt.device_id_unik);
      if (!existing || new Date(rt.timestamp_data) > new Date(existing.timestamp_data)) {
        latestRealtimeMap.set(rt.device_id_unik, rt);
      }
    });

    // Process each device with its latest realtime data
    const processed: ProcessedWaterLevelData[] = master_device.map(device => {
      const company = companyMap.get(device.id_perusahaan);
      const site = siteMap.get(device.id_site);
      const realtime = latestRealtimeMap.get(device.device_id_unik);

      const waterLevel = realtime?.tmat_value || 0;
      const status = determineWaterLevelStatus(waterLevel);

      return {
        id: device.device_id_unik,
        deviceId: device.device_id_unik,
        lat: device.latitude,
        lng: device.longitude,
        companyName: company?.nama_perusahaan || 'Unknown Company',
        siteName: site?.nama_site || 'Unknown Site',
        waterLevel: waterLevel,
        temperature: realtime?.suhu_value || 0,
        ph: realtime?.ph_value || 7.0,
        lastUpdated: realtime ? new Date(realtime.timestamp_data) : new Date(device.last_online),
        status,
        riskLevel: Object.values(WATER_LEVEL_THRESHOLDS).find(t => 
          waterLevel >= t.min && waterLevel < t.max
        )?.label || 'Unknown',
        block: device.kode_blok,
        province: device.provinsi,
        city: device.kota,
        deviceType: device.tipe_alat
      };
    });

    return processed;
  };

  useEffect(() => {
    const loadJsonData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load the JSON file from the public directory
        const response = await fetch('/populate_db.json');
        if (!response.ok) {
          throw new Error(`Failed to load JSON data: ${response.status}`);
        }
        
        const jsonData: JsonDataResponse = await response.json();
        setRawData(jsonData);
        
        const processedData = processJsonData(jsonData);
        setData(processedData);
        
        console.log('[useJsonData] Loaded data:', {
          companies: jsonData.master_perusahaan.length,
          sites: jsonData.master_site.length,
          devices: jsonData.master_device.length,
          realtimeRecords: jsonData.data_realtime.length,
          processedDevices: processedData.length
        });

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load JSON data';
        setError(message);
        console.error('[useJsonData] Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJsonData();
  }, []);

  // Helper functions for data analysis
  const getStatistics = () => {
    if (!data.length) return null;

    const statusCounts = data.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgWaterLevel = data.reduce((sum, item) => sum + item.waterLevel, 0) / data.length;
    const avgTemperature = data.reduce((sum, item) => sum + item.temperature, 0) / data.length;
    const avgPH = data.reduce((sum, item) => sum + item.ph, 0) / data.length;

    return {
      total: data.length,
      statusCounts,
      averages: {
        waterLevel: Number(avgWaterLevel.toFixed(3)),
        temperature: Number(avgTemperature.toFixed(1)),
        ph: Number(avgPH.toFixed(2))
      },
      companies: [...new Set(data.map(d => d.companyName))].length,
      sites: [...new Set(data.map(d => d.siteName))].length
    };
  };

  const getDataByPeriod = (year: number, period: string) => {
    // Implementation for biweekly period filtering
    // This would filter data based on the selected period
    return data; // For now, return all data
  };

  const getEmissionRiskData = () => {
    return data.map(item => ({
      ...item,
      emissionRisk: item.waterLevel > 0.8 ? 'high' : item.waterLevel > 0.4 ? 'medium' : 'low',
      co2Reduction: Math.max(0, (0.8 - item.waterLevel) * 10) // Simplified calculation
    }));
  };

  return {
    data,
    rawData,
    loading,
    error,
    statistics: getStatistics(),
    getDataByPeriod,
    getEmissionRiskData,
    thresholds: WATER_LEVEL_THRESHOLDS
  };
};