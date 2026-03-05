# HabitArc 🎯

A modern habit-tracking app built with [Next.js](https://nextjs.org), featuring rich dashboards, streak tracking, and visual analytics. Installable as a **PWA** from the browser.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Environment Variables

Create `.env.local` for Supabase (optional — works offline with localStorage):

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js (App Router) |
| Auth & DB | Supabase |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| PWA | Service Worker + Web App Manifest |

## PWA (Progressive Web App)

The app is installable as a PWA directly from the browser:

1. Open the deployed site in Chrome/Edge
2. Click the install icon in the address bar (or "Add to Home Screen" on mobile)
3. The app installs locally with offline caching support

## Deploy on Netlify

```toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "20"
```

## Deploy on Vercel

Deploy via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js).

## License

MIT
