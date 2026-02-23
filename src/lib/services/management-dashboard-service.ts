// Management Dashboard API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export interface FinancialStatsParams {
  period?: '7days' | '30days' | '90days' | '365days';
  startDate?: string;
  endDate?: string;
}

export interface FinancialStats {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: number;
    totalTransactions: number;
    averageTransactionValue: number;
  };
  revenueByService: Record<string, {
    revenue: number;
    profit: number;
    count: number;
  }>;
  expensesByCategory: {
    operations: number;
    marketing: number;
    salaries: number;
    infrastructure: number;
  };
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    profit: number;
    expenses: number;
    transactions: number;
  }>;
  topPerformingServices: Array<{
    service: string;
    revenue: number;
    profit: number;
    transactions: number;
    profitMargin: string;
  }>;
  recentTransactions: Array<any>;
  revenueBySegment: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
  revenueByChannel: Array<{
    _id: string;
    revenue: number;
    count: number;
  }>;
}

class ManagementDashboardService {
  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async getFinancialStats(params?: FinancialStatsParams): Promise<{ data: FinancialStats }> {
    const queryParams = new URLSearchParams();
    
    if (params?.period) {
      queryParams.append('period', params.period);
    }
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/v1/dashboard/management/financial-stats${queryString ? `?${queryString}` : ''}`;

    return this.fetchWithAuth(url);
  }
}

export const managementDashboardService = new ManagementDashboardService();
