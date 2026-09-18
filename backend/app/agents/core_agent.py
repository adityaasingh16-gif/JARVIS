from typing import Dict, Any, List
from app.ai.prompts import JARVIS_CORE_SYSTEM_PROMPT

class CoreAssistantAgent:
    """Core JARVIS Agent responsible for intent routing, multi-tool delegation, and main conversation flow."""

    def __init__(self, provider, tool_registry):
        self.provider = provider
        self.tool_registry = tool_registry

    async def run(self, user_message: str, history: List[Dict[str, Any]] = None) -> Dict[str, Any]:
        messages = history or []
        messages.append({"role": "user", "content": user_message})

        tools_schema = self.tool_registry.get_all_schemas()

        # Generate single response or determine tool invocation
        ai_response = await self.provider.generate(
            messages=messages,
            system_prompt=JARVIS_CORE_SYSTEM_PROMPT,
            tools=tools_schema
        )

        executed_tools = []
        # Handle tool calls if returned by LLM
        if ai_response.get("tool_calls"):
            for tc in ai_response["tool_calls"]:
                tool_output = await self.tool_registry.execute_tool(tc["name"], tc["arguments"])
                executed_tools.append({
                    "name": tc["name"],
                    "arguments": tc["arguments"],
                    "output": tool_output
                })
                # Append tool output message to context
                messages.append({
                    "role": "assistant",
                    "content": None,
                    "tool_calls": [tc]
                })
                messages.append({
                    "role": "tool",
                    "content": str(tool_output),
                    "tool_call_id": tc["id"]
                })

            # Re-generate synthesis after tool results
            final_response = await self.provider.generate(
                messages=messages,
                system_prompt=JARVIS_CORE_SYSTEM_PROMPT
            )
            return {
                "content": final_response.get("content", ""),
                "executed_tools": executed_tools
            }

        return {
            "content": ai_response.get("content", ""),
            "executed_tools": []
        }
