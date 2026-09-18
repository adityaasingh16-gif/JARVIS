import React from 'react';
import {
  Orbit,
  MessageSquare,
  BookOpen,
  FolderGit2,
  Code2,
  Monitor,
  BrainCircuit,
  CheckSquare,
  Settings,
} from 'lucide-react';
import { useJarvisStore } from '../../stores/jarvisStore';
import { ActivePage } from '../../types';

interface NavItem {
  id: ActivePage;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: Orbit },
  { id: 'chat', label: 'Conversations', icon: MessageSquare },
  { id: 'research', label: 'Research', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'developer', label: 'Developer', icon: Code2 },
  { id: 'computer', label: 'Computer', icon: Monitor },
  { id: 'memory', label: 'Memory', icon: BrainCircuit },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useJarvisStore();

  return (
    <aside className="w-16 hover:w-56 group bg-[#0B1120] border-r border-slate-800 flex flex-col justify-between py-4 select-none transition-all duration-200 overflow-hidden">
      <div className="space-y-1 px-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              title={item.label}
              className={`w-full flex items-center space-x-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-slate-800/80 mx-2 text-[10px] font-mono text-slate-500 flex items-center space-x-2 overflow-hidden whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150">JARVIS AI OS ONLINE</span>
      </div>
    </aside>
  );
};
