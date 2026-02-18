@echo off
echo Verifying Travel Place Next.js Setup...
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

echo Checking for required files...
if exist "package.json" (
    echo ✓ package.json found
) else (
    echo ✗ package.json NOT found
)

if exist "tsconfig.json" (
    echo ✓ tsconfig.json found
) else (
    echo ✗ tsconfig.json NOT found
)

if exist "next.config.js" (
    echo ✓ next.config.js found
) else (
    echo ✗ next.config.js NOT found
)

if exist "src\app\page.tsx" (
    echo ✓ src\app\page.tsx found
) else (
    echo ✗ src\app\page.tsx NOT found
)

if exist "node_modules" (
    echo ✓ node_modules directory found (dependencies installed)
) else (
    echo ✗ node_modules directory NOT found (dependencies not installed)
    echo   Run 'npm install' to install dependencies
)

echo.
echo Checking Node.js and npm...
node --version 2>nul
if %ERRORLEVEL% equ 0 (
    echo ✓ Node.js is installed
) else (
    echo ✗ Node.js is NOT installed or not in PATH
)

npm --version 2>nul
if %ERRORLEVEL% equ 0 (
    echo ✓ npm is installed
) else (
    echo ✗ npm is NOT installed or not in PATH
)

echo.
echo Setup verification complete!
echo.
pause