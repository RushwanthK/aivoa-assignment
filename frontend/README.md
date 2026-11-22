# Frontend: AIVOA Complaint Management

React 19 + Vite + Redux Toolkit + Material UI.

## Run locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173 and calls the backend at `http://127.0.0.1:8000`.

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Backend URL. Set in `.env.local` locally, or in Vercel's environment variables for deployment. |

See `.env.example`. Vite bakes `VITE_*` values in at build time, so rebuild or redeploy after changing them.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

See the [root README](../README.md) for the full project and [DEPLOYMENT.md](../DEPLOYMENT.md) for hosting.
