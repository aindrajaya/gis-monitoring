import { useState, useEffect } from 'react';
import { MAP_BOUNDS, WATER_LEVEL_THRESHOLDS } from '../constants';
import { SensorStatus } from '../types';
import type { SensorDataPoint } from '../types';

const getStatus = (waterLevel: number): SensorStatus => {
  if (waterLevel <= WATER_LEVEL_THRESHOLDS.SAFE_MAX) {
    return SensorStatus.Safe;
  }
  if (waterLevel <= WATER_LEVEL_THRESHOLDS.WARNING_MAX) {
    return SensorStatus.Warning;
  }
  return SensorStatus.Alert;
};

// Define cluster centers
const CLUSTER_CENTERS = [
    { lat: 1.0, lng: 102.0, status: SensorStatus.Safe },      // West cluster (Safe)
    { lat: 1.05, lng: 102.15, status: SensorStatus.Alert },   // East cluster (Alert)
    { lat: 1.10, lng: 102.05, status: SensorStatus.Warning }, // North cluster (Warning)
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
                waterLevel = Math.random() * WATER_LEVEL_THRESHOLDS.SAFE_MAX;
                break;
            case SensorStatus.Warning:
                waterLevel = WATER_LEVEL_THRESHOLDS.SAFE_MAX + Math.random() * (WATER_LEVEL_THRESHOLDS.WARNING_MAX - WATER_LEVEL_THRESHOLDS.SAFE_MAX);
                break;
            case SensorStatus.Alert:
                waterLevel = WATER_LEVEL_THRESHOLDS.WARNING_MAX + Math.random() * 1.5;
                break;
        }
    } else {
        waterLevel = Math.random() * 5; // 0 to 5 meters
    }

    const batteryLevel = Math.floor(Math.random() * 51) + 50; // 50% to 100%
    const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
    const lastUpdated = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);

    data.push({
      id: i + 1,
      lat,
      lng,
      waterLevel: parseFloat(waterLevel.toFixed(2)),
      status: getStatus(waterLevel),
      lastUpdated,
      sensorType,
      batteryLevel,
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