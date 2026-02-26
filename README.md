# HabitArc 🎯

A modern habit-tracking app built with [Next.js](https://nextjs.org), featuring rich dashboards, streak tracking, and visual analytics. Available as a **PWA**, **Web App**, and **Android APK** (via Capacitor).

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
| Mobile | Capacitor (Native Android/iOS shell) |
| PWA | Service Worker + Web App Manifest |

## Building the Android APK (Capacitor)

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Android Studio](https://developer.android.com/studio) with Android SDK

### Quick Build

```bash
# Build & sync in one command
npm run cap:sync

# Open in Android Studio to build APK
npm run cap:open:android
```

### Manual Steps

```bash
# 1. Build Next.js static site
npm run build

# 2. Sync web assets to Capacitor Android project
npx cap sync android

# 3. Open in Android Studio → Build → Build APK(s)
npx cap open android

# OR build via command line (requires Android SDK):
cd android && gradlew.bat assembleDebug
```

The debug APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Automated Build Script (Windows)

```bash
build-apk.bat
```

## PWA (Progressive Web App)

The app is also installable as a PWA directly from the browser:

1. Open the deployed site in Chrome/Edge
2. Click the install icon in the address bar (or "Add to Home Screen" on mobile)
3. The app installs locally with offline caching support

The PWA uses a service worker (`public/sw.js`) for:
- **Cache-first** loading of static assets (JS, CSS, images, fonts)
- **Network-first** loading of API calls (Supabase)
- **Offline fallback** to cached pages

## App Icon Setup

Generate all icon sizes from a source image:

```bash
# Place your 512x512+ icon at scripts/icon-source.png, then:
npm run generate:icons
```

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
