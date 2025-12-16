# Notetaker — Backend (scaffold)

This folder contains a minimal Express.js scaffold for the Notetaker backend.

To install and run locally:

```bash
cd backend
npm install
npm run start
```

The server listens on port 4000 by default and responds to `GET /` with a JSON status.

Next steps (suggested):

- Add routes for notes and auth (e.g. `/api/notes`, `/api/auth`).
- Add a simple in-memory store or integrate a database (SQLite/Postgres/MongoDB).
- Add CORS and request validation.
