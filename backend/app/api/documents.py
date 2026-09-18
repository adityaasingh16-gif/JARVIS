from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/documents", tags=["documents"])

@router.get("")
async def list_documents():
    return [
        {"id": "doc1", "filename": "SIH_Problem_Statement_26103.pdf", "file_type": "PDF", "size": "1.2 MB"},
        {"id": "doc2", "filename": "CarpoolX_Architecture_Spec.docx", "file_type": "DOCX", "size": "450 KB"},
        {"id": "doc3", "filename": "Infrastructure_Monitoring_Paper.pdf", "file_type": "PDF", "size": "2.8 MB"}
    ]
