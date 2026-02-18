'use client'

import { ReactNode } from 'react'
import { NotificationProvider } from '@/contexts/notification-context'
import { SimpleAuthProvider } from '@/contexts/simple-auth-context'
import { SimpleLoadingProvider } from '@/contexts/simple-loading-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SimpleLoadingProvider>
      <SimpleAuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </SimpleAuthProvider>
    </SimpleLoadingProvider>
  )
}