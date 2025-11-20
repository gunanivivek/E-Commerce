// src/types/adminAnalyticsTypes.ts

export interface AdminKpiData {
  totalRevenue: {
    totalRevenue: number;
    lastMonthRevenue: number;
    currentMonthRevenue: number;
  };

  totalOrders: {
    totalOrders: number;
    lastMonthOrders: number;
  };

  activeCustomers: {
    total: number;
    new30Days: number;
  };

  activeSellers: {
    approved: number;
    pending: number;
  };

  totalProducts: {
    approved: number;
    pending: number;
  };

  failedPayments: {
    failedToday: number;
    failureRate: number;
  };

  couponsUsed: {
    usages: number;
    totalDiscount: number;
  };
}


export interface AdminRevenueTrendPoint {
  month: string;
  revenue: number;
}

export interface AdminOrderOverviewPoint {
  month: string;
  success: number;
  cancelled: number;
  failed: number;
  aov: number;
}

export interface AdminCategoryRevenuePoint {
  category: string;
  revenue: number;
}

export interface AdminTopSeller {
  sellerName: string;
  revenue: number;
  orders: number;
}

export interface AdminTopProduct {
  id: number;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface AdminWorstProduct {
  id: number;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface AdminRecentOrder {
  orderId: number;
  customerName: string;
  amount: number;
  status: string;
  createdDate: string;
}

export interface AdminProductsResponse {
  topSelling: AdminTopProduct[];
  worstPerforming: AdminWorstProduct[];
}
