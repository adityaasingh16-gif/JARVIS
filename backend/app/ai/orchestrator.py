import logging
import re
from typing import Dict, Any, List, Optional, Callable, Awaitable
from app.ai.openai_provider import OpenAIProvider
from app.ai.tools import tool_registry
from app.agents.core_agent import CoreAssistantAgent
from app.agents.research_agent import ResearchAgent
from app.agents.developer_agent import DeveloperAgent
from app.agents.computer_agent import ComputerAgent
from app.agents.document_agent import DocumentAgent

logger = logging.getLogger("AgentOrchestrator")

EventEmitter = Optional[Callable[[Dict[str, Any]], Awaitable[None]]]

# Words that continue a previous request rather than starting a new one
CONTINUATION_MARKERS = (
    "focus", "narrow", "now compare", "compare it", "compare that",
    "what about", "also check", "instead", "go deeper", "expand on",
    "and now", "continue"
)

OPEN_APP_PATTERN = re.compile(
    r"\b(open|launch|start|fire up)\b\s+(?:the\s+|my\s+)?(.+)", re.IGNORECASE
)

DESTRUCTIVE_PATTERNS = ("delete", "remove all", "wipe", "format", "uninstall", "drop table", "rm -rf")


class AgentOrchestrator:
    """Master Orchestrator classifying request intent, routing to specialized agents,
    and (optionally) streaming progress events for voice / live-UI consumption."""

    def __init__(self):
        self.provider = OpenAIProvider()
        self.tool_registry = tool_registry

        self.core_agent = CoreAssistantAgent(self.provider, self.tool_registry)
        self.research_agent = ResearchAgent(self.provider)
        self.developer_agent = DeveloperAgent(self.provider)
        self.computer_agent = ComputerAgent(self.provider)
        self.document_agent = DocumentAgent(self.provider)

        # Very lightweight per-process conversational memory of the last topic,
        # keyed by conversation_id, so voice follow-ups ("now compare it with X")
        # don't need to repeat context. Not a replacement for the DB-backed
        # conversation history -- just enough for natural voice continuity.
        self._last_topic: Dict[str, str] = {}

    async def _emit(self, emit: EventEmitter, event: Dict[str, Any]):
        if emit:
            try:
                await emit(event)
            except Exception as e:  # never let a UI/voice event break execution
                logger.warning(f"Event emit failed: {e}")

    def classify_intent(self, message: str) -> str:
        lowered = message.lower().strip()

        if any(marker in lowered for marker in CONTINUATION_MARKERS):
            return "continuation"
        if OPEN_APP_PATTERN.search(lowered) or "screenshot" in lowered or "system status" in lowered:
            return "computer"
        if "research" in lowered or "paper" in lowered or "literature" in lowered or "academic" in lowered:
            return "research"
        if "analyze" in lowered and ("project" in lowered or "repo" in lowered or "codebase" in lowered):
            return "developer"
        if "codebase" in lowered or "inspect project" in lowered or "analyze repo" in lowered:
            return "developer"
        if "run the tests" in lowered or "run tests" in lowered or "execute test" in lowered:
            return "developer_tests"
        if "summarize" in lowered and ("document" in lowered or "file" in lowered or "doc" in lowered):
            return "document"
        return "core"

    async def route_and_execute(
        self,
        user_message: str,
        history: List[Dict[str, Any]] = None,
        conversation_id: str = "default",
        emit: EventEmitter = None,
    ) -> Dict[str, Any]:
        """Routes a request to the right agent and executes it, emitting progress
        events along the way (used by both the REST /chat endpoint and the
        voice pipeline)."""

        await self._emit(emit, {"type": "status", "stage": "THINKING", "message": "Understanding request..."})

        intent = self.classify_intent(user_message)
        effective_message = user_message

        if intent == "continuation":
            prior = self._last_topic.get(conversation_id)
            if prior:
                effective_message = f"{user_message} (previous topic: {prior})"
                intent = "research"  # continuations in this build are research-flavored
            else:
                intent = "core"

        if intent == "research":
            await self._emit(emit, {"type": "agent_selected", "agent": "ResearchAgent"})
            await self._emit(emit, {"type": "tool_start", "tool": "web_search", "message": "Searching the web..."})
            await self._emit(emit, {"type": "tool_start", "tool": "academic_search", "message": "Querying academic sources..."})

            res = await self.research_agent.execute_research(topic=effective_message)
            self._last_topic[conversation_id] = user_message

            await self._emit(emit, {"type": "tool_complete", "tool": "academic_search",
                                     "count": len(res.get("academic_sources", []))})
            await self._emit(emit, {"type": "status", "stage": "EXECUTING", "message": "Synthesizing findings..."})

            return {
                "agent": "ResearchAgent",
                "content": res.get("report", ""),
                "metadata": {
                    "sources": res.get("academic_sources", []),
                    "web_sources": res.get("web_sources", []),
                },
            }

        elif intent == "developer" or intent == "developer_tests":
            await self._emit(emit, {"type": "agent_selected", "agent": "DeveloperAgent"})
            if intent == "developer_tests":
                await self._emit(emit, {"type": "tool_start", "tool": "execute_terminal_command",
                                         "message": "Running test suite..."})
                result = await self.tool_registry.execute_tool(
                    "execute_terminal_command", {"command": "pytest -q", "cwd": "."}
                )
                await self._emit(emit, {"type": "tool_complete", "tool": "execute_terminal_command"})
                content = (
                    f"Test run finished with exit code {result.get('result', {}).get('returncode', 'n/a')}."
                    if result.get("status") == "SUCCESS" else
                    f"I couldn't run the tests: {result.get('error', result.get('reason', 'unknown error'))}"
                )
                return {"agent": "DeveloperAgent", "content": content, "metadata": result}

            await self._emit(emit, {"type": "tool_start", "tool": "inspect_repository",
                                     "message": "Inspecting project structure..."})
            res = await self.developer_agent.analyze_project(repo_path=".")
            await self._emit(emit, {"type": "tool_complete", "tool": "inspect_repository"})
            return {
                "agent": "DeveloperAgent",
                "content": res.get("architecture_analysis", res.get("error", "")),
                "metadata": res.get("repo_info", {}),
            }

        elif intent == "computer":
            await self._emit(emit, {"type": "agent_selected", "agent": "ComputerAgent"})
            lowered = user_message.lower()

            if "system status" in lowered:
                await self._emit(emit, {"type": "tool_start", "tool": "get_system_status"})
                status = await self.computer_agent.get_status()
                await self._emit(emit, {"type": "tool_complete", "tool": "get_system_status"})
                return {"agent": "ComputerAgent",
                        "content": "Here is the current system status.",
                        "metadata": status}

            match = OPEN_APP_PATTERN.search(user_message)
            app_name = match.group(2).strip().rstrip(".!") if match else user_message

            if any(p in lowered for p in DESTRUCTIVE_PATTERNS):
                await self._emit(emit, {
                    "type": "confirmation_required",
                    "tool": "launch_application",
                    "reason": f"'{app_name}' looks like a destructive action.",
                })
                return {
                    "agent": "ComputerAgent",
                    "content": f"That sounds like a destructive action ('{app_name}'). I need explicit confirmation before proceeding.",
                    "metadata": {"requires_confirmation": True},
                }

            await self._emit(emit, {"type": "tool_start", "tool": "launch_application",
                                     "message": f"Launching {app_name}..."})
            result = await self.tool_registry.execute_tool("launch_application", {"app_name": app_name})
            await self._emit(emit, {"type": "tool_complete", "tool": "launch_application", "result": result})

            if result.get("status") == "SUCCESS":
                content = result["result"].get("message", f"Launched {app_name}.")
            elif result.get("status") == "REQUIRES_APPROVAL":
                content = f"Launching '{app_name}' needs your confirmation first."
            else:
                content = f"I couldn't launch '{app_name}': {result.get('error', 'unknown error')}"

            return {"agent": "ComputerAgent", "content": content, "metadata": result}

        elif intent == "document":
            await self._emit(emit, {"type": "agent_selected", "agent": "DocumentAgent"})
            return {
                "agent": "DocumentAgent",
                "content": "Tell me the file path (or attach the document) and I'll summarize it.",
                "metadata": {},
            }

        else:
            await self._emit(emit, {"type": "agent_selected", "agent": "CoreAssistantAgent"})
            res = await self.core_agent.run(user_message, history)
            for t in res.get("executed_tools", []):
                await self._emit(emit, {"type": "tool_complete", "tool": t["name"]})
            return {
                "agent": "CoreAssistantAgent",
                "content": res.get("content", ""),
                "executed_tools": res.get("executed_tools", []),
            }


orchestrator = AgentOrchestrator()
