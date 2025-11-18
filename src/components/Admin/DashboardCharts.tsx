
import {
  PieChart,
  TrendingUp,
  Users,
  PackageCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

import type {
  AdminRevenueTrendPoint,
  AdminOrderOverviewPoint,
  AdminCategoryRevenuePoint,
  AdminTopSeller,
} from "../../types/adminAnalyticsTypes";

type ChartData = Record<string, string | number>;

/* --------------------- ERROR BLOCK ---------------------- */
const ErrorBlock = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-40 text-red-600 text-sm font-semibold bg-background border border-border rounded-lg">
    {message}
  </div>
);

/* --------------------- MAIN COMPONENT ---------------------- */
export const DashboardCharts = ({
  revenueTrend,
  revenueTrendLoading,
  revenueTrendError,

  orderOverview,
  orderOverviewLoading,
  orderOverviewError,

  categoryRevenue,
  categoryRevenueLoading,
  categoryRevenueError,

  topSellers,
  topSellersLoading,
  topSellersError,
}: {
  revenueTrend: AdminRevenueTrendPoint[];
  revenueTrendLoading: boolean;
  revenueTrendError: boolean;

  orderOverview: AdminOrderOverviewPoint[];
  orderOverviewLoading: boolean;
  orderOverviewError: boolean;

  categoryRevenue: AdminCategoryRevenuePoint[];
  categoryRevenueLoading: boolean;
  categoryRevenueError: boolean;

  topSellers: AdminTopSeller[];
  topSellersLoading: boolean;
  topSellersError: boolean;
}) => {
  const primaryLight = "#D7CCC8";
  const errorLight = "#FCA5A5";
  const white = "#FFFFFF";
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

  const Skeleton = ({ height }: { height: number }) => (
    <div
      className="bg-background rounded-xl p-6 shadow animate-pulse"
      style={{ height }}
    />
  );

 
  let revenueTrendChart;

  if (revenueTrendLoading) {
    revenueTrendChart = <Skeleton height={320} />;
  } else if (revenueTrendError) {
    revenueTrendChart = <ErrorBlock message="Failed to load Revenue Trend" />;
  } else {
    revenueTrendChart = (
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
  }

  /* ---------------------- CATEGORY PIE ---------------------- */
  let categoryPieChart;

  if (categoryRevenueLoading) {
    categoryPieChart = <Skeleton height={320} />;
  } else if (categoryRevenueError) {
    categoryPieChart = <ErrorBlock message="Failed to load Category Revenue" />;
  } else {
    categoryPieChart = (
      <ResponsiveContainer width="100%" height={320}>
        <RechartsPieChart>
          <Pie
            data={categoryRevenue as unknown as ChartData[]}
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
  }

  /* ---------------------- ORDER OVERVIEW ---------------------- */
  let orderOverviewChart;

  if (orderOverviewLoading) {
    orderOverviewChart = <Skeleton height={350} />;
  } else if (orderOverviewError) {
    orderOverviewChart = <ErrorBlock message="Failed to load Order Overview" />;
  } else {
    orderOverviewChart = (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={orderOverview}>
          <CartesianGrid strokeDasharray="1 1" stroke={gray200} />

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

          <Bar dataKey="success" fill={gray600} radius={[6, 6, 0, 0]} />
          <Bar dataKey="cancelled" fill={gray300} radius={[6, 6, 0, 0]} />
          <Bar dataKey="failed" fill={errorLight} radius={[6, 6, 0, 0]} />

          <Line
            dataKey="aov"
            stroke={gray300}
            strokeWidth={3}
            dot={{ fill: gray300, stroke: white, r: 5 }}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  /* ---------------------- TOP SELLERS ---------------------- */
  let topSellersChart;

  if (topSellersLoading) {
    topSellersChart = <Skeleton height={380} />;
  } else if (topSellersError) {
    topSellersChart = <ErrorBlock message="Failed to load Top Sellers" />;
  } else {
    topSellersChart = (
      <ResponsiveContainer width="100%" height={380}>
        <BarChart data={topSellers} layout="vertical">
          <CartesianGrid strokeDasharray="1 1" stroke={gray200} />

          <XAxis type="number" tick={{ fill: gray600 }} axisLine={{ stroke: gray200 }} />
          <YAxis
            dataKey="sellerName"
            type="category"
            width={140}
            tick={{ fill: gray700, fontSize: 13, fontWeight: 600 }}
          />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: `1px solid ${gray300}`,
              backgroundColor: white,
            }}
          />

          <Bar dataKey="revenue" fill={gray300} radius={[6, 6, 6, 6]} barSize={24} />
          <LabelList dataKey="orders" position="right" fill={gray600} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <>
      {/* REVENUE + CATEGORY */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="lg:col-span-2 bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-semibold">Revenue Trend</h2>
          </div>
          {revenueTrendChart}
        </div>

        {/* Category Revenue */}
        <div className="bg-background rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChart className="h-5 w-5 text-primary-400" />
            <h2 className="text-xl font-semibold">Revenue by Category</h2>
          </div>
          {categoryPieChart}
        </div>
      </div>

      {/* ORDER OVERVIEW */}
      <div className="bg-background rounded-xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <PackageCheck className="h-5 w-5 text-primary-400" />
          <h2 className="text-xl font-semibold">Order Overview</h2>
        </div>
        {orderOverviewChart}
      </div>

      {/* TOP SELLERS */}
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
