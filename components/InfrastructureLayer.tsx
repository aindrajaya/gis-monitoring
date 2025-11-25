import React, { useMemo } from 'react';
import L from 'leaflet';
import { ProcessedWaterLevelData } from '../hooks/useJsonData';

export interface InfrastructureFeature {
  id: string;
  type: 'canal' | 'dam' | 'pump' | 'gate' | 'monitoring_station';
  name: string;
  coordinates: [number, number];
  status: 'operational' | 'maintenance' | 'damaged' | 'inactive';
  description?: string;
  relatedDevices?: string[];
  lastInspection?: string;
  properties?: Record<string, any>;
}

export interface CanalBlock {
  id: string;
  name: string;
  coordinates: [number, number][];
  waterLevel: number | null;
  status: 'good' | 'warning' | 'critical' | 'unknown';
  area: number; // hectares
  deviceCount: number;
  averageWaterLevel: number | null;
  managementZone: string;
  infrastructure: InfrastructureFeature[];
}

interface InfrastructureLayerProps {
  waterLevelData: ProcessedWaterLevelData[];
  isVisible: boolean;
  showCanals?: boolean;
  showInfrastructure?: boolean;
  onFeatureClick?: (feature: CanalBlock | InfrastructureFeature) => void;
  className?: string;
}

// Infrastructure icons and styles
export const INFRASTRUCTURE_STYLES = {
  canal: {
    color: '#0ea5e9',
    weight: 3,
    opacity: 0.8,
    fillColor: '#0ea5e9',
    fillOpacity: 0.1,
    dashArray: '5, 10'
  },
  dam: {
    icon: '🚧',
    color: '#7c2d12',
    size: 20,
    className: 'infrastructure-dam'
  },
  pump: {
    icon: '⚙️',
    color: '#1e40af',
    size: 18,
    className: 'infrastructure-pump'
  },
  gate: {
    icon: '🚪',
    color: '#059669',
    size: 16,
    className: 'infrastructure-gate'
  },
  monitoring_station: {
    icon: '📡',
    color: '#7c3aed',
    size: 14,
    className: 'infrastructure-station'
  }
};

export const CANAL_BLOCK_STYLES = {
  good: {
    color: '#22c55e',
    weight: 2,
    opacity: 0.8,
    fillColor: '#22c55e',
    fillOpacity: 0.15,
    dashArray: null
  },
  warning: {
    color: '#eab308',
    weight: 2,
    opacity: 0.8,
    fillColor: '#eab308',
    fillOpacity: 0.2,
    dashArray: '10, 5'
  },
  critical: {
    color: '#ef4444',
    weight: 3,
    opacity: 0.9,
    fillColor: '#ef4444',
    fillOpacity: 0.25,
    dashArray: '5, 5'
  },
  unknown: {
    color: '#6b7280',
    weight: 1,
    opacity: 0.5,
    fillColor: '#6b7280',
    fillOpacity: 0.1,
    dashArray: '15, 10'
  }
};

/**
 * Generate canal blocks from water level data
 */
