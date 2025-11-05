
import { SensorStatus } from './types';

// Centered around Desa Dayun, Riau, Indonesia
export const MAP_CENTER: [number, number] = [1.03, 102.04];
export const MAP_ZOOM = 11;
export const MAP_BOUNDS: [[number, number], [number, number]] = [
    [0.9, 101.9], // Southwest corner
    [1.15, 102.2]  // Northeast corner
];

export const STATUS_COLORS: Record<SensorStatus, string> = {
  [SensorStatus.Safe]: '#22c55e',    // green-500
  [SensorStatus.Warning]: '#f59e0b', // amber-500
  [SensorStatus.Alert]: '#ef4444',    // red-500
  [SensorStatus.Critical]: '#8b0000', // darkred
};

export const WATER_LEVEL_THRESHOLDS = {
    SAFE: { MIN: 0, MAX: 2 },
    WARNING: { MIN: 2, MAX: 3.5 },
    ALERT: { MIN: 3.5, MAX: 5 },
    CRITICAL: { MIN: 5, MAX: 10 },
};
