# SKULPARTNERS

Education finance platform built around a **"Pay Once, Study Free"** model.
Parents/guardians invest upfront, the investment grows over fixed cycles, and
termly school fees are released to the child's school.

Monorepo:

- `frontend/` — Next.js 16 (App Router) + Tailwind CSS 4 web app
- `backend/` — NestJS 12 + Prisma 7 + PostgreSQL (Neon) API

## Quick start

### Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g. Neon) for the backend

### 1. Backend

```bash
cd backend
cp .env.example .env   # then fill in DATABASE_URL + JWT_SECRET
npm install
npx prisma migrate deploy
npm run start:dev      # API on http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env.local   # optional; defaults to https://skulpartner-1.onrender.com
npm install
npm run dev                  # app on http://localhost:3000
```

## Environment variables

Backend (`backend/.env`) — see `backend/.env.example`.
Frontend (`frontend/.env.local`) — see `frontend/.env.example`:

| Variable              | Purpose                          | Default                          |
| --------------------- | -------------------------------- | -------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API      | `https://skulpartner-1.onrender.com` |

## Scripts

| Location    | Command           | Purpose                    |
| ----------- | ----------------- | -------------------------- |
| `backend/`  | `npm run start:dev` | Run API in watch mode    |
| `backend/`  | `npm run build`   | Compile NestJS to `dist/`  |
| `backend/`  | `npm run test`    | Run unit tests (vitest)    |
| `frontend/` | `npm run dev`     | Run Next.js dev server     |
| `frontend/` | `npm run build`   | Production build           |
| `frontend/` | `npm run lint`    | Run ESLint                 |

## Security notes

- Real `.env` files are git-ignored. Never commit secrets.
- If a secret was ever pushed, rotate it immediately.
