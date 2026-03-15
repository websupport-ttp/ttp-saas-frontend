'use client';

import { useState, useEffect } from 'react';
import { User, getDashboardPermissions } from '@/lib/auth/permissions';
import DashboardLayout from './DashboardLayout';
import BookingManagement from './BookingManagement';
import ManagementFinancialDashboard from './ManagementFinancialDashboard';

interface ManagerDashboardProps {
  user: User;
}

export default function ManagerDashboard({ user }: ManagerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'reports' | 'team' | 'financial'>('overview');
  const [stats, setStats] = useState({
    teamMembers: 0,
    completedToday: 0,
    pendingTasks: 0,
    performance: 0
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
      const response = await fetch(`${API_BASE_URL}/api/v1/dashboard/manager/stats`, {
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

  const renderContent = () => {
    switch (activeTab) {
      case 'bookings':
        return <BookingManagement user={user} permissions={permissions} />;
      case 'financial':
        return <ManagementFinancialDashboard />;
      case 'reports':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports & Analytics</h3>
            <p className="text-gray-600">Reports interface coming soon...</p>
          </div>
        );
      case 'team':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Management</h3>
            <p className="text-gray-600">Team management interface coming soon...</p>
          </div>
        );
      default:
        return (
          <div>
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-brand-blue to-brand-blue-800 rounded-lg shadow-lg p-6 mb-6 text-white">
              <h2 className="text-2xl font-bold">Manager Dashboard</h2>
              <p className="mt-1 opacity-90">Welcome back, {user.firstName}!</p>
              <p className="text-sm mt-2 opacity-75">Team oversight and performance tracking</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-brand-blue/10 rounded-lg">
                    <svg className="w-6 h-6 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Team Members</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.teamMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Completed Today</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.completedToday}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-brand-orange/10 rounded-lg">
                    <svg className="w-6 h-6 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : stats.pendingTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-brand-red/10 rounded-lg">
                    <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{loading ? '-' : `${stats.performance}%`}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
                >
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Bookings</p>
                    <p className="text-sm text-gray-600">Manage all bookings</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
                >
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Reports</p>
                    <p className="text-sm text-gray-600">Analytics & insights</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('team')}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-600 hover:bg-green-50 transition-colors"
                >
                  <svg className="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Manage Team</p>
                    <p className="text-sm text-gray-600">Team oversight</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <p className="text-gray-600 text-sm">No recent activity to display</p>
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
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => setActiveTab('financial')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'financial'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Financial Stats
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bookings'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Bookings
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reports'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Reports
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'team'
                ? 'border-green-600 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team
          </button>
        </nav>
      </div>

      {/* Content */}
      {renderContent()}
    </DashboardLayout>
  );
}
