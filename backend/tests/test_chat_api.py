import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "JARVIS" in data["system"]

def test_system_status_endpoint():
    response = client.get("/api/system/status")
    assert response.status_code == 200
    data = response.json()
    assert data["ai_engine"] == "ONLINE"

def test_chat_endpoint():
    response = client.post("/api/chat", json={"message": "Hello JARVIS"})
    assert response.status_code == 200
    data = response.json()
    assert "agent" in data
    assert "content" in data
    assert len(data["content"]) > 0

def test_projects_endpoint():
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 2
