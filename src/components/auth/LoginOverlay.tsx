'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CountryCodeSelector from '@/components/ui/CountryCodeSelector'
import { authService } from '@/lib/auth-service'
import { appConfig } from '@/lib/config'

interface LoginOverlayProps {
  isOpen: boolean
  onClose: () => void
  onLogin?: (email: string, password: string) => Promise<void>
  onSignUp?: () => void
  onForgotPassword?: () => void
}

type FormMode = 'login' | 'signup'
type LoginStep = 1 | 2
type SignupStep = 1 | 2 | 3 | 4 | 5

export default function LoginOverlay({
  isOpen,
  onClose,
  onLogin,
  onSignUp,
  onForgotPassword
}: LoginOverlayProps) {
  const router = useRouter()
  const [formMode, setFormMode] = useState<FormMode>('login')
  const [loginStep, setLoginStep] = useState<LoginStep>(1)
  const [signupStep, setSignupStep] = useState<SignupStep>(1)
  
  // Login state
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  
  // Signup state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    otherNames: '',
    email: '',
    phoneNumber: '',
    countryCode: 'NG',
    dialCode: '+234',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Pre-registration verification state (NEW - separate steps)
  const [emailOtp, setEmailOtp] = useState('')
  const [phoneOtp, setPhoneOtp] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')
  const [phoneVerificationMethod, setPhoneVerificationMethod] = useState<'sms' | 'whatsapp' | 'call'>('sms')
  const [resendEmailTimer, setResendEmailTimer] = useState(0)
  const [resendPhoneTimer, setResendPhoneTimer] = useState(0)
  
  // Verification state (for post-registration)
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false)
  const [verificationType, setVerificationType] = useState<'email' | 'phone'>('email')
  const [verificationContact, setVerificationContact] = useState('')
  const [resendingVerification, setResendingVerification] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Timer effects - MUST be before early return to follow Rules of Hooks
  useEffect(() => {
    if (resendEmailTimer > 0) {
      const timer = setTimeout(() => setResendEmailTimer(resendEmailTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendEmailTimer])

  useEffect(() => {
    if (resendPhoneTimer > 0) {
      const timer = setTimeout(() => setResendPhoneTimer(resendPhoneTimer - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendPhoneTimer])

  if (!isOpen) return null

  const handleLoginNext = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!emailOrPhone) {
      setError('Please enter your email or phone number')
      return
    }
    
    setLoginStep(2)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setShowVerificationPrompt(false)
    setIsLoading(true)

    try {
      await authService.login({
        emailOrPhone,
        password,
      })

      // Call the onLogin callback if provided
      if (onLogin) {
        await onLogin(emailOrPhone, password)
      }
      
      // Show success message
      setSuccess('Login successful! Redirecting...')
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event('userLoggedIn'))
      
      // Close modal
      onClose()
      
      // Use Next.js router for smooth navigation (no page reload)
      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (err: any) {
      // Check if verification is required
      if (err.response?.data?.requiresVerification) {
        setVerificationType(err.response.data.verificationType)
        setVerificationContact(
          err.response.data.email || err.response.data.phoneNumber
        )
        setShowVerificationPrompt(true)
        setError(err.response.data.message)
      } else {
        setError(err.message || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResendingVerification(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch(`${appConfig.apiBaseUrl}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailOrPhone: verificationContact,
          type: verificationType
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.status === 'success') {
        setSuccess(data.message || 'Verification sent successfully')
        setError('')
      } else {
        setError(data.message || 'Failed to resend verification')
        setSuccess('')
      }
    } catch (err: any) {
      setError('Failed to resend verification. Please try again.')
      setSuccess('')
    } finally {
      setResendingVerification(false)
    }
  }

  const handleLoginBack = () => {
    setError('')
    setLoginStep(1)
  }

  const handleSignupCountryChange = (countryCode: string, dialCode: string) => {
    setSignupData(prev => ({ ...prev, countryCode, dialCode }))
  }

  const handleSignupNext = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (signupStep === 1) {
      if (!signupData.firstName || !signupData.lastName) {
        setError('Please enter your first and last name')
        return
      }
      setSignupStep(2)
    } else if (signupStep === 2) {
      if (!signupData.email || !signupData.phoneNumber) {
        setError('Please enter your email and phone number')
        return
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(signupData.email)) {
        setError('Please enter a valid email address')
        return
      }
      
      // Send verification codes
      setIsLoading(true)
      try {
        const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
        await authService.sendVerificationCodes(signupData.email, fullPhoneNumber)
        setSuccess('Verification code sent to your email!')
        setSignupStep(3)
        // Start email resend timer
        setResendEmailTimer(60)
      } catch (err: any) {
        setError(err.message || 'Failed to send verification code. Please try again.')
      } finally {
        setIsLoading(false)
      }
    } else if (signupStep === 3) {
      // Verify email OTP
      if (!emailOtp) {
        setError('Please enter the email verification code')
        return
      }
      
      if (emailOtp.length !== 6) {
        setError('Verification code must be 6 digits')
        return
      }
      
      setIsLoading(true)
      try {
        const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
        const result = await authService.verifyRegistrationCodes(
          signupData.email,
          fullPhoneNumber,
          emailOtp,
          '000000' // Placeholder for phone OTP (not verified yet)
        )
        setEmailVerified(true)
        
        // Check if backend auto-verified phone (dev mode)
        if (result.phoneVerified && result.verificationToken) {
          // Backend is in dev mode - phone auto-verified
          setPhoneVerified(true)
          setVerificationToken(result.verificationToken)
          setSuccess('Email verified! Phone verification skipped (dev mode). Please create your password.')
          setSignupStep(5) // Skip to password step
        } else {
          // Normal flow - proceed to phone verification
          setSuccess('Email verified! Now verifying your phone number...')
          setSignupStep(4)
          // Start phone resend timer
          setResendPhoneTimer(60)
        }
      } catch (err: any) {
        setError(err.message || 'Email verification failed. Please check your code.')
      } finally {
        setIsLoading(false)
      }
    } else if (signupStep === 4) {
      // Verify phone OTP
      if (!phoneOtp) {
        setError('Please enter the phone verification code')
        return
      }
      
      if (phoneOtp.length !== 6) {
        setError('Verification code must be 6 digits')
        return
      }
      
      setIsLoading(true)
      try {
        const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
        const result = await authService.verifyRegistrationCodes(
          signupData.email,
          fullPhoneNumber,
          emailOtp,
          phoneOtp
        )
        setVerificationToken(result.verificationToken)
        setPhoneVerified(true)
        setSuccess('Phone verified! Please create your password.')
        setSignupStep(5)
      } catch (err: any) {
        setError(err.message || 'Phone verification failed. Please check your code.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (!signupData.agreeToTerms) {
      setError('Please agree to the terms and conditions')
      return
    }
    
    setIsLoading(true)
    try {
      // Format phone number with dial code
      const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
      
      await authService.register({
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        otherNames: signupData.otherNames || undefined,
        email: signupData.email,
        phoneNumber: fullPhoneNumber,
        password: signupData.password,
        role: 'Customer',
        verificationToken: verificationToken, // Include verification token
      })

      // Show success message and redirect to dashboard
      setSuccess('Registration successful! Your account is ready. Redirecting to dashboard...')
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userLoggedIn'))
      
      setTimeout(() => {
        router.push('/dashboard')
        onClose()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmailOtp = async () => {
    if (resendEmailTimer > 0) return
    
    setError('')
    setIsLoading(true)
    try {
      const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
      await authService.resendEmailOtp(signupData.email, fullPhoneNumber)
      setSuccess('Email code resent successfully!')
      setResendEmailTimer(60)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend email code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendPhoneOtp = async () => {
    if (resendPhoneTimer > 0) return
    
    setError('')
    setIsLoading(true)
    try {
      const fullPhoneNumber = `${signupData.dialCode}${signupData.phoneNumber}`
      await authService.resendPhoneOtp(signupData.email, fullPhoneNumber, phoneVerificationMethod)
      setSuccess(`Phone code resent via ${phoneVerificationMethod}!`)
      setResendPhoneTimer(60)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to resend phone code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)
    
    try {
      // Initialize Google Sign-In
      // Note: You'll need to add Google Sign-In SDK to your project
      // For now, this is a placeholder
      alert('Google Sign-In integration coming soon!')
      
      // Example of what the implementation would look like:
      /*
      const googleUser = await window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: 'email profile',
      })
      
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          googleId: googleUser.sub,
          email: googleUser.email,
          firstName: googleUser.given_name,
          lastName: googleUser.family_name,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Google login failed')
      }

      if (data.data?.user) {
        localStorage.setItem('user', JSON.stringify(data.data.user))
      }

      onClose()
      window.location.reload()
      */
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignupBack = () => {
    setError('')
    if (signupStep > 1) {
      setSignupStep((signupStep - 1) as SignupStep)
    }
  }

  const switchToSignup = () => {
    setFormMode('signup')
    setSignupStep(1)
    setLoginStep(1)
    setError('')
  }

  const switchToLogin = () => {
    setFormMode('login')
    setLoginStep(1)
    setSignupStep(1)
    setError('')
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden relative border border-white/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 min-h-[500px] p-6 items-center">
          {/* Left Side - Login/Signup Form */}
          <div className="bg-white p-8 md:p-12 rounded-[2rem]">
            {formMode === 'login' ? (
              <>
                {/* Login Form - Progressive Steps */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login</h2>
                  <p className="text-sm text-gray-500">
                    {loginStep === 1 ? 'Enter your email or phone' : 'Enter your password'}
                  </p>
                  
                  {/* Progress Indicator */}
                  <div className="mt-4 flex gap-2">
                    <div className={`h-1 flex-1 rounded ${loginStep >= 1 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${loginStep >= 2 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md mb-4">
                    <p className="text-sm text-green-600">{success}</p>
                  </div>
                )}

                {showVerificationPrompt && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-yellow-800 mb-1">
                          Verification Required
                        </h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          {verificationType === 'email' 
                            ? `Please verify your email (${verificationContact}) before logging in.`
                            : `Please verify your phone number (${verificationContact}) before logging in.`
                          }
                        </p>
                        <button
                          onClick={handleResendVerification}
                          disabled={resendingVerification}
                          className="text-sm font-medium text-yellow-800 hover:text-yellow-900 underline disabled:opacity-50"
                        >
                          {resendingVerification 
                            ? 'Sending...' 
                            : `Resend verification ${verificationType === 'email' ? 'email' : 'code'}`
                          }
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {loginStep === 1 ? (
                  <form onSubmit={handleLoginNext} className="space-y-5">
                    <div>
                      <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700 mb-2">
                        Email or Phone Number
                      </label>
                      <input
                        id="emailOrPhone"
                        type="text"
                        value={emailOrPhone}
                        onChange={(e) => setEmailOrPhone(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="email@example.com or +234..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors"
                    >
                      Next
                    </button>

                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OR</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
                    </button>

                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-600">
                        Do not have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToSignup}
                          className="font-medium text-brand-red hover:text-brand-red-600"
                        >
                          Sign up
                        </button>
                      </p>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleLoginSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                          placeholder="••••••••••••"
                          required
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-brand-red hover:text-brand-red-600"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleLoginBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            ) : (
              <>
                {/* Signup Form - Progressive Steps */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                  <p className="text-sm text-gray-500">
                    {signupStep === 1 && 'Step 1 of 5: Your Name'}
                    {signupStep === 2 && 'Step 2 of 5: Contact Details'}
                    {signupStep === 3 && 'Step 3 of 5: Verify Email'}
                    {signupStep === 4 && 'Step 4 of 5: Verify Phone'}
                    {signupStep === 5 && 'Step 5 of 5: Create Password'}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="mt-4 flex gap-2">
                    <div className={`h-1 flex-1 rounded ${signupStep >= 1 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 2 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 3 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 4 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${signupStep >= 5 ? 'bg-brand-red' : 'bg-gray-200'}`} />
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {signupStep === 1 && (
                  <form onSubmit={handleSignupNext} className="space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={signupData.firstName}
                        onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="John"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={signupData.lastName}
                        onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="Doe"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="otherNames" className="block text-sm font-medium text-gray-700 mb-2">
                        Other Names <span className="text-gray-400 text-xs">(Optional)</span>
                      </label>
                      <input
                        id="otherNames"
                        type="text"
                        value={signupData.otherNames}
                        onChange={(e) => setSignupData({...signupData, otherNames: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="Middle name or other names"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors"
                    >
                      Next
                    </button>

                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={switchToLogin}
                          className="font-medium text-brand-red hover:text-brand-red-600"
                        >
                          Login
                        </button>
                      </p>
                    </div>
                  </form>
                )}

                {signupStep === 2 && (
                  <form onSubmit={handleSignupNext} className="space-y-4">
                    <div>
                      <label htmlFor="signupEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        id="signupEmail"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <div className="border border-gray-300 rounded-lg bg-white flex items-center focus-within:ring-2 focus-within:ring-brand-red focus-within:border-transparent">
                        <CountryCodeSelector
                          selectedCountry={signupData.countryCode}
                          onCountryChange={handleSignupCountryChange}
                        />
                        <input
                          id="phone"
                          type="tel"
                          value={signupData.phoneNumber}
                          onChange={(e) => setSignupData({...signupData, phoneNumber: e.target.value})}
                          className="flex-1 px-4 py-3 border-none outline-none bg-transparent focus:outline-none focus:ring-0"
                          placeholder="800 000 0000"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSignupBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </form>
                )}

                {signupStep === 3 && (
                  <form onSubmit={handleSignupNext} className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="mx-auto w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Email</h3>
                      <p className="text-sm text-gray-600">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-gray-900">{signupData.email}</span>
                      </p>
                    </div>

                    {success && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-600">{success}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="emailOtp" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Verification Code
                      </label>
                      <input
                        id="emailOtp"
                        type="text"
                        value={emailOtp}
                        onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoFocus
                      />
                      <div className="mt-2 text-center">
                        <button
                          type="button"
                          onClick={handleResendEmailOtp}
                          disabled={resendEmailTimer > 0 || isLoading}
                          className="text-sm text-brand-red hover:text-brand-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {resendEmailTimer > 0 ? `Resend in ${resendEmailTimer}s` : 'Resend Email Code'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSignupBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || emailOtp.length !== 6}
                        className="flex-1 bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                      </button>
                    </div>
                  </form>
                )}

                {signupStep === 4 && (
                  <form onSubmit={handleSignupNext} className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="mx-auto w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify Your Phone</h3>
                      <p className="text-sm text-gray-600">
                        We've sent a 6-digit code to<br />
                        <span className="font-medium text-gray-900">{signupData.dialCode} {signupData.phoneNumber.replace(/^0+/, '')}</span>
                      </p>
                    </div>

                    {success && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-sm text-green-600">{success}</p>
                      </div>
                    )}

                    <div>
                      <label htmlFor="phoneOtp" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Verification Code
                      </label>
                      <input
                        id="phoneOtp"
                        type="text"
                        value={phoneOtp}
                        onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                        autoFocus
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <select
                          value={phoneVerificationMethod}
                          onChange={(e) => setPhoneVerificationMethod(e.target.value as 'sms' | 'whatsapp' | 'call')}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="sms">SMS</option>
                          <option value="whatsapp">WhatsApp</option>
                          <option value="call">Voice Call</option>
                        </select>
                        <button
                          type="button"
                          onClick={handleResendPhoneOtp}
                          disabled={resendPhoneTimer > 0 || isLoading}
                          className="text-sm text-brand-red hover:text-brand-red-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          {resendPhoneTimer > 0 ? `Resend in ${resendPhoneTimer}s` : 'Resend Phone Code'}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSignupBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading || phoneOtp.length !== 6}
                        className="flex-1 bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Verifying...' : 'Verify Phone'}
                      </button>
                    </div>
                  </form>
                )}

                {signupStep === 5 && (
                  <form onSubmit={handleSignupSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="signupPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="signupPassword"
                          type={showSignupPassword ? 'text' : 'password'}
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                          placeholder="••••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showSignupPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
                          placeholder="••••••••••••"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showConfirmPassword ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"} />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <input
                        id="agreeToTerms"
                        type="checkbox"
                        checked={signupData.agreeToTerms}
                        onChange={(e) => setSignupData({...signupData, agreeToTerms: e.target.checked})}
                        className="h-4 w-4 mt-1 text-brand-red focus:ring-brand-red border-gray-300 rounded"
                      />
                      <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="/terms" className="text-brand-red hover:text-brand-red-600">
                          Terms and Conditions
                        </a>
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={handleSignupBack}
                        className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-brand-red text-white py-3 rounded-lg font-medium hover:bg-brand-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Right Side - Hero Content */}
          <div className="hidden md:flex flex-col justify-center items-center p-12 text-white relative overflow-hidden">
            {/* Content */}
            <div className="relative z-10 text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
                Ready to Plan Your Dream Trip? Log In and Let's Get Started!
              </h1>
              <p className="text-lg lg:text-xl text-white/90 drop-shadow-md">
                Satisfy Your travel cravings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}