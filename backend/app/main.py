from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.database import Base
from app.database import engine
from app.models.complaint import Complaint  # noqa: F401  (registers the table)
from app.rate_limit import limiter
from app.routers.chat import router as chat_router
from app.routers.complaint import router as complaint_router
from app.routers.extract import router as extract_router

app = FastAPI(
    title="AIVOA AI Complaint Management System",
    version="1.0.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=False,
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
