import React from 'react';
import { Cpu, Terminal, ShieldCheck } from 'lucide-react';
import { useJarvisStore } from '../../stores/jarvisStore';

export const Header: React.FC = () => {
  const { systemStatus } = useJarvisStore();

  return (
    <header className="h-16 border-b border-cyan-500/20 bg-[#080C14]/90 backdrop-blur-md px-6 flex items-center justify-between z-20">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono font-bold text-xl tracking-wider">
          <Cpu className="w-6 h-6 animate-pulse text-cyan-400" />
          <span className="drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]">J A R V I S</span>
        </div>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono">
          v1.0.0 ONLINE
        </span>
      </div>

      <div className="flex items-center space-x-6 text-xs font-mono">
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">ENGINE:</span>
          <span className="text-emerald-400 font-semibold">{systemStatus.ai_engine}</span>
        </div>
        
        <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="text-slate-400">SECURITY:</span>
          <span className="text-cyan-400 font-semibold">ENFORCED</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300">SYSTEM READY</span>
        </div>
      </div>
    </header>
  );
};
