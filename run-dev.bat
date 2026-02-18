@echo off
echo Starting The Travel Place Development Server...
echo.

REM Change to the directory where this batch file is located
cd /d "%~dp0"

echo Current directory: %CD%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo You might be in the wrong directory.
    echo This script should be run from the travel-place folder.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Dependencies not installed. Installing now...
    echo This may take a few minutes...
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
)

echo Starting development server...
echo.
echo The application will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause