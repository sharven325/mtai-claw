# MTAI CLAW Requirements Portal

A multi-department requirements gathering web app used during Week 1 of the CLAW AI agent rollout at M Telecommunications. MTAI facilitators run HOD sessions and capture responses in this portal. Data feeds directly into `CLAUDE.md` configuration files per department.

## Features

- Three-department form portal (HR, Delivery, Sales) with 11 sections each
- Accordion sections with completion indicators
- Auto-save to Supabase on every change (debounced 1.5s)
- Session ID in URL — resume from any device
- Per-department submit with confirmation
- Global progress bar (0 of 3 departments submitted)
- Admin dashboard at `/admin` with session table and export buttons
- Export: generates `CLAUDE.md`-ready markdown per department
- Fully responsive (tablet-optimised for HOD sessions)

## Tech stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres) · next-auth

---

## Local development setup

### 1. Clone and install

```bash
git clone <repo-url>
cd mtai-claw
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000
FACILITATOR_PASSWORD=choose-a-strong-password
ADMIN_PASSWORD=choose-a-different-strong-password
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Set up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com) — choose **Singapore (ap-southeast-1)** region
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Go to **Authentication → URL Configuration** and add `http://localhost:3000` to allowed origins

### 4. Run dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Supabase schema

The full schema is in [`supabase-schema.sql`](./supabase-schema.sql). Key tables:

| Table | Purpose |
|---|---|
| `sessions` | One row per HOD briefing session |
| `responses` | One row per form field (upserted on change) |
| `submissions` | One row per submitted department per session |

---

## Vercel deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-org/mtai-claw.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### 3. Set environment variables

In Vercel dashboard → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXTAUTH_SECRET` | Generated secret (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your Vercel deployment URL (e.g. `https://mtai-claw.vercel.app`) |
| `FACILITATOR_PASSWORD` | Shared facilitator password |
| `ADMIN_PASSWORD` | Admin dashboard password |

### 4. Add Vercel URL to Supabase

In Supabase → **Authentication → URL Configuration**, add your Vercel URL to allowed origins.

### 5. Deploy

Vercel auto-deploys on every push to `main`.

---

## How to use

### Create a new session

1. Go to `/session/new` (or the root URL — it redirects)
2. Sign in with the facilitator password
3. Enter a session label (e.g. "Week 1 HOD Briefing — May 2025") and your name
4. Click **Create session**
5. Share the session URL with other facilitators who may need access

### Fill in the form

- Click each accordion section to expand it
- All changes are auto-saved to Supabase within 1.5 seconds
- When a department is complete, click **Submit [Dept] requirements**
- The session URL can be resumed from any device

### Access the admin dashboard

Go to `/admin`. Sign in with the admin password. You can:

- See all sessions with department submission status
- Click **Open** to jump into any session
- Click a department's checkmark/download icon to export that department's `CLAUDE.md`
- Click **Export all** to download all submitted departments at once

### Export CLAUDE.md drafts

From the session page, click the **Export** button in the header. A modal shows export options per department. Only submitted departments can be exported. The downloaded `.md` file is ready to paste into the department's `CLAUDE.md` configuration.

---

## Health check

`GET /api/health` returns `{ "status": "ok", "timestamp": "..." }` — use this for Vercel uptime monitoring.

---

## Environment variables reference

```env
# Supabase — get from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server-side only — never exposed to browser

# NextAuth
NEXTAUTH_SECRET=                 # openssl rand -base64 32
NEXTAUTH_URL=                    # Full URL including https://

# App passwords
FACILITATOR_PASSWORD=            # Shared among all facilitators
ADMIN_PASSWORD=                  # Admin dashboard only
```
