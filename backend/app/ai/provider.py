from abc import ABC, abstractmethod
from typing import AsyncGenerator, List, Dict, Any, Optional

class BaseLLMProvider(ABC):
    """Abstract Base Class for LLM Providers (OpenAI, Gemini, Ollama, Anthropic, etc.)."""

    @abstractmethod
    async def generate(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None
    ) -> Dict[str, Any]:
        """Synchronous or single-response completion."""
        pass

    @abstractmethod
    async def generate_stream(
        self,
        messages: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        tools: Optional[List[Dict[str, Any]]] = None,
        model: Optional[str] = None
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Streaming token response generator yielding event dicts."""
        pass
