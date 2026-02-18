'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDashboardRoute, getDashboardPermissions, User } from '@/lib/auth/permissions';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage or API
    const getUserAndRedirect = async () => {
      try {
        // Try to get user from localStorage first
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          // No user found, redirect to login
          router.push('/?login=true');
          return;
        }

        const user: User = JSON.parse(userStr);
        
        // Get appropriate dashboard route based on role
        const dashboardRoute = getDashboardRoute(user);
        
        // Redirect to role-specific dashboard
        router.push(dashboardRoute);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/?login=true');
      } finally {
        setLoading(false);
      }
    };

    getUserAndRedirect();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return null;
}
