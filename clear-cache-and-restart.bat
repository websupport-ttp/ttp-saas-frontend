@echo off
echo Clearing Next.js cache and restarting development server...
echo.

echo [1/4] Stopping any running Next.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Removing .next directory...
if exist .next (
    rmdir /s /q .next
    echo ✅ .next directory removed
) else (
    echo ℹ️  .next directory not found
)

echo [3/4] Removing node_modules cache...
if exist node_modules\.cache (
    rmdir /s /q node_modules\.cache
    echo ✅ node_modules cache removed
) else (
    echo ℹ️  node_modules cache not found
)

echo [4/4] Starting development server...
echo.
echo ========================================
echo Cache cleared successfully!
echo Starting npm run dev...
echo ========================================
echo.

npm run dev