import { Server as SocketServer } from 'socket.io';
import { supabaseAdmin } from '../config/supabase';

export class WebSocketService {
  private static io: SocketServer;

  static initialize(io: SocketServer) {
    this.io = io;
  }

  // Emit to specific user
  static emitToUser(userId: string, event: string, data: any) {
    this.io?.to(`user:${userId}`).emit(event, data);
  }

  // Emit to role
  static emitToRole(role: string, event: string, data: any) {
    this.io?.to(`role:${role}`).emit(event, data);
  }

  // Emit to all
  static emitToAll(event: string, data: any) {
    this.io?.emit(event, data);
  }

  // Specific events
  static vehicleUpdated(vehicleId: string, data: any) {
    this.io?.to('fleet:managers').emit('vehicle:updated', { vehicleId, ...data });
    this.io?.to('dispatch:room').emit('vehicle:status-changed', { vehicleId, ...data });
  }

  static tripDispatched(trip: any) {
    this.io?.to('fleet:managers').emit('trip:dispatched', trip);
    this.io?.to('dispatch:room').emit('dispatch:completed', trip);
  }

  static tripCompleted(trip: any) {
    this.io?.to('fleet:managers').emit('trip:completed', trip);
    this.io?.to('finance:analysts').emit('trip:completed', trip);
  }

  static maintenanceAlert(vehicle: any) {
    this.io?.to('fleet:managers').emit('maintenance:alert', vehicle);
  }

  static complianceWarning(data: any) {
    this.io?.to('safety:officers').emit('compliance:warning', data);
    this.io?.to('fleet:managers').emit('compliance:warning', data);
  }

  static dashboardRefresh() {
    this.io?.to('fleet:managers').emit('dashboard:refresh');
    this.io?.to('finance:analysts').emit('dashboard:refresh');
    this.io?.to('safety:officers').emit('dashboard:refresh');
  }
}