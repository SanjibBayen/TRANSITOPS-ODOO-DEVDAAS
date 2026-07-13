import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useAnalytics = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [fleetUtilization, setFleetUtilization] = useState<any>(null);
  const [vehicleCosts, setVehicleCosts] = useState<any[]>([]);
  const [vehicleROI, setVehicleROI] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/analytics/dashboard');
      setDashboard(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFleetUtilization = useCallback(async () => {
    try {
      const response = await api.get('/analytics/fleet-utilization');
      setFleetUtilization(response.data.data);
    } catch {
      // Silent fail
    }
  }, []);

  const loadVehicleCosts = useCallback(async () => {
    try {
      const response = await api.get('/analytics/vehicle-costs');
      setVehicleCosts(response.data.data || []);
    } catch {
      // Silent fail
    }
  }, []);

  const loadVehicleROI = useCallback(async () => {
    try {
      const response = await api.get('/analytics/vehicle-roi');
      setVehicleROI(response.data.data || []);
    } catch {
      // Silent fail
    }
  }, []);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      loadDashboard(),
      loadFleetUtilization(),
      loadVehicleROI(),
    ]);
    setIsLoading(false);
  }, [loadDashboard, loadFleetUtilization, loadVehicleROI]);

  return {
    dashboard,
    fleetUtilization,
    vehicleCosts,
    vehicleROI,
    isLoading,
    error,
    loadDashboard,
    loadFleetUtilization,
    loadVehicleCosts,
    loadVehicleROI,
    loadAll,
  };
};