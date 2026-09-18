import os
import platform
from typing import Dict, Any

async def get_system_status() -> Dict[str, Any]:
    """Returns OS hardware, environment, and system readiness metrics."""
    return {
        "os": platform.system(),
        "release": platform.release(),
        "architecture": platform.machine(),
        "python_version": platform.python_version(),
        "ai_status": "Online",
        "research_engine": "Ready",
        "browser_engine": "Ready",
        "computer_control": "Active",
        "memory_store": "Online"
    }

async def launch_application(app_name: str) -> Dict[str, Any]:
    """Opens a desktop application by name."""
    system = platform.system().lower()
    try:
        if system == "windows":
            if "code" in app_name.lower():
                os.system("start code")
            elif "chrome" in app_name.lower():
                os.system("start chrome")
            else:
                os.system(f"start {app_name}")
        elif system == "darwin":
            os.system(f"open -a '{app_name}'")
        else:
            os.system(f"{app_name} &")
        return {"status": "success", "message": f"Successfully triggered launch for '{app_name}'."}
    except Exception as e:
        return {"status": "error", "message": f"Failed to launch '{app_name}': {str(e)}"}
