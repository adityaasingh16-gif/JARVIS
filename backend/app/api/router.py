from fastapi import APIRouter
from app.api.chat import router as chat_router
from app.api.research import router as research_router
from app.api.projects import router as projects_router
from app.api.documents import router as documents_router
from app.api.developer import router as developer_router
from app.api.computer import router as computer_router
from app.api.tasks import router as tasks_router

api_router = APIRouter(prefix="/api")

api_router.include_router(chat_router)
api_router.include_router(research_router)
api_router.include_router(projects_router)
api_router.include_router(documents_router)
api_router.include_router(developer_router)
api_router.include_router(computer_router)
api_router.include_router(tasks_router)
