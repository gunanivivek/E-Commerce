// src/components/AdminAnalytics/KpiCards.tsx

import React from "react";
import {
  Users,
  ShoppingBag,
  Package,
  AlertCircle,
  Tag,
  Rocket,
} from "lucide-react";
import type { AdminKpiData } from "../../types/adminAnalyticsTypes";

/* -------------------------
   ERROR & SKELETON
------------------------- */
const ErrorBlock = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-28 text-red-600 text-sm font-semibold bg-background border border-border rounded-lg">
    {message}
  </div>
);

const KpiSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 bg-background p-4 rounded-xl">
    {Array(4)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="bg-white p-4 rounded-xl shadow h-28 animate-pulse" />
      ))}
  </div>
);

/* -------------------------
   KPI CARD
------------------------- */
interface KpiCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  isPositive = true,
}) => (
  <div className="group relative bg-white rounded-lg shadow-sm border-border p-3 overflow-hidden hover:shadow-md hover:border-accent-light transition-all duration-300 cursor-pointer h-full">
    <div className="flex items-start justify-between mb-2 relative z-10">
      <div className="w-8 h-8 bg-primary-100/50 rounded-full flex items-center justify-center shadow-sm">
        <Icon className="h-4 w-4 text-primary-500" />
      </div>
      {trend && (
        <div
          className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isPositive
              ? "text-success bg-success/10 border-success/20"
              : "text-error bg-error/10 border-error/20"
          }`}
        >
          {trend}
        </div>
      )}
    </div>

    <h3 className="text-xl font-heading font-bold text-text-primary mb-1">{value}</h3>
    <p className="text-xs text-text-secondary">{title}</p>
    {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
  </div>
);


export const KpiCards: React.FC<{ data?: AdminKpiData; loading: boolean; error?: boolean }> = ({
  data,
  loading,
  error = false,
}) => {
  if (loading) return <KpiSkeleton />;
  if (error) return <ErrorBlock message="Failed to load Insights" />;
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 bg-background p-4 rounded-xl">
      <KpiCard
        icon={Rocket}
        title="Total Revenue"
        value={`₹${data.totalRevenue.toLocaleString()}`}
        subtitle="This Month"
        trend="+13.6% vs last month"
        isPositive
      />

      <KpiCard
        icon={ShoppingBag}
        title="Total Orders"
        value={data.totalOrders.toString()}
        subtitle="This Month"
        trend="+7.1% vs last month"
        isPositive
      />

      <KpiCard
        icon={Users}
        title="Active Customers"
        value={data.totalCustomers.toString()}
        subtitle={`+${data.newCustomers30Days} new`}
      />

      <KpiCard
        icon={Users}
        title="Active Sellers"
        value={data.approvedSellers.toString()}
        subtitle={`${data.pendingSellers} pending`}
      />

      <KpiCard
        icon={Package}
        title="Total Products"
        value={data.approvedProducts.toString()}
        subtitle={`${data.pendingProducts} pending`}
      />

      <KpiCard
        icon={AlertCircle}
        title="Failed Payments"
        value={data.failedPaymentsToday.toString()}
        subtitle={`${data.failedPaymentRate}% rate`}
        trend="+0.5%"
        isPositive={false}
      />

      <KpiCard
        icon={Tag}
        title="Coupons Used"
        value={data.couponUsages.toString()}
        subtitle={`₹${data.totalDiscountGiven.toLocaleString()} discount`}
      />
    </div>
  );
};
