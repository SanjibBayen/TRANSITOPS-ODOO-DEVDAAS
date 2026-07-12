import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { fetchVehicles, createVehicle, updateVehicle, deleteVehicle, setVehicleStatusAPI, updateOdometer, Vehicle } from '../store/slices/vehicleSlice.ts';
import { toast } from 'sonner';

export const useVehicles = () => {
  const dispatch = useDispatch<any>();
  const { vehicles, isLoading, error } = useSelector((state: RootState) => state.vehicles);

  const loadVehicles = async () => {
    try {
      await dispatch(fetchVehicles()).unwrap();
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch vehicles');
    }
  };

  const createNewVehicle = async (vehicle: any) => {
    try {
      await dispatch(createVehicle(vehicle)).unwrap();
      toast.success('Vehicle created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create vehicle');
    }
  };

  const editVehicle = async (vehicle: any) => {
    try {
      await dispatch(updateVehicle({ id: vehicle.id || vehicle.regNo, data: vehicle })).unwrap();
      toast.success('Vehicle updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update vehicle');
    }
  };

  const removeVehicle = async (regNo: string) => {
    // There is no DELETE API in requirements, but slice supports filter.
    dispatch(deleteVehicle(regNo));
    toast.success('Vehicle deleted locally');
  };

  const changeVehicleStatus = async (id: string, status: Vehicle['status']) => {
    try {
      await dispatch(setVehicleStatusAPI({ id, status })).unwrap();
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const addOdometerReading = (regNo: string, distance: number) => {
    dispatch(updateOdometer({ regNo, distance }));
  };

  // Compute live metrics dynamically!
  const totalAssets = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const inShopCount = vehicles.filter(v => v.status === 'In Shop').length;
  const activeCount = vehicles.filter(v => v.status === 'On Trip' || v.status === 'ON_TRIP').length;
  const retiredCount = vehicles.filter(v => v.status === 'Retired').length;

  return {
    vehicles,
    isLoading,
    error,
    loadVehicles,
    createNewVehicle,
    editVehicle,
    removeVehicle,
    changeVehicleStatus,
    addOdometerReading,
    metrics: {
      totalAssets,
      availableCount,
      inShopCount,
      activeCount,
      retiredCount
    }
  };
};
