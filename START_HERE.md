# 🚀 START HERE - How to Run Your Next.js App

## The Problem
You're getting "Missing script: 'dev'" because you're not in the right directory.

## ✅ Step-by-Step Solution

### Step 1: Find the Right Directory
The correct directory should contain these files:
- `package.json`
- `next.config.js`
- `src/` folder
- `tailwind.config.ts`

### Step 2: Navigate Using File Explorer Method (Easiest)
1. **Open File Explorer**
2. **Navigate to:** `C:\Users\hp\OneDrive\Documents\The Travel Place SaaS\web-app\travel-place`
3. **Look for the `package.json` file** - it should be visible in this folder
4. **In the File Explorer address bar, type:** `cmd` and press Enter
5. **This opens Command Prompt in the correct directory**

### Step 3: Verify You're in the Right Place
```cmd
dir package.json
```
You should see the package.json file listed.

### Step 4: Install Dependencies (First Time Only)
```cmd
npm install
```
Wait for this to complete (may take a few minutes).

### Step 5: Start the Development Server
```cmd
npm run dev
```

### Step 6: Open Your Browser
Go to: `http://localhost:3000`

## 🔧 Alternative Method: PowerShell
1. **Right-click in the travel-place folder** (the one with package.json)
2. **Select "Open PowerShell window here"**
3. **Run:** `npm install` (first time only)
4. **Run:** `npm run dev`

## 🚨 Common Mistakes
- ❌ Running from `C:\Users\hp\OneDrive\Documents\The Travel Place SaaS\web-app\` (parent directory)
- ❌ Running from `C:\Windows\System32\` (wrong directory entirely)
- ✅ Should run from `C:\Users\hp\OneDrive\Documents\The Travel Place SaaS\web-app\travel-place\`

## 📁 Directory Structure Check
Your travel-place folder should look like this:
```
travel-place/
├── package.json          ← This file must be present
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   ├── components/
│   └── ...
├── public/
└── node_modules/         ← Created after npm install
```

## ✅ Success Indicators
- Command Prompt shows the correct path
- `npm run dev` starts without errors
- Browser shows "The Travel Place" website at localhost:3000
- No more TypeScript errors in your editor