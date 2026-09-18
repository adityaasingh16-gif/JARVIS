from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.ai.orchestrator import orchestrator

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[Dict[str, Any]]] = None

class ChatResponse(BaseModel):
    agent: str
    content: str
    executed_tools: Optional[List[Dict[str, Any]]] = []
    metadata: Optional[Dict[str, Any]] = None

@router.post("", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    result = await orchestrator.route_and_execute(
        req.message, req.history, conversation_id=req.conversation_id or "default"
    )
    return ChatResponse(
        agent=result.get("agent", "CoreAssistant"),
        content=result.get("content", ""),
        executed_tools=result.get("executed_tools", []),
        metadata=result.get("metadata", {})
    )
