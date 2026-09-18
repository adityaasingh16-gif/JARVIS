import React from 'react';
import { BrainCircuit, Database, Layers } from 'lucide-react';

export const MemoryPage: React.FC = () => {
  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <BrainCircuit className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Long-Term Memory & Knowledge Base</h1>
          <p className="text-slate-400 text-xs font-mono">PostgreSQL + pgvector Semantic Retrieval Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="hud-glass p-6 rounded-xl border border-cyan-500/30 space-y-3">
          <div className="text-cyan-400 font-bold flex items-center space-x-2">
            <Layers className="w-4 h-4" />
            <span>1. SHORT-TERM CONTEXT</span>
          </div>
          <p className="text-xs text-slate-300 font-sans">Active message buffer maintained during ongoing developer chat sessions.</p>
        </div>

        <div className="hud-glass p-6 rounded-xl border border-blue-500/30 space-y-3">
          <div className="text-blue-400 font-bold flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>2. PROJECT MEMORY</span>
          </div>
          <p className="text-xs text-slate-300 font-sans">Stores CarpoolX and SIH project architectural specs, tech stack choices, and key decisions.</p>
        </div>

        <div className="hud-glass p-6 rounded-xl border border-emerald-500/30 space-y-3">
          <div className="text-emerald-400 font-bold flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4" />
            <span>3. PGVECTOR STORE</span>
          </div>
          <p className="text-xs text-slate-300 font-sans">Stores vector embeddings for research papers, PDF documentation, and technical literature.</p>
        </div>
      </div>
    </div>
  );
};
