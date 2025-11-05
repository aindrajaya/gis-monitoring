import { useState, useEffect } from 'react';
import { MAP_BOUNDS, WATER_LEVEL_THRESHOLDS } from '../constants';
import { SensorStatus } from '../types';
import type { SensorDataPoint } from '../types';

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

// Define cluster centers
const CLUSTER_CENTERS = [
    { lat: 1.0, lng: 102.0, status: SensorStatus.Safe },      // West cluster (Safe)
    { lat: 1.05, lng: 102.15, status: SensorStatus.Alert },   // East cluster (Alert)
    { lat: 1.10, lng: 102.05, status: SensorStatus.Warning }, // North cluster (Warning)
    { lat: 1.0, lng: 102.1, status: SensorStatus.Critical }, // South cluster (Critical)
];
const CLUSTER_RADIUS = 0.08;

const generateDummyData = (count: number): SensorDataPoint[] => {
  const data: SensorDataPoint[] = [];
  const [[minLat, minLng], [maxLat, maxLng]] = MAP_BOUNDS;
  const sensorTypes = ['Ultrasonic', 'Pressure', 'Float'];

  for (let i = 0; i < count; i++) {
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);
    
    // Determine which cluster the point is closest to
    let closestCluster = CLUSTER_CENTERS[0];
    let minDistance = Infinity;
    for (const cluster of CLUSTER_CENTERS) {
        const distance = Math.sqrt(Math.pow(lat - cluster.lat, 2) + Math.pow(lng - cluster.lng, 2));
        if (distance < minDistance) {
            minDistance = distance;
            closestCluster = cluster;
        }
    }
    
    let waterLevel;
    // 75% chance of being in the cluster's status, 25% for random
    if (Math.random() < 0.75 && minDistance < CLUSTER_RADIUS) {
        switch(closestCluster.status) {
            case SensorStatus.Safe:
                waterLevel = WATER_LEVEL_THRESHOLDS.SAFE.MIN + Math.random() * (WATER_LEVEL_THRESHOLDS.SAFE.MAX - WATER_LEVEL_THRESHOLDS.SAFE.MIN);
                break;
            case SensorStatus.Warning:
                waterLevel = WATER_LEVEL_THRESHOLDS.WARNING.MIN + Math.random() * (WATER_LEVEL_THRESHOLDS.WARNING.MAX - WATER_LEVEL_THRESHOLDS.WARNING.MIN);
                break;
            case SensorStatus.Alert:
                waterLevel = WATER_LEVEL_THRESHOLDS.ALERT.MIN + Math.random() * (WATER_LEVEL_THRESHOLDS.ALERT.MAX - WATER_LEVEL_THRESHOLDS.ALERT.MIN);
                break;
            case SensorStatus.Critical:
                waterLevel = WATER_LEVEL_THRESHOLDS.CRITICAL.MIN + Math.random() * 2;
                break;
        }
    } else {
        waterLevel = Math.random() * 7; // 0 to 7 meters
    }

  const batteryLevel = Math.floor(Math.random() * 51) + 50; // 50% to 100%
    const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const lastUpdated = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);

  // Additional environmental metrics
  const rainfall = parseFloat((Math.random() * 50).toFixed(2)); // 0 - 50 mm
  const soilMoisture = parseFloat((10 + Math.random() * 80).toFixed(2)); // 10% - 90%
  const soilTemperature = parseFloat((15 + Math.random() * 20).toFixed(2)); // 15°C - 35°C
  const electricalConductivity = parseFloat((50 + Math.random() * 2000).toFixed(2)); // 50 - 2050 µS/cm
  // Device ID (mock) - format similar to exported CSV DeviceId
  const deviceId = `MTI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    data.push({
      id: i + 1,
      deviceId,
      lat,
      lng,
      waterLevel: parseFloat(waterLevel.toFixed(2)),
      status: getStatus(waterLevel),
      lastUpdated,
      sensorType,
      batteryLevel,
      rainfall,
      soilMoisture,
      soilTemperature,
      electricalConductivity,
    });
  }
  return data;
};

export const useSensorData = (count: number): SensorDataPoint[] => {
  const [data, setData] = useState<SensorDataPoint[]>([]);

  useEffect(() => {
    // Increased point count for better visualization of clusters
    setData(generateDummyData(count * 3)); 
  }, [count]);

  return data;
};