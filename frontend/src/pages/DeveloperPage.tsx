import React, { useState } from 'react';
import { Code2, Terminal, FolderSearch, CheckCircle2 } from 'lucide-react';

export const DeveloperPage: React.FC = () => {
  const [path, setPath] = useState('.');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInspect = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/developer/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo_path: path })
      });
      const data = await res.json();
      setAnalysis(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <Code2 className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Developer Suite & Code Inspector</h1>
          <p className="text-slate-400 text-xs font-mono">Architecture Breakdown, Code Audits & Terminal Integration</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
        <input
          type="text"
          value={path}
          onChange={(e) => setPath(e.target.value)}
          placeholder="Repository directory path..."
          className="flex-1 bg-transparent text-sm text-slate-100 font-mono focus:outline-none px-2"
        />
        <button
          onClick={handleInspect}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg font-mono"
        >
          <FolderSearch className="w-4 h-4" />
          <span>{loading ? 'Inspecting Repo...' : 'Inspect Repository'}</span>
        </button>
      </div>

      {analysis && (
        <div className="space-y-6">
          <div className="hud-glass-card p-6 rounded-xl border border-slate-800 space-y-3 font-mono">
            <h2 className="text-base font-bold text-cyan-300">Architecture & Codebase Report</h2>
            <div className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
              {analysis.architecture_analysis}
            </div>
          </div>

          {analysis.repo_info && (
            <div className="hud-glass p-5 rounded-xl border border-slate-800 font-mono space-y-3 text-xs">
              <div className="text-cyan-400 font-bold">REPOS STRUCTURAL AUDIT</div>
              <div>Total Code Files: {analysis.repo_info.total_files}</div>
              <div>
                <span className="text-slate-400">Sample Files:</span>
                <ul className="mt-1 list-disc list-inside text-slate-300">
                  {analysis.repo_info.sample_structure?.slice(0, 8).map((f: string, idx: number) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
