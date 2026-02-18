# Installation Guide

## Quick Start

### Method 1: Using the Install Script (Easiest)

1. Navigate to the `travel-place` folder in File Explorer
2. **Option A:** Double-click `install.bat` (Windows Batch)
3. **Option B:** Right-click `install.ps1` → "Run with PowerShell" (PowerShell - Recommended)
4. Wait for installation to complete
5. Run `npm run dev` to start the development server

### Method 2: Manual Installation (If scripts don't work)

1. Open Command Prompt or PowerShell
2. Navigate to the project directory:
   ```cmd
   cd "C:\Users\hp\OneDrive\Documents\The Travel Place SaaS\web-app\travel-place"
   ```
3. Verify you're in the right directory (should contain package.json):
   ```cmd
   dir package.json
   ```
4. Install dependencies:
   ```cmd
   npm install
   ```
5. Start the development server:
   ```cmd
   npm run dev
   ```

## Troubleshooting

### Issue: "Cannot find module 'next/image'"

**Solution:** This means the dependencies haven't been installed yet. Follow the installation steps above.

### Issue: Path not found

**Solution:** Make sure you're in the correct directory. The path should contain the `package.json` file.

### Issue: Permission denied

**Solution:** Run Command Prompt or PowerShell as Administrator.

## After Installation

Once dependencies are installed, you can:

1. Start development server: `npm run dev`
2. Build for production: `npm run build`
3. Start production server: `npm start`
4. Run linting: `npm run lint`

## Restoring Next.js Image Component

After successful installation, you can restore the optimized Next.js Image component by:

1. Adding the import back:

   ```typescript
   import Image from "next/image";
   ```

2. Replacing the img tag with:
   ```typescript
   <Image
   	src={pkg.image}
   	alt={pkg.name}
   	fill
   	className="object-cover group-hover:scale-110 transition-transform duration-500"
   />
   ```

This will give you better performance with automatic image optimization.
