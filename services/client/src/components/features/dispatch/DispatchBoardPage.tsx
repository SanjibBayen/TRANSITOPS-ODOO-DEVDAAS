import React from 'react';
import { DispatchBoard } from './DispatchBoard';

export const DispatchBoardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#1b1c1c] dark:text-zinc-100">Dispatch Board</h1>
        <p className="text-xs text-gray-500 dark:text-zinc-400">Manage trip assignments and dispatching</p>
      </div>
      <DispatchBoard />
    </div>
  );
};