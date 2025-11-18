// src/types/adminAnalyticsTypes.ts

export interface AdminKpiData {
  totalRevenue: number;
  lastMonthRevenue: number;
  totalOrders: number;
  lastMonthOrders: number;
  totalCustomers: number;
  newCustomers30Days: number;
  approvedSellers: number;
  pendingSellers: number;
  approvedProducts: number;
  pendingProducts: number;
  failedPaymentsToday: number;
  failedPaymentRate: number;
  couponUsages: number;
  totalDiscountGiven: number;
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
  img: string;
  category: string;
  sold: number;
  revenue: number;
  conversionRate: number;
}

export interface AdminWorstProduct {
  id: number;
  name: string;
  img: string;
  views: number;
  sold: number;
  conversionRate: number;
}

export interface AdminRecentOrder {
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdDate: string;
}
