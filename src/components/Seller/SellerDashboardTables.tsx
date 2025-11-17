import React from "react";
import { BarChart3, AlertTriangle, ShoppingBag } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface OrderData {
  orderId: string;
  product: string;
  customer: string;
  qty: number;
  price: number;
  status: string;
  paymentStatus: string;
  lastUpdated: string;
}

interface ProductPerformanceData {
  id: number;
  img: string;
  productName: string;
  views: number;
  sold: number;
  conversion: string;
  stock: number;
  status: string;
}

interface LowStockData {
  product: string;
  sku: string;
  currentStock: number;
  reorderLevel: number;
}

interface SellerDashboardTablesProps {
  orders: OrderData[];
  productPerformance: ProductPerformanceData[];
  lowStock: LowStockData[];
}

// TanStack Table for Orders
const columnHelperOrders = createColumnHelper<OrderData>();
const columnsOrders = [
  columnHelperOrders.accessor("orderId", { header: "Order ID", cell: (info) => info.getValue() }),
  columnHelperOrders.accessor("product", { header: "Product", cell: (info) => info.getValue() }),
  columnHelperOrders.accessor("customer", { header: "Customer Name", cell: (info) => info.getValue() }),
  columnHelperOrders.accessor("qty", { header: "Qty", cell: (info) => info.getValue() }),
  columnHelperOrders.accessor("price", { header: "Price", cell: (info) => `₹${info.getValue().toLocaleString()}` }),
  columnHelperOrders.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            status === "Delivered" ? "bg-green-100 text-green-800" :
            status === "Shipped" ? "bg-blue-100 text-blue-800" :
            status === "Pending" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  }),
  columnHelperOrders.accessor("paymentStatus", { header: "Payment Status", cell: (info) => info.getValue() }),
  columnHelperOrders.accessor("lastUpdated", { header: "Last Updated", cell: (info) => info.getValue() }),
];

// TanStack Table for Product Performance
const columnHelperProductPerformance = createColumnHelper<ProductPerformanceData>();
const columnsProductPerformance = [
  columnHelperProductPerformance.display({
    id: "image",
    header: "Image",
    cell: ({ row }) => (
      <img src={row.original.img} alt={row.original.productName} className="w-10 h-10 rounded-lg object-cover" />
    ),
  }),
  columnHelperProductPerformance.accessor("productName", { header: "Product Name", cell: (info) => info.getValue() }),
  columnHelperProductPerformance.accessor("views", { header: "Views", cell: (info) => info.getValue() }),
  columnHelperProductPerformance.accessor("sold", { header: "Units Sold", cell: (info) => info.getValue() }),
  columnHelperProductPerformance.accessor("conversion", { header: "Conversion Rate", cell: (info) => info.getValue() }),
  columnHelperProductPerformance.accessor("stock", { header: "Stock", cell: (info) => info.getValue() }),
  columnHelperProductPerformance.accessor("status", { header: "Approval Status", cell: (info) => info.getValue() }),
];

// TanStack Table for Low Stock
const columnHelperLowStock = createColumnHelper<LowStockData>();
const columnsLowStock = [
  columnHelperLowStock.accessor("product", { header: "Product", cell: (info) => info.getValue() }),
  columnHelperLowStock.accessor("sku", { header: "SKU", cell: (info) => info.getValue() }),
  columnHelperLowStock.accessor("currentStock", { header: "Current Stock", cell: (info) => info.getValue() }),
  columnHelperLowStock.accessor("reorderLevel", { header: "Reorder Level", cell: (info) => info.getValue() }),
];

export const SellerDashboardTables: React.FC<SellerDashboardTablesProps> = ({
  orders,
  productPerformance,
  lowStock,
}) => {
  // Create tables
  const tableOrders = useReactTable({
    data: orders,
    columns: columnsOrders,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableProductPerformance = useReactTable({
    data: productPerformance,
    columns: columnsProductPerformance,
    getCoreRowModel: getCoreRowModel(),
  });

  const tableLowStock = useReactTable({
    data: lowStock,
    columns: columnsLowStock,
    getCoreRowModel: getCoreRowModel(),
  });

  const OrdersTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Orders</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableOrders.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableOrders.getRowModel().rows.map((row) => (
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

  const ProductPerformanceTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Product Performance</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableProductPerformance.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableProductPerformance.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id === "productName" ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"}
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

  const LowStockTable = () => (
    <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
      <div className="bg-primary-300 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-white">Low Stock Items</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {tableLowStock.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableLowStock.getRowModel().rows.map((row) => (
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

  return (
    <>
      {/* Row 4: Product Performance and Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <ProductPerformanceTable />
        <LowStockTable />
      </div>

      {/* Row 5: Orders Table */}
      <div className="w-full">
        <OrdersTable />
      </div>
    </>
  );
};