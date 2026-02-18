/**
 * Payment Verification Service
 * Handles automatic payment verification after Paystack redirects and payment status polling
 */

import { flightService } from './flight-service'
import { hotelService } from './hotel-service'
import { visaService } from './visa-service'
import { insuranceService } from './insurance-service'
import { packageService } from './package-service'

export type PaymentServiceType = 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'

export interface PaymentVerificationOptions {
  reference: string
  serviceType: PaymentServiceType
  bookingId?: string // For services that need booking/application ID
  onSuccess?: (result: any) => void
  onFailure?: (error: Error) => void
  onTimeout?: () => void
  maxRetries?: number
  retryInterval?: number
  timeoutDuration?: number
}

export interface PaymentStatus {
  status: 'pending' | 'success' | 'failed' | 'timeout'
  reference: string
  serviceType: PaymentServiceType
  result?: any
  error?: string
  attempts: number
  lastChecked: string
}

class PaymentVerificationService {
  private verificationItems: Map<string, PaymentVerificationOptions> = new Map()
  private verificationIntervals: Map<string, NodeJS.Timeout> = new Map()
  private verificationTimeouts: Map<string, NodeJS.Timeout> = new Map()

  /**
   * Verify payment for a specific service type
   */
  private async verifyPaymentForService(
    serviceType: PaymentServiceType, 
    reference: string, 
    bookingId?: string
  ): Promise<any> {
    switch (serviceType) {
      case 'flight':
        return await flightService.verifyPayment(reference)
      case 'hotel':
        return await hotelService.verifyPayment(reference)
      case 'visa':
        if (!bookingId) throw new Error('Booking ID required for visa payment verification')
        return await visaService.verifyPayment(bookingId, reference)
      case 'insurance':
        if (!bookingId) throw new Error('Policy ID required for insurance payment verification')
        return await insuranceService.verifyPayment(bookingId, reference)
      case 'package':
        return await packageService.verifyPayment(reference)
      default:
        throw new Error(`Unsupported service type: ${serviceType}`)
    }
  }

