# The Travel Place - Next.js Application

A modern, production-ready Next.js application converted from static HTML/CSS/JavaScript to a fully functional React application with TypeScript and Tailwind CSS.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Responsive Design**: Mobile-first approach with responsive layouts
- **Performance Optimized**: Next.js Image optimization, lazy loading
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Type Safe**: Full TypeScript implementation

## 📁 Project Structure

```
travel-place/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── flights/           # Flight booking page
│   │   ├── hotels/            # Hotel booking page
│   │   ├── car-hire/          # Car rental page
│   │   ├── visa-applications/ # Visa application page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── sections/          # Page sections (Hero, Services, etc.)
│   │   └── ui/                # Reusable UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
└── ...config files
```

## 🛠 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.local.example .env.local
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses Tailwind CSS for styling with custom configurations:

- **Custom Colors**: Brand colors defined in `tailwind.config.ts`
- **Custom Fonts**: Poppins, Nunito Sans, and Inter fonts
- **Responsive Design**: Mobile-first breakpoints
- **Dark Mode**: Ready for dark mode implementation

## 🔧 Key Components

### Layout Components
- **Header**: Navigation with dropdown menus and mobile responsiveness
- **Footer**: Site links and contact information

### Section Components
- **HeroSection**: Main landing section with search tabs
- **ServicesSection**: Service cards with hover effects
- **PackagesSection**: Tour destination cards
- **TestimonialsSection**: Customer testimonials slider

### UI Components
- **SearchForm**: Reusable search form for different services
- **ServiceTabs**: Tabbed interface for service selection

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker containers**

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Skip links

## 🔍 SEO Optimization

- Meta tags configuration
- Open Graph tags
- Structured data ready
- Sitemap generation
- Image optimization

## 🧪 Testing

The project structure supports:
- Unit testing with Jest
- Integration testing with React Testing Library
- E2E testing with Playwright/Cypress

## 📄 License

This project is proprietary to The Travel Place.

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and installation guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Comprehensive deployment guide
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

## 🤝 Contributing

Please follow the established code style and component patterns when contributing to this project.

## 🆘 Need Help?

If you encounter any issues:

1. Check the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) guide
2. Review the [SETUP.md](./SETUP.md) for configuration issues
3. Consult the [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment problems
4. Create an issue with detailed information about your problem