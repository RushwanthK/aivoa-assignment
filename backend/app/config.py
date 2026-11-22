from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Required
    DATABASE_URL: str
    GROQ_API_KEY: str

    # LLM model used for extraction, risk assessment and the copilot
    GROQ_MODEL: str = "openai/gpt-oss-120b"

    # Comma-separated list of frontend origins allowed to call the API,
    # e.g. "http://localhost:5173,https://your-app.vercel.app"
    ALLOWED_ORIGINS: str = "http://localhost:5173"

    # Log every SQL statement (useful for local debugging, noisy in production)
    DB_ECHO: bool = False

    # Abuse protection for the public AI endpoints
    RATE_LIMIT_AI: str = "10/minute"
    MAX_TEXT_CHARS: int = 10_000
    MAX_PDF_MB: int = 5

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    @property
    def database_url(self) -> str:
        # Some providers hand out "postgres://", which SQLAlchemy 2.x rejects.
        if self.DATABASE_URL.startswith("postgres://"):
            return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self.DATABASE_URL


settings = Settings()
