import { create } from 'zustand';
import { ActivePage, Message, SystemStatus, ProjectItem, TaskItem } from '../types';
import { fetchSystemStatus, fetchProjects, fetchTasks, sendChatMessage } from '../services/api';

interface JarvisState {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  
  messages: Message[];
  isStreaming: boolean;
  addMessage: (msg: Message) => void;
  updateLastMessageContent: (text: string) => void;

  systemStatus: SystemStatus;
  loadSystemStatus: () => Promise<void>;

  projects: ProjectItem[];
  loadProjects: () => Promise<void>;

  tasks: TaskItem[];
  loadTasks: () => Promise<void>;

  sendMessage: (userText: string) => Promise<void>;
}

export const useJarvisStore = create<JarvisState>((set, get) => ({
  activePage: 'home',
  setActivePage: (page) => set({ activePage: page }),

  messages: [
    {
      id: 'welcome-1',
      role: 'assistant',
      content: 'Greetings. I am **JARVIS** — your personal AI research, development, and desktop assistant. How may I assist you today?',
      agent: 'CoreAssistantAgent',
      timestamp: new Date().toLocaleTimeString()
    }
  ],
  isStreaming: false,

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessageContent: (text) => set((state) => {
    const updated = [...state.messages];
    if (updated.length > 0) {
      updated[updated.length - 1].content += text;
    }
    return { messages: updated };
  }),

  systemStatus: {
    ai_engine: 'ONLINE',
    research_agent: 'READY',
    browser_agent: 'READY',
    computer_control: 'READY',
    memory_store: 'ONLINE',
    github_agent: 'CONNECTED'
  },
  loadSystemStatus: async () => {
    const status = await fetchSystemStatus();
    set({ systemStatus: status });
  },

  projects: [],
  loadProjects: async () => {
    const projects = await fetchProjects();
    set({ projects });
  },

  tasks: [],
  loadTasks: async () => {
    const tasks = await fetchTasks();
    set({ tasks });
  },

  sendMessage: async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString()
    };
    
    get().addMessage(userMsg);
    set({ isStreaming: true });

    try {
      const response = await sendChatMessage(userText);
      const assistantMsg: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.content || 'Response completed.',
        agent: response.agent || 'CoreAssistant',
        executed_tools: response.executed_tools || [],
        timestamp: new Date().toLocaleTimeString()
      };
      get().addMessage(assistantMsg);
    } catch (e) {
      get().addMessage({
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an operational issue connecting to backend services: ${String(e)}`,
        agent: 'System',
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      set({ isStreaming: false });
    }
  }
}));
