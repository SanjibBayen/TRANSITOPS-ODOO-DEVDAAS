import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportVehiclesCSV = useCallback(async () => {
    try {
      window.open(`${api.defaults.baseURL}/analytics/export/vehicles/csv`, '_blank');
      toast.success('Vehicle CSV exported');
    } catch {
      toast.error('Export failed');
    }
  }, []);

  const exportVehiclesPDF = useCallback(() => {
    window.open(`${api.defaults.baseURL}/analytics/export/vehicles/pdf`, '_blank');
    toast.success('Vehicle PDF exported');
  }, []);

  const exportTripsCSV = useCallback(async () => {
    try {
      window.open(`${api.defaults.baseURL}/analytics/export/trips/csv`, '_blank');
      toast.success('Trip CSV exported');
    } catch {
      toast.error('Export failed');
    }
  }, []);

  const exportTripsPDF = useCallback(() => {
    window.open(`${api.defaults.baseURL}/analytics/export/trips/pdf`, '_blank');
    toast.success('Trip PDF exported');
  }, []);

  const exportData = useCallback(async (type: 'vehicles' | 'trips', format: 'csv' | 'pdf') => {
    setIsExporting(true);
    try {
      if (type === 'vehicles' && format === 'csv') await exportVehiclesCSV();
      else if (type === 'vehicles' && format === 'pdf') exportVehiclesPDF();
      else if (type === 'trips' && format === 'csv') await exportTripsCSV();
      else if (type === 'trips' && format === 'pdf') exportTripsPDF();
    } finally {
      setIsExporting(false);
    }
  }, [exportVehiclesCSV, exportVehiclesPDF, exportTripsCSV, exportTripsPDF]);

  return {
    isExporting,
    exportData,
    exportVehiclesCSV,
    exportVehiclesPDF,
    exportTripsCSV,
    exportTripsPDF,
  };
};