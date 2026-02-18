'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SearchForm from './SearchForm'
import { ServiceType, SearchFormData } from '@/types'

const services = [
  { 
    id: 'flights' as ServiceType, 
    label: 'Flights', 
    icon: '/images/service-icons/flights-icon.svg', 
    href: '/flights',
    title: 'Click to switch form, double-click to go to Flights page'
  },
  { 
    id: 'hotels' as ServiceType, 
    label: 'Hotel', 
    icon: '/images/service-icons/hotel-icon.svg', 
    href: '/hotels',
    title: 'Click to switch form, double-click to go to Hotels page'
  },
  { 
    id: 'travel-insurance' as ServiceType, 
    label: 'Travel Insurance', 
    icon: '/images/service-icons/travel-insurance-icon.svg', 
    href: '/travel-insurance',
    title: 'Click to switch form, double-click to go to Travel Insurance page'
  },
  { 
    id: 'car' as ServiceType, 
    label: 'Car Hire', 
    icon: '/images/service-icons/car-hire-icon.svg', 
    href: '/car-hire',
    title: 'Click to switch form, double-click to go to Car Hire page'
  },
  { 
    id: 'visa' as ServiceType, 
    label: 'Visa Assistance', 
    icon: '/images/service-icons/visa-application-icon.svg', 
    href: '/visa-assistance',
    title: 'Click to switch form, double-click to go to Visa Assistance page'
  },
]

export default function ServiceTabs() {
  const [activeService, setActiveService] = useState<ServiceType>('flights')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleTabClick = (serviceId: ServiceType, href: string, event: React.MouseEvent) => {
    // Check for modifier keys for navigation
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      window.open(href, '_blank')
      return
    }
    
    setActiveService(serviceId)
  }

  const handleTabDoubleClick = (href: string) => {
    router.push(href)
  }

  const handleContextMenu = (href: string, event: React.MouseEvent) => {
    event.preventDefault()
    router.push(href)
  }

  const handleSearch = (data: SearchFormData) => {
    try {
      setIsSearching(true)
      
      // Save search data to localStorage
      localStorage.setItem(`travelplace_search_${activeService}`, JSON.stringify({
        timestamp: Date.now(),
        serviceType: activeService,
        data
      }))

      // Navigate to service page with search parameters
      const params = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        if (value) {
          // Handle passenger object serialization
          if (key === 'passengers' && typeof value === 'object') {
            params.set(key, JSON.stringify(value))
          } else {
            params.set(key, value.toString())
          }
        }
      })

      const service = services.find(s => s.id === activeService)
      if (service) {
        const url = params.toString() ? `${service.href}?${params.toString()}` : service.href
        
        // Navigate immediately
        router.push(url)
      }
    } catch (error) {
      console.error('Search error:', error)
      setIsSearching(false)
    }
  }

  return (
    <div className="w-full" style={{ overflow: 'visible' }}>
      {/* Tab Buttons - Mobile: icons only with equal width, Desktop: icons + text */}
      <div className="flex justify-start mb-0">
        <div 
          className="flex w-full md:w-auto rounded-t-3xl"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          {services.map((service, index) => {
            const isActive = activeService === service.id
            const isLast = index === services.length - 1
            const isFirst = index === 0
            
            return (
              <button
                key={service.id}
                onClick={(e) => handleTabClick(service.id, service.href, e)}
                onDoubleClick={() => handleTabDoubleClick(service.href)}
                onContextMenu={(e) => handleContextMenu(service.href, e)}
                title={service.label}
                className={`
                  flex items-center justify-center gap-2 
                  flex-1 md:flex-none
                  px-3 md:px-6 py-3 md:py-4 text-xs sm:text-sm font-semibold
                  transition-all duration-300 relative
                  ${isFirst ? 'rounded-tl-3xl' : ''}
                  ${isLast ? 'rounded-tr-3xl' : ''}
                  ${isActive 
                    ? 'text-white shadow-lg' 
                    : 'text-brand-blue hover:bg-white/20'
                  }
                `}
                style={{
                  backgroundColor: isActive ? '#141b34' : 'transparent',
                  borderTop: isActive ? '1px solid #141b34' : '1px solid rgba(255, 255, 255, 0.6)',
                  borderLeft: isActive ? '1px solid #141b34' : '1px solid rgba(255, 255, 255, 0.6)',
                  borderRight: isActive ? '1px solid #141b34' : '1px solid rgba(255, 255, 255, 0.6)',
                  borderBottom: 'none',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Image 
                  src={service.icon} 
                  alt={`${service.label} icon`}
                  width={18}
                  height={18}
                  className={`w-5 h-5 md:w-[18px] md:h-[18px] flex-shrink-0 ${isActive ? 'filter brightness-0 invert' : 'filter brightness-0 invert-0'}`}
                  style={{
                    filter: isActive ? 'brightness(0) invert(1)' : 'brightness(0) invert(0)'
                  }}
                />
                {/* Hide text on mobile, show on medium screens and up */}
                <span className="hidden md:inline whitespace-nowrap">{service.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search Form - Responsive with wrapping fields */}
      <div 
        className="w-full rounded-tr-none md:rounded-tr-lg rounded-b-lg shadow-xl"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.6)',
          overflow: 'visible'
        }}
      >
        <SearchForm 
          serviceType={activeService} 
          onSearch={handleSearch}
          loading={isSearching}
          className="border-0 shadow-none w-full"
          style={{
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  )
}