'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LoginOverlay } from '@/components/auth'

interface HomeHeaderProps {
  className?: string
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function HomeHeader({ className = '' }: HomeHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  const languages = ['EN', 'FR', 'ES', 'DE']
  const currencies = ['NGN', 'USD', 'EUR', 'GBP']

  // Check for logged-in user
  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          console.error('Error parsing user data:', error)
          localStorage.removeItem('user')
        }
      }
    }

    // Check immediately
    checkUser()

    // Also check when storage changes (for cross-tab updates)
    window.addEventListener('storage', checkUser)
    
    // Check again after a short delay to catch any race conditions
    const timer = setTimeout(checkUser, 100)

    return () => {
      window.removeEventListener('storage', checkUser)
      clearTimeout(timer)
    }
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigationItems = [
    { label: 'Home', href: '/', active: pathname === '/' },
    { label: 'Services', href: '/services', active: pathname.startsWith('/services') },
    { label: 'About', href: '/about', active: pathname === '/about' }
  ]

  const getDashboardPath = () => {
    if (!user) return '/dashboard'
    
    switch (user.role) {
      case 'Admin':
        return '/dashboard/admin'
      case 'Staff':
        return '/dashboard/staff'
      case 'Manager':
      case 'Executive':
        return '/dashboard/manager'
      default:
        return '/dashboard'
    }
  }

  const handleAccountClick = () => {
    if (user) {
      router.push(getDashboardPath())
    } else {
      setIsLoginOverlayOpen(true)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log('Login attempt:', { email, password })
    // For now, just simulate a successful login
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleSignUp = () => {
    setIsLoginOverlayOpen(false)
    // Navigate to sign up page or open sign up overlay
    window.location.href = '/signup'
  }

  const handleForgotPassword = () => {
    setIsLoginOverlayOpen(false)
    // Navigate to forgot password page
    window.location.href = '/forgot-password'
  }

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white shadow-md' 
          : 'bg-transparent'
      } ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={isScrolled ? "/images/logo.png" : "/images/white-logo.svg"}
              alt="The Travel Place"
              width={74}
              height={66}
              className="h-12 w-auto transition-all duration-300"
              priority
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-12 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-base font-medium transition-colors duration-300 ${
                  isScrolled
                    ? item.active
                      ? 'text-brand-red'
                      : 'text-gray-700 hover:text-brand-red'
                    : 'text-white hover:text-gray-200'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Account & Settings */}
          <div className="hidden md:flex items-center gap-4">
            {/* Account/Dashboard Button */}
            <button
              onClick={handleAccountClick}
              className={`px-9 py-3.5 rounded-full text-base font-medium transition-all duration-300 border-2 flex items-center gap-2 ${
                isScrolled
                  ? 'bg-brand-red text-white border-brand-red hover:bg-brand-red-600 hover:border-brand-red-600'
                  : 'bg-transparent text-white border-white hover:bg-white hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {user ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                )}
              </svg>
              {user ? 'Dashboard' : 'Account'}
            </button>

            {/* Country | Language | Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 px-3 py-2 rounded ${
                  isScrolled 
                    ? 'text-gray-600 hover:text-brand-red hover:bg-gray-50' 
                    : 'text-white hover:text-gray-200 hover:bg-white/10'
                }`}
              >
                <span>NG | {selectedLanguage} | {selectedCurrency}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isSettingsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
                  {/* Language Dropdown */}
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 font-medium mb-2">LANGUAGE</label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    >
                      <option value="EN">English</option>
                      <option value="FR">Français</option>
                      <option value="ES">Español</option>
                      <option value="DE">Deutsch</option>
                    </select>
                  </div>
                  
                  {/* Currency Dropdown */}
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-2">CURRENCY</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                    >
                      <option value="NGN">NGN - Nigerian Naira</option>
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-md transition-colors duration-300 ${
              isScrolled
                ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                : 'text-white hover:text-gray-200 hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden border-t py-4 transition-colors duration-300 ${
            isScrolled 
              ? 'border-gray-200 bg-white' 
              : 'border-white/20 bg-black/20 backdrop-blur-sm'
          }`}>
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded transition-colors duration-300 ${
                    isScrolled
                      ? item.active
                        ? 'text-brand-red font-medium bg-brand-red-50'
                        : 'text-gray-700 hover:text-brand-red hover:bg-gray-50'
                      : item.active
                        ? 'text-white font-medium bg-white/20'
                        : 'text-white hover:text-gray-200 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Account/Dashboard Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  handleAccountClick()
                }}
                className={`mt-4 px-4 py-2 rounded-full text-center font-medium transition-all duration-300 border-2 flex items-center justify-center gap-2 ${
                  isScrolled
                    ? 'bg-brand-red text-white border-brand-red hover:bg-brand-red-600'
                    : 'bg-transparent text-white border-white hover:bg-white hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {user ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  )}
                </svg>
                {user ? 'Dashboard' : 'Account'}
              </button>
            </nav>
          </div>
        )}

        {/* Login Overlay */}
        <LoginOverlay
          isOpen={isLoginOverlayOpen}
          onClose={() => setIsLoginOverlayOpen(false)}
          onLogin={handleLogin}
          onSignUp={handleSignUp}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </header>
  )
}