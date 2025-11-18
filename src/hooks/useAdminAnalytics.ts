// src/hooks/useAdminAnalytics.ts

import { useQuery } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";

import { adminAnalyticsApi } from "../api/adminAnalyticsApi";
import { adminAnalyticsStore } from "../store/Admin/adminAnalyticsStore";

export const useAdminAnalytics = () => {
  const setData = adminAnalyticsStore((s) => s.setData);
  const setError = adminAnalyticsStore((s) => s.setError);

  const handleError = useCallback((label: string, error: unknown) => {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(label, msg);
    setError(`Failed to fetch ${label}`);
  }, [setError]);


  const kpisQuery = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: adminAnalyticsApi.getKpis,
  });

  useEffect(() => {
    if (kpisQuery.isSuccess) setData("kpis", kpisQuery.data);
    if (kpisQuery.isError) handleError("Admin KPI", kpisQuery.error);
  }, [kpisQuery.isSuccess, kpisQuery.isError, kpisQuery.data, kpisQuery.error, setData, handleError]);


  const revenueTrendQuery = useQuery({
    queryKey: ["admin-revenue-trend"],
    queryFn: adminAnalyticsApi.getRevenueTrend,
  });

  useEffect(() => {
    if (revenueTrendQuery.isSuccess) setData("revenueTrend", revenueTrendQuery.data);
    if (revenueTrendQuery.isError) handleError("Revenue Trend", revenueTrendQuery.error);
  }, [revenueTrendQuery.isSuccess, revenueTrendQuery.isError, revenueTrendQuery.data, revenueTrendQuery.error, setData, handleError]);


  const orderOverviewQuery = useQuery({
    queryKey: ["admin-order-overview"],
    queryFn: adminAnalyticsApi.getOrderOverview,
  });

  useEffect(() => {
    if (orderOverviewQuery.isSuccess) setData("orderOverview", orderOverviewQuery.data);
    if (orderOverviewQuery.isError) handleError("Order Overview", orderOverviewQuery.error);
  }, [orderOverviewQuery.isSuccess, orderOverviewQuery.isError, orderOverviewQuery.data, orderOverviewQuery.error, setData, handleError]);

 
  const categoryRevenueQuery = useQuery({
    queryKey: ["admin-category-revenue"],
    queryFn: adminAnalyticsApi.getCategoryRevenue,
  });

  useEffect(() => {
    if (categoryRevenueQuery.isSuccess) setData("categoryRevenue", categoryRevenueQuery.data);
    if (categoryRevenueQuery.isError) handleError("Category Revenue", categoryRevenueQuery.error);
  }, [categoryRevenueQuery.isSuccess, categoryRevenueQuery.isError, categoryRevenueQuery.data, categoryRevenueQuery.error, setData, handleError]);


  const topSellersQuery = useQuery({
    queryKey: ["admin-top-sellers"],
    queryFn: adminAnalyticsApi.getTopSellers,
  });

  useEffect(() => {
    if (topSellersQuery.isSuccess) setData("topSellers", topSellersQuery.data);
    if (topSellersQuery.isError) handleError("Top Sellers", topSellersQuery.error);
  }, [topSellersQuery.isSuccess, topSellersQuery.isError, topSellersQuery.data, topSellersQuery.error, setData, handleError]);

 
  const productsPerformanceQuery = useQuery({
    queryKey: ["admin-products-performance"],
    queryFn: adminAnalyticsApi.getTopWorstProducts,
  });

  useEffect(() => {
    if (productsPerformanceQuery.isSuccess) {
      setData("topProducts", productsPerformanceQuery.data.top);
      setData("worstProducts", productsPerformanceQuery.data.worst);
    }
    if (productsPerformanceQuery.isError) {
      handleError("Product Performance", productsPerformanceQuery.error);
    }
  }, [productsPerformanceQuery.isSuccess, productsPerformanceQuery.isError, productsPerformanceQuery.data, productsPerformanceQuery.error, setData, handleError]);

  /* -----------
     Recent Orders
  ----------- */
  const recentOrdersQuery = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: adminAnalyticsApi.getRecentOrders,
  });

  useEffect(() => {
    if (recentOrdersQuery.isSuccess) setData("recentOrders", recentOrdersQuery.data);
    if (recentOrdersQuery.isError) handleError("Recent Orders", recentOrdersQuery.error);
  }, [recentOrdersQuery.isSuccess, recentOrdersQuery.isError, recentOrdersQuery.data, recentOrdersQuery.error, setData, handleError]);

  return {
    kpisQuery,
    revenueTrendQuery,
    orderOverviewQuery,
    categoryRevenueQuery,
    topSellersQuery,
    productsPerformanceQuery,
    recentOrdersQuery,
  };
};
