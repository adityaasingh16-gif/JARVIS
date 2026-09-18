import os
import subprocess
from typing import Dict, Any, List

async def inspect_repository(repo_path: str) -> Dict[str, Any]:
    """Inspects a local repository structure, files, models, routes, and controllers."""
    if not os.path.exists(repo_path):
        return {"error": f"Path '{repo_path}' does not exist on local filesystem."}

    structure = []
    file_count = 0
    python_files = []
    js_files = []

    for root, dirs, files in os.walk(repo_path):
        # Ignore node_modules and venv
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '__pycache__', 'venv', 'dist', 'build']]
        for file in files:
            file_count += 1
            rel_path = os.path.relpath(os.path.join(root, file), repo_path)
            structure.append(rel_path)
            if file.endswith('.py'):
                python_files.append(rel_path)
            elif file.endswith(('.js', '.ts', '.jsx', '.tsx')):
                js_files.append(rel_path)

    return {
        "repo_path": repo_path,
        "total_files": file_count,
        "python_files": python_files[:15],
        "javascript_files": js_files[:15],
        "sample_structure": structure[:25]
    }

async def execute_terminal_command(command: str, cwd: str = ".") -> Dict[str, Any]:
    """Executes a terminal command safely and captures output."""
    try:
        proc = subprocess.run(
            command,
            shell=True,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=15
        )
        return {
            "command": command,
            "returncode": proc.returncode,
            "stdout": proc.stdout,
            "stderr": proc.stderr
        }
    except Exception as e:
        return {
            "command": command,
            "returncode": -1,
            "stdout": "",
            "stderr": str(e)
        }
