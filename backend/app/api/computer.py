from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.computer_agent import ComputerAgent
from app.ai.openai_provider import OpenAIProvider

router = APIRouter(prefix="/computer", tags=["computer"])
computer_agent = ComputerAgent(OpenAIProvider())

class LaunchRequest(BaseModel):
    app_name: str

@router.get("/status")
async def get_computer_status():
    return await computer_agent.get_status()

@router.post("/launch")
async def launch_app(req: LaunchRequest):
    return await computer_agent.launch_app(req.app_name)
