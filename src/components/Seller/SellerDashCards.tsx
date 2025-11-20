import React from "react";
import {
  TrendingUp,
  ShoppingBag,
  PackageX,
  Archive,
  AlertTriangle,
  Tag,
} from "lucide-react";

interface SellerKpiData {
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
  coupon_usage: number;
  last_month_revenue: number;
  yesterday_revenue: number;
}

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
      <div className="w-8 h-8 bg-primary-100/50 rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-200/70 group-hover:scale-105 transition-all duration-200 border border-primary-200/30">
        <Icon className="h-4 w-4 text-primary-500 group-hover:text-primary-400 transition-colors" />
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

    <h3 className="text-xl font-heading font-black text-text-primary mb-1 tracking-tight group-hover:text-accent-dark transition-colors leading-tight">
      {value}
    </h3>

    <p className="text-xs text-text-secondary font-medium leading-tight">
      {title}
    </p>

    {subtitle && (
      <p className="text-xs text-text-muted mt-1 leading-tight">{subtitle}</p>
    )}
  </div>
);

interface SellerKpiCardsProps {
  data: SellerKpiData;
}

const calcTrend = (current: number, last: number) => {
  if (!last || last === 0) return { percent: 0, text: "0%" };

  const diff = current - last;
  const percent = (diff / last) * 100;

  return {
    percent,
    text: `${percent.toFixed(1)}%`,
  };
};

export const SellerDashCards: React.FC<SellerKpiCardsProps> = ({ data }) => {
  const monthlyTrend = calcTrend(data.monthly_revenue, data.last_month_revenue);
  const todaysTrend = calcTrend(data.todays_revenue, data.yesterday_revenue);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 bg-background p-4 rounded-xl">
      <KpiCard
        icon={TrendingUp}
        title="Total Revenue"
        value={`₹${data.total_revenue.toLocaleString()}`}
        isPositive
      />

      <KpiCard
        icon={TrendingUp}
        title="Monthly Revenue"
        value={`₹${data.monthly_revenue.toLocaleString()}`}
        trend={`${monthlyTrend.text} vs last month`}
        isPositive={monthlyTrend.percent >= 0}
      />

      <KpiCard
        icon={TrendingUp}
        title="Today's Revenue"
        value={`₹${data.todays_revenue.toLocaleString()}`}
        trend={`${todaysTrend.text} vs yesterday`}
        isPositive={todaysTrend.percent >= 0}
      />

      <KpiCard
        icon={ShoppingBag}
        title="Total Orders"
        value={data.total_orders.toString()}
        subtitle={`${data.delivered_orders} delivered, ${data.pending_orders} pending`}
      />

      <KpiCard
        icon={PackageX}
        title="Pending Shipments"
        value={data.pending_shipments.toString()}
      />

      <KpiCard
        icon={Archive}
        title="Active Products"
        value={data.active_products.toString()}
        subtitle={`${data.pending_approval_products} pending approval`}
      />

      <KpiCard
        icon={AlertTriangle}
        title="Low Stock Items"
        value={data.low_stock_items.toString()}
      />

      <KpiCard
        icon={Tag}
        title="Coupon Usage"
        value={data.coupon_usage.toString()}
      />
    </div>
  );
};
