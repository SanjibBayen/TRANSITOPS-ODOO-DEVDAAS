export enum TripStatus {
  DRAFT = 'DRAFT',
  DISPATCHED = 'DISPATCHED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

interface TransitionAction {
  type: string;
  payload?: any;
}

export class TripStateMachine {
  private static transitions: Map<TripStatus, TripStatus[]> = new Map([
    [TripStatus.DRAFT, [TripStatus.DISPATCHED, TripStatus.CANCELLED]],
    [TripStatus.DISPATCHED, [TripStatus.IN_PROGRESS, TripStatus.CANCELLED]],
    [TripStatus.IN_PROGRESS, [TripStatus.COMPLETED, TripStatus.CANCELLED]],
    [TripStatus.COMPLETED, []],
    [TripStatus.CANCELLED, []],
  ]);

  static canTransition(from: TripStatus, to: TripStatus): boolean {
    const allowed = this.transitions.get(from);
    return allowed ? allowed.includes(to) : false;
  }

  static getNextStates(current: TripStatus): TripStatus[] {
    return this.transitions.get(current) || [];
  }

  static validateTransition(from: TripStatus, to: TripStatus): void {
    if (!this.canTransition(from, to)) {
      throw new Error(
        `Invalid state transition: ${from} -> ${to}. Allowed: ${this.getNextStates(from).join(', ')}`
      );
    }
  }

  static isFinalState(status: TripStatus): boolean {
    return [TripStatus.COMPLETED, TripStatus.CANCELLED].includes(status);
  }

  static isActiveState(status: TripStatus): boolean {
    return [TripStatus.DISPATCHED, TripStatus.IN_PROGRESS].includes(status);
  }

  static getTransitionActions(from: TripStatus, to: TripStatus): TransitionAction[] {
    const actions: TransitionAction[] = [];

    if (from === TripStatus.DRAFT && to === TripStatus.DISPATCHED) {
      actions.push(
        { type: 'SET_VEHICLE_ON_TRIP' },
        { type: 'SET_DRIVER_ON_TRIP' },
        { type: 'SET_DISPATCH_TIMESTAMP' },
        { type: 'NOTIFY_DRIVER' }
      );
    }

    if (from === TripStatus.DISPATCHED && to === TripStatus.IN_PROGRESS) {
      actions.push(
        { type: 'SET_START_TIMESTAMP' },
        { type: 'RECORD_START_ODOMETER' }
      );
    }

    if (to === TripStatus.COMPLETED) {
      actions.push(
        { type: 'SET_VEHICLE_AVAILABLE' },
        { type: 'SET_DRIVER_AVAILABLE' },
        { type: 'UPDATE_ODOMETER' },
        { type: 'CALCULATE_DISTANCE' },
        { type: 'CALCULATE_PROFIT' },
        { type: 'UPDATE_DRIVER_STATS' }
      );
    }

    if (to === TripStatus.CANCELLED) {
      actions.push(
        { type: 'RESTORE_VEHICLE_STATUS' },
        { type: 'RESTORE_DRIVER_STATUS' },
        { type: 'SET_CANCEL_TIMESTAMP' }
      );
    }

    return actions;
  }

  static getStatusLabel(status: TripStatus): string {
    const labels: Record<TripStatus, string> = {
      [TripStatus.DRAFT]: 'Draft',
      [TripStatus.DISPATCHED]: 'Dispatched',
      [TripStatus.IN_PROGRESS]: 'In Progress',
      [TripStatus.COMPLETED]: 'Completed',
      [TripStatus.CANCELLED]: 'Cancelled',
    };
    return labels[status];
  }

  static getStatusColor(status: TripStatus): string {
    const colors: Record<TripStatus, string> = {
      [TripStatus.DRAFT]: '#6B7280',
      [TripStatus.DISPATCHED]: '#3B82F6',
      [TripStatus.IN_PROGRESS]: '#F59E0B',
      [TripStatus.COMPLETED]: '#10B981',
      [TripStatus.CANCELLED]: '#EF4444',
    };
    return colors[status];
  }
}