export const generateCanalBlocks = (data: ProcessedWaterLevelData[]): CanalBlock[] => {
  // Group devices by site/company for block generation
  const siteGroups = data.reduce((groups, device) => {
    const key = `${device.companyName}_${device.siteName}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(device);
    return groups;
  }, {} as Record<string, ProcessedWaterLevelData[]>);

  return Object.entries(siteGroups).map(([key, devices], index) => {
    const [companyName, siteName] = key.split('_');
    
    // Calculate average water level
    const validWaterLevels = devices.filter(d => d.waterLevel !== null).map(d => d.waterLevel!);
    const averageWaterLevel = validWaterLevels.length > 0 
      ? validWaterLevels.reduce((sum, level) => sum + level, 0) / validWaterLevels.length 
      : null;

    // Determine block status based on average water level
    let status: 'good' | 'warning' | 'critical' | 'unknown' = 'unknown';
    if (averageWaterLevel !== null) {
      if (averageWaterLevel >= 0.0 && averageWaterLevel < 0.4) {
        status = 'good';
      } else if (averageWaterLevel >= 0.4 && averageWaterLevel < 0.8) {
        status = 'warning';
      } else if (averageWaterLevel >= 0.8) {
        status = 'critical';
      } else {
        status = 'good'; // Below 0.0m (flooded) is actually good for peat
      }
    }

    // Generate approximate block coordinates (simplified rectangular area)
    const centerLat = devices[0].coordinates?.[0] || -2.5; // Default to Central Kalimantan
    const centerLng = devices[0].coordinates?.[1] || 113.5;
    const blockSize = 0.01; // Approximately 1km x 1km block
    
    const coordinates: [number, number][] = [
      [centerLat - blockSize, centerLng - blockSize],
      [centerLat - blockSize, centerLng + blockSize],
      [centerLat + blockSize, centerLng + blockSize],
      [centerLat + blockSize, centerLng - blockSize],
      [centerLat - blockSize, centerLng - blockSize] // Close the polygon
    ];

    // Generate infrastructure features for this block
    const infrastructure: InfrastructureFeature[] = [
      {
        id: `pump_${index}_1`,
        type: 'pump',
        name: `Pump Station ${siteName} A`,
        coordinates: [centerLat + 0.002, centerLng - 0.003],
        status: Math.random() > 0.8 ? 'maintenance' : 'operational',
        description: 'Primary water pump for block drainage control',
        relatedDevices: devices.slice(0, 2).map(d => d.deviceId),
        lastInspection: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      },
      {
        id: `gate_${index}_1`,
        type: 'gate',
        name: `Water Gate ${siteName} B`,
        coordinates: [centerLat - 0.004, centerLng + 0.002],
        status: Math.random() > 0.9 ? 'damaged' : 'operational',
        description: 'Water level control gate for canal management',
        relatedDevices: devices.slice(1, 3).map(d => d.deviceId),
        lastInspection: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    ];

    // Add dam if this is a larger block
    if (devices.length > 5) {
      infrastructure.push({
        id: `dam_${index}_1`,
        type: 'dam',
        name: `Dam ${siteName}`,
        coordinates: [centerLat + 0.005, centerLng + 0.004],
        status: 'operational',
        description: 'Main water retention structure for area management',
        relatedDevices: devices.map(d => d.deviceId),
        lastInspection: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }

    return {
      id: `block_${index}`,
      name: `${siteName} Management Block`,
      coordinates,
      waterLevel: averageWaterLevel,
      status,
      area: Math.round((devices.length * 2.5 + Math.random() * 5) * 10) / 10, // Estimated hectares
      deviceCount: devices.length,
      averageWaterLevel,
      managementZone: companyName,
      infrastructure
    };
  });
};

/**
 * Generate popup content for canal blocks
 */
export const createCanalBlockPopupContent = (block: CanalBlock): string => {
  const statusColors = {
    good: '#22c55e',
    warning: '#eab308', 
    critical: '#ef4444',
    unknown: '#6b7280'
  };

  const statusLabels = {
    good: 'BAIK',
    warning: 'WASPADA',
    critical: 'KRITIS',
    unknown: 'TIDAK DIKETAHUI'
  };

  const statusColor = statusColors[block.status];
  const statusLabel = statusLabels[block.status];

  return `
    <div class="canal-block-popup" style="min-width: 320px; font-family: system-ui, sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; padding: 14px 18px; margin: -10px -15px 16px -15px; border-radius: 6px 6px 0 0;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
          <span style="font-size: 20px;">🏞️</span>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600;">${block.name}</h3>
        </div>
        <p style="margin: 0; font-size: 13px; opacity: 0.9;">Canal Block Management Unit</p>
      </div>

      <!-- Block Status -->
      <div style="background: #f8fafc; padding: 14px; border-radius: 8px; margin-bottom: 16px; border-left: 5px solid ${statusColor};">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span style="font-size: 15px; font-weight: 600; color: #374151;">Block Status</span>
          <span style="background: ${statusColor}; color: white; padding: 3px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">
            ${statusLabel}
          </span>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <div style="font-size: 12px; color: #6b7280; font-weight: 500;">Average Water Level</div>
            <div style="font-size: 20px; font-weight: 700; color: #1f2937; font-family: 'Courier New', monospace;">
              ${block.averageWaterLevel !== null ? block.averageWaterLevel.toFixed(2) + 'm' : 'No Data'}
            </div>
          </div>
          
          <div>
            <div style="font-size: 12px; color: #6b7280; font-weight: 500;">Management Zone</div>
            <div style="font-size: 14px; font-weight: 600; color: #374151;">
              ${block.managementZone}
            </div>
          </div>
        </div>
      </div>

      <!-- Block Information -->
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 16px;">
        <div style="text-align: center; background: #fef3c7; padding: 10px 8px; border-radius: 6px;">
          <div style="font-size: 12px; color: #92400e; font-weight: 600;">AREA</div>
          <div style="font-size: 16px; font-weight: 700; color: #d97706;">${block.area}ha</div>
        </div>
        
        <div style="text-align: center; background: #ddd6fe; padding: 10px 8px; border-radius: 6px;">
          <div style="font-size: 12px; color: #5b21b6; font-weight: 600;">DEVICES</div>
          <div style="font-size: 16px; font-weight: 700; color: #7c3aed;">${block.deviceCount}</div>
        </div>

        <div style="text-align: center; background: #d1fae5; padding: 10px 8px; border-radius: 6px;">
          <div style="font-size: 12px; color: #065f46; font-weight: 600;">INFRASTRUCTURE</div>
          <div style="font-size: 16px; font-weight: 700; color: #059669;">${block.infrastructure.length}</div>
        </div>
      </div>

      <!-- Infrastructure List -->
      <div style="margin-bottom: 16px;">
        <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 8px;">🏗️ Infrastructure Features</h4>
        <div style="space-y: 6px;">
          ${block.infrastructure.map(infra => `
            <div style="display: flex; justify-content: between; align-items: center; background: #f9fafb; padding: 8px 10px; border-radius: 4px; margin-bottom: 4px;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 14px;">${INFRASTRUCTURE_STYLES[infra.type]?.icon || '⚙️'}</span>
                  <span style="font-size: 13px; font-weight: 500; color: #374151;">${infra.name}</span>
                </div>
                <div style="font-size: 11px; color: #6b7280; margin-left: 20px;">
                  ${infra.description || 'No description available'}
                </div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 10px; padding: 2px 6px; border-radius: 10px; ${
                  infra.status === 'operational' ? 'background: #dcfce7; color: #166534;' :
                  infra.status === 'maintenance' ? 'background: #fef3c7; color: #92400e;' :
                  infra.status === 'damaged' ? 'background: #fecaca; color: #991b1b;' :
                  'background: #f3f4f6; color: #374151;'
                }">
                  ${infra.status.toUpperCase()}
                </div>
                ${infra.lastInspection ? `
                  <div style="font-size: 9px; color: #9ca3af; margin-top: 2px;">
                    Last: ${new Date(infra.lastInspection).toLocaleDateString('id-ID')}
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Management Guidelines -->
      <div style="border-top: 1px solid #e5e7eb; padding-top: 12px; font-size: 11px; color: #6b7280;">
        <div style="font-weight: 600; color: #374151; margin-bottom: 6px;">📋 Management Guidelines:</div>
        ${block.averageWaterLevel !== null ? `
          ${block.averageWaterLevel < 0 ? 
            '• Water level below ground - Maintain flooded condition for peat preservation' :
            block.averageWaterLevel < 0.4 ? 
              '• Optimal water level range - Continue current management practices' :
              block.averageWaterLevel < 0.8 ?
                '• Water level rising - Consider drainage system activation' :
                '• Critical water level - Immediate drainage intervention required'
          }
        ` : '• No water level data - Verify monitoring equipment functionality'}
      </div>
    </div>
  `;
};

/**
 * Generate popup content for infrastructure features
 */
export const createInfrastructurePopupContent = (feature: InfrastructureFeature): string => {
  const statusColors = {
    operational: '#22c55e',
    maintenance: '#eab308',
    damaged: '#ef4444',
    inactive: '#6b7280'
  };

  const statusLabels = {
    operational: 'OPERASIONAL',
    maintenance: 'PEMELIHARAAN',
    damaged: 'RUSAK',
    inactive: 'TIDAK AKTIF'
  };

  const typeLabels = {
    canal: 'Saluran Air',
    dam: 'Bendungan',
    pump: 'Pompa Air',
    gate: 'Pintu Air',
    monitoring_station: 'Stasiun Monitoring'
  };

  const statusColor = statusColors[feature.status];
  const statusLabel = statusLabels[feature.status];
  const typeLabel = typeLabels[feature.type];

  return `
    <div class="infrastructure-popup" style="min-width: 280px; font-family: system-ui, sans-serif;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 12px 16px; margin: -10px -15px 15px -15px; border-radius: 6px 6px 0 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="font-size: 18px;">${INFRASTRUCTURE_STYLES[feature.type]?.icon || '⚙️'}</span>
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${feature.name}</h3>
        </div>
        <p style="margin: 0; font-size: 12px; opacity: 0.9;">${typeLabel}</p>
      </div>

      <!-- Status -->
      <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 15px; border-left: 4px solid ${statusColor};">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 14px; font-weight: 600; color: #374151;">Status</span>
          <span style="background: ${statusColor}; color: white; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">
            ${statusLabel}
          </span>
        </div>
      </div>

      <!-- Description -->
      ${feature.description ? `
        <div style="margin-bottom: 15px;">
          <h4 style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">📝 Description</h4>
          <p style="font-size: 12px; color: #6b7280; line-height: 1.4; margin: 0;">
            ${feature.description}
          </p>
        </div>
      ` : ''}

      <!-- Related Devices -->
      ${feature.relatedDevices && feature.relatedDevices.length > 0 ? `
        <div style="margin-bottom: 15px;">
          <h4 style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">📡 Related Monitoring Devices</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${feature.relatedDevices.map(deviceId => `
              <span style="background: #e0f2fe; color: #0277bd; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: 500;">
                ${deviceId}
              </span>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Last Inspection -->
      ${feature.lastInspection ? `
        <div style="border-top: 1px solid #e5e7eb; padding-top: 10px; font-size: 11px; color: #6b7280;">
          <div style="display: flex; justify-content: space-between;">
            <span>🔍 Last Inspection:</span>
            <span style="font-family: 'Courier New', monospace;">
              ${new Date(feature.lastInspection).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      ` : ''}
    </div>
  `;
};

export const InfrastructureLayer: React.FC<InfrastructureLayerProps> = ({
  waterLevelData,
  isVisible,
  showCanals = true,
  showInfrastructure = true,
  onFeatureClick,
  className = ''
}) => {
  const canalBlocks = useMemo(() => {
    return generateCanalBlocks(waterLevelData);
  }, [waterLevelData]);

  if (!isVisible) return null;

  return (
    <div className={`infrastructure-layer ${className}`}>
      {/* This component would be integrated with the Leaflet map */}
      {/* Canal blocks and infrastructure features would be rendered as map layers */}
      <style>
        {`
          .infrastructure-dam { border-radius: 50%; }
          .infrastructure-pump { animation: infrastructure-rotate 3s linear infinite; }
          .infrastructure-gate { transform: rotate(45deg); }
          .infrastructure-station { animation: infrastructure-pulse 2s infinite; }
          
          @keyframes infrastructure-rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          
          @keyframes infrastructure-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default {
  InfrastructureLayer,
  generateCanalBlocks,
  createCanalBlockPopupContent,
  createInfrastructurePopupContent,
  INFRASTRUCTURE_STYLES,
  CANAL_BLOCK_STYLES
};