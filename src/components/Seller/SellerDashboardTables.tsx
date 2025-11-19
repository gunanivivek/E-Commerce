import React from "react";
import { BarChart3, AlertTriangle } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";

interface ProductPerformanceData {
  product_id: number;
  product_name: string;
  sku: string;
  units_sold: number;
  stock: number;
  approval_status: string;
}

interface LowStockData {
  product_id: number;
  sku: string;
  stock: number;
}

interface SellerDashboardTablesProps {
  productPerformance: ProductPerformanceData[];
  lowStock: LowStockData[];
}

// TanStack Table for Orders

// TanStack Table for Product Performance
const columnHelperProductPerformance =
  createColumnHelper<ProductPerformanceData>();
const columnsProductPerformance = [
  columnHelperProductPerformance.accessor("product_id", {
    header: "Product ID",
    cell: (info) => info.getValue(),
  }),
  columnHelperProductPerformance.accessor("product_name", {
    header: "Product Name",
    cell: (info) => {
    const name = info.getValue();
    return name.length > 15 ? name.slice(0, 15) + "..." : name;
  },
  }),
  columnHelperProductPerformance.accessor("sku", {
    header: "SKU",
    cell: (info) => info.getValue(),
  }),
  columnHelperProductPerformance.accessor("units_sold", {
    header: "Units Sold",
    cell: (info) => info.getValue(),
  }),
  columnHelperProductPerformance.accessor("stock", {
    header: "Stock",
    cell: (info) => info.getValue(),
  }),
  columnHelperProductPerformance.accessor("approval_status", {
    header: "Approval Status",
    cell: (info) => info.getValue(),
  }),
];

// TanStack Table for Low Stock
const columnHelperLowStock = createColumnHelper<LowStockData>();
const columnsLowStock = [
  columnHelperLowStock.accessor("product_id", {
    header: "Product",
    cell: (info) => info.getValue(),
  }),
  columnHelperLowStock.accessor("sku", {
    header: "SKU",
    cell: (info) => info.getValue(),
  }),
  columnHelperLowStock.accessor("stock", {
    header: "Current Stock",
    cell: (info) => info.getValue(),
  }),
];

export const SellerDashboardTables: React.FC<SellerDashboardTablesProps> = ({
  productPerformance,
  lowStock,
}) => {
  // Create tables

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
            {tableProductPerformance.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={
                      cell.column.id === "productName"
                        ? "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        : "px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    }
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
    </>
  );
};
