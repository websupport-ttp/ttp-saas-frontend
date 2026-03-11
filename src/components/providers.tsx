'use client'

import { ReactNode } from 'react'
import { NotificationProvider } from '@/contexts/notification-context'
import { AuthProvider } from '@/contexts/auth-context'
import { SimpleLoadingProvider } from '@/contexts/simple-loading-context'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SimpleLoadingProvider>
      <AuthProvider>
        <CurrencyProvider>
          <SiteSettingsProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </SiteSettingsProvider>
        </CurrencyProvider>
      </AuthProvider>
    </SimpleLoadingProvider>
  )
}