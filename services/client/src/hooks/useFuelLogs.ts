import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useFuelLogs = () => {
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadFuelLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/fuel');
      setFuelLogs(response.data.data || []);
    } catch (err: any) {
      toast.error('Failed to load fuel logs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createFuelLog = useCallback(async (data: any) => {
    try {
      const response = await api.post('/fuel', data);
      toast.success('Fuel log created');
      await loadFuelLogs();
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create fuel log');
      throw err;
    }
  }, [loadFuelLogs]);

  return {
    fuelLogs,
    isLoading,
    loadFuelLogs,
    createFuelLog,
  };
};