import React from 'react';
import { Wrench, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ToolBadgeProps {
  toolName: string;
  arguments: Record<string, any>;
  status?: string;
}

export const ToolBadge: React.FC<ToolBadgeProps> = ({ toolName, arguments: args, status = 'SUCCESS' }) => {
  return (
    <div className="my-2 p-3 bg-[#0B1120] border border-cyan-500/30 rounded-lg text-xs font-mono max-w-xl">
      <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
        <div className="flex items-center space-x-2">
          <Wrench className="w-3.5 h-3.5 text-cyan-400" />
          <span>TOOL EXECUTED: {toolName}</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-400">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>VERIFIED</span>
        </div>
      </div>
      <div className="text-slate-400 bg-slate-950/60 p-2 rounded text-[11px] overflow-x-auto">
        <pre>{JSON.stringify(args, null, 2)}</pre>
      </div>
    </div>
  );
};
