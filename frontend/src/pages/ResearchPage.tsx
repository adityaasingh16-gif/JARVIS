import React, { useState } from 'react';
import { BookOpen, Search, ExternalLink, Sparkles } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [topic, setTopic] = useState('AI-based infrastructure delay prediction');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <BookOpen className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Academic Literature & Research Engine</h1>
          <p className="text-slate-400 text-xs font-mono">arXiv, Semantic Scholar, & Multi-source Comparative Matrix</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-700">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter research topic or paper title..."
          className="flex-1 bg-transparent text-sm text-slate-100 focus:outline-none px-2"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center space-x-2 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-lg font-mono"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? 'Searching Papers...' : 'Execute Research'}</span>
        </button>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="hud-glass-card p-6 rounded-xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-cyan-300 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Literature Review Summary</span>
            </h2>
            <div className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed font-sans">
              {results.report}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-mono text-slate-400 font-semibold uppercase">Academic Papers Extracted ({results.academic_sources?.length || 0})</h3>
            <div className="grid grid-cols-1 gap-3">
              {results.academic_sources?.map((paper: any, i: number) => (
                <div key={i} className="hud-glass p-4 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-sm font-bold text-white">{paper.title}</h4>
                    <a href={paper.url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center space-x-1 text-xs">
                      <span>arXiv</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-400 font-mono">Authors: {paper.authors} ({paper.year})</div>
                  <p className="text-xs text-slate-300">{paper.abstract}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
