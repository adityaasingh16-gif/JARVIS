import enum
import re
from typing import Dict, Any

class RiskLevel(str, enum.Enum):
    LOW = "LOW"         # Auto-approved (web search, paper search, read file, screenshots)
    MEDIUM = "MEDIUM"   # Logged & safe (write file, edit file, run tests, browser automation)
    HIGH = "HIGH"       # Confirmation required (delete files, install software, execute arbitrary shell commands)

# Argument patterns that escalate an otherwise-MEDIUM tool call to HIGH risk,
# regardless of the tool's declared default risk level. This lets a generic
# "execute_terminal_command" tool stay MEDIUM for everyday use (git status,
# npm test) while still forcing confirmation for destructive invocations.
DESTRUCTIVE_ARG_PATTERNS = [
    re.compile(p, re.IGNORECASE) for p in [
        r"rm\s+-rf", r"\bdel\s+/", r"format\s+[a-z]:", r"drop\s+table",
        r"drop\s+database", r">\s*/dev/sd", r"shutdown", r"reboot",
        r"uninstall", r"del\s+\*\.\*",
    ]
]

class PermissionEngine:
    def __init__(self, enforce: bool = True, auto_low: bool = True):
        self.enforce = enforce
        self.auto_low = auto_low

    def _is_destructive(self, args: Dict[str, Any]) -> bool:
        joined = " ".join(str(v) for v in args.values())
        return any(pattern.search(joined) for pattern in DESTRUCTIVE_ARG_PATTERNS)

    def evaluate_risk(self, tool_name: str, args: Dict[str, Any], tool_risk: RiskLevel) -> Dict[str, Any]:
        """Evaluates whether tool execution is permitted or requires explicit user confirmation."""
        if not self.enforce:
            return {"allowed": True, "requires_confirmation": False, "reason": "Permissions enforcement disabled."}

        effective_risk = tool_risk
        if tool_risk != RiskLevel.HIGH and self._is_destructive(args):
            effective_risk = RiskLevel.HIGH

        if effective_risk == RiskLevel.LOW:
            return {"allowed": True, "requires_confirmation": False, "reason": "Low risk tool execution automatically approved."}

        if effective_risk == RiskLevel.MEDIUM:
            return {"allowed": True, "requires_confirmation": False, "reason": "Medium risk tool logged and allowed."}

        # HIGH risk level
        return {
            "allowed": False,
            "requires_confirmation": True,
            "reason": f"High risk action '{tool_name}' requires explicit user confirmation."
        }

permission_engine = PermissionEngine()
