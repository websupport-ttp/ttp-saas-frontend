# Troubleshooting Guide

This guide helps you resolve common issues when developing or deploying "The Travel Place" Next.js application.

## Table of Contents

- [Development Issues](#development-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Performance Issues](#performance-issues)
- [Deployment Issues](#deployment-issues)
- [Environment Issues](#environment-issues)
- [Browser Compatibility](#browser-compatibility)
- [Getting Help](#getting-help)

## Development Issues

### Server Won't Start

#### Issue: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process using port (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Option 3: Kill process using port (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Option 4: Find and kill Next.js processes
pkill -f next
```

#### Issue: Permission Denied
```
Error: EACCES: permission denied
```

**Solutions:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Use npx instead of global install
npx create-next-app@latest

# Run with sudo (not recommended)
sudo npm run dev
```

### Module Resolution Issues

#### Issue: Module Not Found
```
Module not found: Can't resolve 'module-name'
```

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .next
npm install

# Check if module exists
npm list module-name

# Install missing module
npm install module-name

# Check import paths
# Ensure correct relative/absolute paths
```

#### Issue: TypeScript Path Aliases Not Working
```
Cannot find module '@/components/Button'
```

**Solutions:**
1. Check `tsconfig.json` paths configuration:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. Restart TypeScript server in VS Code:
   - `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. Check import syntax:
```typescript
// Correct
import Button from '@/components/ui/Button'

// Incorrect
import Button from '@components/ui/Button'
```

### Hot Reload Issues

#### Issue: Changes Not Reflecting
```
File changes not triggering hot reload
```

**Solutions:**
```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next

# Check file watchers (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Disable fast refresh temporarily
# Add to next.config.js
module.exports = {
  reactStrictMode: false
}
```

## Build Issues

### TypeScript Compilation Errors

#### Issue: Type Errors During Build
```
Type error: Property 'x' does not exist on type 'y'
```

**Solutions:**
```bash
# Run type check separately
npx tsc --noEmit

# Check specific file
npx tsc --noEmit src/components/Button.tsx

# Skip type checking during build (not recommended)
# Add to next.config.js
module.exports = {
  typescript: {
    ignoreBuildErrors: true
  }
}
```

#### Issue: Missing Type Definitions
```
Could not find a declaration file for module 'some-module'
```

**Solutions:**
```bash
# Install type definitions
npm install @types/some-module

# Create custom type definitions
# Create types/some-module.d.ts
declare module 'some-module' {
  export default function someModule(): void;
}

# Add to tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Memory Issues

#### Issue: JavaScript Heap Out of Memory
```
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solutions:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Use environment variable
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Add to package.json scripts
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Dependency Issues

#### Issue: Peer Dependency Warnings
```
npm WARN peer dep missing: react@^18.0.0
```

**Solutions:**
```bash
# Install peer dependencies
npm install react@^18.0.0

# Install all peer dependencies
npx install-peerdeps package-name

# Ignore peer dependency warnings (not recommended)
npm install --legacy-peer-deps
```

## Runtime Issues

### Environment Variables

#### Issue: Environment Variables Undefined
```
process.env.NEXT_PUBLIC_API_URL is undefined
```

**Solutions:**
1. Check variable naming:
```bash
# Client-side variables must have NEXT_PUBLIC_ prefix
NEXT_PUBLIC_API_URL=https://api.example.com

# Server-side variables don't need prefix
API_SECRET=secret-key
```

2. Check file location:
```bash
# Development
.env.local

# Production
.env.production

# All environments
.env
```

3. Restart development server after changes

4. Verify in browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

### Image Loading Issues

#### Issue: Images Not Loading
```
Error: Invalid src prop on `next/image`
```

**Solutions:**
1. Check `next.config.js` image configuration:
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}
```

2. Use correct image paths:
```jsx
// Static images
import image from '/public/image.jpg'

// Remote images (configure in next.config.js)
<Image src="https://example.com/image.jpg" />

// Local images
<Image src="/images/local-image.jpg" />
```

3. Check image formats:
```javascript
// Supported formats
.jpg, .jpeg, .png, .webp, .avif, .gif, .svg
```

### Routing Issues

#### Issue: 404 on Page Refresh
```
Cannot GET /some-page
```

**Solutions:**
1. Check file structure:
```
src/app/
├── page.tsx          # /
├── about/
│   └── page.tsx      # /about
└── contact/
    └── page.tsx      # /contact
```

2. Configure server for SPA routing:
```javascript
// next.config.js
module.exports = {
  trailingSlash: true,
  exportPathMap: function() {
    return {
      '/': { page: '/' },
      '/about': { page: '/about' },
    }
  }
}
```

## Performance Issues

### Slow Loading

#### Issue: Large Bundle Size
```
Warning: Bundle size exceeds recommended limit
```

**Solutions:**
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'))

# Optimize images
# Use next/image with proper sizing
<Image
  src="/image.jpg"
  width={800}
  height={600}
  priority={false}
/>
```

#### Issue: Slow Development Server
```
Development server takes long to start
```

**Solutions:**
```bash
# Clear cache
rm -rf .next node_modules/.cache

# Disable source maps
echo "DISABLE_SOURCE_MAPS=true" >> .env.local

# Use SWC minifier (already enabled)
# Check next.config.js for swcMinify: true
```

### Memory Leaks

#### Issue: Browser Memory Usage Increasing
```
Browser becomes slow over time
```

**Solutions:**
1. Check for memory leaks:
```javascript
// Use React DevTools Profiler
// Check for unnecessary re-renders

// Cleanup event listeners
useEffect(() => {
  const handler = () => {}
  window.addEventListener('scroll', handler)
  
  return () => {
    window.removeEventListener('scroll', handler)
  }
}, [])
```

2. Optimize images:
```jsx
// Use proper image sizing
<Image
  src="/image.jpg"
  width={400}
  height={300}
  sizes="(max-width: 768px) 100vw, 400px"
/>
```

## Deployment Issues

### Build Failures in Production

#### Issue: Build Works Locally But Fails in Production
```
Build failed in production environment
```

**Solutions:**
1. Check environment differences:
```bash
# Use same Node.js version
node --version

# Check environment variables
printenv | grep NEXT_PUBLIC

# Test production build locally
npm run build
npm run start
```

2. Check dependencies:
```bash
# Install exact versions
npm ci

# Check for dev dependencies in production
npm install --only=production
```

### Vercel Deployment Issues

#### Issue: Function Timeout
```
Error: Function execution timed out
```

**Solutions:**
1. Optimize server-side code:
```javascript
// Use static generation when possible
export async function generateStaticParams() {
  return []
}

// Optimize API routes
export async function GET() {
  // Add timeout handling
  const controller = new AbortController()
  setTimeout(() => controller.abort(), 10000)
  
  return fetch(url, { signal: controller.signal })
}
```

2. Configure Vercel settings:
```json
// vercel.json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Netlify Deployment Issues

#### Issue: Build Command Not Found
```
Error: Command not found: npm run build
```

**Solutions:**
1. Configure build settings:
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

2. Check package.json scripts:
```json
{
  "scripts": {
    "build": "next build",
    "export": "next export"
  }
}
```

## Environment Issues

### Node.js Version Conflicts

#### Issue: Unsupported Node.js Version
```
Error: Node.js version not supported
```

**Solutions:**
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18

# Or using n (macOS/Linux)
sudo n 18

# Update package.json engines
{
  "engines": {
    "node": ">=18.17.0",
    "npm": ">=9.0.0"
  }
}
```

### Package Manager Issues

#### Issue: npm vs yarn Conflicts
```
Error: Lockfile conflicts
```

**Solutions:**
```bash
# Choose one package manager
# Delete other lockfiles
rm yarn.lock  # if using npm
rm package-lock.json  # if using yarn

# Reinstall dependencies
npm install
# or
yarn install
```

## Browser Compatibility

### CSS Issues

#### Issue: Styles Not Working in Older Browsers
```
CSS Grid/Flexbox not supported
```

**Solutions:**
1. Check browser support:
```css
/* Use autoprefixer (already configured) */
/* Check caniuse.com for feature support */

/* Add fallbacks */
.grid-container {
  display: block; /* Fallback */
  display: grid;
}
```

2. Configure browserslist:
```json
// package.json
{
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```

### JavaScript Issues

#### Issue: Modern JavaScript Not Working
```
Syntax error in older browsers
```

**Solutions:**
1. Check Babel configuration:
```javascript
// next.config.js
module.exports = {
  compiler: {
    // Ensure proper transpilation
  },
  experimental: {
    // Enable modern features carefully
  }
}
```

2. Add polyfills if needed:
```javascript
// pages/_app.tsx
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

## Getting Help

### Debug Information

When reporting issues, include:

```bash
# System information
node --version
npm --version
npx next info

# Project information
npm list --depth=0
cat package.json

# Error logs
npm run build 2>&1 | tee build.log
```

### Log Analysis

#### Enable Debug Mode
```bash
# Development
DEBUG=* npm run dev

# Next.js specific
DEBUG=next:* npm run dev

# Build analysis
ANALYZE=true npm run build
```

#### Check Browser Console
1. Open Developer Tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Check Performance tab for slow operations

### Community Resources

- **GitHub Issues**: Search existing issues first
- **Stack Overflow**: Tag with `next.js`, `react`, `tailwindcss`
- **Discord Communities**: 
  - Next.js Discord
  - React Discord
  - Tailwind CSS Discord
- **Documentation**:
  - [Next.js Docs](https://nextjs.org/docs)
  - [React Docs](https://react.dev)
  - [Tailwind Docs](https://tailwindcss.com/docs)

### Creating Bug Reports

Include the following information:

1. **Environment**:
   - Operating System
   - Node.js version
   - Package manager version
   - Browser version (if applicable)

2. **Steps to Reproduce**:
   - Exact commands run
   - Expected behavior
   - Actual behavior

3. **Code Samples**:
   - Minimal reproduction case
   - Relevant configuration files
   - Error messages and stack traces

4. **Logs**:
   - Build logs
   - Runtime logs
   - Browser console logs

---

If you can't find a solution here, please check the [SETUP.md](./SETUP.md) and [DEPLOYMENT.md](./DEPLOYMENT.md) guides, or reach out to the development team.