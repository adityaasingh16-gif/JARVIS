from fastapi import APIRouter

router = APIRouter(prefix="/tasks", tags=["tasks"])

MOCK_TASKS = [
    {
        "id": "t1",
        "title": "Deep Literature Review on GNN Infrastructure Delay Prediction",
        "status": "COMPLETED",
        "task_type": "RESEARCH",
        "progress": 100.0
    },
    {
        "id": "t2",
        "title": "CarpoolX Backend Architecture Audit",
        "status": "RUNNING",
        "task_type": "DEVELOPER",
        "progress": 65.0
    }
]

@router.get("")
async def list_tasks():
    return MOCK_TASKS
