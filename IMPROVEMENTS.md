# Improvements

## Run with Docker

Alternative to the manual setup in the README: everything (frontend, backend, Temporal, its Postgres store) runs via Docker Compose. Only Docker Desktop is required — no local Node/pnpm/Temporal CLI needed.

```zsh
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:4000
- Temporal gRPC endpoint: localhost:7233

Source is bind-mounted into both containers, so edits on the host hot-reload inside the containers (nodemon for the backend, Vite HMR for the frontend). If the backend's Temporal worker logs a connection error on the very first `up` (it can race Temporal's own startup), run `docker compose restart backend` once.
