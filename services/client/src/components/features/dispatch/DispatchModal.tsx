import React from 'react';
import { Modal } from '../../shared/Modal';

interface DispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trip: any;
}

export const DispatchModal: React.FC<DispatchModalProps> = ({ isOpen, onClose, onConfirm, trip }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Dispatch" size="sm">
    <div className="space-y-4">
      <div className="text-sm">
        <p className="font-bold">{trip?.trip_number}</p>
        <p className="text-xs text-gray-500 mt-1">{trip?.source} → {trip?.destination}</p>
        <p className="text-xs text-gray-500">Cargo: {trip?.cargo_weight}kg</p>
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg border text-xs font-bold">Cancel</button>
        <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-[#714B67] text-white text-xs font-bold">Dispatch</button>
      </div>
    </div>
  </Modal>
);