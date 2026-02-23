'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/auth/permissions';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ArticleIcon from '@mui/icons-material/Article';
import StarIcon from '@mui/icons-material/Star';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import HeroSlidesManager from '@/components/cms/HeroSlidesManager';
import HotDealsManager from '@/components/cms/HotDealsManager';
import ArticlesManager from '@/components/cms/ArticlesManager';
import ReviewsManager from '@/components/cms/ReviewsManager';

export default function CMSPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hero' | 'deals' | 'articles' | 'reviews'>('hero');
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/?login=true');
      return;
    }

    const userData: User = JSON.parse(userStr);
    if (userData.role !== 'Admin' && userData.role !== 'Manager') {
      router.push('/dashboard');
      return;
    }

    setUser(userData);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const tabs = [
    { id: 'hero', label: 'Hero Slides', icon: ViewCarouselIcon },
    { id: 'deals', label: 'Hot Deals', icon: LocalFireDepartmentIcon },
    { id: 'articles', label: 'Articles', icon: ArticleIcon },
    { id: 'reviews', label: 'Reviews', icon: StarIcon },
  ];

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-blue-800 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <DashboardCustomizeIcon className="text-white" sx={{ fontSize: 32 }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Content Management System</h1>
              <p className="text-white/80 text-sm mt-1">Manage your website content with ease</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <nav className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex-1 py-4 px-6 font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200
                    ${activeTab === tab.id
                      ? 'border-b-3 border-brand-red text-brand-red bg-brand-red/5'
                      : 'border-b-3 border-transparent text-gray-600 hover:text-brand-blue hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon sx={{ fontSize: 20 }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'hero' && <HeroSlidesManager />}
            {activeTab === 'deals' && <HotDealsManager />}
            {activeTab === 'articles' && <ArticlesManager />}
            {activeTab === 'reviews' && <ReviewsManager />}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
