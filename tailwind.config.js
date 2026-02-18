/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          900: '#7f1d1d',
        },
        brand: {
          red: '#e21e24',
          'red-dark': '#c41e24',
          blue: '#141b34',
          'blue-light': '#1e2a4a',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, rgba(3, 35, 45, 1) 0%, rgba(6, 35, 44, 0.26) 69%, rgba(0, 45, 60, 0) 88%, rgba(17, 47, 56, 1) 100%)',
        'service-gradient': 'linear-gradient(135deg, #141b34 0%, #1e2a4a 100%)',
      },
    },
  },
  plugins: [],
}