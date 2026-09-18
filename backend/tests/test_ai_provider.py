import pytest
from app.ai.openai_provider import OpenAIProvider

@pytest.mark.asyncio
async def test_openai_provider_fallback():
    provider = OpenAIProvider(api_key=None)
    response = await provider.generate(messages=[{"role": "user", "content": "Ping JARVIS"}])
    assert "content" in response
    assert len(response["content"]) > 0

@pytest.mark.asyncio
async def test_openai_provider_stream_fallback():
    provider = OpenAIProvider(api_key=None)
    tokens = []
    async for event in provider.generate_stream(messages=[{"role": "user", "content": "Test Stream"}]):
        if event.get("type") == "token":
            tokens.append(event["content"])
    assert len(tokens) > 0
