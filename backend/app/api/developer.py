from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.developer_agent import DeveloperAgent
from app.ai.openai_provider import OpenAIProvider

router = APIRouter(prefix="/developer", tags=["developer"])
dev_agent = DeveloperAgent(OpenAIProvider())

class InspectRequest(BaseModel):
    repo_path: str = "."

@router.post("/inspect")
async def inspect_codebase(req: InspectRequest):
    return await dev_agent.analyze_project(req.repo_path)
