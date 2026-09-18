import React, { useState } from 'react';
import { Monitor, Play, ShieldAlert, Cpu } from 'lucide-react';

export const ComputerPage: React.FC = () => {
  const [appName, setAppName] = useState('VS Code');
  const [statusMsg, setStatusMsg] = useState('');

  const handleLaunch = async () => {
    try {
      const res = await fetch('/api/computer/launch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_name: appName })
      });
      const data = await res.json();
      setStatusMsg(data.message);
    } catch (e) {
      setStatusMsg(`Error: ${String(e)}`);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <Monitor className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Computer Control & Desktop Automation</h1>
          <p className="text-slate-400 text-xs font-mono">PyAutoGUI, Subprocess Launching & Playwright Browser Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="hud-glass-card p-6 rounded-xl border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Launch Application</span>
          </h2>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. VS Code, Chrome..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm font-mono text-white focus:outline-none"
            />
            <button
              onClick={handleLaunch}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg font-mono"
            >
              <Play className="w-4 h-4" />
              <span>Launch</span>
            </button>
          </div>
          {statusMsg && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-emerald-400">
              {statusMsg}
            </div>
          )}
        </div>

        <div className="hud-glass p-6 rounded-xl border border-amber-500/30 space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>SECURITY PERMISSIONS POLICY</span>
          </div>
          <p className="text-slate-300 font-sans">
            JARVIS evaluates all OS automation actions against security risk levels. Low/Medium actions (opening applications, browser navigation) are executed smoothly. High-risk operations (file deletion, system parameter modification) require explicit developer confirmation.
          </p>
        </div>
      </div>
    </div>
  );
};
