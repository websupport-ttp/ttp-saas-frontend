'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServiceHero from '@/components/sections/ServiceHero';
import PackageSearchForm from '@/components/packages/PackageSearchForm';
import PackageFilters from '@/components/packages/PackageFilters';
import PackageCard from '@/components/packages/PackageCard';
import { PackageFilters as PackageFiltersType, PackageListResponse, PackageSummary } from '@/types/api';
import { packageService } from '@/lib/services/package-service';
import { getUIIcon } from '@/lib/constants/icons';
import { useNotifications } from '@/contexts/notification-context';

export default function PackagesPage() {
  const router = useRouter();
  const { addNotification } = useNotifications();
  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<PackageSummary[]>([]);
  const [filters, setFilters] = useState<PackageFiltersType>({});
  const [availableFilters, setAvailableFilters] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Load initial packages on component mount
  useEffect(() => {
    loadPackages();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadPackages(filters);
    }
  }, [filters, currentPage]);

  const loadPackages = async (currentFilters: PackageFiltersType = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filtersWithPagination = {
        ...currentFilters,
        page: currentPage,
        limit: 12
      };

      const response = await packageService.getPackages(filtersWithPagination);
      setPackages(response.packages);
      setFilteredPackages(response.packages);
      setTotalResults(response.totalResults);
      setAvailableFilters(response.filters);
    } catch (error) {
      console.error('Package loading error:', error);
      setError('Failed to load packages. Please try again.');
      addNotification({ 
        type: 'error', 
        title: 'Loading Failed', 
        message: 'Failed to load packages. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setSearchQuery(query);
    setHasSearched(true);
    setError(null);
    setCurrentPage(1);
    
    try {
      const searchFilters = {
        ...filters,
        page: 1,
        limit: 12
      };

      const response = await packageService.searchPackages(query, searchFilters);
      setPackages(response.packages);
      setFilteredPackages(response.packages);
      setTotalResults(response.totalResults);
      
      if (response.packages.length === 0) {
        addNotification({ 
          type: 'info', 
          title: 'No Results', 
          message: 'No packages found for your search. Try different keywords or filters.' 
        });
      }
    } catch (error) {
      console.error('Package search error:', error);
      setError('Failed to search packages. Please try again.');
      addNotification({ 
        type: 'error', 
        title: 'Search Failed', 
        message: 'Failed to search packages. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: PackageFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleViewPackage = (packageId: string) => {
    router.push(`/packages/${packageId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
    setHasSearched(false);
    setFilters({});
    setCurrentPage(1);
    loadPackages();
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-300"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-300 rounded w-20"></div>
              <div className="h-10 bg-gray-300 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <img 
        src={getUIIcon('search')} 
        alt="No results" 
        className="h-16 w-16 mx-auto mb-4 opacity-50"
      />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasSearched ? 'No packages found' : 'Discover Amazing Travel Packages'}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasSearched 
          ? 'Try adjusting your search terms or filters to find more options.'
          : 'Search for your perfect travel experience or browse our featured packages.'
        }
      </p>
      {hasSearched && (
        <button
          onClick={clearSearch}
          className="text-brand-red hover:text-red-700 font-medium"
        >
          Clear search and filters
        </button>
      )}
    </div>
  );

  const Pagination = () => {
    const totalPages = Math.ceil(totalResults / 12);
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-2 rounded-md ${
              page === currentPage
                ? 'bg-brand-red text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <main id="main-content">
      <Header />

      <ServiceHero
        title="Travel Packages"
        description="Discover curated travel experiences with our comprehensive packages. From adventure tours to luxury getaways, find your perfect journey."
        backgroundImage="/images/service-04.png"
      />

      {/* Search Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container-custom">
          <PackageSearchForm onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <PackageFilters
                filters={filters}
                availableFilters={availableFilters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Results Header */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div>
                    <h2 className="font-poppins font-bold text-3xl text-gray-900 mb-2">
                      {hasSearched ? `Search Results for "${searchQuery}"` : 'Travel Packages'}
                    </h2>
                    <p className="text-gray-600">
                      {isLoading ? 'Loading...' : `${totalResults} packages found`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Results */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredPackages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredPackages.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        package={pkg}
                        onViewPackage={handleViewPackage}
                      />
                    ))}
                  </div>
                  <Pagination />
                </>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}