// ----------------------------------------------
// Dashboard Charts (NO GRADIENT COLORS VERSION)
// ----------------------------------------------

import React from "react";
import { PieChart, TrendingUp, Users, PackageCheck } from "lucide-react";
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
  LabelList,
  ReferenceLine,
} from "recharts";

interface RevenueTrendDataPoint {
  month: string;
  revenue: number;
}

interface OrderOverviewDataPoint {
  month: string;
  success: number;
  cancelled: number;
  failed: number;
  aov: number;
}

interface CategoryRevenueDataPoint {
  category: string;
  revenue: number;
  color: string;
  [key: string]: string | number;
}

interface TopSellerDataPoint {
  sellerName: string;
  revenue: number;
  orders: number;
}

interface DashboardChartsProps {
  revenueTrend: RevenueTrendDataPoint[];
  orderOverview: OrderOverviewDataPoint[];
  categoryRevenue: CategoryRevenueDataPoint[];
  topSellers: TopSellerDataPoint[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  revenueTrend,
  orderOverview,
  categoryRevenue,
  topSellers,
}) => {
  // Solid light colors (no gradients!)
  const primaryLight = "#D7CCC8";
  const infoLight = "#BFDBFE";
  const successLight = "#BBF7D0";
  const warningLight = "#FDE68A";
  const errorLight = "#FCA5A5";

  const white = "#FFFFFF";
  // const gray100 = "#D7CCC8";
  const gray200 = "#BCAAA4";
  const gray300 = "#A1887F";
  const gray600 = "#6D4C41";
  const gray700 = "#5D4037";
  const grayShades = [
    "#D7CCC8",
    "#BCAAA4",
    "#A1887F",
    "#424242",
    "#D7CCC8",
    "#BCAAA4",
  ];

  const revenueTrendChart = (
   <ResponsiveContainer width="100%" height={320}>
  <LineChart data={revenueTrend}>
    <CartesianGrid strokeDasharray="3 3" stroke={gray200} />

    <XAxis
      dataKey="month"
      tick={{ fill: gray600, fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: gray200 }}
    />

    <YAxis
      tick={{ fill: gray600, fontSize: 12 }}
      tickLine={false}
      axisLine={{ stroke: gray200 }}
    />

    <Tooltip
      contentStyle={{
        borderRadius: "12px",
        border: `1px solid ${gray200}`,
        backgroundColor: white,
        boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
        fontSize: "13px",
      }}
    />


    <Area
      type="monotone"
      dataKey="revenue"
      stroke={gray600}
      fill={primaryLight}
      fillOpacity={0.4}
      tooltipType="none"   
    />

   
    <Line
      type="monotone"
      dataKey="revenue"
      stroke={primaryLight}
      strokeWidth={3}
      dot={{ fill: gray200, stroke: white, strokeWidth: 2, r: 5 }}
      activeDot={{ r: 7, stroke: gray600, strokeWidth: 2 }}
    />

    <ReferenceLine y={0} stroke={errorLight} strokeDasharray="5 5" />
  </LineChart>
</ResponsiveContainer>

  );

  const categoryPieChart = (
    <ResponsiveContainer width="100%" height={320}>
      <RechartsPieChart>
        <Pie
          data={categoryRevenue}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={95}
          paddingAngle={4}
          dataKey="revenue"
          nameKey="category"
          labelLine={{ stroke: gray300, strokeWidth: 1 }}
          label={({ percent }) => `${(percent! * 100).toFixed(0)}%`}
        >
          {categoryRevenue.map((_entry, index) => (
            <Cell
              key={index}
              fill={grayShades[index % grayShades.length]}
              stroke={white}
              strokeWidth={2}
            />
          ))}
        </Pie>

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
            boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
          }}
        />

        <Legend
          wrapperStyle={{
            paddingTop: 12,
            fontSize: 12,
            fontWeight: 500,
          }}
          iconSize={10}
          iconType="circle"
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );

  const orderOverviewChart = (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={orderOverview}>
        <CartesianGrid strokeDasharray="3 3" stroke={gray200} />

        <XAxis
          dataKey="month"
          tick={{ fill: gray600, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />
        <YAxis
          tick={{ fill: gray600, fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: gray200 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
          }}
        />

        {/* Bars – solid light colors */}
        <Bar dataKey="success" fill={successLight} radius={[6, 6, 0, 0]} />
        <Bar dataKey="cancelled" fill={warningLight} radius={[6, 6, 0, 0]} />
        <Bar dataKey="failed" fill={errorLight} radius={[6, 6, 0, 0]} />

        {/* AOV line */}
        <Line
          dataKey="aov"
          stroke={infoLight}
          strokeWidth={3}
          dot={{ fill: infoLight, stroke: white, r: 5 }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  // ------------------------------
  // Top Sellers (Horizontal Bars)
  // ------------------------------
  const topSellersChart = (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={topSellers} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={gray200} />

        <XAxis
          type="number"
          tick={{ fill: gray600 }}
          axisLine={{ stroke: gray200 }}
        />
        <YAxis
          dataKey="sellerName"
          type="category"
          width={140}
          tick={{ fill: gray700, fontSize: 13, fontWeight: 600 }}
        />

        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: `1px solid ${gray200}`,
            backgroundColor: white,
          }}
        />

        <Bar
          dataKey="revenue"
          fill={primaryLight}
          radius={[6, 6, 6, 6]}
          barSize={24}
        />

        <LabelList dataKey="orders" position="right" fill={gray600} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <>
      {/* Revenue & Category */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
          </div>
          {revenueTrendChart}
        </div>

        <div className="bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-semibold">Revenue by Category</h2>
          </div>
          {categoryPieChart}
        </div>
      </div>

      {/* Order Overview */}
      <div className="bg-background rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <PackageCheck className="h-5 w-5 text-primary-400" />
          <h2 className="text-xl font-semibold">Order Overview</h2>
        </div>
        {orderOverviewChart}
      </div>

      {/* Top Sellers */}
      <div className="bg-background rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-5 w-5 text-primary-400" />
          <h2 className="text-xl font-semibold">Top Sellers</h2>
        </div>
        {topSellersChart}
      </div>
    </>
  );
};
