import pytest
from app.ai.ollama_provider import OllamaProvider

@pytest.mark.asyncio
async def test_ollama_provider_generation():
    provider = OllamaProvider()
    response = await provider.generate(messages=[{"role": "user", "content": "JARVIS Ollama check"}])
    assert "content" in response
    assert len(response["content"]) > 0

@pytest.mark.asyncio
async def test_ollama_provider_stream():
    provider = OllamaProvider()
    tokens = []
    async for event in provider.generate_stream(messages=[{"role": "user", "content": "Streaming test"}]):
        if event.get("type") == "token":
            tokens.append(event["content"])
    assert len(tokens) > 0
