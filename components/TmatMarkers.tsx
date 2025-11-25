import React from 'react';
import L from 'leaflet';
import { ProcessedWaterLevelData, WATER_LEVEL_THRESHOLDS } from '../hooks/useJsonData';

export interface MarkerStyleConfig {
  color: string;
  fillColor: string;
  fillOpacity: number;
  radius: number;
  weight: number;
  className?: string;
}

export interface TmatMarkerOptions extends L.CircleMarkerOptions {
  device: ProcessedWaterLevelData;
  showLabels?: boolean;
  markerSize?: 'small' | 'medium' | 'large';
}

// TMAT marker styles based on SiPPEG risk thresholds
export const TMAT_MARKER_STYLES: Record<string, MarkerStyleConfig> = {
  // Blue: Flooded (Tergenang) - Very Good Condition
  blue: {
    color: '#1e40af',        // Blue border
    fillColor: '#3b82f6',    // Blue fill
    fillOpacity: 0.8,
    radius: 8,
    weight: 2,
    className: 'tmat-marker-flooded'
  },
  
  // Green: Safe (Aman) - Good Condition
  green: {
    color: '#15803d',        // Green border
    fillColor: '#22c55e',    // Green fill
    fillOpacity: 0.8,
    radius: 8,
    weight: 2,
    className: 'tmat-marker-safe'
  },
  
  // Yellow: Warning (Waspada) - Caution Required
  yellow: {
    color: '#ca8a04',        // Yellow border
    fillColor: '#eab308',    // Yellow fill
    fillOpacity: 0.8,
    radius: 8,
    weight: 2,
    className: 'tmat-marker-warning'
  },
  
  // Red: Danger (Bahaya) - Critical Condition
  red: {
    color: '#dc2626',        // Red border
    fillColor: '#ef4444',    // Red fill
    fillOpacity: 0.8,
    radius: 8,
    weight: 2,
    className: 'tmat-marker-danger'
  },
  
  // Gray: No Data or Error
  gray: {
    color: '#6b7280',        // Gray border
    fillColor: '#9ca3af',    // Gray fill
    fillOpacity: 0.5,
    radius: 6,
    weight: 1,
    className: 'tmat-marker-nodata'
  }
};

// Size variants for different zoom levels or importance
export const MARKER_SIZES = {
  small: { radius: 6, weight: 1 },
  medium: { radius: 8, weight: 2 },
  large: { radius: 12, weight: 3 }
};

/**
 * Get marker style based on water level and SiPPEG thresholds
 */
export const getTmatMarkerStyle = (
  waterLevel: number | null, 
  size: 'small' | 'medium' | 'large' = 'medium'
): MarkerStyleConfig => {
  if (waterLevel === null || waterLevel === undefined) {
    return { 
      ...TMAT_MARKER_STYLES.gray, 
      ...MARKER_SIZES[size] 
    };
  }

  let baseStyle: MarkerStyleConfig;

  if (waterLevel < WATER_LEVEL_THRESHOLDS.green.min) {
    // Below 0.0m - Flooded (Tergenang) - Blue
    baseStyle = TMAT_MARKER_STYLES.blue;
  } else if (waterLevel >= WATER_LEVEL_THRESHOLDS.green.min && waterLevel < WATER_LEVEL_THRESHOLDS.yellow.min) {
    // 0.0m to 0.4m - Safe (Aman) - Green
    baseStyle = TMAT_MARKER_STYLES.green;
  } else if (waterLevel >= WATER_LEVEL_THRESHOLDS.yellow.min && waterLevel < WATER_LEVEL_THRESHOLDS.red.min) {
    // 0.4m to 0.8m - Warning (Waspada) - Yellow
    baseStyle = TMAT_MARKER_STYLES.yellow;
  } else {
    // Above 0.8m - Danger (Bahaya) - Red
    baseStyle = TMAT_MARKER_STYLES.red;
  }

  return {
    ...baseStyle,
    ...MARKER_SIZES[size]
  };
};

/**
 * Generate popup content for TMAT device markers
 */
