import React, { useEffect, useState } from "react";
import { DashboardTables } from "../../components/Admin/DashboardTables";
import { KpiCards } from "../../components/Admin/AdminDashCards";
import { DashboardCharts } from "../../components/Admin/DashboardCharts";


const mockKPIData = {
  totalRevenue: 125000,
  lastMonthRevenue: 110000,
  totalOrders: 450,
  lastMonthOrders: 420,
  totalCustomers: 2500,
  newCustomers30Days: 150,
  approvedSellers: 120,
  pendingSellers: 15,
  approvedProducts: 850,
  pendingProducts: 25,
  failedPaymentsToday: 8,
  failedPaymentRate: 2.5,
  couponUsages: 120,
  totalDiscountGiven: 4500,
};

const mockRevenueTrendData = [
  { month: "Jan", revenue: 80000 },
  { month: "Feb", revenue: 85000 },
  { month: "Mar", revenue: 90000 },
  { month: "Apr", revenue: 95000 },
  { month: "May", revenue: 100000 },
  { month: "Jun", revenue: 105000 },
  { month: "Jul", revenue: 110000 },
  { month: "Aug", revenue: 115000 },
  { month: "Sep", revenue: 120000 },
  { month: "Oct", revenue: 122000 },
  { month: "Nov", revenue: 125000 },
  { month: "Dec", revenue: 130000 },
];

const mockOrderOverviewData = [
  { month: "Jan", success: 400, cancelled: 50, failed: 10, aov: 450 },
  { month: "Feb", success: 420, cancelled: 45, failed: 12, aov: 460 },
  { month: "Mar", success: 450, cancelled: 40, failed: 8, aov: 470 },
  { month: "Apr", success: 480, cancelled: 35, failed: 15, aov: 480 },
  { month: "May", success: 500, cancelled: 30, failed: 5, aov: 490 },
  { month: "Jun", success: 520, cancelled: 25, failed: 7, aov: 500 },
];

const mockCategoryRevenueData = [
  { category: "Electronics", revenue: 50000, color: "#3B82F6" },
  { category: "Fashion", revenue: 37500, color: "#10B981" },
  { category: "Home", revenue: 25000, color: "#F59E0B" },
  { category: "Others", revenue: 12500, color: "#EF4444" },
];

const mockTopSellersData = [
  { sellerName: "Seller A", revenue: 25000, orders: 120 },
  { sellerName: "Seller B", revenue: 20000, orders: 95 },
  { sellerName: "Seller C", revenue: 18000, orders: 80 },
  { sellerName: "Seller D", revenue: 15000, orders: 70 },
  { sellerName: "Seller E", revenue: 12000, orders: 60 },
];

const mockTopProductsData = [
  { id: 1, name: "iPhone 15", img: "https://via.placeholder.com/50", category: "Electronics", sold: 150, revenue: 225000, conversionRate: 12.5 },
  { id: 2, name: "Nike Shoes", img: "https://via.placeholder.com/50", category: "Fashion", sold: 120, revenue: 18000, conversionRate: 10.2 },
  { id: 3, name: "Sofa Set", img: "https://via.placeholder.com/50", category: "Home", sold: 80, revenue: 40000, conversionRate: 8.7 },
];

const mockWorstProductsData = [
  { id: 4, name: "Old Laptop", img: "https://via.placeholder.com/50", views: 500, sold: 5, conversionRate: 1.0 },
  { id: 5, name: "Vintage Shirt", img: "https://via.placeholder.com/50", views: 300, sold: 2, conversionRate: 0.7 },
  { id: 6, name: "Broken Chair", img: "https://via.placeholder.com/50", views: 200, sold: 0, conversionRate: 0.0 },
];

const mockPendingProductsData = [
  { id: 7, name: "New Gadget", seller: "Seller X", date: "2025-11-10", img: "https://via.placeholder.com/50", category: "Electronics" },
  { id: 8, name: "Dress", seller: "Seller Y", date: "2025-11-12", img: "https://via.placeholder.com/50", category: "Fashion" },
];

const mockRecentOrdersData = [
  { orderId: "#12345", customerName: "John Doe", amount: 4500, status: "Delivered", paymentMethod: "Card", createdDate: "2025-11-14" },
  { orderId: "#12346", customerName: "Jane Smith", amount: 2500, status: "Pending", paymentMethod: "UPI", createdDate: "2025-11-13" },
  { orderId: "#12347", customerName: "Bob Johnson", amount: 1800, status: "Cancelled", paymentMethod: "Cash", createdDate: "2025-11-12" },
];

const AdminDashboard: React.FC = () => {
  const [data] = useState({
    kpi: mockKPIData,
    revenueTrend: mockRevenueTrendData,
    orderOverview: mockOrderOverviewData,
    categoryRevenue: mockCategoryRevenueData,
    topSellers: mockTopSellersData,
    topProducts: mockTopProductsData,
    worstProducts: mockWorstProductsData,
    pendingProducts: mockPendingProductsData,
    recentOrders: mockRecentOrdersData,
  });

  useEffect(() => {
    // In real app, fetch data here
  }, []);

  return (
    <>
    <div className=" pt-6 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark">
           Analytics Dashboard
          </h1>
          <p className="text-primary-300 text-sm sm:text-base">
            Overview of the platform's performance
          </p>
        </div>
      </div>
      <div className="min-h-screen  py-6">
        <div className="container space-y-6 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <KpiCards data={data.kpi} />
          <DashboardCharts
            revenueTrend={data.revenueTrend}
            orderOverview={data.orderOverview}
            categoryRevenue={data.categoryRevenue}
            topSellers={data.topSellers}
          />
          <DashboardTables
            topProducts={data.topProducts}
            worstProducts={data.worstProducts}
            pendingProducts={data.pendingProducts}
            recentOrders={data.recentOrders}
          />
        </div>
      </div>
     
    </>
  );
};

export default AdminDashboard;