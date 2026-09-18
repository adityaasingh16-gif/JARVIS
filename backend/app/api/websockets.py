import json
import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.ai.openai_provider import OpenAIProvider
from app.ai.prompts import JARVIS_CORE_SYSTEM_PROMPT
from app.ai.tools import tool_registry

logger = logging.getLogger("WebSocketChat")
router = APIRouter(tags=["websockets"])

@router.websocket("/ws/chat")
async def websocket_chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    provider = OpenAIProvider()
    
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            user_message = data.get("message", "")
            history = data.get("history", [])

            await websocket.send_json({"type": "status", "status": "THINKING", "message": "JARVIS processing query..."})

            # Handle intent keyword checks for tool calls display
            if "search" in user_message.lower() or "research" in user_message.lower():
                await websocket.send_json({
                    "type": "tool_start",
                    "tool": "academic_search",
                    "message": "Querying arXiv and literature databases..."
                })
                tool_output = await tool_registry.execute_tool("academic_search", {"query": user_message})
                await websocket.send_json({
                    "type": "tool_complete",
                    "tool": "academic_search",
                    "result": tool_output
                })

            messages = history + [{"role": "user", "content": user_message}]

            # Stream LLM tokens back over WebSocket
            async for event in provider.generate_stream(messages=messages, system_prompt=JARVIS_CORE_SYSTEM_PROMPT):
                if event["type"] == "token":
                    await websocket.send_json({"type": "token", "token": event["content"]})
                elif event["type"] == "done":
                    await websocket.send_json({"type": "done"})

    except WebSocketDisconnect:
        logger.info("WebSocket connection closed by client.")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        try:
            await websocket.send_json({"type": "error", "error": str(e)})
        except:
            pass
