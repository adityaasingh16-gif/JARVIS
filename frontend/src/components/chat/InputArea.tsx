import React, { useState } from 'react';
import { Send, Mic, Paperclip, Sparkles } from 'lucide-react';
import { useJarvisStore } from '../../stores/jarvisStore';

export const InputArea: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isStreaming } = useJarvisStore();

  const handleSend = () => {
    if (!input.trim() || isStreaming) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-[#0B1120] border-t border-slate-800">
      <div className="max-w-4xl mx-auto flex items-center space-x-3 bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 shadow-lg focus-within:border-cyan-500/60 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all">
        <button
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="Push to talk (Voice)"
        >
          <Mic className="w-5 h-5" />
        </button>

        <button
          className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded-lg transition-colors"
          title="Attach document / project file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask JARVIS to research papers, inspect codebase, execute commands..."
          disabled={isStreaming}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />

        <button
          onClick={handleSend}
          disabled={isStreaming || !input.trim()}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-40 text-white font-medium text-xs rounded-lg shadow-md transition-all font-mono"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
