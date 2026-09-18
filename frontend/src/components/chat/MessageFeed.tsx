import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../../types';
import { ToolBadge } from './ToolBadge';

interface MessageFeedProps {
  messages: Message[];
  isStreaming: boolean;
}

export const MessageFeed: React.FC<MessageFeedProps> = ({ messages, isStreaming }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';
        return (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                isUser
                  ? 'bg-blue-950/80 border-blue-500/40 text-blue-300'
                  : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
              }`}
            >
              {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div className={`max-w-2xl space-y-1 ${isUser ? 'items-end text-right' : ''}`}>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="font-semibold text-slate-200">
                  {isUser ? 'DEVELOPER' : (msg.agent || 'JARVIS')}
                </span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-xl text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600/20 border border-blue-500/30 text-blue-100 rounded-tr-none'
                    : 'bg-[#0F172A]/90 border border-slate-800 text-slate-200 rounded-tl-none hud-glass-card'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.executed_tools && msg.executed_tools.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    {msg.executed_tools.map((t, idx) => (
                      <ToolBadge key={idx} toolName={t.name} arguments={t.arguments} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {isStreaming && (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 flex items-center justify-center">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div className="p-3 bg-[#0F172A]/90 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>JARVIS is searching, reasoning & executing tools...</span>
          </div>
        </div>
      )}
    </div>
  );
};
