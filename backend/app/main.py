from fastapi import FastAPI
from app.config import settings
from app.database import Base
from app.database import engine
from app.models.complaint import Complaint
from app.routers.extract import router as extract_router
from app.routers.complaint import router as complaint_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.chat import router as chat_router

app = FastAPI(
    title="AIVOA AI Complaint Management System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(extract_router)
app.include_router(complaint_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {
        "message": "Backend is running successfully."
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


@app.get("/config-test")
def config_test():
    return {
        "database": settings.DATABASE_URL,
        "groq_loaded": bool(settings.GROQ_API_KEY)
    }

