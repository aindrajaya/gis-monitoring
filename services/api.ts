import type { ApiResponse, Company, Site, Device, RealtimeSummary, RealtimePoint } from '../types';

// During local dev, use the Vite proxy (`/api`) to avoid CORS.
// In production builds we hit the real base URL.
const BASE_URL = import.meta.env.DEV ? '/api' : (import.meta.env.VITE_API_BASE_URL || '');
const API_KEY = import.meta.env.VITE_API_KEY || '';

class ApiClient {
  private headers: HeadersInit = {
    'X-API-KEY': API_KEY,
    'Content-Type': 'application/json',
  };

  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Company (Perusahaan) endpoints
  async getAllCompanies(): Promise<ApiResponse<Company[]>> {
    return this.request<Company[]>('/perusahaan');
  }

  async getCompanyById(id: number): Promise<ApiResponse<Company>> {
    return this.request<Company>(`/perusahaan?id=${id}`);
  }

  // Site endpoints
  async getAllSites(id_perusahaan?: number): Promise<ApiResponse<Site[]>> {
    const query = id_perusahaan ? `?id_perusahaan=${id_perusahaan}` : '';
    return this.request<Site[]>(`/site${query}`);
  }

  async getSiteById(id: number): Promise<ApiResponse<Site>> {
    return this.request<Site>(`/site?id=${id}`);
  }

  // Device endpoints
  async getAllDevices(): Promise<ApiResponse<Device[]>> {
    return this.request<Device[]>('/device');
  }

  async getDeviceById(device_id: string): Promise<ApiResponse<Device>> {
    return this.request<Device>(`/device?device_id=${device_id}`);
  }

  // Realtime data endpoints
  async getRealtimeAll(id_perusahaan?: number): Promise<ApiResponse<RealtimeSummary[]>> {
    const query = id_perusahaan ? `?id_perusahaan=${id_perusahaan}` : '';
    return this.request<RealtimeSummary[]>(`/realtime_all${query}`);
  }

  async getRealtimeDevice(
    device_id: string,
    start_date: string,
    end_date: string,
    limit: number = 100
  ): Promise<ApiResponse<RealtimePoint[]>> {
    const params = new URLSearchParams({
      device_id,
      start_date,
      end_date,
      limit: limit.toString(),
    });
    return this.request<RealtimePoint[]>(`/realtime_device?${params.toString()}`);
  }
}

export const apiClient = new ApiClient();
