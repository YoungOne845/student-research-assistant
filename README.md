# Student Research Assistant

Production-ready foundation for a multi-disciplinary academic research assistant SaaS.

## Architecture

```txt
AcademicField -> ResearchModule -> ResearchTemplate -> AI Engine -> GeneratedContent
```

Computer Science is seeded as the first supported academic field, but the application logic is field-based. To add another discipline later, add database rows for `AcademicField`, `AcademicFieldModule`, and `ResearchTemplate`.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, Axios, React Query
- Backend: Node.js, Express, TypeScript, Prisma
- Database: PostgreSQL
- Auth: JWT, Google OAuth token verification
- AI: OpenAI-compatible provider abstraction with mock mode
- Deployment: Docker, Docker Compose, Render-ready config

## Step 1: GitHub only

1. Create an empty GitHub repository.
2. Extract this zip.
3. Open this folder in VS Code.
4. Run:

```bash
git init
git add .
git commit -m "Initial Student Research Assistant project"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
```

Do not create a real `.env` before the first push unless you understand secrets. `.env` is ignored by Git.

## Step 2: Local setup

### Option A: Docker

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

### Option B: Manual

Backend:

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Frontend:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Free AI testing

Use this to avoid spending API credits during setup:

```env
AI_PROVIDER=mock
```

Switch to OpenAI-compatible mode later:

```env
AI_PROVIDER=openai
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your_key
AI_MODEL=gpt-4o-mini
```

## Production notes

- Use Supabase PostgreSQL or Render PostgreSQL for the database.
- Put secrets only in hosting environment variables.
- Use `npx prisma migrate deploy` in production.
- Set backend `CLIENT_URL` to your frontend URL.
- Set frontend `VITE_API_BASE_URL` to your backend `/api` URL.
