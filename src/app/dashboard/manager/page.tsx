'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth/permissions';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';

export default function ManagerDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/?login=true');
      return;
    }

    const userData: User = JSON.parse(userStr);
    if (userData.role !== 'Manager' && userData.role !== 'Executive') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ManagerDashboard user={user} />;
}
