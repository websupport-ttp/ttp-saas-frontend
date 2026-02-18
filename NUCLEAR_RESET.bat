@echo off
echo ========================================
echo NUCLEAR RESET - Complete Fresh Start
echo ========================================
echo.

echo Step 1: Killing all Node processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im next.exe 2>nul
timeout /t 3 >nul

echo Step 2: Complete destruction of build files...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"
if exist "yarn.lock" del "yarn.lock"
if exist ".eslintrc*" del ".eslintrc*"
if exist ".babelrc*" del ".babelrc*"

echo Step 3: Creating ultra-minimal package.json...
(
echo {
echo   "name": "travel-place",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start"
echo   },
echo   "dependencies": {
echo     "next": "14.0.0",
echo     "react": "18.2.0",
echo     "react-dom": "18.2.0"
echo   }
echo }
) > package.json

echo Step 4: Creating minimal next.config.js...
(
echo const nextConfig = {}
echo module.exports = nextConfig
) > next.config.js

echo Step 5: Clearing all caches...
npm cache clean --force
if exist "%APPDATA%\npm-cache" rmdir /s /q "%APPDATA%\npm-cache"

echo Step 6: Fresh install...
npm install

echo Step 7: Starting development server...
echo.
echo ========================================
echo If this works, you should see:
echo - Next.js startup messages
echo - "The Travel Place" website
echo - No 404 errors
echo ========================================
echo.
npm run dev

pause