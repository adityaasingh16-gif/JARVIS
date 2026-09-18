from typing import Dict, Any
from app.ai.prompts import DEVELOPER_AGENT_SYSTEM_PROMPT
from app.tools.code_analysis import inspect_repository, execute_terminal_command

class DeveloperAgent:
    """Specialized Developer Subagent for code review, repo inspection, and terminal test execution."""

    def __init__(self, provider):
        self.provider = provider

    async def analyze_project(self, repo_path: str) -> Dict[str, Any]:
        repo_info = await inspect_repository(repo_path)
        if "error" in repo_info:
            return repo_info

        prompt = f"Analyze the architecture and codebase structure of repository at '{repo_path}':\n{repo_info}"
        messages = [{"role": "user", "content": prompt}]
        res = await self.provider.generate(
            messages=messages,
            system_prompt=DEVELOPER_AGENT_SYSTEM_PROMPT
        )

        return {
            "repo_path": repo_path,
            "architecture_analysis": res.get("content", ""),
            "repo_info": repo_info
        }
