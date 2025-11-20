import React from "react";
import { SellerDashCards } from "../../components/Seller/SellerDashCards";
import { SellerDashboardCharts } from "../../components/Seller/SellerDashboardCharts";
import { SellerDashboardTables } from "../../components/Seller/SellerDashboardTables";
import {
  useCouponUsage,
  useLowStockItems,
  useOrderStatus,
  useProductPerformance,
  useSellerOverview,
  useSellerRevenueTrend,
  useTopSellingProducts,
} from "../../hooks/Seller/useSellerDashboard";

const SellerDashboard: React.FC = () => {
  const KpiCardsSkeleton = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 bg-background p-4 rounded-xl">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-sm animate-pulse"
          >
            <div className="flex items-center gap-3">
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-gray-300 rounded-xl" />

              {/* Title placeholder */}
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-gray-300 rounded-md mb-2" />
                <div className="h-5 w-1/2 bg-gray-200 rounded-md" />
              </div>
            </div>

            {/* Optional subtitle placeholder */}
            <div className="mt-4 h-4 w-1/2 bg-gray-200 rounded-md" />
          </div>
        ))}
      </div>
    );
  };

  const SellerDashboardTablesSkeleton = () => {
    const TableSkeleton = () => (
      <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100 animate-pulse">
        <div className="bg-primary-300 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
            <div className="h-5 w-40 bg-white/30 rounded"></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <th key={i} className="px-6 py-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i}>
                  {[1, 2, 3, 4, 5, 6].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );

    return (
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <TableSkeleton />
        <TableSkeleton />
      </div>
    );
  };

  const { data: overview, isLoading: loadingOverview } = useSellerOverview();

  const { data: revenueTrend, isLoading: loadingRevenue } =
    useSellerRevenueTrend();

  const { data: orderStatus, isLoading: loadingOrderStatus } = useOrderStatus();

  const { data: productSales = [], isLoading: loadingProductSales } =
    useTopSellingProducts();

  const { data: couponPerformance = [], isLoading: loadingCouponPerformance } =
    useCouponUsage();

  const { data: lowProducts, isLoading: loadingLowProducts } =
    useLowStockItems();

  const { data: productsPerformance, isLoading: loadingProductsPerformance } =
    useProductPerformance();

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
          {loadingOverview ? (
            <KpiCardsSkeleton />
          ) : overview ? (
            <SellerDashCards data={overview} />
          ) : null}
          <SellerDashboardCharts
            revenueTrend={revenueTrend ?? []}
            loadingRevenue={loadingRevenue}
            productSales={productSales}
            loadingProductSales={loadingProductSales}
            orderStatus={
              orderStatus ?? {
                delivered: 0,
                pending: 0,
                shipped: 0,
                cancelled: 0,
              }
            }
            loadingOrderStatus={loadingOrderStatus}
            couponPerformance={couponPerformance}
            loadingCouponPerformance={loadingCouponPerformance}
          />
          {loadingLowProducts || loadingProductsPerformance ? (
            <SellerDashboardTablesSkeleton />
          ) : (
            <SellerDashboardTables
              productPerformance={productsPerformance ?? []}
              lowStock={lowProducts ?? []}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SellerDashboard;
