import inspect
import time
from typing import Dict, Any, Callable, List
from app.security.permissions import RiskLevel, permission_engine
from app.tools.web_search import execute_web_search
from app.tools.academic_search import execute_academic_search
from app.tools.code_analysis import inspect_repository, execute_terminal_command
from app.tools.os_control import get_system_status, launch_application

class Tool:
    def __init__(
        self,
        name: str,
        description: str,
        func: Callable,
        risk_level: RiskLevel = RiskLevel.LOW,
        parameters: Dict[str, Any] = None
    ):
        self.name = name
        self.description = description
        self.func = func
        self.risk_level = risk_level
        self.parameters = parameters or {"type": "object", "properties": {}}

    def to_openai_schema(self) -> Dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }

class ToolRegistry:
    def __init__(self):
        self._tools: Dict[str, Tool] = {}
        self._register_default_tools()

    def register(self, tool: Tool):
        self._tools[tool.name] = tool

    def get_tool(self, name: str) -> Tool:
        return self._tools.get(name)

    def get_all_schemas(self) -> List[Dict[str, Any]]:
        return [t.to_openai_schema() for t in self._tools.values()]

    async def execute_tool(self, name: str, args: Dict[str, Any]) -> Dict[str, Any]:
        tool = self._tools.get(name)
        if not tool:
            return {"error": f"Tool '{name}' is not registered."}

        # Check risk permissions
        permission = permission_engine.evaluate_risk(tool.name, args, tool.risk_level)
        if not permission["allowed"]:
            return {
                "status": "REQUIRES_APPROVAL",
                "tool_name": name,
                "risk_level": tool.risk_level,
                "reason": permission["reason"],
                "args": args
            }

        start_time = time.time()
        try:
            if inspect.iscoroutinefunction(tool.func):
                result = await tool.func(**args)
            else:
                result = tool.func(**args)
            duration_ms = (time.time() - start_time) * 1000
            return {
                "status": "SUCCESS",
                "tool_name": name,
                "risk_level": tool.risk_level,
                "duration_ms": duration_ms,
                "result": result
            }
        except Exception as e:
            return {
                "status": "ERROR",
                "tool_name": name,
                "error": str(e)
            }

    def _register_default_tools(self):
        self.register(Tool(
            name="web_search",
            description="Searches the web for latest news, technological developments, and general knowledge.",
            func=execute_web_search,
            risk_level=RiskLevel.LOW,
            parameters={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query term"}
                },
                "required": ["query"]
            }
        ))

        self.register(Tool(
            name="academic_search",
            description="Searches academic paper databases (arXiv, Semantic Scholar) for research papers, methodologies, and findings.",
            func=execute_academic_search,
            risk_level=RiskLevel.LOW,
            parameters={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "Research paper topic or keyword"}
                },
                "required": ["query"]
            }
        ))

        self.register(Tool(
            name="inspect_repository",
            description="Inspects local directory structure, code files, routes, controllers, and architecture.",
            func=inspect_repository,
            risk_level=RiskLevel.LOW,
            parameters={
                "type": "object",
                "properties": {
                    "repo_path": {"type": "string", "description": "Absolute or relative path to the repository directory"}
                },
                "required": ["repo_path"]
            }
        ))

        self.register(Tool(
            name="execute_terminal_command",
            description="Executes a CLI command in the terminal (e.g. npm test, pytest, git status).",
            func=execute_terminal_command,
            risk_level=RiskLevel.MEDIUM,
            parameters={
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Terminal command string"},
                    "cwd": {"type": "string", "description": "Working directory"}
                },
                "required": ["command"]
            }
        ))

        self.register(Tool(
            name="get_system_status",
            description="Retrieves current OS hardware, environment status, and engine readiness metrics.",
            func=get_system_status,
            risk_level=RiskLevel.LOW
        ))

        self.register(Tool(
            name="launch_application",
            description="Launches a desktop application such as VS Code or Browser.",
            func=launch_application,
            risk_level=RiskLevel.MEDIUM,
            parameters={
                "type": "object",
                "properties": {
                    "app_name": {"type": "string", "description": "Application name to launch"}
                },
                "required": ["app_name"]
            }
        ))

tool_registry = ToolRegistry()
