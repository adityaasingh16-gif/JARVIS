import React from 'react';
import { Mic, MicOff, Loader2, Volume2, AlertTriangle } from 'lucide-react';
import { VoiceState } from '../../types';

interface AICoreProps {
  voiceState: VoiceState;
  onPress: () => void;
  micSupported: boolean;
}

const STATE_COPY: Record<VoiceState, string> = {
  idle: 'How can I assist?',
  listening: 'Listening...',
  thinking: 'Understanding...',
  executing: 'Executing...',
  speaking: 'Speaking...',
  error: 'Something went wrong',
};

const STATE_RING: Record<VoiceState, string> = {
  idle: 'border-cyan-500/30',
  listening: 'border-cyan-400 shadow-[0_0_60px_rgba(0,240,255,0.45)]',
  thinking: 'border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.4)]',
  executing: 'border-amber-400 shadow-[0_0_50px_rgba(245,158,11,0.4)]',
  speaking: 'border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]',
  error: 'border-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.4)]',
};

export const AICore: React.FC<AICoreProps> = ({ voiceState, onPress, micSupported }) => {
  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer slow-rotating ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 ${STATE_RING[voiceState]} transition-all duration-500`}
          style={{ animation: voiceState === 'idle' ? 'jarvis-spin-slow 12s linear infinite' : 'jarvis-spin-fast 3s linear infinite' }}
        />
        {/* Secondary ring, opposite direction */}
        <div
          className="absolute inset-4 rounded-full border border-cyan-500/20"
          style={{ animation: 'jarvis-spin-reverse 8s linear infinite' }}
        />

        {/* Waveform bars while listening */}
        {voiceState === 'listening' && (
          <div className="absolute inset-0 flex items-center justify-center space-x-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-cyan-400"
                style={{
                  height: '18px',
                  animation: `jarvis-wave 0.9s ease-in-out ${i * 0.12}s infinite`,
                }}
              />
            ))}
          </div>
        )}

        {/* Core button */}
        <button
          onClick={onPress}
          disabled={!micSupported}
          className={`relative z-10 w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ${
            voiceState === 'idle'
              ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/10 hover:from-cyan-500/30 hover:to-blue-600/20'
              : 'bg-gradient-to-br from-cyan-500/30 to-blue-600/20'
          } border border-cyan-400/40 disabled:opacity-40 disabled:cursor-not-allowed`}
          style={{ animation: voiceState === 'idle' ? 'jarvis-pulse 3s ease-in-out infinite' : undefined }}
          title={micSupported ? 'Press to speak' : 'Voice input not supported in this browser'}
        >
          {voiceState === 'listening' && <Mic className="w-10 h-10 text-cyan-300" />}
          {voiceState === 'thinking' && <Loader2 className="w-10 h-10 text-blue-300 animate-spin" />}
          {voiceState === 'executing' && <Loader2 className="w-10 h-10 text-amber-300 animate-spin" />}
          {voiceState === 'speaking' && <Volume2 className="w-10 h-10 text-emerald-300 animate-pulse" />}
          {voiceState === 'error' && <AlertTriangle className="w-10 h-10 text-rose-400" />}
          {voiceState === 'idle' && (micSupported ? <Mic className="w-10 h-10 text-cyan-300" /> : <MicOff className="w-10 h-10 text-slate-500" />)}
        </button>
      </div>

      <div className="mt-6 text-center space-y-1">
        <div className="font-mono text-xs tracking-[0.3em] text-cyan-400/80 uppercase">J A R V I S</div>
        <div className="text-lg font-semibold text-white">{STATE_COPY[voiceState]}</div>
      </div>
    </div>
  );
};
