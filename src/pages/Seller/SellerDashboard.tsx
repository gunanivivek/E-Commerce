import React, { useEffect, useState } from "react";
import { SellerDashCards } from "../../components/Seller/SellerDashCards";
import { SellerDashboardCharts } from "../../components/Seller/SellerDashboardCharts";
import { SellerDashboardTables } from "../../components/Seller/SellerDashboardTables";

// Mock data based on blueprint
const mockSellerKpiData = {
  todayRevenue: 2400,
  yesterdayRevenue: 1800,
  monthlyRevenue: 46000,
  lastMonthRevenue: 39000,
  totalOrders: 520,
  delivered: 420,
  pending: 50,
  pendingShipments: 35,
  activeProducts: 120,
  pendingApproval: 8,
  lowStockCount: 14,
  couponUsage: 112,
  discountTotal: 4800,
  productViews: 1250,
  conversionRate: 4.2,
};

const mockRevenueTrendData = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 17000 },
  { month: "Mar", revenue: 19000 },
  { month: "Apr", revenue: 21000 },
  { month: "May", revenue: 23000 },
  { month: "Jun", revenue: 25000 },
  { month: "Jul", revenue: 27000 },
  { month: "Aug", revenue: 29000 },
  { month: "Sep", revenue: 31000 },
  { month: "Oct", revenue: 33000 },
  { month: "Nov", revenue: 35000 },
  { month: "Dec", revenue: 37000 },
];

const mockProductSalesData = [
  { productName: "T-shirt", unitsSold: 240 },
  { productName: "Shoes", unitsSold: 180 },
  { productName: "Jacket", unitsSold: 120 },
  { productName: "Hat", unitsSold: 90 },
  { productName: "Bag", unitsSold: 60 },
];

const mockOrderStatusData = {
  pending: 20,
  processing: 40,
  shipped: 60,
  delivered: 300,
  cancelled: 10,
};

const mockCouponPerformanceData = [
  { code: "NEW50", usage: 45 },
  { code: "SAVE10", usage: 18 },
  { code: "FALL20", usage: 25 },
  { code: "WELCOME", usage: 24 },
];

const mockOrdersData = [
  {
    orderId: "OD1122",
    product: "T-shirt",
    customer: "Pratik",
    qty: 2,
    price: 900,
    status: "Shipped",
    paymentStatus: "Paid",
    lastUpdated: "2025-11-13",
  },
  {
    orderId: "OD1123",
    product: "Shoes",
    customer: "Amit",
    qty: 1,
    price: 1500,
    status: "Delivered",
    paymentStatus: "Paid",
    lastUpdated: "2025-11-12",
  },
  {
    orderId: "OD1124",
    product: "Jacket",
    customer: "Sneha",
    qty: 1,
    price: 2000,
    status: "Pending",
    paymentStatus: "Pending",
    lastUpdated: "2025-11-14",
  },
];

const mockProductPerformanceData = [
  {
    id: 1,
    img: "https://via.placeholder.com/50",
    productName: "Jacket",
    views: 1500,
    sold: 80,
    conversion: "5.3%",
    stock: 20,
    status: "Approved",
  },
  {
    id: 2,
    img: "https://via.placeholder.com/50",
    productName: "T-shirt",
    views: 2000,
    sold: 240,
    conversion: "12.0%",
    stock: 50,
    status: "Approved",
  },
  {
    id: 3,
    img: "https://via.placeholder.com/50",
    productName: "Shoes",
    views: 1200,
    sold: 180,
    conversion: "15.0%",
    stock: 10,
    status: "Approved",
  },
];

const mockLowStockData = [
  {
    product: "Hat",
    sku: "HAT-001",
    currentStock: 5,
    reorderLevel: 10,
  },
  {
    product: "Bag",
    sku: "BAG-002",
    currentStock: 3,
    reorderLevel: 15,
  },
  {
    product: "Socks",
    sku: "SOCK-003",
    currentStock: 8,
    reorderLevel: 20,
  },
];

const SellerDashboard: React.FC = () => {
  const [data] = useState({
    kpi: mockSellerKpiData,
    revenueTrend: mockRevenueTrendData,
    productSales: mockProductSalesData,
    orderStatus: mockOrderStatusData,
    couponPerformance: mockCouponPerformanceData,
    orders: mockOrdersData,
    productPerformance: mockProductPerformanceData,
    lowStock: mockLowStockData,
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
            Overview of your store's performance
          </p>
        </div>
      </div>
      <div className="min-h-screen  to-primary-50 py-6">
        <div className="container mx-auto space-y-6 px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SellerDashCards data={data.kpi} />
          <SellerDashboardCharts
            revenueTrend={data.revenueTrend}
            productSales={data.productSales}
            orderStatus={data.orderStatus}
            couponPerformance={data.couponPerformance}
          />
          <SellerDashboardTables
            orders={data.orders}
            productPerformance={data.productPerformance}
            lowStock={data.lowStock}
          />
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
