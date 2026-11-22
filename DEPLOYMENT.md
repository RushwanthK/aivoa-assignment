# Deployment Guide

Free-tier setup: **Supabase** (PostgreSQL) → **Render** (FastAPI backend) → **Vercel** (React frontend).
Do the steps in this order: each one needs a value from the previous one.

---

## 1. Database: Supabase

1. Create a new project at https://supabase.com and save the database password.
2. Open **Connect** (top bar) and copy the **Session pooler** connection string. It looks like:
   ```
   postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   Use the *Session pooler*, not the *Direct connection*: Render's free tier has no IPv6, and Supabase's direct host is IPv6-only.
3. Replace `[YOUR-PASSWORD]` with your password. If it contains special characters (`@`, `#`, `/`, …), URL-encode them.

No manual table setup is needed: the backend creates the `complaints` table on first start.

---

## 2. Groq API key

Create a key at https://console.groq.com/keys. The free tier is enough for a demo.

---

## 3. Backend: Render

### Option A: Blueprint (uses `render.yaml`)

1. In Render: **New → Blueprint**, connect this GitHub repo.
2. Render reads `render.yaml` and asks for the secret values:
   - `DATABASE_URL`: the Supabase string from step 1
   - `GROQ_API_KEY`: from step 2
   - `ALLOWED_ORIGINS`: enter `http://localhost:5173` for now; you'll update it after step 4
3. Click **Apply**.

### Option B: Manual web service

**New → Web Service**, connect the repo, then set:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Runtime | Python 3 |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers --forwarded-allow-ips='*'` |
| Health Check Path | `/health` |
| Instance Type | Free |

Environment variables: `DATABASE_URL`, `GROQ_API_KEY`, `ALLOWED_ORIGINS`, and `PYTHON_VERSION=3.12.6`.

### Check it

Open `https://<your-service>.onrender.com/health`. It should return `{"status":"healthy"}`.
Interactive API docs are at `/docs`.

> `--proxy-headers` matters: without it, rate limiting would see Render's proxy IP instead of each visitor's, and every visitor would share one limit.

---

## 4. Frontend: Vercel

1. **Add New → Project**, import this GitHub repo.
2. Set **Root Directory** to `frontend`. Vercel detects Vite automatically (build `npm run build`, output `dist`).
3. Add the environment variable:
   - `VITE_API_URL` = `https://<your-service>.onrender.com` (no trailing slash)
4. Deploy and copy your Vercel URL, e.g. `https://aivoa-qms.vercel.app`.

> `VITE_*` variables are baked in at build time. If you change `VITE_API_URL` later, redeploy the frontend.

---

## 5. Connect frontend and backend (CORS)

Back in Render → your service → **Environment**, set:

```
ALLOWED_ORIGINS=https://aivoa-qms.vercel.app,http://localhost:5173
```

Use your exact Vercel URL with no trailing slash. Save; Render redeploys automatically.

Verify from a terminal (should print an `access-control-allow-origin` header, not "Disallowed CORS origin"):

```bash
curl -i -X OPTIONS https://<your-service>.onrender.com/extract/text \n  -H "Origin: https://aivoa-qms.vercel.app" -H "Access-Control-Request-Method: POST"
```

---

## 6. Smoke test

1. Open the Vercel URL.
2. Paste a sample complaint in the AI Copilot, e.g.
   *"CityCare Pharmacy reports Amoxicillin 500 mg capsules, batch AMX-2291, 12 capsules broken."*
3. The form should fill in, including severity, priority and a suggested action.
4. Ask the copilot: *"Change the affected quantity to 15 capsules."*
5. Fill any empty fields and click save.

---

## Free-tier notes

- **Cold starts:** Render's free tier sleeps after ~15 minutes without traffic. The first request then takes 30–60 seconds; the frontend waits up to 90 seconds and shows a "server is waking up" message if it times out.
- **Supabase pausing:** free projects pause after a week without activity. Resume them from the Supabase dashboard.
- **Groq limits:** the app rate-limits AI endpoints per visitor (`RATE_LIMIT_AI`, default `10/minute`) to protect your Groq quota.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| Browser console shows a CORS error | `ALLOWED_ORIGINS` doesn't exactly match the Vercel URL (check `https://` and no trailing slash) |
| "Can't reach the server" | Backend is waking up, or `VITE_API_URL` is wrong (redeploy the frontend after fixing it) |
| Render deploy fails on database connection | Using Supabase's direct connection instead of the Session pooler, or the password isn't URL-encoded |
| "The AI service is unavailable" | Invalid `GROQ_API_KEY` or Groq quota reached |
| 429 "Too many requests" | Rate limit hit; wait a minute |
