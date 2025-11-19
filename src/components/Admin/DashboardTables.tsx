import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  type Table,
  type HeaderGroup,
  type Row,
} from "@tanstack/react-table";

import type {
  AdminTopProduct,
  AdminWorstProduct,
  AdminRecentOrder,
} from "../../types/adminAnalyticsTypes";

import { BarChart3, TrendingDown, ShoppingBag } from "lucide-react";

const ErrorBlock = ({ message }: { message: string }) => (
  <div className="flex items-center justify-center h-40 text-red-600 text-sm font-semibold bg-background border border-border rounded-lg">
    {message}
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
    <div className="space-y-3">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
    </div>
  </div>
);

const columnHelperTop = createColumnHelper<AdminTopProduct>();
const columnsTopProducts = [
  columnHelperTop.accessor("id", { header: "Product Id" }),

  columnHelperTop.accessor("name", {
    header: "Product Name",
    cell: (info) => {
      const name = info.getValue();
      return name.length > 25 ? name.substring(0, 25) + "..." : name;
    },
  }),

  columnHelperTop.accessor("category", { header: "Category" }),
  columnHelperTop.accessor("sold", { header: "Units Sold" }),

  columnHelperTop.accessor("revenue", {
    header: "Revenue",
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
  }),
];

const columnHelperWorst = createColumnHelper<AdminWorstProduct>();
const columnsWorstProducts = [
  columnHelperWorst.accessor("id", { header: "Product Id" }),

  columnHelperWorst.accessor("name", {
    header: "Product Name",
    cell: (info) => {
      const name = info.getValue();
      return name.length > 25 ? name.substring(0, 25) + "..." : name;
    },
  }),

  columnHelperWorst.accessor("category", { header: "Category" }),

  columnHelperWorst.accessor("sold", { header: "Units Sold" }),

  columnHelperWorst.accessor("revenue", {
    header: "Revenue",
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
  }),
];

const columnHelperOrders = createColumnHelper<AdminRecentOrder>();
const columnsRecentOrders = [
  columnHelperOrders.accessor("orderId", { header: "Order ID" }),

  columnHelperOrders.accessor("customerName", {
    header: "Customer",
    cell: (info) => {
      const name = info.getValue();
      return name.length > 20 ? name.substring(0, 20) + "..." : name;
    },
  }),

  columnHelperOrders.accessor("amount", {
    header: "Amount",
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
  }),

  columnHelperOrders.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status.toLowerCase(); // normalize

      const badgeClass =
        status === "delivered"
          ? "bg-green-100 text-green-800"
          : status === "pending"
          ? "bg-yellow-100 text-yellow-800"
          : status === "cancelled" ||
            status === "canceled" ||
            status === "cancel"
          ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800"; // fallback

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badgeClass}`}
        >
          {row.original.status}
        </span>
      );
    },
  }),

  columnHelperOrders.accessor("createdDate", { header: "Created" }),
];

const AnalyticsTableCard = <T,>({
  title,
  icon,
  table,
}: {
  title: string;
  icon: React.ReactNode;
  table: Table<T>;
}) => (
  <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
    <div className="bg-primary-300 p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row: Row<T>) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const DashboardTables = ({
  topProducts,
  worstProducts,
  recentOrders,

  topProductsLoading,
  topProductsError,

  worstProductsLoading,
  worstProductsError,

  recentOrdersLoading,
  recentOrdersError,
}: {
  topProducts?: AdminTopProduct[];
  worstProducts?: AdminWorstProduct[];
  recentOrders?: AdminRecentOrder[];

  topProductsLoading: boolean;
  topProductsError: boolean;

  worstProductsLoading: boolean;
  worstProductsError: boolean;

  recentOrdersLoading: boolean;
  recentOrdersError: boolean;
}) => {
  const tableTop = useReactTable({
    data: topProducts || [],
    columns: columnsTopProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableWorst = useReactTable({
    data: worstProducts || [],
    columns: columnsWorstProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableOrders = useReactTable({
    data: recentOrders || [],
    columns: columnsRecentOrders,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* TOP + WORST PRODUCTS */}
      <div className="flex flex-col gap-6 mb-8">
        {topProductsLoading ? (
          <TableSkeleton />
        ) : topProductsError ? (
          <ErrorBlock message="Failed to load top products" />
        ) : (
          <AnalyticsTableCard
            title="Top Selling Products"
            icon={<BarChart3 className="text-white" />}
            table={tableTop}
          />
        )}

        {worstProductsLoading ? (
          <TableSkeleton />
        ) : worstProductsError ? (
          <ErrorBlock message="Failed to load worst products" />
        ) : (
          <AnalyticsTableCard
            title="Worst Performing Products"
            icon={<TrendingDown className="text-white" />}
            table={tableWorst}
          />
        )}
      </div>

      {/* RECENT ORDERS */}
      {recentOrdersLoading ? (
        <TableSkeleton />
      ) : recentOrdersError ? (
        <ErrorBlock message="Failed to load recent orders" />
      ) : (
        <AnalyticsTableCard
          title="Recent Orders"
          icon={<ShoppingBag className="text-white" />}
          table={tableOrders}
        />
      )}
    </>
  );
};
