@echo off
echo Stopping any running Node processes...
taskkill /f /im node.exe >nul 2>&1

echo Clearing Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Starting frontend development server...
npm run dev