@echo off
REM ============================================
REM  HabitArc APK Build Script
REM  Run this from the project root (d:\habitarc)
REM ============================================

echo.
echo  ==============================
echo   HabitArc APK Builder
echo  ==============================
echo.

REM Step 1: Build the Next.js static export
echo [1/3] Building Next.js static export...
call npm run build
if errorlevel 1 (
    echo ERROR: Next.js build failed!
    exit /b 1
)

REM Step 2: Copy the exported files to the Android assets folder
echo [2/3] Copying build output to Android assets...
if exist "android\app\src\main\assets\www" (
    rmdir /s /q "android\app\src\main\assets\www"
)
mkdir "android\app\src\main\assets\www"
xcopy /s /e /y "out\*" "android\app\src\main\assets\www\" >nul

echo.
echo [3/3] Building Android APK...
echo.
echo  ┌─────────────────────────────────────────────┐
echo  │  To build the APK, you need Android Studio  │
echo  │  or the Android SDK command-line tools.      │
echo  │                                              │
echo  │  Option A: Android Studio                    │
echo  │  1. Open android/ folder in Android Studio   │
echo  │  2. Build ^> Build Bundle(s) / APK(s)        │
echo  │  3. APK at: app/build/outputs/apk/debug/     │
echo  │                                              │
echo  │  Option B: Command Line                      │
echo  │  cd android                                  │
echo  │  gradlew.bat assembleDebug                   │
echo  │  APK at: app/build/outputs/apk/debug/        │
echo  └─────────────────────────────────────────────┘
echo.

REM If Gradle wrapper exists, build automatically
if exist "android\gradlew.bat" (
    echo Found Gradle wrapper, building automatically...
    cd android
    call gradlew.bat assembleDebug
    if errorlevel 1 (
        echo ERROR: Gradle build failed!
        exit /b 1
    )
    echo.
    echo  ✅ APK built successfully!
    echo  📦 Location: android\app\build\outputs\apk\debug\app-debug.apk
    cd ..
) else (
    echo No Gradle wrapper found. Open the android/ folder in Android Studio to build.
)

echo.
echo Done!
