import re

SECRET_PATTERNS = [
    re.compile(r"sk-[a-zA-Z0-9]{32,}", re.IGNORECASE),
    re.compile(r"ghp_[a-zA-Z0-9]{36}", re.IGNORECASE),
    re.compile(r"bearer\s+[a-zA-Z0-9\-\._~\+\/]+=*", re.IGNORECASE),
    re.compile(r"password[\"']?\s*:\s*[\"']?([^\"'\s]+)", re.IGNORECASE)
]

def redact_secrets(text: str) -> str:
    """Redacts sensitive tokens, API keys, and passwords from log strings and responses."""
    if not text or not isinstance(text, str):
        return text

    sanitized = text
    for pattern in SECRET_PATTERNS:
        sanitized = pattern.sub("[REDACTED_SECRET]", sanitized)
    
    return sanitized
