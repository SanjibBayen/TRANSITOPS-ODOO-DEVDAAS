import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateVehicle } from '../store/slices/vehicleSlice.ts';
import { updateTripStatusAPI } from '../store/slices/tripSlice.ts';
import { toast } from 'sonner';

export const useWebSocket = () => {
  const dispatch = useDispatch<any>();

  useEffect(() => {
    // We are integrating with a mock backend ws for now
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';
    let socket: WebSocket;
    
    const connect = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('WebSocket Connected');
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === 'VEHICLE_LOCATION_UPDATE') {
              // Handle vehicle location update
              // Usually handled by triggering a refetch or partial update
            } else if (data.type === 'TRIP_STATUS_UPDATE') {
              // Trigger a toast
              toast.info(`Trip ${data.payload.tripId} status updated to ${data.payload.status}`);
            } else if (data.type === 'ALERT') {
              toast.warning(`Alert: ${data.payload.message}`);
            }
          } catch (e) {
            console.error('Error parsing WS message', e);
          }
        };

        socket.onclose = () => {
          console.log('WebSocket Disconnected. Reconnecting...');
          setTimeout(connect, 3000);
        };
      } catch (err) {
        console.error('WebSocket connection error:', err);
      }
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [dispatch]);
};
