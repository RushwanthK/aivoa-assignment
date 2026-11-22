from fastapi import APIRouter
from fastapi import Request

from app.config import settings
from app.rate_limit import limiter
from app.schemas.chat import ChatRequest
from app.services.llm_service import update_complaint_fields

router = APIRouter()


@router.post("/chat")
@limiter.limit(settings.RATE_LIMIT_AI)
def chat(request: Request, body: ChatRequest):

    return update_complaint_fields(
        body.message,
        body.current_data
    )
