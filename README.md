# AMS Life — Personal Self-Improvement App

A modern, mobile-friendly web app connected to your Google Sheet (or local JSON for dev). Built for daily check-ins, streaks, finance tracking, learning roadmap, skills, planning, networking, and journaling.

## Quick Start

```bash
cd ams-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Default login password:** `ams2026` (change in `.env.local`)

## Features

- **Dashboard** — KPIs, charts, month-by-month summary
- **Daily Check-in** — mood, productivity, learning, expenses, journal
- **Streaks** — current/longest streak + GitHub-style heatmap
- **Finance** — expenses, savings rate, RD/FD corpus, 4-layer resilience
- **Learning** — Udemy course roadmap with progress tracking
- **Skills & Reading** — skill progression map + book tracker
- **Planning** — monthly deliverables and milestones
- **Network** — personal CRM with follow-up reminders
- **Journal** — searchable reflections and key learnings
- **Settings** — setup values, sheet init, Excel import

## Google Sheets Setup

See [SETUP.md](./SETUP.md) for full instructions to connect your centralized Google Sheet.

## Import Existing Excel Data

```bash
npm run import:xlsx
```

Or use **Settings → Import from Excel** in the app.

## Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add env vars from `.env.example`
4. Deploy

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- NextAuth (password login)
- Google Sheets API (production) / Local JSON (dev)
- Recharts
