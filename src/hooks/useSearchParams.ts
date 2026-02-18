'use client'

import { useEffect, useState } from 'react'
import { useSearchParams as useNextSearchParams } from 'next/navigation'
import { SearchFormData, ServiceType } from '@/types'
import { searchParamManager } from '@/lib/utils'

export function useSearchParams(serviceType: ServiceType) {
  const searchParams = useNextSearchParams()
  const [formData, setFormData] = useState<SearchFormData>({})

  useEffect(() => {
    // Get URL parameters first (highest priority)
    const urlParams = searchParamManager.getUrlParameters()
    
    // Get stored data as fallback
    const storedData = searchParamManager.getSearchData(serviceType)
    
    // Use URL params if available, otherwise use stored data
    const dataToUse = Object.keys(urlParams).length > 0 ? urlParams : storedData
    
    if (dataToUse) {
      setFormData(dataToUse)
    }
  }, [serviceType, searchParams])

  const saveSearchData = (data: SearchFormData) => {
    searchParamManager.saveSearchData(serviceType, data)
    setFormData(data)
  }

  return {
    formData,
    saveSearchData,
    hasData: Object.keys(formData).length > 0,
  }
}