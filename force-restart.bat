@echo off
echo ========================================
echo FORCE RESTART - Clearing ALL caches
echo ========================================
echo.

echo [1/6] Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul
timeout /t 3 /nobreak >nul

echo [2/6] Removing .next directory...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next directory removed
)

echo [3/6] Removing node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules cache removed
)

echo [4/6] Clearing npm cache...
npm cache clean --force
echo ✅ npm cache cleared

echo [5/6] Reinstalling dependencies...
npm install
echo ✅ Dependencies reinstalled

echo [6/6] Starting development server...
echo.
echo ========================================
echo All caches cleared! Starting fresh...
echo ========================================
echo.

npm run dev