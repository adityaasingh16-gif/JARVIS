.PHONY: dev test test-backend install setup-db clean

dev:
	@echo "Starting JARVIS Development Stack..."
	docker-compose up --build

test: test-backend

test-backend:
	cd backend && pytest -v

install:
	pip install -r backend/requirements.txt
	cd frontend && npm install

setup-db:
	python -m backend.app.database.init_db

clean:
	rm -rf backend/.pytest_cache frontend/dist frontend/node_modules
