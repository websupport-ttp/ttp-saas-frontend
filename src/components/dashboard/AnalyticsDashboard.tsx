'use client';

import { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AnalyticsData {
  revenue: {
    total: number;
    byService: { service: string; amount: number }[];
    trend: number;
  };
  bookings: {
    total: number;
    byService: { service: string; count: number }[];
    trend: number;
  };
  discounts: {
    totalApplied: number;
    totalAmount: number;
    mostUsed: { name: string; count: number }[];
  };
  taxes: {
    totalCollected: number;
    byType: { type: string; amount: number }[];
  };
}

export default function AnalyticsDashboard() {
  const { formatAmount } = useCurrency();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(
        `${API_BASE_URL}/analytics/pricing?range=${dateRange}`,
        {
          credentials: 'include',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Revenue and pricing insights
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatAmount(analytics.revenue.total)}
              </p>
              <p className={`text-sm mt-2 ${analytics.revenue.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.revenue.trend >= 0 ? '+' : ''}{analytics.revenue.trend.toFixed(1)}% from last period
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics.bookings.total}
              </p>
              <p className={`text-sm mt-2 ${analytics.bookings.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.bookings.trend >= 0 ? '+' : ''}{analytics.bookings.trend.toFixed(1)}% from last period
              </p>
            </div>
            <div className="p-3 bg-brand-blue/10 rounded-lg">
              <svg className="w-8 h-8 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Taxes Collected</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatAmount(analytics.taxes.totalCollected)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                From {analytics.bookings.total} bookings
              </p>
            </div>
            <div className="p-3 bg-brand-orange/10 rounded-lg">
              <svg className="w-8 h-8 text-brand-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Service */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Service</h3>
        <div className="space-y-4">
          {analytics.revenue.byService.map((item, index) => {
            const percentage = (item.amount / analytics.revenue.total) * 100;
            return (
              <div key={index}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 capitalize">{item.service}</span>
                  <span className="text-gray-900 font-medium">{formatAmount(item.amount)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-brand-red h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Discounts & Taxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Discount Usage</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Applied</span>
              <span className="text-sm font-medium text-gray-900">{analytics.discounts.totalApplied}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Amount</span>
              <span className="text-sm font-medium text-green-600">{formatAmount(analytics.discounts.totalAmount)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-sm font-medium text-gray-900 mb-2">Most Used</p>
              {analytics.discounts.mostUsed.map((discount, index) => (
                <div key={index} className="flex justify-between text-sm py-1">
                  <span className="text-gray-600">{discount.name}</span>
                  <span className="text-gray-900">{discount.count} uses</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
          <div className="space-y-3">
            {analytics.taxes.byType.map((tax, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-600">{tax.type}</span>
                <span className="text-sm font-medium text-gray-900">{formatAmount(tax.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
