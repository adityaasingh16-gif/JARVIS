import React, { useEffect } from 'react';
import { CheckSquare, Clock, CheckCircle2 } from 'lucide-react';
import { useJarvisStore } from '../stores/jarvisStore';

export const TasksPage: React.FC = () => {
  const { tasks, loadTasks } = useJarvisStore();

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <CheckSquare className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Async Background Tasks & Jobs</h1>
          <p className="text-slate-400 text-xs font-mono">Long-running literature reviews, builds, and paper monitoring</p>
        </div>
      </div>

      <div className="space-y-4">
        {tasks.map((t) => (
          <div key={t.id} className="hud-glass-card p-5 rounded-xl border border-slate-800 flex items-center justify-between font-mono">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white font-sans">{t.title}</h3>
              <div className="text-xs text-slate-400">TYPE: {t.task_type}</div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-32 bg-slate-900 rounded-full h-2 border border-slate-700 overflow-hidden">
                <div className="bg-cyan-400 h-full transition-all" style={{ width: `${t.progress}%` }} />
              </div>
              <span className={`text-xs px-2.5 py-1 rounded border ${
                t.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {t.status} ({t.progress}%)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
