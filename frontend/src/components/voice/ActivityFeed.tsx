import React, { useEffect, useRef } from 'react';
import { Radio } from 'lucide-react';
import { ActivityLogEntry } from '../../types';

const DOT_COLOR: Record<ActivityLogEntry['kind'], string> = {
  status: 'bg-slate-500',
  agent: 'bg-cyan-400',
  tool_start: 'bg-amber-400',
  tool_complete: 'bg-emerald-400',
  error: 'bg-rose-400',
  response: 'bg-blue-400',
};

export const ActivityFeed: React.FC<{ entries: ActivityLogEntry[] }> = ({ entries }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries.length]);

  return (
    <div className="hud-glass-card rounded-xl border border-slate-800 p-4 flex flex-col h-full">
      <div className="flex items-center space-x-2 text-slate-300 font-semibold uppercase tracking-wider text-xs font-mono mb-3">
        <Radio className="w-4 h-4 text-cyan-400" />
        <span>JARVIS Activity</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-[11px]">
        {entries.length === 0 && (
          <div className="text-slate-600 italic">No activity yet -- speak a command to get started.</div>
        )}
        {entries.map((e) => (
          <div key={e.id} className="flex items-start space-x-2 jarvis-fade-in">
            <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${DOT_COLOR[e.kind]}`} />
            <div>
              <span className="text-slate-600">{e.timestamp}</span>{' '}
              <span className="text-slate-300">{e.label}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
