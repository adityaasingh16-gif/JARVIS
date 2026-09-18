from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.router import api_router
from app.api.websockets import router as ws_router
from app.api.voice import router as voice_router
from app.database.init_db import init_models
import asyncio

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="JARVIS — Personal AI Research, Development & Desktop Assistant Backend API"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(api_router)
app.include_router(ws_router)
app.include_router(voice_router)

@app.on_event("startup")
async def on_startup():
    try:
        await init_models()
    except Exception as e:
        print(f"Startup DB init notice: {e}")

@app.get("/")
async def root():
    return {
        "status": "ONLINE",
        "system": "JARVIS AI Command Center",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/api/system/status")
async def system_status():
    return {
        "ai_engine": "ONLINE",
        "research_agent": "READY",
        "browser_agent": "READY",
        "computer_control": "READY",
        "memory_store": "ONLINE",
        "github_agent": "CONNECTED"
    }
