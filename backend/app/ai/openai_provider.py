import asyncio
import json
import logging
from typing import AsyncGenerator, List, Dict, Any, Optional
from openai import AsyncOpenAI
from app.ai.provider import BaseLLMProvider
from app.config import settings

logger = logging.getLogger("OpenAIProvider")

class OpenAIProvider(BaseLLMProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY
        if self.api_key:
            self.client = AsyncOpenAI(api_key=self.api_key)
        else:
            self.client = None
            logger.warning("OpenAI API key not configured. Fallback execution mode activated.")

    async def generate(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        target_model = model or settings.DEFAULT_MODEL
        
        if not self.client:
            # Fallback mock response for testing/offline mode
            last_msg = messages[-1]["content"] if messages else ""
            return {
                "content": f"[JARVIS Offline Mode] Received: {last_msg}. OpenAI API Key is not set in backend configuration.",
                "tool_calls": [],
                "usage": {"total_tokens": 0}
            }

        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)

        try:
            kwargs = {"model": target_model, "messages": formatted_messages}
            if tools:
                kwargs["tools"] = tools

            response = await self.client.chat.completions.create(**kwargs)
            message = response.choices[0].message

            tool_calls = []
            if message.tool_calls:
                for tc in message.tool_calls:
                    tool_calls.append({
                        "id": tc.id,
                        "name": tc.function.name,
                        "arguments": json.loads(tc.function.arguments or "{}")
                    })

            return {
                "content": message.content or "",
                "tool_calls": tool_calls,
                "usage": {
                    "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
                    "completion_tokens": response.usage.completion_tokens if response.usage else 0,
                }
            }
        except Exception as e:
            logger.error(f"OpenAI generate error: {e}")
            return {
                "content": f"I encountered an issue connecting to the AI model: {str(e)}",
                "tool_calls": [],
                "error": str(e)
            }

    async def generate_stream(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        target_model = model or settings.DEFAULT_MODEL

        if not self.client:
            last_msg = messages[-1]["content"] if messages else ""
            fallback_text = f"Greetings! I am JARVIS. You said: '{last_msg}'. My backend is operational and tools are registered."
            for chunk in fallback_text.split(" "):
                yield {"type": "token", "content": chunk + " "}
                await asyncio.sleep(0.04)
            yield {"type": "done"}
            return

        formatted_messages = []
        if system_prompt:
            formatted_messages.append({"role": "system", "content": system_prompt})
        formatted_messages.extend(messages)

        try:
            kwargs = {"model": target_model, "messages": formatted_messages, "stream": True}
            if tools:
                kwargs["tools"] = tools

            stream = await self.client.chat.completions.create(**kwargs)
            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta
                if delta.content:
                    yield {"type": "token", "content": delta.content}
                if delta.tool_calls:
                    for tc in delta.tool_calls:
                        yield {"type": "tool_call_delta", "tool_call": tc.model_dump()}
            yield {"type": "done"}
        except Exception as e:
            logger.error(f"OpenAI stream error: {e}")
            yield {"type": "error", "error": str(e)}
