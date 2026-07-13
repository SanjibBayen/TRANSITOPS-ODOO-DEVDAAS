import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useDispatch = () => {
  const [availableResources, setAvailableResources] = useState<any>({
    vehicles: [],
    drivers: [],
    pendingTrips: [],
  });
  const [validation, setValidation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadResources = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dispatch/available-resources');
      setAvailableResources(response.data.data);
    } catch (err: any) {
      toast.error('Failed to load dispatch resources');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateDispatch = useCallback(async (tripId: string, vehicleId: string, driverId: string) => {
    try {
      const response = await api.post('/dispatch/validate', {
        trip_id: tripId,
        vehicle_id: vehicleId,
        driver_id: driverId,
      });
      setValidation(response.data.data);
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Validation failed');
      return null;
    }
  }, []);

  const dispatchTrip = useCallback(async (tripId: string) => {
    try {
      await api.post(`/dispatch/dispatch/${tripId}`);
      toast.success('Trip dispatched successfully');
      setValidation(null);
      await loadResources();
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Dispatch failed');
      return false;
    }
  }, [loadResources]);

  const clearValidation = useCallback(() => {
    setValidation(null);
  }, []);

  return {
    availableResources,
    validation,
    isLoading,
    loadResources,
    validateDispatch,
    dispatchTrip,
    clearValidation,
  };
};