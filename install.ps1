# PowerShell installation script for The Travel Place Next.js Application

Write-Host "Installing The Travel Place Next.js Application..." -ForegroundColor Green
Write-Host ""

# Change to the directory where this script is located
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: package.json not found in current directory!" -ForegroundColor Red
    Write-Host "Please make sure you're running this script from the travel-place folder." -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 1: Installing Node.js dependencies..." -ForegroundColor Cyan
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open http://localhost:3000 in your browser" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to exit"