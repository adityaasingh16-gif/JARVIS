from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.agents.research_agent import ResearchAgent
from app.ai.openai_provider import OpenAIProvider

router = APIRouter(prefix="/research", tags=["research"])
research_agent = ResearchAgent(OpenAIProvider())

class ResearchRequest(BaseModel):
    topic: str
    compare_with: Optional[str] = None

@router.post("")
async def create_research(req: ResearchRequest) -> Dict[str, Any]:
    return await research_agent.execute_research(topic=req.topic, compare_with=req.compare_with)
