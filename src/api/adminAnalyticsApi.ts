// src/api/adminAnalyticsApi.ts


import {
  type AdminKpiData,
  type AdminRevenueTrendPoint,
  type AdminOrderOverviewPoint,
  type AdminCategoryRevenuePoint,
  type AdminTopSeller,
  type AdminTopProduct,
  type AdminWorstProduct,
  type AdminRecentOrder,
} from "../types/adminAnalyticsTypes";

import api from "./axiosInstance";
export const adminAnalyticsApi = {
  getKpis: async (): Promise<AdminKpiData> => {
   
    const res = await api.get("/admin/analytics/kpis");
    return res.data.data;
  },

  getRevenueTrend: async (): Promise<AdminRevenueTrendPoint[]> => {
   
    const res = await api.get("/admin/analytics/revenue-trend");
    return res.data.data;
  },

  getOrderOverview: async (): Promise<AdminOrderOverviewPoint[]> => {

    const res = await api.get("/admin/analytics/order-overview");
    return res.data.data;
  },

  getCategoryRevenue: async (): Promise<AdminCategoryRevenuePoint[]> => {
   
    const res = await api.get("/admin/analytics/category-revenue");
    return res.data.data;
  },

  getTopSellers: async (): Promise<AdminTopSeller[]> => {
  
    const res = await api.get("/admin/analytics/top-sellers");
    return res.data.data;
  },

  getTopWorstProducts: async (): Promise<{
    top: AdminTopProduct[];
    worst: AdminWorstProduct[];
  }> => {
  
    const res = await api.get("/admin/analytics/products-performance");
    return res.data.data;
  },

  getRecentOrders: async (): Promise<AdminRecentOrder[]> => {
  
    const res = await api.get("/admin/analytics/recent-orders");
    return res.data.data;
  },
};
