import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export interface Vehicle {
  id: string;
  registration_number: string;
  model: string;
  type: string;
  brand?: string;
  year?: number;
  max_load_capacity: number;
  current_odometer: number;
  acquisition_cost: number;
  status: 'AVAILABLE' | 'ON_TRIP' | 'IN_SHOP' | 'RETIRED';
  region?: string;
  fuel_type?: string;
  created_at: string;
}

export const useVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/vehicles');
      setVehicles(response.data.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to load vehicles';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVehicle = useCallback(async (data: Partial<Vehicle>) => {
    try {
      const response = await api.post('/vehicles', data);
      setVehicles(prev => [...prev, response.data.data]);
      toast.success('Vehicle created successfully');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create vehicle');
      throw err;
    }
  }, []);

  const updateVehicle = useCallback(async (id: string, data: Partial<Vehicle>) => {
    try {
      const response = await api.put(`/vehicles/${id}`, data);
      setVehicles(prev => prev.map(v => v.id === id ? response.data.data : v));
      toast.success('Vehicle updated successfully');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update vehicle');
      throw err;
    }
  }, []);

  const updateVehicleStatus = useCallback(async (id: string, status: Vehicle['status']) => {
    try {
      const response = await api.patch(`/vehicles/${id}/status`, { status });
      setVehicles(prev => prev.map(v => v.id === id ? response.data.data : v));
      toast.success('Status updated');
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update status');
      throw err;
    }
  }, []);

  const getAvailableVehicles = useCallback(async () => {
    try {
      const response = await api.get('/vehicles/available');
      return response.data.data || [];
    } catch (err: any) {
      toast.error('Failed to load available vehicles');
      return [];
    }
  }, []);

  const getVehicleStats = useCallback(async () => {
    try {
      const response = await api.get('/vehicles/stats');
      return response.data.data;
    } catch {
      return { total: 0, available: 0, onTrip: 0, inShop: 0, retired: 0 };
    }
  }, []);

  const metrics = {
    total: vehicles.length,
    available: vehicles.filter(v => v.status === 'AVAILABLE').length,
    onTrip: vehicles.filter(v => v.status === 'ON_TRIP').length,
    inShop: vehicles.filter(v => v.status === 'IN_SHOP').length,
    retired: vehicles.filter(v => v.status === 'RETIRED').length,
  };

  return {
    vehicles,
    isLoading,
    error,
    metrics,
    loadVehicles,
    createVehicle,
    updateVehicle,
    updateVehicleStatus,
    getAvailableVehicles,
    getVehicleStats,
  };
};