'use client';

import { useState, useEffect } from 'react';
import { User, getDashboardPermissions } from '@/lib/auth/permissions';
import DashboardLayout from './DashboardLayout';
import CarInventoryManagement from './CarInventoryManagement';
import BookingManagement from './BookingManagement';

interface StaffDashboardProps {
  user: User;
}

export default function StaffDashboard({ user }: StaffDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'bookings'>('overview');
  const [stats, setStats] = useState({
    pendingBookings: 0,
    availableCars: 0,
    todayRevenue: 0,
    totalCars: 0
  });
  const [loading, setLoading] = useState(true);
  const permissions = getDashboardPermissions(user);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/staff/stats`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClearanceBadge = () => {
    const level = user.staffClearanceLevel || 1;
    const colors = {
      1: 'bg-gray-100 text-gray-800',
      2: 'bg-brand-blue/10 text-brand-blue',
      3: 'bg-green-100 text-green-800',
      4: 'bg-brand-red/10 text-brand-red',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[level as keyof typeof colors]}`}>
        Clearance Level {level}
      </span>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <CarInventoryManagement user={user} permissions={permissions} />;
      case 'bookings':
        return <BookingManagement user={user} permissions={permissions} />;
      default:
        return (
          <div>
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome, {user.firstName}!
                  </h2>
                  <p className="text-gray-600 mt-1">Staff Dashboard</p>
                </div>
                {getClearanceBadge()}
              </div>
              {user.staffEmployeeId && (
                <p className="text-sm text-gray-500 mt-2">Employee ID: {user.staffEmployeeId}</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-brand-blue/10 rounded-lg">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pending Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.pendingBookings}</p>
                  </div>
                </div>
              </div>

              {permissions.canManageInventory && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-brand-orange/10 rounded-lg">
                      <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Available Cars</p>
                      <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.availableCars}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-brand-red/10 rounded-lg">
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Today's Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : `$${stats.todayRevenue.toFixed(2)}`}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {permissions.canManageBookings && (
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-red hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-brand-red mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Manage Bookings</p>
                      <p className="text-sm text-gray-600">View and process bookings</p>
                    </div>
                  </button>
                )}

                {permissions.canManageInventory && (
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-brand-red hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-8 h-8 text-brand-red mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Car Inventory</p>
                      <p className="text-sm text-gray-600">Manage car fleet</p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Permissions Info */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Your Permissions</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {permissions.canManageBookings && <li>✓ Manage Bookings</li>}
                {permissions.canManageInventory && <li>✓ Manage Car Inventory</li>}
                {permissions.canViewReports && <li>✓ View Reports</li>}
                {permissions.canManageStaff && <li>✓ Manage Staff</li>}
                {!permissions.canManageInventory && (
                  <li className="text-blue-600">ℹ Tier 2+ clearance required for inventory management</li>
                )}
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout user={user}>
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>

          {permissions.canManageBookings && (
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bookings
            </button>
          )}

          {permissions.canManageInventory && (
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Car Inventory
            </button>
          )}
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </DashboardLayout>
  );
}
