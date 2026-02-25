@echo off
REM ============================================
REM  HabitArc APK Build Script
REM ============================================

echo.
echo  ==============================
echo   HabitArc APK Builder
echo  ==============================
echo.

echo [1/3] Building Next.js static export...
call npm run build
if errorlevel 1 (
    echo ERROR: Next.js build failed!
    exit /b 1
)

echo [2/3] Copying build output to Android assets...
if exist "android\app\src\main\assets" (
    rmdir /s /q "android\app\src\main\assets"
)
mkdir "android\app\src\main\assets"
xcopy /s /e /y "out\*" "android\app\src\main\assets\" >nul

echo [3/3] Ready for APK build!
echo.
echo  Open android/ folder in Android Studio
echo  or run: cd android ^& gradlew.bat assembleDebug
echo.
echo Done!
