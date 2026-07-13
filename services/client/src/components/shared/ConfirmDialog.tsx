import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  onConfirm, onCancel, variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-[#714B67] hover:bg-[#5e3b56]',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold">{title}</h3>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 dark:text-zinc-400">{message}</p>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-gray-100 dark:border-zinc-800">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 text-xs font-bold">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-white text-xs font-bold ${variantStyles[variant]}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};