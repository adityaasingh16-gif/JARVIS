import { useCallback, useEffect, useRef, useState } from 'react';
import {
  VoiceState,
  ActivityLogEntry,
  CommandCenterState,
  PendingConfirmation,
  VoiceHistoryItem,
} from '../types';
import { useJarvisStore } from '../stores/jarvisStore';

// --- Web Speech API type shims (not in default TS lib) ---
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

const genId = () => Math.random().toString(36).slice(2, 10);
const nowTime = () => new Date().toLocaleTimeString([], { hour12: false });

function wsUrl(path: string) {
  const envWs = import.meta.env.VITE_WS_URL;
  if (envWs) {
    return `${envWs.replace(/\/$/, '')}${path}`;
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}${path}`;
}

export function useVoiceAssistant() {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micSupported, setMicSupported] = useState(true);
  const [micError, setMicError] = useState<string | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  const [commandCenter, setCommandCenter] = useState<CommandCenterState>({
    currentTask: null,
    agent: null,
    tools: [],
    status: 'IDLE',
    progress: 0,
  });
  const [pendingConfirmation, setPendingConfirmation] = useState<PendingConfirmation | null>(null);
  const [history, setHistory] = useState<VoiceHistoryItem[]>([]);
  const [autoListen, setAutoListen] = useState(false);
  const [lastResponse, setLastResponse] = useState<string>('');

  const socketRef = useRef<WebSocket | null>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const conversationIdRef = useRef<string>(genId());

  const addMessage = useJarvisStore((s) => s.addMessage);

  const pushLog = useCallback((label: string, kind: ActivityLogEntry['kind']) => {
    setActivityLog((prev) => [
      ...prev.slice(-49),
      { id: genId(), timestamp: nowTime(), label, kind },
    ]);
  }, []);

  // ---- WebSocket lifecycle ----
  const ensureSocket = useCallback((): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        resolve(socketRef.current);
        return;
      }

      const socket = new WebSocket(wsUrl('/ws/voice'));
      socketRef.current = socket;

      socket.onopen = () => resolve(socket);
      socket.onerror = () => {
        setVoiceState('error');
        setMicError('Could not reach JARVIS backend (WebSocket).');
        reject(new Error('WebSocket connection failed'));
      };

      socket.onmessage = (event) => {
        try {
          handleServerEvent(JSON.parse(event.data));
        } catch (e) {
          console.error('Bad voice event', e);
        }
      };

      socket.onclose = () => {
        socketRef.current = null;
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleServerEvent = useCallback((evt: any) => {
    switch (evt.type) {
      case 'status':
        if (evt.stage === 'THINKING') { setVoiceState('thinking'); pushLog(evt.message || 'Thinking...', 'status'); }
        else if (evt.stage === 'EXECUTING') { setVoiceState('executing'); pushLog(evt.message || 'Executing...', 'status'); }
        else if (evt.stage === 'SPEAKING') { setVoiceState('speaking'); pushLog(evt.message || 'Responding...', 'status'); }
        else if (evt.stage === 'ERROR') { setVoiceState('error'); }
        else if (evt.stage === 'DONE') {
          setCommandCenter((c) => ({ ...c, status: 'DONE', progress: 100 }));
        }
        break;

      case 'agent_selected':
        setCommandCenter((c) => ({ ...c, agent: evt.agent, status: 'EXECUTING', progress: 20 }));
        pushLog(`${evt.agent} activated`, 'agent');
        break;

      case 'tool_start':
        setCommandCenter((c) => ({
          ...c,
          tools: c.tools.includes(evt.tool) ? c.tools : [...c.tools, evt.tool],
          progress: Math.min(80, c.progress + 25),
        }));
        pushLog(evt.message || `Running ${evt.tool}`, 'tool_start');
        break;

      case 'tool_complete':
        setCommandCenter((c) => ({ ...c, progress: Math.min(95, c.progress + 25) }));
        pushLog(`${evt.tool} completed`, 'tool_complete');
        break;

      case 'confirmation_required':
        setPendingConfirmation({ tool: evt.tool, args: evt.args || {}, reason: evt.reason || 'Confirmation required.' });
        setVoiceState('idle');
        pushLog(`Confirmation required: ${evt.reason}`, 'error');
        break;

      case 'response': {
        setVoiceState('speaking');
        setLastResponse(evt.content);
        pushLog(`${evt.agent}: response ready`, 'response');
        speak(evt.speech || evt.content);

        addMessage({
          id: genId(),
          role: 'assistant',
          content: evt.content,
          agent: evt.agent,
          executed_tools: evt.executed_tools || [],
          timestamp: nowTime(),
        });

        setHistory((prev) => [
          { id: genId(), transcript: prev.length ? prev[prev.length - 1].transcript : '', timestamp: nowTime(), agent: evt.agent, response: evt.content },
          ...prev,
        ].slice(0, 20));

        setCommandCenter((c) => ({ ...c, currentTask: null, status: 'DONE', progress: 100 }));
        break;
      }

      case 'error':
        setVoiceState('error');
        pushLog(evt.error || 'Unknown error', 'error');
        setCommandCenter((c) => ({ ...c, status: 'ERROR' }));
        break;

      default:
        break;
    }
  }, [addMessage, pushLog]);

  // ---- Text-to-speech ----
  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) {
      setVoiceState('idle');
      return;
    }
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 0.95;
    utter.onend = () => setVoiceState('idle');
    utter.onerror = () => setVoiceState('idle');
    synthRef.current.speak(utter);
  }, []);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setVoiceState('idle');
  }, []);

  // ---- Sending a command (from voice OR typed text) ----
  const sendCommand = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setCommandCenter({ currentTask: text, agent: null, tools: [], status: 'EXECUTING', progress: 5 });
    setActivityLog((prev) => [...prev.slice(-49), { id: genId(), timestamp: nowTime(), label: `Voice command received: "${text}"`, kind: 'status' }]);

    addMessage({ id: genId(), role: 'user', content: text, timestamp: nowTime() });

    try {
      const socket = await ensureSocket();
      socket.send(JSON.stringify({
        type: 'user_text',
        text,
        history: [],
        conversation_id: conversationIdRef.current,
      }));
    } catch (e) {
      setVoiceState('error');
      pushLog('Could not send command -- backend unreachable.', 'error');
    }
  }, [ensureSocket, addMessage, pushLog]);

  const confirmPendingAction = useCallback(async (approved: boolean) => {
    if (!pendingConfirmation) return;
    try {
      const socket = await ensureSocket();
      socket.send(JSON.stringify({
        type: 'confirm_action',
        approved,
        tool: pendingConfirmation.tool,
        args: pendingConfirmation.args,
      }));
    } finally {
      setPendingConfirmation(null);
    }
  }, [pendingConfirmation, ensureSocket]);

  // ---- Speech-to-text ----
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setMicSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalText = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) finalText += res[0].transcript;
        else interim += res[0].transcript;
      }
      setInterimTranscript(interim);
      if (finalText.trim()) {
        setTranscript(finalText.trim());
        sendCommand(finalText.trim());
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        setVoiceState('idle');
        return;
      }
      setMicError(`Microphone error: ${event.error}`);
      setVoiceState('error');
    };

    recognition.onend = () => {
      setInterimTranscript('');
      setVoiceState((s) => (s === 'listening' ? 'idle' : s));
    };

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendCommand]);

  const startListening = useCallback(() => {
    setMicError(null);
    if (!recognitionRef.current) {
      setMicError('Voice input is not supported in this browser. Try Chrome or Edge.');
      return;
    }
    ensureSocket().catch(() => {});
    try {
      setVoiceState('listening');
      setTranscript('');
      recognitionRef.current.start();
    } catch {
      // Already-started errors are safe to ignore
    }
  }, [ensureSocket]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState('idle');
  }, []);

  useEffect(() => {
    return () => {
      socketRef.current?.close();
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  }, []);

  return {
    voiceState,
    transcript,
    interimTranscript,
    micSupported,
    micError,
    activityLog,
    commandCenter,
    pendingConfirmation,
    history,
    lastResponse,
    autoListen,
    setAutoListen,
    startListening,
    stopListening,
    stopSpeaking,
    sendCommand,
    confirmPendingAction,
  };
}
