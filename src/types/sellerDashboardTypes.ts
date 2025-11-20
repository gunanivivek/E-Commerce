export interface SellerOverview {
  total_revenue: number;
  monthly_revenue: number;
  todays_revenue: number;

  total_orders: number;
  delivered_orders: number;
  pending_orders: number;
  pending_shipments: number;

  total_products: number;
  active_products: number;
  pending_approval_products: number;
  low_stock_items: number;
   last_month_revenue: number;
  yesterday_revenue: number;
  coupon_usage: number;
}

export interface RevenueTrendApiResponse {
  labels: string[];
  data: number[];
}

export interface RevenueTrendDataPoint {
  month: string;
  revenue: number;
}

export interface OrderStatusApiResponse {
  labels: string[];
  percentages: number[];
}

export interface OrderStatusData {
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

export interface ProductSalesApiResponse {
  labels: string[];
  units_sold: number[];
}

export interface ProductSalesDataPoint {
  productName: string;
  unitsSold: number;
}

export interface CouponUsageApiResponse {
  labels: string[];
  usage: number[];
}

export interface CouponPerformanceDataPoint {
  code: string;
  usage: number;
}

export interface LowStockItems {
  product_id: number;
  sku: string;
  stock: number;
}

export interface ProductPerformanceApi {
  product_id: number;
  product_name: string;
  sku: string;
  units_sold: number;
  stock: number;
  approval_status: string;
}


