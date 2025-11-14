import React from "react";
import { BarChart3, TrendingDown, Package, ShoppingBag } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface TopProductData {
  id: number;
  name: string;
  img: string;
  category: string;
  sold: number;
  revenue: number;
  conversionRate: number;
}

interface WorstProductData {
  id: number;
  name: string;
  img: string;
  views: number;
  sold: number;
  conversionRate: number;
}

interface PendingProductData {
  id: number;
  name: string;
  seller: string;
  date: string;
  img: string;
  category: string;
}

interface RecentOrderData {
  orderId: string;
  customerName: string;
  amount: number;
  status: string;
  paymentMethod: string;
  createdDate: string;
}

interface DashboardTablesProps {
  topProducts: TopProductData[];
  worstProducts: WorstProductData[];
  pendingProducts: PendingProductData[];
  recentOrders: RecentOrderData[];
}

// TanStack Table for Top Products
const columnHelperTopProducts = createColumnHelper<TopProductData>();
const columnsTopProducts = [
  columnHelperTopProducts.display({
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.img}
        alt={row.original.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
    ),
  }),
  columnHelperTopProducts.accessor("name", {
    header: "Product Name",
    cell: (info) => info.getValue(),
  }),
  columnHelperTopProducts.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelperTopProducts.accessor("sold", {
    header: "Units Sold",
    cell: (info) => info.getValue(),
  }),
  columnHelperTopProducts.accessor("revenue", {
    header: "Revenue",
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
  }),
  columnHelperTopProducts.accessor("conversionRate", {
    header: "Conversion Rate",
    cell: (info) => `${info.getValue()}%`,
  }),
];

// TanStack Table for Worst Products
const columnHelperWorstProducts = createColumnHelper<WorstProductData>();
const columnsWorstProducts = [
  columnHelperWorstProducts.display({
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.img}
        alt={row.original.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
    ),
  }),
  columnHelperWorstProducts.accessor("name", {
    header: "Product Name",
    cell: (info) => info.getValue(),
  }),
  columnHelperWorstProducts.accessor("views", {
    header: "Views",
    cell: (info) => info.getValue(),
  }),
  columnHelperWorstProducts.accessor("sold", {
    header: "Sales",
    cell: (info) => info.getValue(),
  }),
  columnHelperWorstProducts.accessor("conversionRate", {
    header: "Conversion Rate",
    cell: (info) => `${info.getValue()}%`,
  }),
];

// TanStack Table for Pending Products
const columnHelperPendingProducts = createColumnHelper<PendingProductData>();
const columnsPendingProducts = [
  columnHelperPendingProducts.display({
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <img
        src={row.original.img}
        alt={row.original.name}
        className="w-10 h-10 rounded-lg object-cover"
      />
    ),
  }),
  columnHelperPendingProducts.accessor("name", {
    header: "Product Name",
    cell: (info) => info.getValue(),
  }),
  columnHelperPendingProducts.accessor("seller", {
    header: "Seller",
    cell: (info) => info.getValue(),
  }),
  columnHelperPendingProducts.accessor("category", {
    header: "Category",
    cell: (info) => info.getValue(),
  }),
  columnHelperPendingProducts.accessor("date", {
    header: "Submitted",
    cell: (info) => info.getValue(),
  }),
  columnHelperPendingProducts.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex space-x-2">
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs">Approve</button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Reject</button>
      </div>
    ),
  }),
];

// TanStack Table for Recent Orders
const columnHelperRecentOrders = createColumnHelper<RecentOrderData>();
const columnsRecentOrders = [
  columnHelperRecentOrders.accessor("orderId", {
    header: "Order ID",
    cell: (info) => info.getValue(),
  }),
  columnHelperRecentOrders.accessor("customerName", {
    header: "Customer",
    cell: (info) => info.getValue(),
  }),
  columnHelperRecentOrders.accessor("amount", {
    header: "Amount",
    cell: (info) => `₹${info.getValue().toLocaleString()}`,
  }),
  columnHelperRecentOrders.accessor("paymentMethod", {
    header: "Payment Method",
    cell: (info) => info.getValue(),
  }),
  columnHelperRecentOrders.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            status === "Delivered"
              ? "bg-green-100 text-green-800"
              : status === "Pending"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelperRecentOrders.accessor("createdDate", {
    header: "Created",
    cell: (info) => info.getValue(),
  }),
];

export const DashboardTables: React.FC<DashboardTablesProps> = ({
  topProducts,
  worstProducts,
  pendingProducts,
  recentOrders,
}) => {
  // Create tables
  const tableTopProducts = useReactTable({
    data: topProducts,
    columns: columnsTopProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableWorstProducts = useReactTable({
    data: worstProducts,
    columns: columnsWorstProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const tablePendingProducts = useReactTable({
    data: pendingProducts,
    columns: columnsPendingProducts,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableRecentOrders = useReactTable({
    data: recentOrders,
    columns: columnsRecentOrders,
    getCoreRowModel: getCoreRowModel(),
  });

  const TopProductsTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Top Selling Products</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableTopProducts.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableTopProducts.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id === "name" ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
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

  const WorstProductsTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Worst Performing Products</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableWorstProducts.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableWorstProducts.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id === "name" ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
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

  const PendingProductsTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Package className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Pending Product Approvals</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tablePendingProducts.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tablePendingProducts.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id === "name" ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
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

  const RecentOrdersTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Recent Orders</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableRecentOrders.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRecentOrders.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id === "orderId" || cell.column.id === "amount" ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
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

  return (
    <>
      {/* Row 4: Top and Worst Products */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <TopProductsTable />
        <WorstProductsTable />
      </div>

      {/* Row 5: Pending and Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6">
        <PendingProductsTable />
        <RecentOrdersTable />
      </div>
    </>
  );
};