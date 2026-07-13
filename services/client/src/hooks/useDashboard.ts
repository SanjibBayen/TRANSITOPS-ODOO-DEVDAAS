import { useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

interface DashboardData {
  vehicles: { total: number; active: number; available: number; onTrip: number; inShop: number; utilization: number };
  drivers: { total: number; available: number; onTrip: number; offDuty: number; suspended: number };
  trips: { total: number; active: number; pending: number; completed: number };
  alerts: { expiringLicenses: number };
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/analytics/dashboard');
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadDashboard, 30000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  return {
    data,
    isLoading,
    error,
    refresh: loadDashboard,
  };
};