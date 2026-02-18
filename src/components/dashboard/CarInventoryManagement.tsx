'use client';

import { useState, useEffect } from 'react';
import { User, DashboardPermissions } from '@/lib/auth/permissions';
import CarForm from './CarForm';

interface CarInventoryManagementProps {
  user: User;
  permissions: DashboardPermissions;
}

interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  capacity: number;
  transmission: string;
  pricePerDay: number;
  image?: string;
  location: string;
  availability: boolean;
  registrationNumber?: string;
  supplier: {
    name: string;
    rating: number;
  };
}

export default function CarInventoryManagement({ user, permissions }: CarInventoryManagementProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [filters, setFilters] = useState({
    type: '',
    location: '',
    availability: '',
    search: '',
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.type) params.set('type', filters.type);
      if (filters.location) params.set('location', filters.location);
      
      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire?${params.toString()}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCars(data.data?.cars || []);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setEditingCar(null);
    setShowForm(true);
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setShowForm(true);
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/${carId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchCars();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete car');
      }
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car');
    }
  };

  const handleFormClose = (success?: boolean) => {
    setShowForm(false);
    setEditingCar(null);
    if (success) {
      fetchCars();
    }
  };

  const filteredCars = cars.filter(car => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        car.name.toLowerCase().includes(searchLower) ||
        car.brand.toLowerCase().includes(searchLower) ||
        car.model.toLowerCase().includes(searchLower) ||
        car.registrationNumber?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (showForm) {
    return (
      <CarForm
        car={editingCar}
        onClose={handleFormClose}
        user={user}
      />
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Car Inventory</h2>
        {permissions.canManageInventory && (
          <button
            onClick={handleAddCar}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Car
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All Types</option>
              <option value="economy">Economy</option>
              <option value="compact">Compact</option>
              <option value="midsize">Midsize</option>
              <option value="fullsize">Full Size</option>
              <option value="luxury">Luxury</option>
              <option value="suv">SUV</option>
              <option value="minivan">Minivan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter location"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="booked">Booked</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search cars..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Car List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cars...</p>
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredCars.map((car) => (
            <div key={car._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Car Image */}
                  <div className="flex-shrink-0 w-32 h-24 bg-gray-200 rounded-lg overflow-hidden">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
                        <p className="text-sm text-gray-600">
                          {car.brand} {car.model} {car.year}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="inline-flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {car.capacity} passengers
                          </span>
                          <span>•</span>
                          <span className="capitalize">{car.transmission}</span>
                          <span>•</span>
                          <span className="capitalize">{car.type}</span>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Location:</span> {car.location}
                        </div>
                        {car.registrationNumber && (
                          <div className="mt-1 text-sm text-gray-600">
                            <span className="font-medium">Reg:</span> {car.registrationNumber}
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-brand-red">
                          ${car.pricePerDay}
                          <span className="text-sm font-normal text-gray-600">/day</span>
                        </p>
                        <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          car.availability
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {car.availability ? 'Available' : 'Booked'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {permissions.canManageInventory && (
                      <div className="mt-4 flex space-x-3">
                        <button
                          onClick={() => handleEditCar(car)}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCar(car._id)}
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No cars found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.type || filters.location
              ? 'Try adjusting your filters'
              : 'Get started by adding a new car to the inventory'}
          </p>
          {permissions.canManageInventory && !filters.search && !filters.type && !filters.location && (
            <div className="mt-6">
              <button
                onClick={handleAddCar}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-red hover:bg-red-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New Car
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