  /**
   * Perform single payment verification attempt
   */
  private async attemptVerification(verificationId: string): Promise<void> {
    const options = this.verificationItems.get(verificationId)
    if (!options) return

    try {
      console.log(`[PaymentVerification] Attempting verification for ${options.serviceType} - ${options.reference}`)
      
      const result = await this.verifyPaymentForService(
        options.serviceType,
        options.reference,
        options.bookingId
      )

      console.log(`[PaymentVerification] Verification result:`, result)

      // Check if payment was successful - be more flexible with response formats
      const isSuccess = result.success || 
                       result.status === 'success' || 
                       result.verified ||
                       (result.data && result.data.paymentStatus === 'success') ||
                       (result.paymentStatus === 'success')

      const isFailed = result.status === 'failed' || 
                      result.error ||
                      (result.data && result.data.paymentStatus === 'failed') ||
                      (result.paymentStatus === 'failed')

      if (isSuccess) {
        console.log(`[PaymentVerification] Payment verified successfully for ${options.reference}`)
        this.completeVerification(verificationId, 'success', result)
      } else if (isFailed) {
        console.log(`[PaymentVerification] Payment verification failed for ${options.reference}`)
        this.completeVerification(verificationId, 'failed', null, result.message || result.error || 'Payment verification failed')
      } else {
        console.log(`[PaymentVerification] Payment still pending for ${options.reference}, will retry...`)
      }
      // If still pending, continue polling

    } catch (error) {
      console.error(`[PaymentVerification] Error verifying payment for ${options.serviceType}:`, error)
      
      // Don't fail immediately on network errors - continue retrying
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase()
        if (errorMessage.includes('network') || 
            errorMessage.includes('timeout') || 
            errorMessage.includes('fetch') ||
            errorMessage.includes('connection')) {
          console.log(`[PaymentVerification] Network error, will retry: ${error.message}`)
          return
        }
        
        // If it's a 404 or transaction not found, stop retrying
        if (errorMessage.includes('not found') || errorMessage.includes('404')) {
          console.log(`[PaymentVerification] Transaction not found, stopping verification: ${error.message}`)
          this.completeVerification(verificationId, 'failed', null, error.message)
          return
        }

        // If it's a payment verification failed error, continue retrying (backend might still be processing)
        if (errorMessage.includes('payment verification failed')) {
          console.log(`[PaymentVerification] Payment verification failed, but continuing to retry as backend might still be processing: ${error.message}`)
          return
        }
      }
      
      this.completeVerification(verificationId, 'failed', null, (error as Error).message)
    }
  }

  /**
   * Complete verification process
   */
  private completeVerification(
    verificationId: string, 
    status: 'success' | 'failed' | 'timeout',
    result?: any,
    error?: string
  ): void {
    const options = this.verificationItems.get(verificationId)
    if (!options) return

    // Clear intervals and timeouts
    const interval = this.verificationIntervals.get(verificationId)
    const timeout = this.verificationTimeouts.get(verificationId)
    
    if (interval) {
      clearInterval(interval)
      this.verificationIntervals.delete(verificationId)
    }
    
    if (timeout) {
      clearTimeout(timeout)
      this.verificationTimeouts.delete(verificationId)
    }

    // Remove from tracking
    this.verificationItems.delete(verificationId)

    // Call appropriate callback
    if (status === 'success' && options.onSuccess) {
      options.onSuccess(result)
    } else if (status === 'failed' && options.onFailure) {
      options.onFailure(new Error(error || 'Payment verification failed'))
    } else if (status === 'timeout' && options.onTimeout) {
      options.onTimeout()
    }
  }

  /**
   * Start automatic payment verification
   */
  startVerification(options: PaymentVerificationOptions): string {
    const verificationId = `${options.serviceType}-${options.reference}-${Date.now()}`
    
    // Set defaults
    const finalOptions: PaymentVerificationOptions = {
      maxRetries: 40, // Increased from 20 to 40 (6-7 minutes with 10-second intervals)
      retryInterval: 10000, // 10 seconds
      timeoutDuration: 420000, // 7 minutes (increased from 5 minutes)
      ...options
    }

    this.verificationItems.set(verificationId, finalOptions)

    // Start immediate verification
    this.attemptVerification(verificationId)

    // Set up polling interval
    const interval = setInterval(() => {
      this.attemptVerification(verificationId)
    }, finalOptions.retryInterval!)

    this.verificationIntervals.set(verificationId, interval)

    // Set up timeout
    const timeout = setTimeout(() => {
      this.completeVerification(verificationId, 'timeout')
    }, finalOptions.timeoutDuration!)

    this.verificationTimeouts.set(verificationId, timeout)

    return verificationId
  }

  /**
   * Stop verification for a specific ID
   */
  stopVerification(verificationId: string): void {
    this.completeVerification(verificationId, 'timeout')
  }

  /**
   * Stop all verifications
   */
  stopAllVerifications(): void {
    const verificationIds = Array.from(this.verificationItems.keys())
    verificationIds.forEach(id => this.stopVerification(id))
  }

  /**
   * Get current verification status
   */
  getVerificationStatus(): {
    activeVerifications: number
    verificationItems: Array<{
      id: string
      serviceType: PaymentServiceType
      reference: string
      bookingId?: string
    }>
  } {
    return {
      activeVerifications: this.verificationItems.size,
      verificationItems: Array.from(this.verificationItems.entries()).map(([id, options]) => ({
        id,
        serviceType: options.serviceType,
        reference: options.reference,
        bookingId: options.bookingId
      }))
    }
  }

  /**
   * Verify payment immediately (one-time check)
   */
  async verifyPaymentOnce(
    serviceType: PaymentServiceType,
    reference: string,
    bookingId?: string
  ): Promise<any> {
    return await this.verifyPaymentForService(serviceType, reference, bookingId)
  }

  /**
   * Handle Paystack redirect and start automatic verification
   */
  handlePaystackRedirect(
    searchParams: URLSearchParams,
    serviceType: PaymentServiceType,
    bookingId?: string
  ): string | null {
    const reference = searchParams.get('reference')
    const trxref = searchParams.get('trxref')
    
    // Paystack can return either 'reference' or 'trxref'
    const paymentReference = reference || trxref
    
    if (!paymentReference) {
      console.error('No payment reference found in URL parameters')
      return null
    }

    // Start automatic verification
    return this.startVerification({
      reference: paymentReference,
      serviceType,
      bookingId,
      onSuccess: (result) => {
        console.log(`Payment verification successful for ${serviceType}:`, result)
      },
      onFailure: (error) => {
        console.error(`Payment verification failed for ${serviceType}:`, error)
      },
      onTimeout: () => {
        console.warn(`Payment verification timed out for ${serviceType}`)
      }
    })
  }

  /**
   * Check if verification is in progress
   */
  isVerifying(verificationId: string): boolean {
    return this.verificationItems.has(verificationId)
  }

  /**
   * Get verification options for a specific ID
   */
  getVerificationOptions(verificationId: string): PaymentVerificationOptions | undefined {
    return this.verificationItems.get(verificationId)
  }
}

// Export singleton instance
export const paymentVerificationService = new PaymentVerificationService()

// Utility function to extract payment reference from URL
export function extractPaymentReference(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('reference') || urlObj.searchParams.get('trxref')
  } catch {
    return null
  }
}

// Utility function to check if URL contains payment parameters
export function isPaymentRedirectUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.has('reference') || urlObj.searchParams.has('trxref')
  } catch {
    return false
  }
}