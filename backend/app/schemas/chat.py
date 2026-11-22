from pydantic import BaseModel
from pydantic import Field
from typing import Dict, Any


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2_000)
    current_data: Dict[str, Any]


class ChatResponse(BaseModel):
    updates: Dict[str, Any]
    reply: str
