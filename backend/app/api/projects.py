from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/projects", tags=["projects"])

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = []
    repo_url: Optional[str] = None

MOCK_PROJECTS = [
    {
        "id": "p1",
        "name": "CarpoolX",
        "description": "Smart ride-sharing & routing platform for campus commuting",
        "tech_stack": ["React", "Node.js", "Express", "MongoDB"],
        "architecture": "MVC Microservices with WebSocket Location Tracking",
        "repo_url": "https://github.com/user/carpoolx"
    },
    {
        "id": "p2",
        "name": "SIH 26103 - Early Warning Infrastructure",
        "description": "AI-based Infrastructure Project Monitoring and Delay Forecasting System",
        "tech_stack": ["Python", "FastAPI", "React", "PostgreSQL", "PyTorch"],
        "architecture": "GNN Spatio-temporal anomaly detector with automated risk reports",
        "repo_url": "https://github.com/user/sih-infrastructure"
    }
]

@router.get("")
async def list_projects():
    return MOCK_PROJECTS

@router.post("")
async def create_project(project: ProjectCreate):
    new_p = {
        "id": f"p{len(MOCK_PROJECTS) + 1}",
        "name": project.name,
        "description": project.description,
        "tech_stack": project.tech_stack,
        "repo_url": project.repo_url
    }
    MOCK_PROJECTS.append(new_p)
    return new_p
