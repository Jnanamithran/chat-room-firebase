@echo off
REM Firebase Deployment Script for Windows
REM Usage: deploy.bat

setlocal enabledelayedexpansion

echo 🔨 Building project...
call npm run build

echo.
echo 🚀 Deploying to Firebase...

REM Read FIREBASE_TOKEN from .env file
for /f "tokens=2 delims==" %%I in ('findstr /B "FIREBASE_TOKEN=" .env') do set "FIREBASE_TOKEN=%%I"

if "!FIREBASE_TOKEN!"=="" (
  echo ❌ Error: FIREBASE_TOKEN not found in .env file
  exit /b 1
)

call firebase deploy --token !FIREBASE_TOKEN!

echo.
echo ✅ Deployment complete!
echo 🌐 Live URL: https://react-chat-app-8c28e.web.app
