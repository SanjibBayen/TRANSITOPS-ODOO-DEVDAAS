import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { fetchDrivers, createDriver, updateDriver, deleteDriver, setDriverStatusAPI, setDriverAttendance, Driver } from '../store/slices/driverSlice.ts';
import { toast } from 'sonner';

export const useDrivers = () => {
  const dispatch = useDispatch<any>();
  const { drivers, isLoading, error } = useSelector((state: RootState) => state.drivers);

  const loadDrivers = async () => {
    try {
      await dispatch(fetchDrivers()).unwrap();
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch drivers');
    }
  };

  const createNewDriver = async (driver: any) => {
    try {
      await dispatch(createDriver(driver)).unwrap();
      toast.success('Driver created successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create driver');
    }
  };

  const editDriver = async (driver: any) => {
    try {
      await dispatch(updateDriver({ id: driver.id, data: driver })).unwrap();
      toast.success('Driver updated successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update driver');
    }
  };

  const removeDriver = (id: string) => {
    dispatch(deleteDriver(id));
    toast.success('Driver removed locally');
  };

  const changeDriverStatus = async (id: string, status: Driver['status']) => {
    try {
      await dispatch(setDriverStatusAPI({ id, status })).unwrap();
      toast.success('Status updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  const changeDriverAttendance = (id: string, status: Driver['attendanceStatus']) => {
    dispatch(setDriverAttendance({ id, status }));
  };

  const totalDrivers = drivers.length;
  const onDutyCount = drivers.filter(d => d.status === 'On Trip' || d.status === 'Available' || d.status === 'ON_TRIP' || d.status === 'AVAILABLE').length;
  const availableDriversCount = drivers.filter(d => d.status === 'Available' || d.status === 'AVAILABLE').length;

  return {
    drivers,
    isLoading,
    error,
    loadDrivers,
    createNewDriver,
    editDriver,
    removeDriver,
    changeDriverStatus,
    changeDriverAttendance,
    metrics: {
      totalDrivers,
      onDutyCount,
      availableDriversCount
    }
  };
};
