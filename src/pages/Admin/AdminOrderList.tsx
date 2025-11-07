import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";

import { useAdminOrderStore } from "../../store/Admin/adminOrderStore";
import { useFetchOrders } from "../../hooks/Admin/useFetchOrders";
import type { Order } from "../../types/admin";

import ViewOrderModal from "../../components/Admin/ViewOrderModal";
import TableRowSkeleton from "../../components/TableRowSkeleton";

const columnHelper = createColumnHelper<Order>();

const AdminOrderList: React.FC = () => {
  const { orders, loading, error } = useAdminOrderStore();
  useFetchOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleView = useCallback((id: number) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setIsModalOpen(true);
    }
  }, [orders]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredData = useMemo(() => {
    return orders.filter((o: Order) => {
      const matchesSearch =
        o.id.toString().includes(searchTerm.toLowerCase()) ||
        o.address.full_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter ? o.status === statusFilter : true;

      const matchesPayment = paymentStatusFilter
        ? o.payment_status === paymentStatusFilter
        : true;

      const matchesDateFrom = dateFrom ? o.created_at >= dateFrom : true;
      const matchesDateTo = dateTo ? o.created_at <= dateTo : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment &&
        matchesDateFrom &&
        matchesDateTo
      );
    });
  }, [orders, searchTerm, statusFilter, paymentStatusFilter, dateFrom, dateTo]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Order ID",
        cell: (info) => (
          <span className="font-medium text-primary-400">
            #{info.getValue()}
          </span>
        ),
      }),
    
      columnHelper.accessor("total_amount", {
        header: "Amount",
        cell: (info) => (
          <span className="text-primary-400">
            ₹{Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Order Status",
        cell: (info) => {
          const status = info.getValue();
          const map: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
            confirmed: "bg-indigo-100 text-indigo-700 border-indigo-300",
            shipped: "bg-blue-100 text-blue-700 border-blue-300",
            delivered: "bg-green-100 text-green-700 border-green-300",
            cancelled: "bg-red-100 text-red-700 border-red-300",
          };
          return (
            <span className={`px-3 py-1 border rounded-full text-xs font-medium ${map[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      }),
      columnHelper.accessor("payment_status", {
        header: "Payment",
        cell: (info) => (
          <span className="text-primary-400 capitalize">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
        cell: (info) => (
          <span className="text-primary-400">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }: { row: Row<Order> }) => (
          <button
            onClick={() => handleView(row.original.id)}
            className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
            title="View Order"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        ),
      }),
    ],
    [handleView]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  if (error)
    return <p className="text-center text-red-500 mt-10">Failed to load orders 😕</p>;

  return (
    <>
      <div className="min-h-screen py-4 sm:py-6">
        <div className="px-4 sm:px-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-400 mb-1">
              Order Management
            </h1>
            <p className="text-primary-400 text-xs sm:text-sm">
              View and manage customer orders.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">

            {/* Search + Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
              <h2 className="text-primary-400 font-semibold text-base sm:text-lg">
                All Orders
              </h2>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400/50 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 w-full border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-2 mb-4">
              <div className="flex flex-col min-w-[120px]">
                <label className="text-xs text-primary-400 mb-1">Order Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:ring-primary-500"
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex flex-col min-w-[120px]">
                <label className="text-xs text-primary-400 mb-1">Payment</label>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:ring-primary-500"
                >
                  <option value="">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              <div className="flex flex-col min-w-[130px]">
                <label className="text-xs text-primary-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm"
                />
              </div>

              <div className="flex flex-col min-w-[130px]">
                <label className="text-xs text-primary-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="border-b border-primary-400/10">
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className="text-left py-2 sm:py-4 px-2 sm:px-4 text-primary-400 font-semibold text-xs sm:text-sm cursor-pointer select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span className="ml-1 opacity-60">
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="w-3" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="w-3" />
                              ) : (
                                <ArrowUpDown className="w-3" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>

                <tbody>
                  {loading ? (
                    <TableRowSkeleton rows={8} columns={7} />
                  ) : table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="border-b border-primary-400/5 hover:bg-primary-400/5">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="py-2 px-3 text-xs sm:text-sm text-primary-400">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-4 text-primary-400/60 text-sm">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t border-primary-400/10 pt-2">
              <div className="text-xs sm:text-sm text-primary-400">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-primary-400/20 text-xs sm:text-sm text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>

                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-primary-400/20 text-xs sm:text-sm text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <ViewOrderModal isOpen={isModalOpen} onClose={closeModal} order={selectedOrder} />
    </>
  );
};

export default AdminOrderList;
