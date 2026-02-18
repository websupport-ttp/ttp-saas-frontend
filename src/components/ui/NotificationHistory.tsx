/**
 * Notification History Component
 * Shows notification history with filtering and management options
 */

'use client'

import { useState, useMemo } from 'react'
import { useNotifications } from '@/contexts/notification-context'
import { Button } from './Button'

interface NotificationHistoryProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationHistory({ isOpen, onClose }: NotificationHistoryProps) {
  const { 
    notifications, 
    notificationHistory, 
    markAsRead, 
    markAllAsRead, 
    clearHistory,
    getUnreadCount
  } = useNotifications()

  const [filter, setFilter] = useState<'all' | 'unread' | 'booking' | 'payment' | 'status' | 'system'>('all')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'flight' | 'hotel' | 'visa' | 'insurance' | 'package'>('all')

  const allNotifications = useMemo(() => {
    return [...notifications, ...notificationHistory].sort((a, b) => 
      new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime()
    )
  }, [notifications, notificationHistory])

  const filteredNotifications = useMemo(() => {
    return allNotifications.filter(notification => {
      // Filter by read status
      if (filter === 'unread' && notification.read) return false
      if (filter !== 'all' && filter !== 'unread' && notification.category !== filter) return false
      
      // Filter by service type
      if (serviceFilter !== 'all' && notification.serviceType !== serviceFilter) return false
      
      return true
    })
  }, [allNotifications, filter, serviceFilter])

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        )
      case 'info':
      case 'status-update':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
            </svg>
          </div>
        )
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500'
      case 'high': return 'border-l-orange-500'
      case 'medium': return 'border-l-blue-500'
      case 'low': return 'border-l-gray-500'
      default: return 'border-l-gray-300'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">
                {getUnreadCount()} unread • {allNotifications.length} total
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filters */}
          <div className="p-4 border-b border-gray-200 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by type</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All notifications</option>
                <option value="unread">Unread only</option>
                <option value="booking">Bookings</option>
                <option value="payment">Payments</option>
                <option value="status">Status updates</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by service</label>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All services</option>
                <option value="flight">Flights</option>
                <option value="hotel">Hotels</option>
                <option value="visa">Visa</option>
                <option value="insurance">Insurance</option>
                <option value="package">Packages</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={markAllAsRead}
                disabled={getUnreadCount() === 0}
              >
                Mark all read
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={clearHistory}
                disabled={notificationHistory.length === 0}
              >
                Clear history
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
                <p>No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}
                        </div>
                        
                        <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {notification.serviceType && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">
                                {notification.serviceType}
                              </span>
                            )}
                            {notification.category && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full">
                                {notification.category}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>

                        {notification.bookingReference && (
                          <p className="text-xs text-gray-500 mt-1">
                            Ref: {notification.bookingReference}
                          </p>
                        )}

                        {notification.actions && notification.actions.length > 0 && (
                          <div className="flex space-x-2 mt-3">
                            {notification.actions.map((action, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant={action.variant || 'outline'}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  action.action()
                                }}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Notification bell component for header
export function NotificationBell() {
  const { getUnreadCount } = useNotifications()
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const unreadCount = getUnreadCount()

  return (
    <>
      <button
        onClick={() => setIsHistoryOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <NotificationHistory
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </>
  )
}