@echo off
echo ========================================
echo MINIMAL NEXT.JS SETUP - Emergency Fix
echo ========================================
echo.

echo Step 1: Stopping all Node processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Step 2: Complete cleanup...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"
if exist ".babelrc*" del ".babelrc*"

echo Step 3: Creating minimal package.json...
echo { > package.json
echo   "name": "travel-place", >> package.json
echo   "version": "0.1.0", >> package.json
echo   "private": true, >> package.json
echo   "scripts": { >> package.json
echo     "dev": "next dev", >> package.json
echo     "build": "next build", >> package.json
echo     "start": "next start" >> package.json
echo   }, >> package.json
echo   "dependencies": { >> package.json
echo     "next": "14.0.0", >> package.json
echo     "react": "18.2.0", >> package.json
echo     "react-dom": "18.2.0" >> package.json
echo   }, >> package.json
echo   "devDependencies": { >> package.json
echo     "typescript": "5.1.6", >> package.json
echo     "tailwindcss": "3.3.3", >> package.json
echo     "postcss": "8.4.28", >> package.json
echo     "autoprefixer": "10.4.15", >> package.json
echo     "@types/node": "20.5.0", >> package.json
echo     "@types/react": "18.2.20", >> package.json
echo     "@types/react-dom": "18.2.7" >> package.json
echo   } >> package.json
echo } >> package.json

echo Step 4: Installing minimal dependencies...
npm install

echo Step 5: Starting development server...
echo.
echo Your application should load at: http://localhost:3000
echo.
npm run dev

pause