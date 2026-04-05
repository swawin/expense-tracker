# Expense Tracker

Production-structured expense tracker inspired by core Zoho Expense workflow.

## Stack
- Next.js frontend (`apps/web`)
- Node.js + Express backend (`apps/api`)
- MongoDB (`MONGODB_URI`)

## Core workflow implemented
- Create/list/edit/delete expenses
- Create/list/view reports
- Add unreported expenses to report
- Remove expenses from report
- Submit report (read-only enforcement)

## Run locally
```bash
npm install
npm run dev:api
npm run dev:web
```

Frontend: http://localhost:3000
API: http://localhost:4000
