import React from "react";
import { BarChart3, PieChart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  Area,
  ReferenceLine,
} from "recharts";

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
}

export const SellerDashboardCharts: React.FC<SellerDashboardChartsProps> = ({
  revenueTrend,
  productSales,
  orderStatus,
  couponPerformance,
}) => {
  // SAME COLORS AS ADMIN DASHBOARD
  const primaryColor = "#8D6E63";
  // const infoColor = "#3b82f6";
  const successColor = "#22c55e";
  const warningColor = "#f59e0b";
  const errorColor = "#ef4444";
  const gray100 = "#D7CCC8";
  const gray200 = "#BCAAA4";
  const gray300 = "#A1887F";
  const gray600 = "#6D4C41";
  const gray700 = "#5D4037";
  const white = "#FFFFFF";

  const orderStatusData = [
    { name: "Pending", value: orderStatus.pending, color: gray200 },
    { name: "Shipped", value: orderStatus.shipped, color: gray300 },
    { name: "Delivered", value: orderStatus.delivered, color: gray600 },
    { name: "Cancelled", value: orderStatus.cancelled, color: warningColor },
  ];

  const revenueTrendChart = (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueTrend}>
        <defs>
          <linearGradient
            id="sellerRevenueGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.4} />
            <stop offset="95%" stopColor={primaryColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />
        <XAxis
          dataKey="month"
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />
        <YAxis
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
            fontSize: "13px",
          }}
          labelStyle={{ fontWeight: 600, color: gray700 }}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke={primaryColor}
          fill="url(#sellerRevenueGradient)"
          strokeWidth={0}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke={primaryColor}
          strokeWidth={3}
          dot={{
            fill: primaryColor,
            stroke: white,
            strokeWidth: 3,
            r: 5,
          }}
        />

        <ReferenceLine y={0} stroke={errorColor} strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );

  const orderStatusDonutChart = (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart margin={{left: 20, right: 20, top: 0, bottom: 0}}>
        <Pie
          data={orderStatusData}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={90}
          paddingAngle={6}
          dataKey="value"
          nameKey="name"
          label={({  percent }) =>
            ` ${((percent ?? 0) * 100).toFixed(0)}%`
          }
        >
          {orderStatusData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
          }}
        />

        <Legend wrapperStyle={{ paddingTop: 10, fontSize: 10 }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  const productSalesBarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={productSales}>
        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />

        <XAxis
          dataKey="productName"
          tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }}
        />
        <YAxis tick={{ fill: gray300, fontSize: 12, fontWeight: 500 }} />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            background: white,
          }}
        />

        <Bar
          dataKey="unitsSold"
          fill={successColor}
          radius={[8, 8, 0, 0]}
          barSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const couponPerformanceBarChart = (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={couponPerformance}
        layout="vertical"
        margin={{ top: 10, right: 100, bottom: 10, left: 100 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gray100} />

        <XAxis type="number" tick={{ fill: gray300, fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="code"
          tick={{ fill: gray600, fontSize: 13, fontWeight: 600 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
          }}
        />

        <Bar
          dataKey="usage"
          fill={primaryColor}
          barSize={22}
          radius={[6, 6, 6, 6]}
        />
      </BarChart>
    </ResponsiveContainer>
  );

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
          {revenueTrendChart}
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
          {orderStatusDonutChart}
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
        {productSalesBarChart}
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
        {couponPerformanceBarChart}
      </div>
    </>
  );
};
