import React, { useEffect } from 'react';
import { FolderGit2, Github, Code, Layers } from 'lucide-react';
import { useJarvisStore } from '../stores/jarvisStore';

export const ProjectsPage: React.FC = () => {
  const { projects, loadProjects } = useJarvisStore();

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="p-8 space-y-6 overflow-y-auto max-h-full">
      <div className="flex items-center space-x-3 text-cyan-400">
        <FolderGit2 className="w-7 h-7" />
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Project Workspaces & Repositories</h1>
          <p className="text-slate-400 text-xs font-mono">Managed AI/ML, Web, and Academic Projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="hud-glass-card p-6 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{proj.name}</h2>
              <a href={proj.repo_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 text-xs font-mono">
                <Github className="w-4 h-4" />
                <span>Repo</span>
              </a>
            </div>
            
            <p className="text-sm text-slate-300">{proj.description}</p>
            
            {proj.architecture && (
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-400">
                <div className="text-cyan-400 font-semibold mb-1 flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>ARCHITECTURE</span>
                </div>
                {proj.architecture}
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {proj.tech_stack.map((tech, i) => (
                <span key={i} className="text-xs font-mono px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
