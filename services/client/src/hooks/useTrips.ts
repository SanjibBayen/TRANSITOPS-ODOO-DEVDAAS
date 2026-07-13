import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/index';
import { fetchTrips, createTrip, updateTripStatusAPI, completeTripAPI, deleteTrip, Trip } from '../store/slices/tripSlice';
import { toast } from 'sonner';

export const useTrips = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trips, isLoading, error } = useSelector((state: RootState) => state.trips);

  const loadTrips = async () => {
    try {
      await dispatch(fetchTrips()).unwrap();
    } catch (err: any) {
      toast.error(err || 'Failed to fetch trips');
    }
  };

  const dispatchNewTrip = async (trip: any) => {
    try {
      await dispatch(createTrip(trip)).unwrap();
      toast.success('Trip created successfully');
      await loadTrips();
    } catch (err: any) {
      toast.error(err || 'Failed to create trip');
    }
  };

  const changeTripStatus = async (id: string, status: string) => {
    try {
      if (status === 'COMPLETED') {
        await dispatch(completeTripAPI({ id, data: {} })).unwrap();
        toast.success('Trip completed');
      } else {
        await dispatch(updateTripStatusAPI({ id, status })).unwrap();
        toast.success(`Trip status updated to ${status}`);
      }
      await loadTrips();
    } catch (err: any) {
      toast.error(err || 'Failed to update trip status');
    }
  };

  const removeTrip = (id: string) => {
    dispatch(deleteTrip(id));
    toast.success('Trip removed');
  };

  const metrics = {
    totalTrips: trips.length,
    activeTripsCount: trips.filter(t => 
      t.status === 'DISPATCHED' || t.status === 'IN_PROGRESS'
    ).length,
    completedTripsCount: trips.filter(t => 
      t.status === 'COMPLETED'
    ).length,
    draftTripsCount: trips.filter(t => 
      t.status === 'DRAFT'
    ).length,
    cancelledTripsCount: trips.filter(t => 
      t.status === 'CANCELLED'
    ).length,
  };

  return {
    trips,
    isLoading,
    error,
    loadTrips,
    dispatchNewTrip,
    changeTripStatus,
    removeTrip,
    metrics,
  };
};