from fastapi import APIRouter

from app.schemas.chat import ChatRequest
from app.services.llm_service import update_complaint_fields

router = APIRouter()


@router.post("/chat")
def chat(request: ChatRequest):

    return update_complaint_fields(
        request.message,
        request.current_data
    )