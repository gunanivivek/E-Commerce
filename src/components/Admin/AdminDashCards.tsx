import React from "react";
import {  Users, ShoppingBag, Package, AlertCircle, Tag, Rocket } from "lucide-react";

interface KpiData {
  totalRevenue: number;
  lastMonthRevenue: number;
  totalOrders: number;
  lastMonthOrders: number;
  totalCustomers: number;
  newCustomers30Days: number;
  approvedSellers: number;
  pendingSellers: number;
  approvedProducts: number;
  pendingProducts: number;
  failedPaymentsToday: number;
  failedPaymentRate: number;
  couponUsages: number;
  totalDiscountGiven: number;
}

interface KpiCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  isPositive?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, title, value, subtitle, trend, isPositive = true }) => (
  <div className="group relative bg-white rounded-lg shadow-sm  border-border p-3 overflow-hidden hover:shadow-md hover:border-accent-light transition-all duration-300 cursor-pointer h-full">
    {/* Subtle accent gradient overlay */}
    
    <div className="flex items-start justify-between mb-2 relative z-10">
      <div className="w-8 h-8 bg-primary-100/50 rounded-full flex items-center justify-center shadow-sm group-hover:bg-primary-200/70 group-hover:scale-105 transition-all duration-200 border border-primary-200/30">
        <Icon className="h-4 w-4 text-primary-500 group-hover:text-primary-400 transition-colors" />
      </div>
      {trend && (
        <div className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
          isPositive ? 'text-success bg-success/10 border-success/20' : 'text-error bg-error/10 border-error/20'
        }`}>
          {trend}
        </div>
      )}
    </div>

    <h3 className="text-xl font-heading font-black text-text-primary mb-1 tracking-tight group-hover:text-accent-dark transition-colors leading-tight">
      {value}
    </h3>
    <p className="text-xs text-text-secondary font-medium leading-tight">{title}</p>
    {subtitle && <p className="text-xs text-text-muted mt-1 leading-tight">{subtitle}</p>}
  </div>
);

interface KpiCardsProps {
  data: KpiData;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 bg-background p-4 rounded-xl">
    <KpiCard
      icon={Rocket}
      title="Total Revenue"
      value={`₹${data.totalRevenue.toLocaleString()}`}
      subtitle="This Month"
      trend={"+13.6% vs last month"}
      isPositive
    />

    <KpiCard
      icon={ShoppingBag}
      title="Total Orders"
      value={data.totalOrders.toString()}
      subtitle="This Month"
      trend={"+7.1% vs last month"}
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
      trend={"+0.5%"}
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