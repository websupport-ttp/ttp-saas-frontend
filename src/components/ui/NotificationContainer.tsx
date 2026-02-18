'use client'

import { useNotifications } from '@/contexts/notification-context'
import { Button } from './Button'

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotifications()

  if (notifications.length === 0) {
    return null
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'status-update':
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      default:
        return null
    }
  }

  const getNotificationColors = (type: string, priority?: string) => {
    // Priority-based styling
    const priorityClasses = {
      critical: 'ring-2 ring-red-500 ring-opacity-50',
      high: 'ring-1 ring-orange-400 ring-opacity-50',
      medium: '',
      low: 'opacity-90'
    }

    const priorityClass = priority ? priorityClasses[priority as keyof typeof priorityClasses] || '' : ''

    const baseClasses = (() => {
      switch (type) {
        case 'success':
          return 'bg-green-50 border-green-200 text-green-800'
        case 'error':
          return 'bg-red-50 border-red-200 text-red-800'
        case 'warning':
          return 'bg-yellow-50 border-yellow-200 text-yellow-800'
        case 'info':
          return 'bg-blue-50 border-blue-200 text-blue-800'
        case 'status-update':
          return 'bg-purple-50 border-purple-200 text-purple-800'
        default:
          return 'bg-gray-50 border-gray-200 text-gray-800'
      }
    })()

    return `${baseClasses} ${priorityClass}`.trim()
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`border rounded-lg p-4 shadow-lg transition-all duration-300 ${getNotificationColors(notification.type, notification.priority)}`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1">
                {notification.title}
              </h4>
              <p className="text-sm opacity-90">
                {notification.message}
              </p>
              
              {/* Show service type and booking reference for relevant notifications */}
              {(notification.serviceType || notification.bookingReference) && (
                <div className="flex items-center space-x-2 mt-2 text-xs opacity-75">
                  {notification.serviceType && (
                    <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full">
                      {notification.serviceType}
                    </span>
                  )}
                  {notification.bookingReference && (
                    <span className="font-mono">
                      Ref: {notification.bookingReference}
                    </span>
                  )}
                </div>
              )}
              
              {notification.actions && notification.actions.length > 0 && (
                <div className="flex space-x-2 mt-3">
                  {notification.actions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={() => {
                        action.action()
                        removeNotification(notification.id)
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={() => removeNotification(notification.id)}
              className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}