import { useQuery } from "@tanstack/react-query";
import {
  fetchLowProductPerformance,
  getCouponUsage,
  getProductPerformance,
  getSellerRevenueTrend,
  getTopSellingProducts,
} from "../../api/sellerDashboardApi";
import type {
  OrderStatusApiResponse,
  OrderStatusData,
  SellerOverview,
  ProductSalesApiResponse,
  ProductSalesDataPoint,
  CouponPerformanceDataPoint,
  LowStockItems,
  ProductPerformanceApi,
} from "../../types/sellerDashboardTypes";
import {
  fetchOrderStatus,
  getSellerOverview,
} from "../../api/sellerDashboardApi";

import type {
  RevenueTrendApiResponse,
  RevenueTrendDataPoint,
} from "../../types/sellerDashboardTypes";

const transformRevenueTrend = (
  data: RevenueTrendApiResponse
): RevenueTrendDataPoint[] => {
  return data.labels.map((label, index) => ({
    month: label,
    revenue: data.data[index],
  }));
};

export const useSellerRevenueTrend = () => {
  return useQuery({
    queryKey: ["seller-revenue-trend"],
    queryFn: getSellerRevenueTrend,
    select: transformRevenueTrend,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

const transformOrderStatus = (
  apiData: OrderStatusApiResponse
): OrderStatusData => {
  const result: OrderStatusData = {
    delivered: 0,
    pending: 0,
    shipped: 0,
    cancelled: 0,
  };

  apiData.labels.forEach((label, index) => {
    const value = apiData.percentages[index] ?? 0;

    switch (label.toLowerCase()) {
      case "delivered":
        result.delivered = value;
        break;
      case "pending":
        result.pending = value;
        break;
      case "shipped":
        result.shipped = value;
        break;
      case "cancelled":
        result.cancelled = value;
        break;
    }
  });

  return result;
};

export const useOrderStatus = () => {
  return useQuery<OrderStatusData>({
    queryKey: ["order-status-distribution"],
    queryFn: async () => {
      const res = await fetchOrderStatus();
      return transformOrderStatus(res);
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useSellerOverview = () => {
  return useQuery<SellerOverview>({
    queryKey: ["seller-overview"],
    queryFn: getSellerOverview,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTopSellingProducts = () => {
  return useQuery({
    queryKey: ["top-selling-products"],
    queryFn: getTopSellingProducts,
    select: (data: ProductSalesApiResponse): ProductSalesDataPoint[] => {
      return data.labels.map((label, index) => ({
        productName: label,
        unitsSold: data.units_sold[index],
      }));
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useCouponUsage = () => {
  return useQuery({
    queryKey: ["coupon-usage"],
    queryFn: getCouponUsage,
    select: (data): CouponPerformanceDataPoint[] => {
      return data.labels.map((label, index) => ({
        code: label,
        usage: data.usage[index] ?? 0,
      }));
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useLowStockItems = () =>
  useQuery<LowStockItems[]>({
    queryKey: ["low-product-performance"],
    queryFn: async () => {
      const data = await fetchLowProductPerformance();
      const items = data ?? [];
      const filteredItems = items.filter((p) => p.stock < 7);
      return filteredItems.map((item) => ({
        product_id: item.product_id,
        sku: item.sku,
        stock: item.stock,
      }));
    },
    staleTime: 1000 * 60 * 2, // ❗ 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
});

export const useProductPerformance = () => {
  return useQuery({
    queryKey: ["product-performance"],
    queryFn: getProductPerformance,
    select: (data: ProductPerformanceApi[]): ProductPerformanceApi[] => {
      return data.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        sku: item.sku,
        units_sold: item.units_sold,
        stock: item.stock,
        approval_status: item.approval_status,
      }));
    },

    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: true,
  });
};
