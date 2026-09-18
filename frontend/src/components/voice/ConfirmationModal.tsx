import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { PendingConfirmation } from '../../types';

export const ConfirmationModal: React.FC<{
  confirmation: PendingConfirmation | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ confirmation, onConfirm, onCancel }) => {
  if (!confirmation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="hud-glass-card w-full max-w-md rounded-2xl border border-amber-500/40 p-6 space-y-4 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
        <div className="flex items-center space-x-2 text-amber-400 font-mono font-bold uppercase tracking-wider text-sm">
          <ShieldAlert className="w-5 h-5" />
          <span>Confirmation Required</span>
        </div>
        <p className="text-slate-200 text-sm leading-relaxed">
          {confirmation.reason}
        </p>
        <div className="text-xs font-mono text-slate-500 bg-slate-950/60 p-2 rounded">
          {confirmation.tool}({JSON.stringify(confirmation.args)})
        </div>
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-300 border border-slate-700 hover:bg-slate-800"
          >
            CANCEL
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
