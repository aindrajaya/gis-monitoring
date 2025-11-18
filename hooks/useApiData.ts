import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/api';
import type { Company, Site, Device, RealtimeSummary } from '../types';

interface UseApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching and caching company data
 */
export function useCompanies(): UseApiDataResult<Company[]> {
  const [data, setData] = useState<Company[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getAllCompanies();
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch companies');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch companies:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching company by ID
 */
export function useCompany(id: number | null): UseApiDataResult<Company> {
  const [data, setData] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCompanyById(id);
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch company');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch company:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching sites (optionally filtered by company)
 */
export function useSites(id_perusahaan?: number | null): UseApiDataResult<Site[]> {
  const [data, setData] = useState<Site[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getAllSites(id_perusahaan ?? undefined);
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch sites');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch sites:', err);
    } finally {
      setLoading(false);
    }
  }, [id_perusahaan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching site by ID
 */
export function useSite(id: number | null): UseApiDataResult<Site> {
  const [data, setData] = useState<Site | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getSiteById(id);
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch site');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch site:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching devices
 */
export function useDevices(): UseApiDataResult<Device[]> {
  const [data, setData] = useState<Device[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getAllDevices();
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch devices');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching device by ID
 */
export function useDevice(device_id: string | null): UseApiDataResult<Device> {
  const [data, setData] = useState<Device | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!device_id) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getDeviceById(device_id);
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch device');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch device:', err);
    } finally {
      setLoading(false);
    }
  }, [device_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

/**
 * Hook for fetching realtime summary data
 */
export function useRealtimeData(id_perusahaan?: number | null): UseApiDataResult<RealtimeSummary[]> {
  const [data, setData] = useState<RealtimeSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getRealtimeAll(id_perusahaan ?? undefined);
      if (response.status) {
        setData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch realtime data');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to fetch realtime data:', err);
    } finally {
      setLoading(false);
    }
  }, [id_perusahaan]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
