import type { OrderStatusApiResponse, SellerOverview, ProductSalesApiResponse, CouponUsageApiResponse, LowStockItems, ProductPerformanceApi } from "../types/sellerDashboardTypes";
import api from "./axiosInstance";

export const getSellerOverview = async (): Promise<SellerOverview> => {
  const res = await api.get("/seller/analytics/overview");
  return res.data;
};

export const getSellerRevenueTrend = async () => {
  const res = await api.get("/seller/analytics/revenue-trend");
  return res.data; 
};

export const getTopSellingProducts = async () => {
  const res = await api.get<ProductSalesApiResponse>("/seller/analytics/top-selling-products");
  return res.data;
};

export const fetchOrderStatus = async (): Promise<OrderStatusApiResponse> => {
  const res = await api.get("/seller/analytics/order-status-distribution");
  return res.data;
};

export const getCouponUsage = async (): Promise<CouponUsageApiResponse> => {
  const res = await api.get("/seller/analytics/coupon-usage");
  return res.data;
};

export const fetchLowProductPerformance = async (): Promise<LowStockItems[]> => {
  const res = await api.get("/seller/analytics/low-stock-items");
  return res.data; 
};

export const getProductPerformance = async (): Promise<ProductPerformanceApi[]> => {
  const res = await api.get("/seller/analytics/product-performance");
  return res.data;
};