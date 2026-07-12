import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/index.ts';
import { fetchTrips, createTrip, updateTripStatusAPI, completeTripAPI, deleteTrip, Trip } from '../store/slices/tripSlice.ts';
import { toast } from 'sonner';

export const useTrips = () => {
  const dispatch = useDispatch<any>();
  const { trips, isLoading, error } = useSelector((state: RootState) => state.trips);

  const loadTrips = async () => {
    try {
      await dispatch(fetchTrips()).unwrap();
    } catch (err: any) {
      toast.error(err.message || 'Failed to fetch trips');
    }
  };

  const dispatchNewTrip = async (trip: any) => {
    try {
      await dispatch(createTrip(trip)).unwrap();
      toast.success('Trip dispatched successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch trip');
    }
  };

  const changeTripStatus = async (id: string, status: Trip['status'], currentLocation?: string, progressPercent?: number) => {
    try {
      if (status === 'COMPLETED' || status === 'Completed') {
        await dispatch(completeTripAPI({ id, data: { status: 'COMPLETED' } })).unwrap();
        toast.success('Trip completed');
      } else {
        await dispatch(updateTripStatusAPI({ id, status })).unwrap();
        toast.success('Trip status updated');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update trip status');
    }
  };

  const removeTrip = (id: string) => {
    dispatch(deleteTrip(id));
    toast.success('Trip removed locally');
  };

  const totalTrips = trips.length;
  const activeTripsCount = trips.filter(t => t.status === 'On Trip' || t.status === 'Delayed' || t.status === 'ON_TRIP' || t.status === 'IN_PROGRESS').length;
  const completedTripsCount = trips.filter(t => t.status === 'Completed' || t.status === 'COMPLETED').length;
  const draftTripsCount = trips.filter(t => t.status === 'Draft' || t.status === 'DRAFT').length;

  return {
    trips,
    isLoading,
    error,
    loadTrips,
    dispatchNewTrip,
    changeTripStatus,
    removeTrip,
    metrics: {
      totalTrips,
      activeTripsCount,
      completedTripsCount,
      draftTripsCount
    }
  };
};
