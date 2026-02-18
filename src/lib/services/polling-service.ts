/**
 * Polling Service
 * Centralized service for managing status polling across all booking types
 */

import { flightService } from './flight-service'
import { hotelService } from './hotel-service'
import { visaService } from './visa-service'
import { insuranceService } from './insurance-service'
import { packageService } from './package-service'

export type ServiceType = 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'

export interface PollingItem {
  id: string
  bookingReference: string
  serviceType: ServiceType
  status?: string
  lastUpdated?: string
  pollCount: number
  maxPollAttempts: number
  pollInterval: number
  onStatusUpdate?: (status: any) => void
  onError?: (error: Error) => void
  onComplete?: (finalStatus: any) => void
}

export interface PollingServiceConfig {
  maxConcurrentPolls?: number
  defaultPollInterval?: number
  enableIntelligentPolling?: boolean
}

class PollingService {
  private pollingItems: Map<string, PollingItem> = new Map()
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map()
  private config: PollingServiceConfig

  constructor(config: PollingServiceConfig = {}) {
    this.config = {
      maxConcurrentPolls: 10,
      defaultPollInterval: 30000,
      enableIntelligentPolling: true,
      ...config
    }
  }

  /**
   * Get intelligent polling interval based on service type and status
   */
  private getPollingInterval(serviceType: ServiceType, status?: string): number {
    if (!this.config.enableIntelligentPolling) {
      return this.config.defaultPollInterval!
    }

    // Base intervals by service type (in milliseconds)
    const baseIntervals = {
      flight: 30000,    // 30 seconds - flights change quickly
      hotel: 45000,     // 45 seconds - hotels are moderate
      visa: 300000,     // 5 minutes - visa processing is slow
      insurance: 60000, // 1 minute - insurance is moderate
      package: 60000    // 1 minute - packages are moderate
    }

    // Adjust based on status
    const statusMultipliers = {
      pending: 1,       // Normal polling
      processing: 0.5,  // Faster polling when actively processing
      confirmed: 2,     // Slower polling for confirmed items
      failed: 0.25,     // Very fast polling for failures (might recover)
      cancelled: 3,     // Very slow polling for cancelled items
      expired: 3,       // Very slow polling for expired items
      rejected: 2       // Slower polling for rejected items
    }

    const baseInterval = baseIntervals[serviceType] || this.config.defaultPollInterval!
    const multiplier = status ? (statusMultipliers[status.toLowerCase() as keyof typeof statusMultipliers] || 1) : 1
    
    return Math.max(baseInterval * multiplier, 10000) // Minimum 10 seconds
  }

  /**
   * Get maximum poll attempts based on service type
   */
  private getMaxPollAttempts(serviceType: ServiceType): number {
    const maxAttempts = {
      flight: 40,    // 20 minutes max
      hotel: 30,     // 22.5 minutes max  
      visa: 20,      // 100 minutes max (visa processing is very slow)
      insurance: 25, // 25 minutes max
      package: 25    // 25 minutes max
    }
    
    return maxAttempts[serviceType] || 30
  }

  /**
   * Check if status is final (no more polling needed)
   */
  private isFinalStatus(status: string): boolean {
    const finalStates = ['confirmed', 'cancelled', 'failed', 'completed', 'expired', 'rejected']
    return finalStates.includes(status?.toLowerCase())
  }

  /**
   * Fetch status for a specific service type
   */
  private async fetchStatus(serviceType: ServiceType, bookingReference: string): Promise<any> {
    switch (serviceType) {
      case 'flight':
        return await flightService.getBookingStatus(bookingReference)
      case 'hotel':
        return await hotelService.getBookingStatus(bookingReference)
      case 'visa':
        return await visaService.getApplicationStatus(bookingReference)
      case 'insurance':
        return await insuranceService.getPolicyStatus(bookingReference)
      case 'package':
        return await packageService.getBookingStatus(bookingReference)
      default:
        throw new Error(`Unsupported service type: ${serviceType}`)
    }
  }

