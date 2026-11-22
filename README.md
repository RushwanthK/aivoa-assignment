# AI-Powered Pharmaceutical Customer Complaint Management System

An AI-assisted Customer Complaint Management System developed as part of the AIVOA Software Engineering Assessment.

The application automates pharmaceutical complaint processing using Large Language Models (LLMs), LangGraph workflows, PDF parsing, and structured data extraction.

> **Live demo:** https://aivoa-assignment-chi.vercel.app (the backend sleeps when idle, so the first request can take up to a minute)

---

## Features

### AI Complaint Extraction
- Extract complaint information from pasted customer emails.
- Extract complaint information from uploaded PDF complaint documents.
- Automatically populate complaint form fields.

### AI Copilot
- Conversational AI assistant for updating complaint details.
- Supports natural language modifications.
- Updates only the requested fields while preserving existing data.

### AI Risk Assessment
Automatically generates:

- Severity
- Priority
- Risk Summary
- Suggested Action

using an LLM-powered risk assessment workflow.

### Complaint Management

- Editable complaint form
- Save complaints into PostgreSQL
- Reset complaint form

### Production Hardening

- Per-IP rate limiting on the AI endpoints (`slowapi`)
- Input limits: complaint text length, PDF size, and field lengths matching the database columns
- Groq JSON mode for reliable structured output, with clear error messages instead of server crashes
- CORS origins, model name and limits configured through environment variables
- Database connection health checks for hosted PostgreSQL (Supabase)

---

## Tech Stack

### Frontend

- React 19 + Vite
- Redux Toolkit
- Material UI
- Axios

### Backend

- FastAPI
- LangGraph
- Groq LLM (`openai/gpt-oss-120b`)
- SQLAlchemy + PostgreSQL
- slowapi (rate limiting)

### PDF Processing

- pdfplumber

---

## Project Structure

```
frontend/
    src/
        components/      UI: complaint form, AI copilot panel
        pages/
        redux/           complaint state
        services/        API client (reads VITE_API_URL)
    .env.example

backend/
    app/
        routers/         /extract, /chat, /complaints
        services/        Groq client, LLM prompts, PDF parsing
        langgraph/       extraction → risk-assessment graph
        models/          SQLAlchemy models
        schemas/         request/response validation
        config.py        settings from environment variables
    requirements.txt
    .env.example
    .python-version

render.yaml              Render blueprint for the backend
DEPLOYMENT.md            Vercel + Render + Supabase guide
```

---

## AI Workflow

```
Customer Complaint
        │
        ▼
PDF Upload / Complaint Text
        │
        ▼
LangGraph
        │
        ├── Complaint Extraction
        │
        └── Risk Assessment
                │
                ▼
Structured Complaint Data
                │
                ▼
Redux State
                │
                ▼
Complaint Form
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /extract/text | Extract complaint from pasted text (rate limited) |
| POST | /extract/pdf | Extract complaint from uploaded PDF (rate limited, max 5 MB) |
| POST | /chat | AI Copilot field updates (rate limited) |
| POST | /complaints | Save complaint |
| GET | /complaints | List the 100 most recent complaints |
| GET | /health | Health check |

Interactive API docs are available at `/docs` when the backend is running.

---

## Running Locally

### Prerequisites

- Python 3.12
- Node.js 20+
- PostgreSQL (local, or a free Supabase project)
- A Groq API key from https://console.groq.com

### Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

```bash
# macOS / Linux
source venv/bin/activate

# Windows (PowerShell)
venv\Scripts\activate
```

Install dependencies and configure:

```bash
pip install -r requirements.txt
cp .env.example .env      # then fill in DATABASE_URL and GROQ_API_KEY
```

Run:

```bash
uvicorn app.main:app --reload
```

The API runs at http://127.0.0.1:8000. The `complaints` table is created automatically on startup.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:5173 and calls the backend at `http://127.0.0.1:8000` by default. To point it elsewhere, create `frontend/.env.local` with `VITE_API_URL=...`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Yes | | PostgreSQL connection string |
| `GROQ_API_KEY` | Yes | | Groq API key |
| `GROQ_MODEL` | No | `openai/gpt-oss-120b` | LLM model |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173` | Comma-separated frontend URLs allowed by CORS |
| `DB_ECHO` | No | `false` | Log SQL statements |
| `RATE_LIMIT_AI` | No | `10/minute` | Per-IP limit on AI endpoints |
| `MAX_TEXT_CHARS` | No | `10000` | Max complaint text length |
| `MAX_PDF_MB` | No | `5` | Max PDF upload size |

### Frontend

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend URL, e.g. `https://your-backend.onrender.com` |

Never commit real `.env` files; they are git-ignored.

---

## Deployment

The app is designed for free hosting: **Vercel** (frontend), **Render** (backend) and **Supabase** (PostgreSQL).
Step-by-step instructions are in [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Demonstrated AI Capabilities

- Complaint extraction
- PDF processing
- Conversational complaint editing
- LangGraph orchestration
- AI-generated risk assessment
- Structured complaint storage

---

## Future Improvements

- OCR support for scanned PDFs
- Complaint history dashboard
- Email integration
- Investigation workflow
- CAPA recommendations
- Authentication & role-based access

---

## Author

Rushwanth K

AIVOA Software Engineering Assessment
