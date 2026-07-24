from pydantic import BaseModel
from typing import Dict, Any


class ChatRequest(BaseModel):
    message: str
    current_data: Dict[str, Any]


class ChatResponse(BaseModel):
    updates: Dict[str, Any]
    reply: str