'use client';

import { useState, useEffect } from 'react';
import { User, DashboardPermissions } from '@/lib/auth/permissions';

interface BookingManagementProps {
  user: User;
  permissions: DashboardPermissions;
}

interface Booking {
  _id: string;
  bookingReference: string;
  car: {
    _id: string;
    name: string;
    brand: string;
    model: string;
    registrationNumber?: string;
  };
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  pickupDate: string;
  dropoffDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export default function BookingManagement({ user, permissions }: BookingManagementProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: '',
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.paymentStatus) params.set('paymentStatus', filters.paymentStatus);

      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/bookings?${params.toString()}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.data?.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/car-hire/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings();
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Failed to update booking status');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        booking.bookingReference.toLowerCase().includes(searchLower) ||
        booking.user.email.toLowerCase().includes(searchLower) ||
        `${booking.user.firstName} ${booking.user.lastName}`.toLowerCase().includes(searchLower) ||
        booking.car.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
        <p className="text-sm text-gray-600 mt-1">Manage all car rental bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search bookings..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.bookingReference}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Booked on {formatDate(booking.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Customer</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {booking.user.firstName} {booking.user.lastName}
                      </p>
                      <p>{booking.user.email}</p>
                      {booking.user.phoneNumber && <p>{booking.user.phoneNumber}</p>}
                    </div>
                  </div>

                  {/* Car Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicle</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-medium text-gray-900">{booking.car.name}</p>
                      <p>{booking.car.brand} {booking.car.model}</p>
                      {booking.car.registrationNumber && (
                        <p>Reg: {booking.car.registrationNumber}</p>
                      )}
                    </div>
                  </div>

                  {/* Rental Period */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Rental Period</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Pickup:</span> {formatDate(booking.pickupDate)}
                      </p>
                      <p>
                        <span className="font-medium">Dropoff:</span> {formatDate(booking.dropoffDate)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Location</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Pickup:</span> {booking.pickupLocation}
                      </p>
                      <p>
                        <span className="font-medium">Dropoff:</span> {booking.dropoffLocation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Total Price</span>
                    <span className="text-xl font-bold text-brand-red">
                      ${booking.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {permissions.canManageBookings && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                          className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'active')}
                        className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                      >
                        Mark as Active
                      </button>
                    )}
                    {booking.status === 'active' && (
                      <button
                        onClick={() => updateBookingStatus(booking._id, 'completed')}
                        className="px-3 py-1.5 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filters.search || filters.status || filters.paymentStatus
              ? 'Try adjusting your filters'
              : 'No bookings have been made yet'}
          </p>
        </div>
      )}
    </div>
  );
}
