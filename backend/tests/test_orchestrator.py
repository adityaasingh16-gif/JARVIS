import pytest
from app.ai.orchestrator import orchestrator

@pytest.mark.asyncio
async def test_orchestrator_routing_research():
    res = await orchestrator.route_and_execute("Research GNN model for delay prediction")
    assert res["agent"] == "ResearchAgent"
    assert "content" in res

@pytest.mark.asyncio
async def test_orchestrator_routing_core():
    res = await orchestrator.route_and_execute("What is the current time and status?")
    assert res["agent"] == "CoreAssistantAgent"
    assert "content" in res
