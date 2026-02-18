# Setup and Installation Guide

This guide will help you set up "The Travel Place" Next.js application for development and production.

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
- [Development Workflow](#development-workflow)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

- **Node.js**: 18.17.0 or later
- **npm**: 9.0.0 or later (or yarn 1.22.0+)
- **Git**: Latest version
- **Operating System**: Windows 10+, macOS 10.15+, or Linux

### Recommended Requirements

- **Node.js**: 20.x LTS
- **npm**: Latest version
- **RAM**: 8GB or more
- **Storage**: 2GB free space

### Check Your System

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd travel-place
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy environment template
cp .env.local.example .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Detailed Setup

### 1. Project Structure

```
travel-place/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── layout/         # Layout components
│   │   └── sections/       # Page sections
│   ├── lib/                # Utility functions and data
│   │   ├── data/          # Mock data files
│   │   └── utils/         # Helper functions
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

### 2. Environment Configuration

#### Development Environment

1. **Copy the template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`:**
   ```env
   NODE_ENV=development
   NEXT_PUBLIC_SITE_NAME="The Travel Place"
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_DESCRIPTION="Discover amazing destinations and plan your perfect trip"
   NEXT_PUBLIC_DEBUG_MODE=true
   ```

#### Production Environment

1. **Copy the template:**
   ```bash
   cp .env.production.example .env.production
   ```

2. **Configure production variables:**
   ```env
   NODE_ENV=production
   NEXT_PUBLIC_SITE_NAME="The Travel Place"
   NEXT_PUBLIC_SITE_URL=https://yourdomain.com
   NEXT_PUBLIC_SITE_DESCRIPTION="Discover amazing destinations and plan your perfect trip"
   
   # Add your production services
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   SMTP_HOST=smtp.youremailprovider.com
   # ... other production variables
   ```

### 3. Dependencies Installation

#### Install All Dependencies

```bash
npm install
```

#### Install Development Dependencies Only

```bash
npm install --only=dev
```

#### Install Production Dependencies Only

```bash
npm install --only=production
```

### 4. Verify Installation

```bash
# Check if TypeScript compiles
npx tsc --noEmit

# Check if build works
npm run build

# Run linting
npm run lint
```

## Development Workflow

### 1. Start Development Server

```bash
# Start with hot reload
npm run dev

# Start on different port
npm run dev -- -p 3001
```

### 2. Code Quality

```bash
# Run TypeScript check
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

### 3. Building

```bash
# Development build
npm run build

# Production build
NODE_ENV=production npm run build

# Analyze bundle size
npm run analyze
```

### 4. Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Configuration

### Next.js Configuration

The `next.config.js` file contains:

- **Image optimization** settings
- **Security headers** configuration
- **Performance optimizations**
- **Bundle splitting** rules
- **Compression** settings

### Tailwind CSS Configuration

The `tailwind.config.ts` file includes:

- **Custom colors** matching the design
- **Typography** settings
- **Responsive breakpoints**
- **Custom components**

### TypeScript Configuration

The `tsconfig.json` file provides:

- **Strict type checking**
- **Path aliases** for imports
- **Next.js optimizations**

## Scripts

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run type-check` | Run TypeScript check |
| `npm run format` | Format code with Prettier |
| `npm run analyze` | Analyze bundle size |

### Custom Scripts

You can add custom scripts to `package.json`:

```json
{
  "scripts": {
    "dev:debug": "NODE_OPTIONS='--inspect' npm run dev",
    "build:analyze": "ANALYZE=true npm run build",
    "clean": "rm -rf .next node_modules/.cache"
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solutions**:
```bash
# Use different port
npm run dev -- -p 3001

# Kill process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process using port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9
```

#### 2. Module Not Found

**Error**: `Module not found: Can't resolve 'module-name'`

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Check if module is installed
npm list module-name
```

#### 3. TypeScript Errors

**Error**: TypeScript compilation errors

**Solutions**:
```bash
# Check TypeScript configuration
npx tsc --showConfig

# Run type check
npx tsc --noEmit

# Update TypeScript
npm update typescript @types/node @types/react
```

#### 4. Build Failures

**Error**: Build fails with memory issues

**Solutions**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Clear cache
npm run clean
```

#### 5. Environment Variables Not Loading

**Error**: Environment variables are undefined

**Solutions**:
- Ensure variables start with `NEXT_PUBLIC_` for client-side access
- Check `.env.local` file exists and has correct syntax
- Restart development server after changing environment variables
- Verify no spaces around `=` in environment files

### Performance Issues

#### Slow Development Server

```bash
# Clear cache
rm -rf .next node_modules/.cache

# Disable source maps (faster builds)
echo "DISABLE_SOURCE_MAPS=true" >> .env.local

# Use SWC minifier
# Already enabled in next.config.js
```

#### Large Bundle Size

```bash
# Analyze bundle
npm run analyze

# Check for duplicate dependencies
npx npm-check-updates
```

### Getting Help

#### Debug Information

When reporting issues, include:

```bash
# System information
node --version
npm --version
npx next info

# Package information
npm list --depth=0

# Build information
npm run build 2>&1 | tee build.log
```

#### Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **TypeScript Documentation**: https://www.typescriptlang.org/docs

#### Community Support

- **GitHub Issues**: Report bugs and feature requests
- **Stack Overflow**: Tag questions with `next.js`, `react`, `tailwindcss`
- **Discord Communities**: Next.js, React, Tailwind CSS communities

## Best Practices

### Development

1. **Use TypeScript**: Always type your components and functions
2. **Component Structure**: Follow the established folder structure
3. **Environment Variables**: Use appropriate prefixes and validation
4. **Code Quality**: Run linting and formatting before commits
5. **Performance**: Monitor bundle size and Core Web Vitals

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature description"

# Push and create pull request
git push origin feature/your-feature-name
```

### Code Style

- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Write meaningful commit messages
- Add comments for complex logic

---

For additional help or questions, please refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) guide or contact the development team.