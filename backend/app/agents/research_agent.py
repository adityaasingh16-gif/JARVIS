from typing import Dict, Any, List
from app.ai.prompts import RESEARCH_AGENT_SYSTEM_PROMPT
from app.tools.academic_search import execute_academic_search
from app.tools.web_search import execute_web_search

class ResearchAgent:
    """Specialized Research Agent for deep literature review, academic search, and technical comparisons."""

    def __init__(self, provider):
        self.provider = provider

    async def execute_research(self, topic: str, compare_with: str = None) -> Dict[str, Any]:
        """Runs complete multi-source research workflow."""
        web_results = await execute_web_search(topic)
        academic_results = await execute_academic_search(topic)

        prompt = f"""Conduct a detailed research analysis on the topic: '{topic}'.
        
Academic Papers Found:
{academic_results}

Web Intelligence:
{web_results}
"""
        if compare_with:
            prompt += f"\nCompare findings directly with existing solution / context: '{compare_with}'."

        messages = [{"role": "user", "content": prompt}]
        res = await self.provider.generate(
            messages=messages,
            system_prompt=RESEARCH_AGENT_SYSTEM_PROMPT
        )

        return {
            "topic": topic,
            "report": res.get("content", ""),
            "academic_sources": academic_results,
            "web_sources": web_results
        }
