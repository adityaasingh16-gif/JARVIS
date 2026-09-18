import React from 'react';
import { Activity, Database, Globe, Monitor, Code } from 'lucide-react';
import { useJarvisStore } from '../../stores/jarvisStore';

export const HUDStatusBar: React.FC = () => {
  const { systemStatus } = useJarvisStore();

  return (
    <div className="bg-[#0B1120]/80 border-t border-slate-800 px-6 py-2 flex items-center justify-between text-xs font-mono text-slate-400">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>RESEARCH:</span>
          <span className="text-cyan-300 font-semibold">{systemStatus.research_agent}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>BROWSER:</span>
          <span className="text-blue-300 font-semibold">{systemStatus.browser_agent}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Monitor className="w-3.5 h-3.5 text-emerald-400" />
          <span>DESKTOP:</span>
          <span className="text-emerald-300 font-semibold">{systemStatus.computer_control}</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-amber-400" />
          <span>MEMORY STORE:</span>
          <span className="text-amber-300 font-semibold">{systemStatus.memory_store}</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 text-slate-500">
        <Code className="w-3.5 h-3.5 text-cyan-400" />
        <span>FASTAPI + REACT + LANGGRAPH ORCHESTRATOR</span>
      </div>
    </div>
  );
};
