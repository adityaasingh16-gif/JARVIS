import os
from typing import Dict, Any
from app.ai.prompts import DOCUMENT_AGENT_SYSTEM_PROMPT

class DocumentAgent:
    """Specialized Document Subagent for parsing, chunking, and summarizing files."""

    def __init__(self, provider):
        self.provider = provider

    async def summarize_document(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"error": f"File '{file_path}' not found."}

        filename = os.path.basename(file_path)
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read(4000)
        except Exception as e:
            return {"error": f"Failed to read file: {str(e)}"}

        prompt = f"Analyze and provide a comprehensive technical summary of document '{filename}':\n\n{content}"
        messages = [{"role": "user", "content": prompt}]
        res = await self.provider.generate(
            messages=messages,
            system_prompt=DOCUMENT_AGENT_SYSTEM_PROMPT
        )

        return {
            "filename": filename,
            "file_path": file_path,
            "summary": res.get("content", "")
        }
