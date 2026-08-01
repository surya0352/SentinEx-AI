from fastapi import FastAPI

from backend.database import Base, engine
import backend.models
from backend.routers import cases

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="SentinEx AI",
    description="AI-powered platform for detecting and responding to non-consensual intimate image sharing",
    version="1.0.0"
)


app.include_router(
    cases.router
)


@app.get("/")
def home():
    return {
        "message": "Welcome to SentinEx AI",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }