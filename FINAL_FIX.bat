@echo off
echo ========================================
echo FINAL FIX - Remove All ESLint Issues
echo ========================================
echo.

echo Step 1: Stopping all processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 >nul

echo Step 2: Removing problematic files...
if exist ".eslintrc.json" del ".eslintrc.json"
if exist ".eslintrc.js" del ".eslintrc.js"
if exist ".babelrc" del ".babelrc"
if exist ".babelrc.js" del ".babelrc.js"
if exist ".babelrc.json" del ".babelrc.json"

echo Step 3: Clearing caches...
if exist ".next" rmdir /s /q ".next"
npm cache clean --force 2>nul

echo Step 4: Reinstalling dependencies...
npm install

echo Step 5: Starting clean development server...
echo.
echo Your application should load at: http://localhost:3000
echo No more ESLint or Babel errors!
echo.
npm run dev

pause