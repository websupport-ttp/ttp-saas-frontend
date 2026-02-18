@echo off
echo ========================================
echo COMPLETE RESET - Travel Place Next.js
echo ========================================
echo.

echo Step 1: Stopping any running processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Step 2: Removing corrupted cache and build files...
if exist ".next" rmdir /s /q ".next"
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"
if exist ".babelrc" del ".babelrc"
if exist ".babelrc.js" del ".babelrc.js"
if exist ".babelrc.json" del ".babelrc.json"

echo Step 3: Clearing npm cache...
npm cache clean --force

echo Step 4: Installing fresh dependencies...
npm install

echo Step 5: Starting development server...
echo.
echo Your application will be available at: http://localhost:3000
echo.
npm run dev

pause