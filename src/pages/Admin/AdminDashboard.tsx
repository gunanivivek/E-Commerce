// src/pages/Admin/AdminDashboard.tsx

import React from "react";

import { useAdminAnalytics } from "../../hooks/useAdminAnalytics";
import { adminAnalyticsStore } from "../../store/Admin/adminAnalyticsStore";
import { KpiCards } from "../../components/Admin/AdminDashCards";
import { DashboardCharts } from "../../components/Admin/DashboardCharts";
import { DashboardTables } from "../../components/Admin/DashboardTables";

const AdminDashboard: React.FC = () => {
  const {
    kpisQuery,
    chartsQuery,
    productsPerformanceQuery,
    recentOrdersQuery,
  } = useAdminAnalytics();

  // read data from store (will be populated by useAdminAnalytics)
  const {
    kpis,
    revenueTrend,
    orderOverview,
    categoryRevenue,
    topSellers,
    topProducts,
    worstProducts,
    recentOrders,
  } = adminAnalyticsStore();

  return (
    <>
      {/* Header */}
      <div className="pt-6 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
            Analytics Dashboard
          </h1>
          <p className="text-primary-300 text-sm sm:text-base">
            Overview of the platform's performance
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-screen py-6">
        <div className="container space-y-6 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* KPI CARDS */}
          <KpiCards
            data={kpis}
            loading={kpisQuery.isLoading}
            error={kpisQuery.isError}
          />

          {/* CHARTS: pass per-chart loading + error flags */}
          <DashboardCharts
            revenueTrend={revenueTrend || []}
            orderOverview={orderOverview || []}
            categoryRevenue={categoryRevenue || []}
            topSellers={topSellers || []}
            revenueTrendLoading={chartsQuery.isLoading}
            orderOverviewLoading={chartsQuery.isLoading}
            categoryRevenueLoading={chartsQuery.isLoading}
            topSellersLoading={chartsQuery.isLoading}
            revenueTrendError={chartsQuery.isError}
            orderOverviewError={chartsQuery.isError}
            categoryRevenueError={chartsQuery.isError}
            topSellersError={chartsQuery.isError}
          />

          <DashboardTables
            topProducts={topProducts || []}
            worstProducts={worstProducts || []}
            recentOrders={recentOrders || []}
            topProductsLoading={productsPerformanceQuery.isLoading}
            topProductsError={productsPerformanceQuery.isError}
            worstProductsLoading={productsPerformanceQuery.isLoading}
            worstProductsError={productsPerformanceQuery.isError}
            recentOrdersLoading={recentOrdersQuery.isLoading}
            recentOrdersError={recentOrdersQuery.isError}
          />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
