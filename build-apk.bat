@echo off
REM ============================================
REM  HabitArc Capacitor APK Build Script
REM ============================================

echo.
echo  ==============================
echo   HabitArc Capacitor Builder
echo  ==============================
echo.

echo [1/3] Building Next.js static export...
call npm run build
if errorlevel 1 (
    echo ERROR: Next.js build failed!
    exit /b 1
)

echo [2/3] Syncing web assets to Capacitor Android...
call npx cap sync android
if errorlevel 1 (
    echo ERROR: Capacitor sync failed!
    exit /b 1
)

echo [3/3] Ready for APK build!
echo.
echo  Options:
echo    1. Open in Android Studio:  npx cap open android
echo    2. Build via CLI:           cd android ^& gradlew.bat assembleDebug
echo.
echo  The debug APK will be at:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo Done!
