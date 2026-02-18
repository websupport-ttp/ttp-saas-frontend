@echo off
echo ========================================
echo CHECKING STATUS AFTER NUCLEAR RESET
echo ========================================
echo.

echo Current directory: %CD%
echo.

echo Checking for key files...
if exist "package.json" (
    echo ✅ package.json exists
    echo Contents:
    type package.json
) else (
    echo ❌ package.json missing
)

echo.
if exist "next.config.js" (
    echo ✅ next.config.js exists
) else (
    echo ❌ next.config.js missing
)

echo.
if exist "node_modules" (
    echo ✅ node_modules directory exists
) else (
    echo ❌ node_modules directory missing - dependencies not installed
)

echo.
if exist "src\app\page.tsx" (
    echo ✅ src\app\page.tsx exists
) else (
    echo ❌ src\app\page.tsx missing
)

echo.
echo Checking Node.js and npm...
node --version 2>nul && echo ✅ Node.js is working || echo ❌ Node.js not found
npm --version 2>nul && echo ✅ npm is working || echo ❌ npm not found

echo.
echo ========================================
echo DIAGNOSIS COMPLETE
echo ========================================
pause