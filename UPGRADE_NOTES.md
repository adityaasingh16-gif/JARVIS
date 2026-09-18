# JARVIS V2 Upgrade Notes

This is an incremental upgrade of your existing FastAPI + React JARVIS project —
nothing was rewritten from scratch, and all existing agents/tools/APIs still work
exactly as before.

## What's new

**Backend**
- `app/api/voice.py` — new `/ws/voice` WebSocket: the real voice pipeline.
  Protocol is documented in the file's docstring. It streams `status`,
  `agent_selected`, `tool_start`, `tool_complete`, `confirmation_required`,
  and `response` events as the request is actually processed — nothing here
  is faked; every event corresponds to a real orchestrator/tool call.
- `app/ai/orchestrator.py` — rewritten with:
  - an `emit` callback so any caller (REST or voice) gets live progress events
  - wider intent routing: research / developer / developer_tests / computer
    (open app, system status) / document / core fallback
  - a lightweight per-conversation "last topic" memory so voice follow-ups
    like *"now compare it with our SIH project"* work without repeating context
  - a regex-based "open/launch X" parser so `launch_application` gets wired
    to natural voice phrasing instead of only being reachable via the REST form
- `app/security/permissions.py` — destructive commands (`rm -rf`, `drop table`,
  `format`, etc.) now escalate to HIGH risk and require confirmation *even if*
  the tool's default risk is MEDIUM, closing the gap the original prompt's
  "never auto-run destructive actions" requirement called out.

**Frontend**
- `src/hooks/useVoiceAssistant.ts` — the voice pipeline client: browser
  Speech-to-Text (Web Speech API — no external STT service or API key needed),
  Text-to-Speech (`speechSynthesis`, with responses shortened to a spoken
  summary while the full text still renders on screen), the WebSocket client,
  and the full listening → thinking → executing → speaking state machine.
- `src/components/voice/AICore.tsx` — the central animated AI core (idle /
  listening / thinking / executing / speaking / error), built in CSS for
  performance, not WebGL.
- `src/components/voice/CommandCenterPanel.tsx` + `ActivityFeed.tsx` — live,
  real (not mocked) view of the current task, active agent, tools invoked,
  and a timestamped activity log — spec sections 15/16.
- `src/components/voice/ConfirmationModal.tsx` — blocks high-risk actions
  until the user taps CONFIRM (spec section 7/24).
- `src/pages/HomePage.tsx` — the new voice-first home screen (spec section
  11), now the app's default page. Typing still works as a fallback next to
  the mic.
- `Sidebar.tsx` — collapsed to a compact icon rail that expands on hover,
  per spec section 14, with a new Home entry.

## How to run it

```bash
# backend
cd backend
pip install -r ../requirements.txt
uvicorn app.main:app --reload

# frontend (separate terminal)
cd frontend
npm install
npm run dev
```

Open the printed Vite URL. Voice input needs a Chromium-based browser
(Chrome/Edge) — Safari and Firefox don't yet support the Web Speech
Recognition API you'll fall back to typed input automatically there, with
a message under the mic explaining why.

Set `OPENAI_API_KEY` in `.env` for real LLM responses; without it every
provider call runs in the existing offline fallback mode (as it did before
this upgrade) so you can still exercise the whole pipeline end-to-end.

## What I verified myself (in a sandboxed container, no mic/speakers)

- Full TypeScript compile + production `vite build` — clean.
- Backend imports cleanly and every REST route still resolves.
- Ran the actual `/ws/voice` pipeline over a real WebSocket connection for
  both a "research" command and an "open VS Code" command and confirmed the
  correct sequence of live events and a final response — this is genuine
  execution, not a mock.

What I could *not* verify here: an actual microphone/speaker round-trip in a
real browser, and desktop app launching on your OS (the container is
headless Linux). Both use standard, well-documented browser/OS APIs, but
please do a real run-through — that's exactly the kind of thing worth
catching before you demo it.

## Honest scope callout

The original brief (`jarvis_prompt.txt`, section-numbered) is a large,
multi-week product spec. I implemented the highest-leverage voice-first
pieces end to end and verified them. Not yet built:

- WebGL/canvas AI core (current one is CSS — smoother performance, less
  "cinematic," a reasonable trade for a first pass)
- Full Settings page wiring (mic/voice selection, push-to-talk toggle,
  research-depth slider) — UI shell exists, not yet connected to state
- Document upload + summarization UI (the agent/endpoint exists; no upload
  widget yet)
- Persisting conversations/tasks to the DB (models already exist in
  `database/models.py` but aren't yet written to from the new voice flow)
- Screenshot tool (needs a GUI-capable OS to test properly)

If you want to keep building this out with fast iterate-test-fix loops
(especially anything touching the mic, desktop launch behavior across
OSes, or the DB persistence), **Claude Code** is a better fit than this
chat — it can run your dev servers persistently and let you test changes
live instead of only reviewing a zipped diff.
