/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo } from "react";
import { Search, Eye, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import type { Order } from "../../types/orders";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import OrderDetailModel from "../../components/Seller/OrderDetailModel";
import { getSellerOrders } from "../../api/sellerOrderApi";
import { useQuery } from "@tanstack/react-query";

const columnHelper = createColumnHelper<Order>();

const SellerOrders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sellerOrders"],
    queryFn: getSellerOrders,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const filteredData = useMemo(() => {
    let filtered = orders.filter(
      (order) =>
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.status === statusFilter)
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) >= new Date(dateFrom)
      );
    }

    if (dateTo) {
      filtered = filtered.filter(
        (order) => new Date(order.created_at) <= new Date(dateTo)
      );
    }

    return filtered;
  }, [orders, searchTerm, statusFilter, dateFrom, dateTo]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("order_number", {
        header: "Order No.",
        cell: (info) => (
          <span className="font-medium text-primary-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("customer_name", {
        header: "Customer",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("items", {
        header: "Items",
        cell: (info) => <span>{info.getValue().length}</span>,
      }),
      columnHelper.accessor("total_amount", {
        header: "Total Amount",
        cell: (info) => (
          <span className="text-primary-400"> ₹{Number(info.getValue()).toLocaleString("en-IN")}</span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-primary-400">
              {date.toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "status",
        header: "Status",
        cell: ({ row }: { row: Row<Order> }) => {
          const items = row.original.items;
          const allDelivered = items.every((i) => i.status === "delivered");
          const anyPending = items.some((i) => i.status === "pending");
          const displayStatus = allDelivered
            ? "Delivered"
            : anyPending
            ? "Pending"
            : "Shipped";

          const colorClass = allDelivered
            ? "bg-green-100 text-green-700"
            : anyPending
            ? "bg-gray-300 text-muted"
            : "bg-accent-light text-primary";

          return (
            <span
              className={`px-4 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {displayStatus}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "payment",
        header: "Payment Status",
        cell: ({ row }: { row: Row<Order> }) => {
          const paymentStatus = row.original.payment_status;

          const displayStatus = paymentStatus === "paid" ? "Success" : "Failed";
          const colorClass =
            paymentStatus === "paid"
              ? "bg-green-100 text-green-700"
              : "bg-red-300 text-white";

          return (
            <span
              className={`px-4 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {displayStatus}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Order> }) => {
          const order = row.original;
          return (
            <button
              onClick={() => {
                setSelectedOrder(order);
                setIsModalOpen(true);
              }}
              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="View Order"
            >
              <Eye className="w-4 h-4" />
            </button>
          );
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  return (
    <div className="min-h-screen py-6">
      <div className="px-4 sm:px-8">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-400">
              Orders
            </h1>
            <p className="text-primary-400 text-xs sm:text-sm">
              Review and manage customer orders
            </p>
          </div>
        </div>

        {/* Filters */}
        {/* Search Bar - on its own line */}
        <div className="mb-3 w-full sm:w-96">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400/50 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search by order or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 w-full border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
        </div>

        {/* Filters Row - status, from date, to date */}
        <div className="flex flex-wrap items-end gap-3 mb-4">
          {/* Status Filter */}
          <div className="flex flex-col min-w-[120px]">
            <label className="text-xs text-primary-400 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* From Date Filter */}
          <div className="flex flex-col min-w-[130px]">
            <label className="text-xs text-primary-400 mb-1">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* To Date Filter */}
          <div className="flex flex-col min-w-[130px]">
            <label className="text-xs text-primary-400 mb-1">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-primary-400/10"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`text-left py-2 px-4 text-primary-400 font-semibold text-xs sm:text-sm ${
                        header.column.getCanSort() ? "cursor-pointer" : ""
                      }`}
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      <div className="flex items-center">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="ml-1 opacity-60">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="w-3 h-3" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="w-3 h-3" />
                            ) : (
                              <ArrowUpDown className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <TableRowSkeleton rows={5} columns={8} />
              ) : isError ? (
                <div>Failed to load orders.</div>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-primary-400/5 hover:bg-primary-400/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-2 px-4 text-xs sm:text-sm text-primary-400"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailModel
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

export default SellerOrders;
