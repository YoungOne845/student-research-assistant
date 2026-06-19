# Deployment Guide

## Free-tier friendly path

- GitHub: code repository
- Supabase: PostgreSQL database
- Render: backend web service
- Vercel or Render static site: frontend
- OpenAI/OpenRouter/Groq: AI provider

## Backend production command

Build:

```bash
npm install && npx prisma generate && npm run build
```

Start:

```bash
npx prisma migrate deploy && npx prisma db seed && npm run start
```

## Required backend env vars

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=your_supabase_or_render_postgres_url
JWT_SECRET=long_random_secret
CLIENT_URL=https://your-frontend-url
GOOGLE_CLIENT_ID=your_google_client_id
AI_PROVIDER=mock
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=your_key
AI_MODEL=gpt-4o-mini
```

Use `AI_PROVIDER=mock` first to avoid spending credits.
