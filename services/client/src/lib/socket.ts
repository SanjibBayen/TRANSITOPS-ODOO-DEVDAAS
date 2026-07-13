import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000';

let socket: Socket | null = null;

export const socketService = {
  connect: (): Socket => {
    if (socket?.connected) return socket;

    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');

    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', (reason: string) => {
      console.log('WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error: Error) => {
      console.warn('WebSocket connection error:', error.message);
    });

    return socket;
  },

  disconnect: (): void => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: (): Socket | null => socket,

  on: (event: string, callback: (...args: any[]) => void): void => {
    socket?.on(event, callback);
  },

  off: (event: string, callback?: (...args: any[]) => void): void => {
    socket?.off(event, callback);
  },

  emit: (event: string, data?: any): void => {
    socket?.emit(event, data);
  },
};