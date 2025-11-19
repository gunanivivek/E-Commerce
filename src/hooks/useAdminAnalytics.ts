// src/hooks/useAdminAnalytics.ts

import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";

import { adminAnalyticsApi } from "../api/adminAnalyticsApi";
import { adminAnalyticsStore } from "../store/Admin/adminAnalyticsStore";

export const useAdminAnalytics = () => {
  const setData = adminAnalyticsStore((s) => s.setData);
  const setError = adminAnalyticsStore((s) => s.setError);

  const handleError = useCallback(
    (label: string, error: unknown) => {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error(label, msg);
      setError(`Failed to fetch ${label}`);
    },
    [setError]
  );

  const kpisQuery = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: adminAnalyticsApi.getKpis,
  });

  useEffect(() => {
    if (kpisQuery.isSuccess) setData("kpis", kpisQuery.data);
    if (kpisQuery.isError) handleError("Admin KPI", kpisQuery.error);
  }, [
    kpisQuery.isSuccess,
    kpisQuery.isError,
    kpisQuery.data,
    kpisQuery.error,
    setData,
    handleError,
  ]);

const chartsQuery = useQuery({
  queryKey: ["admin-charts"],
  queryFn: adminAnalyticsApi.getCharts,
});

useEffect(() => {
  if (chartsQuery.isSuccess) {
    setData("revenueTrend", chartsQuery.data.revenueTrend);
    setData("orderOverview", chartsQuery.data.orderOverview);
    setData("categoryRevenue", chartsQuery.data.categoryRevenue);
    setData("topSellers", chartsQuery.data.topSellers);
  }

  if (chartsQuery.isError) {
    handleError("Charts", chartsQuery.error);
  }
}, [
  chartsQuery.isSuccess,
  chartsQuery.isError,
  chartsQuery.data,
  chartsQuery.error,
  setData,
  handleError,
]);



  





  const productsPerformanceQuery = useQuery({
    queryKey: ["admin-products-performance"],
    queryFn: adminAnalyticsApi.getTopWorstProducts,
  });

  useEffect(() => {
    if (productsPerformanceQuery.isSuccess) {
      const raw = productsPerformanceQuery.data;

      const top = raw?.topSelling ?? [];
      const worst = raw?.worstPerforming ?? [];

      setData("topProducts", top);
      setData("worstProducts", worst);
    }
    if (productsPerformanceQuery.isError) {
      handleError("Product Performance", productsPerformanceQuery.error);
    }
  }, [
    productsPerformanceQuery.isSuccess,
    productsPerformanceQuery.isError,
    productsPerformanceQuery.data,
    productsPerformanceQuery.error,
    setData,
    handleError,
  ]);

  /* -----------
     Recent Orders
  ----------- */
  const recentOrdersQuery = useQuery({
    queryKey: ["admin-recent-orders"],
  queryFn: () => adminAnalyticsApi.getRecentOrders(6),

  });

  useEffect(() => {
    if (recentOrdersQuery.isSuccess)
      setData("recentOrders", recentOrdersQuery.data);
    if (recentOrdersQuery.isError)
      handleError("Recent Orders", recentOrdersQuery.error);
  }, [
    recentOrdersQuery.isSuccess,
    recentOrdersQuery.isError,
    recentOrdersQuery.data,
    recentOrdersQuery.error,
    setData,
    handleError,
  ]);

  return {
    kpisQuery,
    chartsQuery,
    productsPerformanceQuery,
    recentOrdersQuery,
  };
};
