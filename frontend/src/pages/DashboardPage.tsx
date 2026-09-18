import React, { useEffect } from 'react';
import { 
  Bot, 
  BookOpen, 
  Code2, 
  Monitor, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useJarvisStore } from '../stores/jarvisStore';

export const DashboardPage: React.FC = () => {
  const { systemStatus, loadSystemStatus, projects, loadProjects, setActivePage } = useJarvisStore();

  useEffect(() => {
    loadSystemStatus();
    loadProjects();
  }, []);

  return (
    <div className="p-8 space-y-8 overflow-y-auto max-h-full">
      {/* Welcome Banner */}
      <div className="hud-glass-card p-6 rounded-2xl border border-cyan-500/30 flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>JARVIS Operating Layer Ready</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            How can I assist your research & development today?
          </h1>
          <p className="text-slate-400 text-sm max-w-2xl">
            JARVIS is active with academic paper discovery, codebase architecture inspection, pgvector long-term memory, and desktop control capabilities.
          </p>
        </div>
        <button
          onClick={() => setActivePage('chat')}
          className="flex items-center space-x-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
        >
          <span>Open Chat Center</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* System Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
        <div className="hud-glass p-5 rounded-xl border border-emerald-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>AI CORE ENGINE</span>
            <Bot className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">{systemStatus.ai_engine}</div>
          <div className="text-[11px] text-slate-500 mt-1">OpenAI + LangGraph Orchestrator</div>
        </div>

        <div className="hud-glass p-5 rounded-xl border border-cyan-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>RESEARCH ENGINE</span>
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-400">{systemStatus.research_agent}</div>
          <div className="text-[11px] text-slate-500 mt-1">arXiv, Literature & Web APIs</div>
        </div>

        <div className="hud-glass p-5 rounded-xl border border-blue-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>DEVELOPER SUITE</span>
            <Code2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-400">ACTIVE</div>
          <div className="text-[11px] text-slate-500 mt-1">Git, Code Inspection & Terminal</div>
        </div>

        <div className="hud-glass p-5 rounded-xl border border-purple-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>DESKTOP AUTOMATION</span>
            <Monitor className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-400">{systemStatus.computer_control}</div>
          <div className="text-[11px] text-slate-500 mt-1">Controlled OS & Browser Execution</div>
        </div>
      </div>

      {/* Active Projects Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <span>Active Managed Projects</span>
          </h2>
          <button
            onClick={() => setActivePage('projects')}
            className="text-xs text-cyan-400 hover:underline font-mono"
          >
            View All Projects →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="hud-glass-card p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">{proj.name}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  MANAGED
                </span>
              </div>
              <p className="text-sm text-slate-400">{proj.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {proj.tech_stack.map((tech, i) => (
                  <span key={i} className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
