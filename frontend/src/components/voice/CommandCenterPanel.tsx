import React from 'react';
import { Activity } from 'lucide-react';
import { CommandCenterState } from '../../types';

export const CommandCenterPanel: React.FC<{ state: CommandCenterState }> = ({ state }) => {
  const statusColor = {
    IDLE: 'text-slate-400',
    EXECUTING: 'text-amber-400',
    DONE: 'text-emerald-400',
    ERROR: 'text-rose-400',
  }[state.status];

  return (
    <div className="hud-glass-card rounded-xl border border-slate-800 p-4 font-mono text-xs space-y-3">
      <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider">
        <Activity className="w-4 h-4 text-cyan-400" />
        <span>Command Center</span>
      </div>

      <div className="space-y-1">
        <div className="text-slate-500 uppercase text-[10px]">Current Task</div>
        <div className="text-slate-200 text-sm font-sans">
          {state.currentTask || 'Waiting for a voice command...'}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-slate-500 uppercase text-[10px]">Agent</div>
          <div className="text-cyan-300">{state.agent || '—'}</div>
        </div>
        <div className="text-right">
          <div className="text-slate-500 uppercase text-[10px]">Status</div>
          <div className={`font-semibold ${statusColor}`}>● {state.status}</div>
        </div>
      </div>

      {state.tools.length > 0 && (
        <div className="space-y-1">
          <div className="text-slate-500 uppercase text-[10px]">Tools</div>
          <div className="flex flex-wrap gap-1.5">
            {state.tools.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-1">
        <div className="text-slate-500 uppercase text-[10px]">Progress</div>
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
            style={{ width: `${state.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
