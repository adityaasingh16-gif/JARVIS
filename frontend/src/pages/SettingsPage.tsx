import React from 'react';
import { Settings, ShieldCheck, Key, Cpu } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <Settings className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Settings & AI Provider Config</h1>
          <p className="text-slate-400 text-xs font-mono">Environment variables, security policies, and API providers</p>
        </div>
      </div>

      <div className="hud-glass-card p-6 rounded-xl border border-slate-800 space-y-4 max-w-2xl font-mono text-sm">
        <div className="space-y-2">
          <label className="text-slate-300 font-semibold block flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>DEFAULT LLM PROVIDER</span>
          </label>
          <select className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none">
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="gemini">Google Gemini 1.5 Pro</option>
            <option value="ollama">Local Ollama (Llama3 / Mistral)</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-slate-300 font-semibold block flex items-center space-x-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>OPENAI API KEY</span>
          </label>
          <input
            type="password"
            value="••••••••••••••••••••••••••••••••"
            disabled
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-400 focus:outline-none"
          />
          <span className="text-[11px] text-slate-500">Managed safely via backend .env file. Secrets are automatically redacted in responses.</span>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>TOOL RISK CONTROLS ENABLED</span>
          </div>
          <span className="text-slate-400">HIGH RISK CONFIRMATION REQUIRED</span>
        </div>
      </div>
    </div>
  );
};
