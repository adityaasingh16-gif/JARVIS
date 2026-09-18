import pytest
from app.ai.tools import tool_registry

@pytest.mark.asyncio
async def test_tool_registry_registration():
    schemas = tool_registry.get_all_schemas()
    assert len(schemas) >= 4
    tool_names = [s["function"]["name"] for s in schemas]
    assert "web_search" in tool_names
    assert "academic_search" in tool_names

@pytest.mark.asyncio
async def test_execute_academic_search():
    result = await tool_registry.execute_tool("academic_search", {"query": "infrastructure monitoring"})
    assert result["status"] == "SUCCESS"
    assert "result" in result
    assert isinstance(result["result"], list)

@pytest.mark.asyncio
async def test_execute_system_status():
    result = await tool_registry.execute_tool("get_system_status", {})
    assert result["status"] == "SUCCESS"
    assert result["result"]["ai_status"] == "Online"
