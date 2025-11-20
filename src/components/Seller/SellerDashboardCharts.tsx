import React, { Suspense } from "react";
import { BarChart3, PieChart } from "lucide-react";

const RevenueTrendChart = React.lazy(() =>
  import("./Dashboard Components/RevenueTrendChart").then((m) => ({
    default: m.RevenueTrendChart,
  }))
);

const OrderStatusDonutChart = React.lazy(() =>
  import("./Dashboard Components/OrderStatusDonutChart").then((m) => ({
    default: m.OrderStatusDonutChart,
  }))
);

const ProductSalesBarChart = React.lazy(() =>
  import("./Dashboard Components/ProductSalesBarChart").then((m) => ({
    default: m.ProductSalesBarChart,
  }))
);

const CouponPerformanceBarChart = React.lazy(() =>
  import("./Dashboard Components/CouponPerformanceBarChart").then((m) => ({
    default: m.CouponPerformanceBarChart,
  }))
);

// -------- Skeleton Component --------
const ChartSkeleton = () => (
  <div className="h-[300px] w-full rounded-xl bg-gray-100 animate-pulse" />
);

interface RevenueTrendDataPoint {
  month: string;
  revenue: number;
}

interface ProductSalesDataPoint {
  productName: string;
  unitsSold: number;
}

interface OrderStatusData {
  pending: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface CouponPerformanceDataPoint {
  code: string;
  usage: number;
}

interface SellerDashboardChartsProps {
  revenueTrend: RevenueTrendDataPoint[];
  productSales: ProductSalesDataPoint[];
  orderStatus: OrderStatusData;
  couponPerformance: CouponPerformanceDataPoint[];

  loadingRevenue: boolean;
  loadingProductSales: boolean;
  loadingOrderStatus: boolean;
  loadingCouponPerformance: boolean;
}

export const SellerDashboardCharts: React.FC<SellerDashboardChartsProps> = ({
  revenueTrend,
  productSales,
  orderStatus,
  couponPerformance,

  loadingRevenue,
  loadingProductSales,
  loadingOrderStatus,
  loadingCouponPerformance,
}) => {
  const chartColors = {
    primaryColor: "#8D6E63",
    successColor: "#22c55e",
    warningColor: "#f59e0b",
    errorColor: "#ef4444",
    gray100: "#D7CCC8",
    gray200: "#BCAAA4",
    gray300: "#A1887F",
    gray600: "#6D4C41",
    gray700: "#5D4037",
    white: "#FFFFFF",
  };

  return (
    <>
      {/* Revenue Trend + Order Status */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100/50 rounded-xl flex items-center justify-center border border-primary-200/50">
              <BarChart3 className="h-5 w-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Revenue Trend (Last 12 Months)
            </h2>
          </div>
          {loadingRevenue ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <RevenueTrendChart
                revenueTrend={revenueTrend}
                colors={chartColors}
              />
            </Suspense>
          )}
        </div>

        <div className="bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-100/50 rounded-xl flex items-center justify-center border border-primary-200/50">
              <PieChart className="h-5 w-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">
              Order Status Distribution
            </h2>
          </div>
          {loadingOrderStatus ? (
            <ChartSkeleton />
          ) : (
            <Suspense fallback={<ChartSkeleton />}>
              <OrderStatusDonutChart
                orderStatus={orderStatus}
                colors={chartColors}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* Product Sales */}
      <div className="bg-background rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100/50 rounded-xl flex items-center justify-center border border-primary-200/50">
            <BarChart3 className="h-5 w-5 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            Top Selling Products
          </h2>
        </div>
        {loadingProductSales ? (
          <ChartSkeleton />
        ) : (
          <Suspense fallback={<ChartSkeleton />}>
            <ProductSalesBarChart
              productSales={productSales}
              colors={chartColors}
            />
          </Suspense>
        )}
      </div>

      {/* Coupon Usage */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary-100/50 rounded-xl flex items-center justify-center border border-primary-200/50">
            <BarChart3 className="h-5 w-5 text-primary-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary">
            Coupon Usage Analytics
          </h2>
        </div>
        {loadingCouponPerformance ? (
          <ChartSkeleton />
        ) : (
          <Suspense fallback={<ChartSkeleton />}>
            <CouponPerformanceBarChart
              couponPerformance={couponPerformance}
              colors={chartColors}
            />
          </Suspense>
        )}
      </div>
    </>
  );
};
