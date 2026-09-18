import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.ai.orchestrator import orchestrator
from app.ai.openai_provider import OpenAIProvider

logger = logging.getLogger("VoicePipeline")
router = APIRouter(tags=["voice"])

_provider = OpenAIProvider()


def make_speech_summary(content: str, max_sentences: int = 3) -> str:
    """JARVIS should speak a short natural summary, not read entire reports aloud
    (spec section 17). We keep the full content for on-screen display and only
    shorten what actually gets sent to the browser's speech synthesizer."""
    if not content:
        return "Done. I don't have anything further to add."

    # crude sentence split -- good enough for a spoken summary, not for parsing
    sentences = [s.strip() for s in content.replace("\n", " ").split(". ") if s.strip()]
    if len(sentences) <= max_sentences:
        return content if len(content) < 400 else ". ".join(sentences[:max_sentences]) + "."

    summary = ". ".join(sentences[:max_sentences])
    if not summary.endswith("."):
        summary += "."
    return summary + " I've put the full detail on screen."


@router.websocket("/ws/voice")
async def voice_pipeline(websocket: WebSocket):
    """
    Full voice-first pipeline. Protocol (JSON messages both ways):

    Client -> Server:
      { "type": "user_text", "text": "...", "history": [...], "conversation_id": "..." }
        (the browser does STT locally via the Web Speech API and sends the
         transcript here -- see useVoiceAssistant.ts on the frontend)
      { "type": "confirm_action", "approved": true/false, "tool": "...", "args": {...} }

    Server -> Client:
      { "type": "status", "stage": "LISTENING|THINKING|EXECUTING|SPEAKING|DONE|ERROR", "message": "..." }
      { "type": "agent_selected", "agent": "ResearchAgent" }
      { "type": "tool_start", "tool": "...", "message": "..." }
      { "type": "tool_complete", "tool": "...", ... }
      { "type": "confirmation_required", "tool": "...", "reason": "..." }
      { "type": "response", "agent": "...", "content": "...", "speech": "...", "metadata": {...} }
      { "type": "error", "error": "..." }
    """
    await websocket.accept()
    logger.info("Voice client connected")

    async def emit(event: dict):
        await websocket.send_json(event)

    try:
        while True:
            raw = await websocket.receive_text()
            data = json.loads(raw)
            msg_type = data.get("type", "user_text")

            if msg_type == "confirm_action":
                # The frontend re-sends the exact tool/args after the user
                # taps CONFIRM on a high-risk action dialog. We re-run it
                # through the tool registry, bypassing nothing except the
                # permission gate itself (the user IS the confirmation).
                if not data.get("approved"):
                    await emit({"type": "status", "stage": "DONE", "message": "Action cancelled."})
                    continue

                tool_name = data.get("tool")
                args = data.get("args", {})
                await emit({"type": "status", "stage": "EXECUTING", "message": f"Executing {tool_name}..."})
                tool = orchestrator.tool_registry.get_tool(tool_name)
                if not tool:
                    await emit({"type": "error", "error": f"Unknown tool '{tool_name}'."})
                    continue
                result = await tool.func(**args)
                await emit({"type": "tool_complete", "tool": tool_name, "result": result})
                await emit({
                    "type": "response",
                    "agent": "ComputerAgent",
                    "content": "Action completed as confirmed.",
                    "speech": "Done. Action completed.",
                    "metadata": {"result": result},
                })
                await emit({"type": "status", "stage": "DONE"})
                continue

            user_text = data.get("text", "").strip()
            history = data.get("history", [])
            conversation_id = data.get("conversation_id", "default")

            if not user_text:
                await emit({"type": "error", "error": "Empty voice command received."})
                continue

            await emit({"type": "status", "stage": "LISTENING", "message": "Command received", "transcript": user_text})

            try:
                result = await orchestrator.route_and_execute(
                    user_message=user_text,
                    history=history,
                    conversation_id=conversation_id,
                    emit=emit,
                )
            except Exception as e:
                logger.error(f"Orchestrator error: {e}")
                await emit({"type": "error", "error": f"I ran into a problem processing that: {str(e)}"})
                await emit({"type": "status", "stage": "ERROR"})
                continue

            content = result.get("content", "")
            speech = make_speech_summary(content)

            await emit({"type": "status", "stage": "SPEAKING", "message": "Responding..."})
            await emit({
                "type": "response",
                "agent": result.get("agent", "CoreAssistantAgent"),
                "content": content,
                "speech": speech,
                "metadata": result.get("metadata", {}),
                "executed_tools": result.get("executed_tools", []),
            })
            await emit({"type": "status", "stage": "DONE"})

    except WebSocketDisconnect:
        logger.info("Voice client disconnected")
    except Exception as e:
        logger.error(f"Voice pipeline error: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except Exception:
            pass
