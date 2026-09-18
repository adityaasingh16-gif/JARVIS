# JARVIS — Personal AI Research, Development & Desktop Assistant

**JARVIS** is an extensible personal AI operating layer built for researchers and developers. It unifies natural language text/voice interaction, deep academic paper research, automated literature reviews, codebase architecture auditing, pgvector long-term memory, and controlled desktop automation.

---

## 🏛️ System Architecture

```
                ┌─────────────────────────┐
                │          USER           │
                │    Text + Voice Input   │
                └────────────┬────────────┘
                             │
                             ▼
                ┌─────────────────────────┐
                │       JARVIS UI         │
                │ React + TypeScript      │
                └────────────┬────────────┘
                             │
                        WebSocket
                             │
                             ▼
                ┌─────────────────────────┐
                │       FASTAPI           │
                │      Backend API        │
                └────────────┬────────────┘
                             │
                             ▼
                ┌─────────────────────────┐
                │     AGENT ORCHESTRATOR  │
                │       LangGraph         │
                └────────────┬────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   Research Agent       Developer Agent      Computer Agent
        │                    │                    │
        ▼                    ▼                    ▼
   Web / Papers          GitHub / Code        Browser / OS
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                ┌─────────────────────────┐
                │    MEMORY / KNOWLEDGE   │
                │ PostgreSQL + pgvector   │
                └─────────────────────────┘
```

---

## ⚡ Tech Stack

* **Backend**: Python 3.12+, FastAPI, Pydantic v2, WebSockets, AsyncIO, SQLAlchemy, PostgreSQL, `pgvector`, SQLite fallback.
* **AI & Agents**: OpenAI API / Provider Abstraction, LangGraph multi-agent orchestrator, Tool Registry with risk permissions.
* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Zustand, Lucide Icons, futuristic dark command center UI.
* **Testing & Tools**: Pytest, Async HTTPX, PyAutoGUI, Playwright.

---

## 🚀 Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend Server
```bash
cd backend
python -m pytest -v          # Run full backend test suite
python -m app.main           # Or uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Development UI
```bash
cd frontend
npm install
npm run dev                  # Launches on http://localhost:5173
```

---

## 🛡️ Security Model

JARVIS enforces tool risk permission ratings:
* **LOW**: Web search, academic arXiv search, system status, file read. (Auto-approved)
* **MEDIUM**: Code editing, test execution, desktop app launcher. (Logged & monitored)
* **HIGH**: File deletion, system configuration modification, arbitrary script execution. (Explicit user confirmation required)

Secret redaction automatically strips API tokens (`sk-...`, `ghp_...`, passwords) from log streams and response content.

---

## 🧪 Testing

Run backend tests:
```bash
python -m pytest -v
```
All 11 integration & unit test suites cover AI provider fallbacks, WebSocket chat, tool registry risk checks, and multi-agent intent routing.
