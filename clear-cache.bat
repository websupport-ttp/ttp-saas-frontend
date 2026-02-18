@echo off
echo Clearing Next.js cache and rebuilding...

echo Removing .next directory...
if exist .next rmdir /s /q .next

echo Removing node_modules/.cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Cache cleared successfully!
echo You can now run: npm run dev

pause