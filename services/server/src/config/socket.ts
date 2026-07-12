import { Server as HttpServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { supabaseAdmin } from './supabase';

let io: SocketServer;

interface AuthenticatedSocket {
    userId: string;
    role: string;
}

export const initializeSocket = (server: HttpServer) => {
    io = new SocketServer(server, {
        cors: {
            origin: process.env.FRONTEND_URL || 'http://localhost:5173',
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: 60000,
        pingInterval: 25000,
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error('Authentication required'));
            }

            const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
            if (error || !user) {
                return next(new Error('Invalid token'));
            }

            (socket as any).user = {
                userId: user.id,
                role: user.user_metadata?.role || 'DRIVER',
            };

            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        const user = (socket as any).user as AuthenticatedSocket;
        console.log(`User connected: ${user.userId} (${user.role})`);

        // Join role-based rooms
        socket.join(`role:${user.role}`);
        socket.join(`user:${user.userId}`);

        // Fleet manager events
        if (user.role === 'FLEET_MANAGER') {
            socket.join('fleet:managers');
            socket.join('dispatch:room');
        }

        // Driver events
        if (user.role === 'DRIVER') {
            socket.join('drivers:active');
        }

        // Safety officer events
        if (user.role === 'SAFETY_OFFICER') {
            socket.join('safety:officers');
        }

        // Financial analyst events
        if (user.role === 'FINANCIAL_ANALYST') {
            socket.join('finance:analysts');
        }

        // Handle vehicle status change
        socket.on('vehicle:status-change', (data: { vehicleId: string; status: string }) => {
            io.to('fleet:managers').emit('vehicle:updated', data);
            io.to('dispatch:room').emit('vehicle:status-changed', data);
        });

        // Handle trip status change
        socket.on('trip:status-change', (data: { tripId: string; status: string }) => {
            io.to('fleet:managers').emit('trip:updated', data);
            io.to('dispatch:room').emit('trip:status-changed', data);
        });

        // Handle dispatch events
        socket.on('dispatch:new-trip', (data: any) => {
            io.to('dispatch:room').emit('dispatch:trip-added', data);
            io.to('drivers:active').emit('dispatch:new-assignment', data);
        });

        // Handle driver location update
        socket.on('driver:location-update', (data: { tripId: string; location: any }) => {
            io.to('fleet:managers').emit('driver:location-changed', data);
        });

        // Handle maintenance alerts
        socket.on('maintenance:created', (data: any) => {
            io.to('fleet:managers').emit('maintenance:alert', data);
        });

        // Handle compliance alerts
        socket.on('compliance:alert', (data: any) => {
            io.to('safety:officers').emit('compliance:warning', data);
            io.to('fleet:managers').emit('compliance:warning', data);
        });

        // Handle dashboard refresh
        socket.on('dashboard:refresh', () => {
            io.to('fleet:managers').emit('dashboard:update');
            io.to('finance:analysts').emit('dashboard:update');
        });

        // Handle notifications
        socket.on('notification:send', (data: { userId: string; notification: any }) => {
            io.to(`user:${data.userId}`).emit('notification:new', data.notification);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${user.userId}`);
        });
    });

    return io;
};

// Emit events from anywhere
export const emitEvent = {
    vehicleStatusChanged: (vehicleId: string, status: string) => {
        io?.to('fleet:managers').emit('vehicle:updated', { vehicleId, status });
        io?.to('dispatch:room').emit('vehicle:status-changed', { vehicleId, status });
    },

    tripStatusChanged: (tripId: string, status: string, driverId?: string) => {
        io?.to('fleet:managers').emit('trip:updated', { tripId, status });
        io?.to('dispatch:room').emit('trip:status-changed', { tripId, status });
        if (driverId) {
            io?.to(`user:${driverId}`).emit('trip:updated', { tripId, status });
        }
    },

    tripDispatched: (trip: any, driverUserId: string) => {
        io?.to('dispatch:room').emit('dispatch:trip-added', trip);
        io?.to(`user:${driverUserId}`).emit('dispatch:new-assignment', trip);
    },

    maintenanceCreated: (maintenance: any) => {
        io?.to('fleet:managers').emit('maintenance:alert', maintenance);
    },

    licenseExpiring: (driver: any) => {
        io?.to('safety:officers').emit('compliance:warning', {
            type: 'LICENSE_EXPIRY',
            driver,
        });
        io?.to('fleet:managers').emit('compliance:warning', {
            type: 'LICENSE_EXPIRY',
            driver,
        });
    },

    dashboardRefresh: () => {
        io?.to('fleet:managers').emit('dashboard:update');
        io?.to('finance:analysts').emit('dashboard:update');
        io?.to('safety:officers').emit('dashboard:update');
    },

    notification: (userId: string, notification: any) => {
        io?.to(`user:${userId}`).emit('notification:new', notification);
    },

    fleetUpdate: (data: any) => {
        io?.to('fleet:managers').emit('fleet:update', data);
    },
};

export { io };