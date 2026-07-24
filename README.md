# AI-Powered Pharmaceutical Customer Complaint Management System

An AI-assisted Customer Complaint Management System developed as part of the AIVOA Software Engineering Assessment.

The application automates pharmaceutical complaint processing using Large Language Models (LLMs), LangGraph workflows, PDF parsing, and structured data extraction.

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

---

## Tech Stack

### Frontend

- React
- Redux Toolkit
- Material UI

### Backend

- FastAPI
- LangGraph
- Groq LLM (Llama 3.3 70B Versatile)
- PostgreSQL

### PDF Processing

- pdfplumber

---

## Project Structure

```
frontend/
    src/
        components/
        redux/
        services/

backend/
    app/
        routers/
        services/
        langgraph/
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
| POST | /extract/text | Extract complaint from pasted text |
| POST | /extract/pdf | Extract complaint from uploaded PDF |
| POST | /chat | AI Copilot field updates |
| POST | /complaint | Save complaint |

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

source venv/bin/activate
```

Windows

```bash
venv\\Scripts\\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Database

Configure PostgreSQL in:

```
backend/app/database.py
```

Create the required database before running the backend.

---

## Environment Variables

Create a `.env` inside backend.

Example

```
GROQ_API_KEY=your_groq_key

DATABASE_URL=postgresql://username:password@localhost/database_name
```

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
