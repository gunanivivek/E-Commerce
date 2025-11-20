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
  const res = await api.get("/analytics/kpis");
  return res.data.kpis;  
},


getCharts: async (): Promise<{
  revenueTrend: AdminRevenueTrendPoint[];
  orderOverview: AdminOrderOverviewPoint[];
  categoryRevenue: AdminCategoryRevenuePoint[];
  topSellers: AdminTopSeller[];
}> => {
  const res = await api.get("/analytics/charts");

  return {
    revenueTrend: res.data.charts.revenueTrend ?? [],
    orderOverview: res.data.charts.orderOverview ?? [],
    categoryRevenue: res.data.charts.categoryRevenue ?? [],
    topSellers: res.data.charts.topSellers ?? [],
  };
},


  getTopWorstProducts: async (): Promise<{
  topSelling: AdminTopProduct[];
  worstPerforming: AdminWorstProduct[];
}> => {
  const res = await api.get("/analytics/products");

  return {
    topSelling: res.data.products.topSelling ?? [],
    worstPerforming: res.data.products.worstPerforming ?? [],
  };
},


getRecentOrders: async (limit = 6): Promise<AdminRecentOrder[]> => {
  const res = await api.get(`/analytics/recent-orders?limit=${limit}`);
  return res.data.recentOrders ?? [];
},

};
