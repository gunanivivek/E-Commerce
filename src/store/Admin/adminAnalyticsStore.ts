// src/store/useAdminAnalyticsStore.ts

import { create } from "zustand";
import type {
  AdminCategoryRevenuePoint,
  AdminKpiData,
  AdminOrderOverviewPoint,
  AdminRecentOrder,
  AdminRevenueTrendPoint,
  AdminTopProduct,
  AdminTopSeller,
  AdminWorstProduct,
} from "../../types/adminAnalyticsTypes";

type AdminAnalyticsData = {
  kpis?: AdminKpiData;
  revenueTrend?: AdminRevenueTrendPoint[];
  orderOverview?: AdminOrderOverviewPoint[];
  categoryRevenue?: AdminCategoryRevenuePoint[];
  topSellers?: AdminTopSeller[];
  topProducts?: AdminTopProduct[];
  worstProducts?: AdminWorstProduct[];
  recentOrders?: AdminRecentOrder[];
};

interface AdminAnalyticsState extends AdminAnalyticsData {
  error: string | null;
  setError: (error: string | null) => void;
  setData: <K extends keyof AdminAnalyticsData>(key: K, value: AdminAnalyticsData[K]) => void;
}

export const adminAnalyticsStore = create<AdminAnalyticsState>((set) => ({
  kpis: undefined,
  revenueTrend: undefined,
  orderOverview: undefined,
  categoryRevenue: undefined,
  topSellers: undefined,
  topProducts: undefined,
  worstProducts: undefined,
  recentOrders: undefined,
  error: null,

  setError: (error) => set({ error }),
  setData: (key, value) => set((state) => ({ ...state, [key]: value })),
}));
