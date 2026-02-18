# Deployment Guide

This guide provides comprehensive instructions for deploying "The Travel Place" Next.js application to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel (Recommended)](#vercel-recommended)
  - [Netlify](#netlify)
  - [AWS](#aws)
  - [Docker](#docker)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18.17 or later
- npm or yarn package manager
- Git repository with your code
- Environment variables configured
- Domain name (optional)

## Environment Configuration

### 1. Copy Environment Template

```bash
# For production deployment
cp .env.production.example .env.production

# For local development
cp .env.local.example .env.local
```

### 2. Configure Required Variables

Edit your environment file with the following **required** variables:

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_NAME="The Travel Place"
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_DESCRIPTION="Discover amazing destinations and plan your perfect trip"
```

### 3. Configure Optional Variables

Add these variables based on your needs:

```env
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Email Service (for newsletter)
SMTP_HOST=smtp.youremailprovider.com
SMTP_PORT=587
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-secure-password
FROM_EMAIL=noreply@yourdomain.com
```

## Build Process

### 1. Install Dependencies

```bash
cd travel-place
npm install
```

### 2. Run Build

```bash
# Production build
npm run build

# Check build output
npm run start
```

### 3. Verify Build

The build should complete without errors and generate:
- `.next/` directory with optimized files
- Static assets in `.next/static/`
- Server-side code in `.next/server/`

## Deployment Platforms

### Vercel (Recommended)

Vercel is the easiest platform for Next.js deployment.

#### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all required environment variables
   - Set `NODE_ENV=production`

3. **Custom Domain** (Optional)
   - Go to Domains tab in Vercel dashboard
   - Add your custom domain
   - Configure DNS records as instructed

#### Manual Deployment

```bash
# Build and deploy
npm run build
vercel --prod
```

### Netlify

#### Using Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build and Deploy**
   ```bash
   # Build the project
   npm run build
   
   # Deploy to Netlify
   netlify deploy --prod --dir=.next
   ```

3. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Node version: 18.x

#### Using Git Integration

1. Connect your repository to Netlify
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables in Netlify dashboard

### AWS

#### Using AWS Amplify

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Connect your Git repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add environment variables in Amplify console
   - Set `NODE_ENV=production`

#### Using EC2 with PM2

1. **Setup EC2 Instance**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd travel-place
   
   # Install dependencies
   npm ci --only=production
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "travel-place" -- start
   pm2 save
   pm2 startup
   ```

### Docker

#### Dockerfile

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  travel-place:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SITE_NAME=The Travel Place
      - NEXT_PUBLIC_SITE_URL=https://yourdomain.com
    restart: unless-stopped
```

#### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Or build manually
docker build -t travel-place .
docker run -p 3000:3000 travel-place
```

## Post-Deployment

### 1. Verify Deployment

- [ ] Site loads correctly at your domain
- [ ] All pages are accessible
- [ ] Images load properly
- [ ] Forms work (newsletter signup)
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable (check Core Web Vitals)

### 2. Setup Monitoring

#### Google Analytics (if configured)

1. Verify GA tracking is working
2. Set up goals and conversions
3. Configure enhanced ecommerce (if applicable)

#### Performance Monitoring

```bash
# Test Core Web Vitals
npx lighthouse https://yourdomain.com --view

# Test mobile performance
npx lighthouse https://yourdomain.com --preset=perf --view
```

### 3. SEO Setup

- [ ] Submit sitemap to Google Search Console
- [ ] Verify meta tags are correct
- [ ] Check structured data
- [ ] Test social media sharing

### 4. Security Checklist

- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] Environment variables are secure
- [ ] No sensitive data in client-side code

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: `Module not found` errors during build
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Issue**: TypeScript errors during build
```bash
# Solution: Check TypeScript configuration
npx tsc --noEmit
```

#### Runtime Errors

**Issue**: Environment variables not loading
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Check that variables are set in your deployment platform
- Verify `.env` files are not committed to Git

**Issue**: Images not loading
- Check `next.config.js` image domains configuration
- Verify image paths are correct
- Ensure images are optimized and accessible

#### Performance Issues

**Issue**: Slow loading times
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer
```

**Issue**: Poor Core Web Vitals
- Enable image optimization
- Check for render-blocking resources
- Optimize fonts and CSS

### Debug Mode

Enable debug mode for troubleshooting:

```env
NEXT_PUBLIC_DEBUG_MODE=true
NEXT_PUBLIC_SHOW_PERFORMANCE_METRICS=true
```

### Getting Help

1. **Check Logs**
   - Vercel: Check function logs in dashboard
   - Netlify: Check deploy logs
   - AWS: Check CloudWatch logs

2. **Community Support**
   - [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
   - [Vercel Community](https://github.com/vercel/vercel/discussions)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)

3. **Documentation**
   - [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
   - [Vercel Docs](https://vercel.com/docs)
   - [Netlify Docs](https://docs.netlify.com/)

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Rebuild and redeploy
npm run build
```

### Backup Strategy

- Regular database backups (if applicable)
- Environment variable backups
- Code repository backups
- Asset backups (images, etc.)

### Performance Monitoring

Set up regular performance checks:
- Weekly Lighthouse audits
- Monthly dependency updates
- Quarterly security reviews

---

For additional support or questions, please refer to the project documentation or contact the development team.