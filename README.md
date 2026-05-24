# FIFA World Cup 2026 App

Next.js 16 application for following the 2026 FIFA World Cup with a homepage for upcoming/live matches, a full calendar, group standings, and a live match detail view backed by Supabase.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- Supabase
- SWR
- API-Football sync endpoint for live match refresh

## Features

- Homepage with the next live or upcoming matches
- Full calendar page grouped by day
- Group standings page
- Match detail page with live polling, score updates, stats, events, and lineups
- Internal cron endpoint to recalculate standings
- Local scripts for seeding matches and initializing group tables in Supabase

## Routes

- `/` homepage with featured matches and store/ad placements
- `/calendar` full match schedule
- `/standings` group table view
- `/matches/[matchId]` live match detail page
- `/api/matches/[matchId]/sync` fetches and persists live updates for one match
- `/api/cron/update-standings` recalculates standings from finished matches

## Project Structure

```text
app/
  api/
    cron/update-standings/route.ts
    matches/[matchId]/sync/route.ts
  calendar/page.tsx
  matches/[matchId]/page.tsx
  standings/page.tsx
  layout.tsx
  page.tsx
components/
  AdUnit.tsx
  CardMatch.tsx
  FechaLocal.tsx
  LiveMatchDetails.tsx
  TeamImage.tsx
types/
  match.ts
```

## Requirements

- Node.js 20+
- npm
- A Supabase project with the expected `matches` and `groups` tables

## Environment Variables

Create `.env.local` with at least:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FOOTBALL_API_KEY=
CRON_SECRET=
```

Notes:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used by server-rendered pages and public Supabase reads.
- `SUPABASE_SERVICE_ROLE_KEY` is required by server routes and local seed scripts that write to Supabase.
- `FOOTBALL_API_KEY` is required for `/api/matches/[matchId]/sync`.
- `CRON_SECRET` must match the secret used to call `/api/cron/update-standings`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Run linting:

```bash
npm run lint
```

Open `http://localhost:3000`.

## Data Flow

The app reads match data from Supabase at runtime.

- Home page queries the next live or scheduled matches from `matches`
- Calendar reads all matches ordered by `scheduled_at`
- Standings reads grouped team rows from `groups`
- Live match details poll the internal sync route every 60 seconds
- The sync route fetches fresh data from API-Football and writes updates back to `matches`

## Deployment

This project is configured for Vercel and includes a cron job in [vercel.json]that calls the standings refresh endpoint every 15 minutes.

Before deploying:

- set all required environment variables in Vercel
- make sure the cron secret in Vercel matches `CRON_SECRET`
- verify your Supabase tables and policies are ready for the app and scripts

## Notes

- Remote images are allowed from `media.api-sports.io` and `api.fifa.com` in [next.config.ts].
- The app uses the Next.js App Router and server components for page data loading.
- AdSense is loaded globally from [app/layout.tsx].
