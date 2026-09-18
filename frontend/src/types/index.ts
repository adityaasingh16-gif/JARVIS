export type ActivePage = 
  | 'home'
  | 'dashboard'
  | 'chat'
  | 'research'
  | 'projects'
  | 'developer'
  | 'computer'
  | 'memory'
  | 'tasks'
  | 'settings';

export interface ToolExecution {
  name: string;
  arguments: Record<string, any>;
  output?: any;
}

// ---- Voice pipeline ----

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'executing'
  | 'speaking'
  | 'error';

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  label: string;
  kind: 'status' | 'agent' | 'tool_start' | 'tool_complete' | 'error' | 'response';
}

export interface CommandCenterState {
  currentTask: string | null;
  agent: string | null;
  tools: string[];
  status: 'IDLE' | 'EXECUTING' | 'DONE' | 'ERROR';
  progress: number; // 0-100, approximate
}

export interface PendingConfirmation {
  tool: string;
  args: Record<string, any>;
  reason: string;
}

export interface VoiceHistoryItem {
  id: string;
  transcript: string;
  timestamp: string;
  agent?: string;
  response?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  agent?: string;
  timestamp: string;
  executed_tools?: ToolExecution[];
}

export interface SystemStatus {
  ai_engine: string;
  research_agent: string;
  browser_agent: string;
  computer_control: string;
  memory_store: string;
  github_agent: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  architecture?: string;
  repo_url?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  task_type: string;
  progress: number;
}