  /**
   * Poll status for a single item
   */
  private async pollItem(itemId: string): Promise<void> {
    const item = this.pollingItems.get(itemId)
    if (!item) return

    try {
      const status = await this.fetchStatus(item.serviceType, item.bookingReference)
      
      // Update item with new status
      const updatedItem = {
        ...item,
        status: status.status,
        lastUpdated: status.lastUpdated || new Date().toISOString(),
        pollCount: item.pollCount + 1
      }
      
      this.pollingItems.set(itemId, updatedItem)

      // Notify callback
      if (item.onStatusUpdate) {
        item.onStatusUpdate(status)
      }

      // Check if we should stop polling
      const shouldStop = this.isFinalStatus(status.status) || 
                        updatedItem.pollCount >= updatedItem.maxPollAttempts

      if (shouldStop) {
        this.stopPolling(itemId)
        if (item.onComplete) {
          item.onComplete(status)
        }
      } else {
        // Schedule next poll with updated interval
        const newInterval = this.getPollingInterval(item.serviceType, status.status)
        this.scheduleNextPoll(itemId, newInterval)
      }

    } catch (error) {
      console.error(`Polling error for ${item.serviceType} ${item.bookingReference}:`, error)
      
      const updatedItem = {
        ...item,
        pollCount: item.pollCount + 1
      }
      this.pollingItems.set(itemId, updatedItem)

      if (item.onError) {
        item.onError(error as Error)
      }

      // Continue polling on error unless max attempts reached
      if (updatedItem.pollCount < updatedItem.maxPollAttempts) {
        this.scheduleNextPoll(itemId, item.pollInterval)
      } else {
        this.stopPolling(itemId)
      }
    }
  }

  /**
   * Schedule next poll for an item
   */
  private scheduleNextPoll(itemId: string, interval: number): void {
    // Clear existing interval
    const existingInterval = this.pollingIntervals.get(itemId)
    if (existingInterval) {
      clearTimeout(existingInterval)
    }

    // Schedule new poll
    const timeoutId = setTimeout(() => {
      this.pollItem(itemId)
    }, interval)

    this.pollingIntervals.set(itemId, timeoutId)
  }

  /**
   * Start polling for a booking/application
   */
  startPolling(options: {
    bookingReference: string
    serviceType: ServiceType
    onStatusUpdate?: (status: any) => void
    onError?: (error: Error) => void
    onComplete?: (finalStatus: any) => void
    customPollInterval?: number
    customMaxAttempts?: number
  }): string {
    // Check concurrent polling limit
    if (this.pollingItems.size >= this.config.maxConcurrentPolls!) {
      throw new Error('Maximum concurrent polling limit reached')
    }

    const itemId = `${options.serviceType}-${options.bookingReference}-${Date.now()}`
    
    const pollingItem: PollingItem = {
      id: itemId,
      bookingReference: options.bookingReference,
      serviceType: options.serviceType,
      pollCount: 0,
      maxPollAttempts: options.customMaxAttempts || this.getMaxPollAttempts(options.serviceType),
      pollInterval: options.customPollInterval || this.getPollingInterval(options.serviceType),
      onStatusUpdate: options.onStatusUpdate,
      onError: options.onError,
      onComplete: options.onComplete
    }

    this.pollingItems.set(itemId, pollingItem)

    // Start polling immediately
    this.pollItem(itemId)

    return itemId
  }

  /**
   * Stop polling for a specific item
   */
  stopPolling(itemId: string): void {
    // Clear interval
    const interval = this.pollingIntervals.get(itemId)
    if (interval) {
      clearTimeout(interval)
      this.pollingIntervals.delete(itemId)
    }

    // Remove item
    this.pollingItems.delete(itemId)
  }

  /**
   * Stop all polling
   */
  stopAllPolling(): void {
    // Clear all intervals
    this.pollingIntervals.forEach(interval => clearTimeout(interval))
    this.pollingIntervals.clear()

    // Clear all items
    this.pollingItems.clear()
  }

  /**
   * Get current polling status
   */
  getPollingStatus(): {
    activePolls: number
    maxConcurrentPolls: number
    pollingItems: Array<{
      id: string
      serviceType: ServiceType
      bookingReference: string
      status?: string
      pollCount: number
      maxPollAttempts: number
    }>
  } {
    return {
      activePolls: this.pollingItems.size,
      maxConcurrentPolls: this.config.maxConcurrentPolls!,
      pollingItems: Array.from(this.pollingItems.values()).map(item => ({
        id: item.id,
        serviceType: item.serviceType,
        bookingReference: item.bookingReference,
        status: item.status,
        pollCount: item.pollCount,
        maxPollAttempts: item.maxPollAttempts
      }))
    }
  }

  /**
   * Update polling configuration
   */
  updateConfig(newConfig: Partial<PollingServiceConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  /**
   * Get polling item by ID
   */
  getPollingItem(itemId: string): PollingItem | undefined {
    return this.pollingItems.get(itemId)
  }

  /**
   * Check if an item is currently being polled
   */
  isPolling(itemId: string): boolean {
    return this.pollingItems.has(itemId)
  }
}

// Export singleton instance
export const pollingService = new PollingService()