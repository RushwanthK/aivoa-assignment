import json
import logging

from fastapi import HTTPException
from groq import Groq
from groq import GroqError

from app.config import settings

logger = logging.getLogger(__name__)

client = Groq(
    api_key=settings.GROQ_API_KEY
)


def _parse_json(content: str) -> dict:
    content = (content or "").strip()
    content = content.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        # Fall back to the outermost {...} block if the model added stray text.
        start, end = content.find("{"), content.rfind("}")
        if start != -1 and end > start:
            return json.loads(content[start:end + 1])
        raise


def call_llm_json(prompt: str) -> dict:
    """Send a prompt to Groq and return the reply parsed as a JSON object.

    Uses Groq's JSON mode so the model must answer with valid JSON. Errors are
    turned into clean HTTP responses instead of unhandled 500s.
    """
    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0,
            response_format={"type": "json_object"},
        )
    except GroqError as exc:
        logger.exception("Groq request failed")
        raise HTTPException(
            status_code=502,
            detail="The AI service is unavailable right now. Please try again shortly."
        ) from exc

    content = response.choices[0].message.content

    try:
        data = _parse_json(content)
    except json.JSONDecodeError as exc:
        logger.error("Model returned invalid JSON: %r", content)
        raise HTTPException(
            status_code=502,
            detail="The AI returned an unexpected response. Please try again."
        ) from exc

    if not isinstance(data, dict):
        raise HTTPException(
            status_code=502,
            detail="The AI returned an unexpected response. Please try again."
        )

    return data
