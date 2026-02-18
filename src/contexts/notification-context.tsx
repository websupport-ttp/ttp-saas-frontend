'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info' | 'status-update'
  title: string
  message: string
  duration?: number
  persistent?: boolean
  timestamp?: string
  category?: 'booking' | 'payment' | 'system' | 'user' | 'status'
  serviceType?: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'
  bookingReference?: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  read?: boolean
  actions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'secondary'
  }>
  metadata?: Record<string, any>
}

interface NotificationContextType {
  notifications: Notification[]
  notificationHistory: Notification[]
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  getUnreadCount: () => number
  getNotificationsByCategory: (category: string) => Notification[]
  getNotificationsByService: (serviceType: string) => Notification[]
  clearHistory: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationHistory, setNotificationHistory] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
      duration: notification.duration ?? (notification.type === 'error' ? 8000 : 5000),
      read: false,
      priority: notification.priority ?? 'medium'
    }

    setNotifications(prev => {
      // Limit active notifications to prevent UI overflow
      const maxActiveNotifications = 5
      const updated = [...prev, newNotification]
      if (updated.length > maxActiveNotifications) {
        // Move oldest to history
        const oldest = updated.shift()!
        setNotificationHistory(prevHistory => [oldest, ...prevHistory].slice(0, 100)) // Keep last 100
      }
      return updated
    })

    // Auto-remove notification after duration (unless persistent)
    if (!notification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id)
      if (notification) {
        // Add to history when removed
        setNotificationHistory(prevHistory => [
          { ...notification, read: true },
          ...prevHistory
        ].slice(0, 100))
      }
      return prev.filter(n => n.id !== id)
    })
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications(prev => {
      // Move all to history
      setNotificationHistory(prevHistory => [
        ...prev.map(n => ({ ...n, read: true })),
        ...prevHistory
      ].slice(0, 100))
      return []
    })
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
    setNotificationHistory(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setNotificationHistory(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length + 
           notificationHistory.filter(n => !n.read).length
  }, [notifications, notificationHistory])

  const getNotificationsByCategory = useCallback((category: string) => {
    const allNotifications = [...notifications, ...notificationHistory]
    return allNotifications.filter(n => n.category === category)
  }, [notifications, notificationHistory])

  const getNotificationsByService = useCallback((serviceType: string) => {
    const allNotifications = [...notifications, ...notificationHistory]
    return allNotifications.filter(n => n.serviceType === serviceType)
  }, [notifications, notificationHistory])

  const clearHistory = useCallback(() => {
    setNotificationHistory([])
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      notificationHistory,
      addNotification,
      removeNotification,
      clearAllNotifications,
      markAsRead,
      markAllAsRead,
      getUnreadCount,
      getNotificationsByCategory,
      getNotificationsByService,
      clearHistory
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Convenience hooks for different notification types
export function useNotificationHelpers() {
  const { addNotification } = useNotifications()

  const showSuccess = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'success', title, message, ...options })
  }, [addNotification])

  const showError = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ 
      type: 'error', 
      title, 
      message, 
      duration: 8000, // Longer duration for errors
      ...options 
    })
  }, [addNotification])

  const showWarning = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'warning', title, message, ...options })
  }, [addNotification])

  const showInfo = useCallback((title: string, message: string, options?: Partial<Notification>) => {
    return addNotification({ type: 'info', title, message, ...options })
  }, [addNotification])

  const showApiError = useCallback((error: any, fallbackMessage?: string) => {
    // Handle enhanced app errors
    if (error && typeof error === 'object' && error.userMessage) {
      return showError(
        'Error',
        error.userMessage,
        {
          persistent: error.severity === 'critical',
          actions: error.retryable ? [
            {
              label: 'Retry',
              action: () => window.location.reload(),
              variant: 'primary'
            }
          ] : undefined
        }
      );
    }

    // Handle standard errors
    const message = error?.message || fallbackMessage || 'An unexpected error occurred';
    return showError('Error', message);
  }, [showError]);

  const showValidationErrors = useCallback((errors: Array<{ field: string; message: string }>) => {
    const errorMessages = errors.map(err => `${err.field}: ${err.message}`).join(', ');
    return showError(
      'Validation Error',
      `Please check the following fields: ${errorMessages}`,
      { duration: 10000 }
    );
  }, [showError]);

  const showNetworkError = useCallback(() => {
    return showError(
      'Connection Error',
      'Unable to connect to our servers. Please check your internet connection and try again.',
      {
        persistent: true,
        category: 'system',
        priority: 'high',
        actions: [
          {
            label: 'Retry',
            action: () => window.location.reload(),
            variant: 'primary'
          }
        ]
      }
    );
  }, [showError]);

  const showStatusUpdate = useCallback((
    serviceType: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package',
    bookingReference: string,
    oldStatus: string,
    newStatus: string,
    options?: Partial<Notification>
  ) => {
    const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
    return addNotification({
      type: 'status-update',
      title: `${serviceLabel} Status Update`,
      message: `Your ${serviceLabel.toLowerCase()} status changed from "${oldStatus}" to "${newStatus}"`,
      category: 'status',
      serviceType,
      bookingReference,
      priority: 'medium',
      duration: 8000,
      ...options
    })
  }, [addNotification])

  const showBookingConfirmation = useCallback((
    serviceType: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package',
    bookingReference: string,
    options?: Partial<Notification>
  ) => {
    const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
    return addNotification({
      type: 'success',
      title: `${serviceLabel} Confirmed!`,
      message: `Your ${serviceLabel.toLowerCase()} booking has been confirmed. Reference: ${bookingReference}`,
      category: 'booking',
      serviceType,
      bookingReference,
      priority: 'high',
      duration: 10000,
      ...options
    })
  }, [addNotification])

  const showPaymentUpdate = useCallback((
    serviceType: 'flight' | 'hotel' | 'visa' | 'insurance' | 'package',
    status: 'processing' | 'success' | 'failed',
    reference: string,
    options?: Partial<Notification>
  ) => {
    const serviceLabel = serviceType.charAt(0).toUpperCase() + serviceType.slice(1)
    const statusMessages = {
      processing: `Processing your ${serviceLabel.toLowerCase()} payment...`,
      success: `Payment confirmed for your ${serviceLabel.toLowerCase()}!`,
      failed: `Payment failed for your ${serviceLabel.toLowerCase()}. Please try again.`
    }
    
    const notificationTypes = {
      processing: 'info' as const,
      success: 'success' as const,
      failed: 'error' as const
    }

    return addNotification({
      type: notificationTypes[status],
      title: 'Payment Update',
      message: statusMessages[status],
      category: 'payment',
      serviceType,
      bookingReference: reference,
      priority: status === 'failed' ? 'high' : 'medium',
      duration: status === 'processing' ? 0 : 8000,
      persistent: status === 'processing',
      ...options
    })
  }, [addNotification])

  const showApplicationUpdate = useCallback((
    applicationId: string,
    status: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    return addNotification({
      type: 'status-update',
      title: 'Application Update',
      message: message || `Your application status is now: ${status}`,
      category: 'status',
      serviceType: 'visa',
      bookingReference: applicationId,
      priority: 'medium',
      duration: 8000,
      ...options
    })
  }, [addNotification])

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showApiError,
    showValidationErrors,
    showNetworkError,
    showStatusUpdate,
    showBookingConfirmation,
    showPaymentUpdate,
    showApplicationUpdate
  }
}