export const createTmatPopupContent = (device: ProcessedWaterLevelData): string => {
  const lastReading = device.lastReading;
  const waterLevel = device.waterLevel;
  const riskLevel = device.riskLevel;
  
  // Risk level styling
  const riskColors = {
    'Tergenang': '#3b82f6',   // Blue
    'Aman': '#22c55e',        // Green
    'Waspada': '#eab308',     // Yellow
    'Bahaya': '#ef4444'       // Red
  };

  const riskColor = riskColors[riskLevel as keyof typeof riskColors] || '#6b7280';

  return `
    <div class="tmat-popup" style="min-width: 280px; font-family: system-ui, sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 12px 16px; margin: -10px -15px 15px -15px; border-radius: 6px 6px 0 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 18px;">📡</span>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${device.deviceId}</h3>
        </div>
        <p style="margin: 0; font-size: 12px; opacity: 0.9;">TMAT Logger V3 - Water Level Monitoring</p>
      </div>

      <!-- Location Information -->
      <div style="margin-bottom: 15px;">
        <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
          <span style="font-size: 14px;">📍</span>
          <strong style="font-size: 14px; color: #374151;">${device.siteName}</strong>
        </div>
        <div style="font-size: 12px; color: #6b7280; margin-left: 20px;">
          Block: ${device.block || 'N/A'} | Company: ${device.companyName}
        </div>
      </div>

      <!-- Current Status -->
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid ${riskColor};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 14px; font-weight: 600; color: #374151;">Current Water Level</span>
          <span style="background: ${riskColor}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
            ${riskLevel.toUpperCase()}
          </span>
        </div>
        
        <div style="font-size: 24px; font-weight: 700; color: #1f2937; font-family: 'Courier New', monospace;">
          ${waterLevel !== null ? waterLevel.toFixed(2) + 'm' : 'No Data'}
        </div>
        
        ${waterLevel !== null ? `
          <div style="font-size: 11px; color: #6b7280; margin-top: 4px;">
            ${waterLevel < 0 ? 'Below ground level' : 'Above ground level'}
          </div>
        ` : ''}
      </div>

      <!-- Sensor Readings -->
      ${lastReading ? `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
          <div style="text-align: center; background: #fef3c7; padding: 8px; border-radius: 4px;">
            <div style="font-size: 12px; color: #92400e; font-weight: 600;">TEMPERATURE</div>
            <div style="font-size: 16px; font-weight: 700; color: #d97706;">${lastReading.temperature.toFixed(1)}°C</div>
          </div>
          
          <div style="text-align: center; background: #ddd6fe; padding: 8px; border-radius: 4px;">
            <div style="font-size: 12px; color: #5b21b6; font-weight: 600;">pH LEVEL</div>
            <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">${lastReading.ph.toFixed(1)}</div>
          </div>
        </div>
      ` : ''}

      <!-- Last Update -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 11px; color: #6b7280;">
        <div style="display: flex; justify-content: space-between;">
          <span>📅 Last Update:</span>
          <span style="font-family: 'Courier New', monospace;">
            ${lastReading ? new Date(lastReading.timestamp).toLocaleString('id-ID', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'No data available'}
          </span>
        </div>
      </div>

      <!-- SiPPEG Threshold Reference -->
      <div style="margin-top: 12px; padding: 8px; background: #f1f5f9; border-radius: 4px; border: 1px solid #e2e8f0;">
        <div style="font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 4px;">📊 SiPPEG Thresholds:</div>
        <div style="font-size: 10px; color: #64748b; line-height: 1.3;">
          <span style="color: #3b82f6;">■</span> Flooded: <0.0m |
          <span style="color: #22c55e;">■</span> Safe: 0.0-0.4m |
          <span style="color: #eab308;">■</span> Warning: 0.4-0.8m |
          <span style="color: #ef4444;">■</span> Danger: >0.8m
        </div>
      </div>
    </div>
  `;
};

/**
 * Create tooltip content for quick device information
 */
export const createTmatTooltipContent = (device: ProcessedWaterLevelData): string => {
  return `
    <div style="font-family: system-ui, sans-serif; text-align: center;">
      <div style="font-weight: 600; color: #374151; margin-bottom: 2px;">${device.deviceId}</div>
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">${device.siteName}</div>
      <div style="font-size: 14px; font-weight: 700; color: #1f2937;">
        ${device.waterLevel !== null ? device.waterLevel.toFixed(2) + 'm' : 'No Data'}
      </div>
      <div style="font-size: 11px; color: #64748b;">${device.riskLevel}</div>
    </div>
  `;
};

/**
 * CSS classes for marker animations and styling
 */
export const TMAT_MARKER_CSS = `
  .tmat-marker-flooded {
    animation: tmat-pulse-blue 2s infinite;
  }
  
  .tmat-marker-safe {
    animation: tmat-pulse-green 2s infinite;
  }
  
  .tmat-marker-warning {
    animation: tmat-pulse-yellow 2s infinite;
  }
  
  .tmat-marker-danger {
    animation: tmat-pulse-red 2s infinite;
  }
  
  .tmat-marker-nodata {
    opacity: 0.6;
  }

  @keyframes tmat-pulse-blue {
    0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  }

  @keyframes tmat-pulse-green {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  }

  @keyframes tmat-pulse-yellow {
    0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
  }

  @keyframes tmat-pulse-red {
    0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
    50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  }

  .tmat-popup .leaflet-popup-content-wrapper {
    padding: 0;
  }
  
  .tmat-popup .leaflet-popup-content {
    margin: 10px 15px;
  }
`;

/**
 * Helper to inject TMAT marker CSS into document
 */
export const injectTmatMarkerCSS = (): void => {
  const styleId = 'tmat-marker-styles';
  
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = TMAT_MARKER_CSS;
    document.head.appendChild(style);
  }
};

export default {
  getTmatMarkerStyle,
  createTmatPopupContent,
  createTmatTooltipContent,
  injectTmatMarkerCSS,
  TMAT_MARKER_STYLES,
  MARKER_SIZES
};