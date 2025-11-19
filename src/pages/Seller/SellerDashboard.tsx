import React, { useEffect } from "react";
import { SellerDashCards } from "../../components/Seller/SellerDashCards";
import { SellerDashboardCharts } from "../../components/Seller/SellerDashboardCharts";
import { SellerDashboardTables } from "../../components/Seller/SellerDashboardTables";
import { useCouponUsage, useLowStockItems, useOrderStatus, useProductPerformance, useSellerOverview, useSellerRevenueTrend, useTopSellingProducts } from "../../hooks/Seller/useSellerDashboard";






const SellerDashboard: React.FC = () => {
  
  const { data: overview, isLoading: loadingOverview } = useSellerOverview();

  const { data: revenueTrend, isLoading: loadingRevenue } = useSellerRevenueTrend();

  const { data: orderStatus, isLoading: loadingOrderStatus } = useOrderStatus();

  const { data: productSales = [], isLoading: loadingProductSales } = useTopSellingProducts();

  const { data: couponPerformance = [], isLoading: loadingCouponPerformance } = useCouponUsage();

  const { data: lowProducts, isLoading: loadingLowProducts } = useLowStockItems();

  const { data: productsPerformance, isLoading: loadingProductsPerformance } = useProductPerformance();
  
  useEffect(() => {
    // In real app, fetch data here
  }, []);

   if(loadingOverview){
    return <div>Loading....</div>
  }

  if(loadingProductsPerformance){
    return <div>Loading....</div>
  }

  if(loadingLowProducts){
    return <div>Loading....</div>
  }

  if(loadingProductSales){
    return <div>Loading....</div>
  }

  if(loadingRevenue){
    return <div>Loading....</div>
  }

  if(loadingOrderStatus){
    return <div>Loading Orders Status....</div>
  }

   if(loadingCouponPerformance){
    return <div>Loading Coupon Status....</div>
  }


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
          {overview && <SellerDashCards data={overview} />}
          <SellerDashboardCharts
            revenueTrend={revenueTrend ?? []}
            productSales={productSales}
            orderStatus={orderStatus ?? { delivered:0, pending:0, shipped:0, cancelled:0 }}
            couponPerformance={couponPerformance}
          />
          <SellerDashboardTables
            productPerformance={productsPerformance ?? []}
            lowStock={lowProducts ?? []}
          />
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
