from fastapi import FastAPI

app = FastAPI(
    title="SentinEx AI",
    description="AI-powered platform for detecting and responding to non-consensual intimate image sharing",
    version="1.0.0"
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