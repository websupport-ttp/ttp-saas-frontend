@echo off
echo ========================================
echo MANUAL RESET - Step by Step
echo ========================================
echo.

echo Step 1: Killing Node processes...
taskkill /f /im node.exe 2>nul
echo Done.
pause

echo Step 2: Removing build files...
if exist ".next" (
    rmdir /s /q ".next"
    echo ✅ Removed .next directory
) else (
    echo ℹ️ .next directory doesn't exist
)
pause

echo Step 3: Removing node_modules...
if exist "node_modules" (
    echo This may take a while...
    rmdir /s /q "node_modules"
    echo ✅ Removed node_modules directory
) else (
    echo ℹ️ node_modules directory doesn't exist
)
pause

echo Step 4: Creating minimal package.json...
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
echo ✅ Created package.json
pause

echo Step 5: Installing dependencies...
echo This will take several minutes...
npm install
if %ERRORLEVEL% equ 0 (
    echo ✅ Dependencies installed successfully
) else (
    echo ❌ Failed to install dependencies
    echo Error code: %ERRORLEVEL%
)
pause

echo Step 6: Starting development server...
echo Opening http://localhost:3000 in a few seconds...
timeout /t 3 >nul
start http://localhost:3000
npm run dev
pause