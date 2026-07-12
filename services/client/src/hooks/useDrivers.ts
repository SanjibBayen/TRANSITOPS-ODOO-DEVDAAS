import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export interface Driver {
  id: string;
  name: string;
  email?: string;
  phone: string;
  license_number: string;
  license_category: string;
  license_expiry: string;
  safety_score: number;
  total_trips: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'SUSPENDED';
  created_at: string;
}

export const useDrivers = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDrivers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/drivers');
      setDrivers(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load drivers';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDriver = useCallback(async (data: Partial<Driver>) => {
    try {
      const response = await api.post('/drivers', data);
      setDrivers(prev => [...prev, response.data.data]);
      toast.success('Driver created successfully');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create driver');
      throw err;
    }
  }, []);

  const updateDriver = useCallback(async (id: string, data: Partial<Driver>) => {
    try {
      const response = await api.put(`/drivers/${id}`, data);
      setDrivers(prev => prev.map(d => d.id === id ? response.data.data : d));
      toast.success('Driver updated successfully');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update driver');
      throw err;
    }
  }, []);

  const updateDriverStatus = useCallback(async (id: string, status: Driver['status']) => {
    try {
      const response = await api.patch(`/drivers/${id}/status`, { status });
      setDrivers(prev => prev.map(d => d.id === id ? response.data.data : d));
      toast.success('Status updated');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      throw err;
    }
  }, []);

  const getAvailableDrivers = useCallback(async () => {
    try {
      const response = await api.get('/drivers/available');
      return response.data.data || [];
    } catch {
      return [];
    }
  }, []);

  const getExpiringLicenses = useCallback(async () => {
    try {
      const response = await api.get('/drivers/expiring-licenses');
      return response.data.data || [];
    } catch {
      return [];
    }
  }, []);

  const metrics = {
    total: drivers.length,
    available: drivers.filter(d => d.status === 'AVAILABLE').length,
    onTrip: drivers.filter(d => d.status === 'ON_TRIP').length,
    offDuty: drivers.filter(d => d.status === 'OFF_DUTY').length,
    suspended: drivers.filter(d => d.status === 'SUSPENDED').length,
  };

  return {
    drivers,
    isLoading,
    error,
    metrics,
    loadDrivers,
    createDriver,
    updateDriver,
    updateDriverStatus,
    getAvailableDrivers,
    getExpiringLicenses,
  };
};