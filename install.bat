@echo off
echo Installing The Travel Place Next.js Application...
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found in current directory!
    echo Please make sure you're running this script from the travel-place folder.
    echo.
    pause
    exit /b 1
)

echo Step 1: Installing Node.js dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: npm install failed!
    echo Please check the error messages above.
    echo.
    pause
    exit /b 1
)

echo.
echo Step 2: Installation complete!
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo.
pause