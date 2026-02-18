'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LoginOverlay } from '@/components/auth'

interface HeaderProps {
  className?: string
}

export function Header({ className = '' }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginOverlayOpen, setIsLoginOverlayOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('EN')
  const [selectedCurrency, setSelectedCurrency] = useState('NGN')
  const pathname = usePathname()

  const languages = ['EN', 'FR', 'ES', 'DE']
  const currencies = ['NGN', 'USD', 'EUR', 'GBP']

  const navigationItems = [
    { label: 'Home', href: '/', active: pathname === '/' },
    { label: 'Services', href: '/services', active: pathname.startsWith('/services') },
    { label: 'About', href: '/about', active: pathname === '/about' }
  ]

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
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="The Travel Place"
              width={118}
              height={75}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-2.5 rounded transition-colors ${
                  item.active
                    ? 'text-brand-red font-medium'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side - Account & Settings */}
          <div className="hidden md:flex items-center gap-4">
            {/* Account Button */}
            <button
              onClick={() => setIsLoginOverlayOpen(true)}
              className="px-5 py-3 bg-brand-red text-white rounded hover:bg-brand-red-600 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account
            </button>

            {/* Country | Language | Currency Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-red transition-colors px-3 py-2 rounded hover:bg-gray-50"
              >
                <span className="font-medium">NG | {selectedLanguage} | {selectedCurrency}</span>
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
            className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
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
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded transition-colors ${
                    item.active
                      ? 'text-brand-red font-medium bg-brand-red-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Account Button */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsLoginOverlayOpen(true)
                }}
                className="mt-4 px-4 py-2 bg-brand-red text-white rounded hover:bg-brand-red-600 transition-colors font-medium text-center flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Account
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