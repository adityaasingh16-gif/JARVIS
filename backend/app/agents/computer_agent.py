from typing import Dict, Any
from app.ai.prompts import COMPUTER_AGENT_SYSTEM_PROMPT
from app.tools.os_control import get_system_status, launch_application

class ComputerAgent:
    """Specialized Computer Automation Subagent for desktop control and OS interactions."""

    def __init__(self, provider):
        self.provider = provider

    async def get_status(self) -> Dict[str, Any]:
        return await get_system_status()

    async def launch_app(self, app_name: str) -> Dict[str, Any]:
        return await launch_application(app_name)
