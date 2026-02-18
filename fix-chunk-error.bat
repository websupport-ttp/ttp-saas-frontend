@echo off
echo Fixing Next.js chunk loading error...

echo Step 1: Stopping any running processes...
taskkill /f /im node.exe 2>nul

echo Step 2: Clearing Next.js cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Step 3: Clearing npm cache...
npm cache clean --force

echo Step 4: Reinstalling dependencies...
npm install

echo Step 5: Starting development server...
npm run dev

echo Done! The chunk loading error should be resolved.
pause