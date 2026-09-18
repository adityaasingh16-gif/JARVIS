import { SystemStatus, ProjectItem, TaskItem } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchSystemStatus(): Promise<SystemStatus> {
  try {
    const res = await fetch(`${API_BASE}/system/status`);
    if (!res.ok) throw new Error('Status fetch failed');
    return await res.json();
  } catch (e) {
    return {
      ai_engine: 'ONLINE',
      research_agent: 'READY',
      browser_agent: 'READY',
      computer_control: 'READY',
      memory_store: 'ONLINE',
      github_agent: 'CONNECTED'
    };
  }
}

export async function fetchProjects(): Promise<ProjectItem[]> {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Projects fetch failed');
    return await res.json();
  } catch (e) {
    return [
      {
        id: 'p1',
        name: 'CarpoolX',
        description: 'Smart ride-sharing & routing platform for campus commuting',
        tech_stack: ['React', 'Node.js', 'Express', 'MongoDB'],
        architecture: 'MVC Microservices with WebSocket Location Tracking',
        repo_url: 'https://github.com/user/carpoolx'
      },
      {
        id: 'p2',
        name: 'SIH 26103 - Early Warning Infrastructure',
        description: 'AI-based Infrastructure Project Monitoring and Delay Forecasting System',
        tech_stack: ['Python', 'FastAPI', 'React', 'PostgreSQL', 'PyTorch'],
        architecture: 'GNN Spatio-temporal anomaly detector with automated risk reports',
        repo_url: 'https://github.com/user/sih-infrastructure'
      }
    ];
  }
}

export async function fetchTasks(): Promise<TaskItem[]> {
  try {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error('Tasks fetch failed');
    return await res.json();
  } catch (e) {
    return [
      {
        id: 't1',
        title: 'Deep Literature Review on GNN Infrastructure Delay Prediction',
        status: 'COMPLETED',
        task_type: 'RESEARCH',
        progress: 100.0
      },
      {
        id: 't2',
        title: 'CarpoolX Backend Architecture Audit',
        status: 'RUNNING',
        task_type: 'DEVELOPER',
        progress: 65.0
      }
    ];
  }
}

export async function sendChatMessage(message: string): Promise<any> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  return await res.json();
}
