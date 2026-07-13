import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useMaintenance = () => {
  const [maintenances, setMaintenances] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMaintenance = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/maintenance');
      setMaintenances(response.data.data || []);
    } catch (err: any) {
      toast.error('Failed to load maintenance records');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMaintenance = useCallback(async (data: any) => {
    try {
      const response = await api.post('/maintenance', data);
      toast.success('Maintenance record created');
      await loadMaintenance();
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create maintenance');
      throw err;
    }
  }, [loadMaintenance]);

  const completeMaintenance = useCallback(async (id: string) => {
    try {
      await api.patch(`/maintenance/${id}/complete`);
      toast.success('Maintenance completed');
      await loadMaintenance();
    } catch (err: any) {
      toast.error('Failed to complete maintenance');
    }
  }, [loadMaintenance]);

  return {
    maintenances,
    isLoading,
    loadMaintenance,
    createMaintenance,
    completeMaintenance,
  };
};