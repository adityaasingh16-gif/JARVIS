import React, { useState } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';
import { useVoiceAssistant } from '../hooks/useVoiceAssistant';
import { AICore } from '../components/voice/AICore';
import { CommandCenterPanel } from '../components/voice/CommandCenterPanel';
import { ActivityFeed } from '../components/voice/ActivityFeed';
import { ConfirmationModal } from '../components/voice/ConfirmationModal';

const SUGGESTIONS = [
  'Research AI infrastructure monitoring',
  'Analyze my project',
  'Open VS Code',
  'Check system status',
  'Run the tests',
];

export const HomePage: React.FC = () => {
  const {
    voiceState,
    transcript,
    interimTranscript,
    micSupported,
    micError,
    activityLog,
    commandCenter,
    pendingConfirmation,
    history,
    startListening,
    stopListening,
    stopSpeaking,
    sendCommand,
    confirmPendingAction,
  } = useVoiceAssistant();

  const [typed, setTyped] = useState('');

  const handleMicPress = () => {
    if (voiceState === 'listening') stopListening();
    else if (voiceState === 'speaking') stopSpeaking();
    else if (voiceState === 'idle' || voiceState === 'error') startListening();
  };

  const handleTypedSend = () => {
    if (!typed.trim()) return;
    sendCommand(typed.trim());
    setTyped('');
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 overflow-hidden">
      {/* Center: AI Core + input + suggestions */}
      <div className="flex flex-col items-center justify-between overflow-y-auto py-6">
        <div />

        <div className="flex flex-col items-center space-y-6">
          <AICore voiceState={voiceState} onPress={handleMicPress} micSupported={micSupported} />

          <div className="h-6 text-center">
            {(transcript || interimTranscript) && (
              <p className="text-slate-300 text-sm font-mono max-w-md truncate">
                "{transcript || interimTranscript}"
              </p>
            )}
            {micError && <p className="text-rose-400 text-xs font-mono max-w-md">{micError}</p>}
          </div>

          {/* Typed fallback -- voice is primary, typing always works */}
          <div className="flex items-center space-x-2 bg-slate-900/80 border border-slate-700 rounded-xl p-2 w-full max-w-lg">
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTypedSend()}
              placeholder='Or type a command, e.g. "research early warning systems"'
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2"
            />
            <button
              onClick={handleTypedSend}
              disabled={!typed.trim()}
              className="p-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 rounded-lg text-slate-950"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={stopSpeaking}
              title="Stop speaking"
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              {voiceState === 'speaking' ? <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="w-full max-w-2xl space-y-2 pt-8">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">Try saying</div>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendCommand(s)}
                className="text-xs font-mono px-3 py-1.5 rounded-full border border-slate-700 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div className="pt-6">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center mb-2">Recent Commands</div>
              <div className="space-y-1 max-w-lg mx-auto">
                {history.slice(0, 5).map((h) => (
                  <button
                    key={h.id}
                    onClick={() => sendCommand(h.transcript)}
                    className="w-full text-left text-xs font-mono text-slate-500 hover:text-slate-300 truncate px-2 py-1 rounded hover:bg-slate-900/60"
                  >
                    🎙 "{h.transcript}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: live command center + activity feed */}
      <div className="flex flex-col space-y-4 min-h-0">
        <CommandCenterPanel state={commandCenter} />
        <div className="flex-1 min-h-0">
          <ActivityFeed entries={activityLog} />
        </div>
      </div>

      <ConfirmationModal
        confirmation={pendingConfirmation}
        onConfirm={() => confirmPendingAction(true)}
        onCancel={() => confirmPendingAction(false)}
      />
    </div>
  );
};
