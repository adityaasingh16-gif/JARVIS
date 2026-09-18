import asyncio
import logging
from app.database.session import engine
from app.database.models import Base

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("init_db")

async def init_models():
    logger.info("Initializing database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables successfully created.")

if __name__ == "__main__":
    asyncio.run(init_models())
