import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/index';
import { toast } from 'sonner';
import { socketService } from '../lib/socket';

export const useWebSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
      return;
    }

    // Connect to WebSocket
    const socket = socketService.connect();

    // Vehicle updates
    socketService.on('vehicle:updated', (data: any) => {
      dispatch({ type: 'vehicles/setVehicleStatus', payload: { id: data.vehicleId, status: data.status } });
    });

    // Trip status updates
    socketService.on('trip:updated', (data: any) => {
      dispatch({ type: 'trips/updateTripStatus', payload: { id: data.tripId, status: data.status } });
      toast.info(`Trip ${data.tripId} status: ${data.status}`);
    });

    // New dispatch assignments
    socketService.on('dispatch:new-assignment', (data: any) => {
      toast.info('New trip assigned!');
    });

    // Maintenance alerts
    socketService.on('maintenance:alert', (data: any) => {
      toast.warning(`Maintenance: ${data.type || 'Alert received'}`);
    });

    // Compliance warnings
    socketService.on('compliance:warning', (data: any) => {
      toast.warning(`Compliance: ${data.message || 'Warning received'}`);
    });

    // Dashboard refresh
    socketService.on('dashboard:refresh', () => {
      dispatch({ type: 'analytics/fetchDashboard' } as any);
    });

    // New notifications
    socketService.on('notification:new', (data: any) => {
      toast(data.title || 'Notification', { description: data.message });
    });

    // Cleanup on unmount or auth change
    return () => {
      socketService.off('vehicle:updated');
      socketService.off('trip:updated');
      socketService.off('dispatch:new-assignment');
      socketService.off('maintenance:alert');
      socketService.off('compliance:warning');
      socketService.off('dashboard:refresh');
      socketService.off('notification:new');
      socketService.disconnect();
    };
  }, [isAuthenticated, dispatch]);
};