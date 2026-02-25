# HabitArc 🎯

A modern habit-tracking app built with [Next.js](https://nextjs.org), featuring rich dashboards, streak tracking, and visual analytics. Available as both a **web app** and an **Android APK**.

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
| Mobile | Android WebView Wrapper |

## Building the Android APK

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- [Android Studio](https://developer.android.com/studio) **or** [Android SDK Command Line Tools](https://developer.android.com/studio#command-tools)

### Option A: Automated Build Script (Windows)

```bash
# From the project root
build-apk.bat
```

This script:
1. Runs `npm run build` (static export to `out/`)
2. Copies the build output to `android/app/src/main/assets/www/`
3. Triggers Gradle build (if available)

### Option B: Manual Steps

```bash
# 1. Build Next.js static site
npm run build

# 2. Copy output to Android assets
xcopy /s /e /y out\* android\app\src\main\assets\www\

# 3. Build APK via Android Studio
#    Open android/ folder → Build → Build APK(s)

# OR via command line (requires Android SDK):
cd android
gradlew.bat assembleDebug
```

The debug APK will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Using a Deployed URL Instead

To load from your deployed site instead of bundled assets, edit `MainActivity.java`:

```java
// Change this:
private static final String APP_URL = "file:///android_asset/www/index.html";

// To your deployed URL:
private static final String APP_URL = "https://your-app.netlify.app";
```

## App Icon Setup

Place your logo files in the Android `mipmap` resource folders:

| Folder | Size | File |
|--------|------|------|
| `mipmap-mdpi` | 48×48 | `ic_launcher.png` |
| `mipmap-hdpi` | 72×72 | `ic_launcher.png` |
| `mipmap-xhdpi` | 96×96 | `ic_launcher.png` |
| `mipmap-xxhdpi` | 144×144 | `ic_launcher.png` |
| `mipmap-xxxhdpi` | 192×192 | `ic_launcher.png` |

Path: `android/app/src/main/res/mipmap-*/ic_launcher.png`

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
