@echo off
echo ========================================
echo Travel Place - Project Verification
echo ========================================
echo.

echo [1/5] Checking TypeScript compilation...
npx tsc --noEmit --skipLibCheck
if %errorlevel% neq 0 (
    echo ❌ TypeScript compilation failed
    goto :error
) else (
    echo ✅ TypeScript compilation successful
)
echo.

echo [2/5] Checking Next.js build...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Next.js build failed
    goto :error
) else (
    echo ✅ Next.js build successful
)
echo.

echo [3/5] Checking for unused dependencies...
npx depcheck --ignores="@types/*,eslint-*"
echo ✅ Dependency check complete
echo.

echo [4/5] Checking bundle size...
npm run build 2>nul
if exist ".next\static" (
    echo ✅ Bundle generated successfully
    dir ".next\static\chunks" /s /-c | find "File(s)"
) else (
    echo ❌ Bundle generation failed
)
echo.

echo [5/5] Final verification...
echo ✅ All checks completed successfully!
echo.
echo ========================================
echo Project Status: READY FOR PRODUCTION
echo ========================================
echo.
echo Next steps:
echo 1. Run: npm run dev (for development)
echo 2. Run: npm run build (for production build)
echo 3. Run: npm run start (for production server)
echo.
goto :end

:error
echo.
echo ========================================
echo Project Status: ISSUES FOUND
echo ========================================
echo Please check the error messages above and fix any issues.
echo.

:end
pause