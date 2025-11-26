import React, { useState, useMemo, useCallback } from "react";
import {
  Ban,
  Unlock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  Eye,
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
import { useAdminStore } from "../../store/adminStore";
import { useFetchCustomers } from "../../hooks/Admin/useFetchCustomers";
import type { Customer } from "../../types/admin";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ViewCustomerModal from "../../components/Admin/ViewCustomerModal";
import { useCustomerActions } from "../../hooks/Admin/useCustomerActions";

const columnHelper = createColumnHelper<Customer>();

const CustomerList: React.FC = () => {
  const { customers, loading, error } = useAdminStore();
  useFetchCustomers();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleBlockCustomer, mutatingId } = useCustomerActions();

  const handleBlockToggle = useCallback(
    (id: number) => {
      toggleBlockCustomer(id);
      setIsModalOpen(false);
    },
    [toggleBlockCustomer]
  );

  // --- Filter & Search Logic ---
  const filteredData = useMemo(() => {
    let filtered = customers.filter((c) => {
      const name = c.full_name?.toLowerCase() || "";
      const email = c.email?.toLowerCase() || "";
      const phone = c.phone ? String(c.phone).toLowerCase() : "";

      const search = searchTerm.toLowerCase();

      return (
        name.includes(search) ||
        email.includes(search) ||
        phone.includes(search)
      );
    });

    if (statusFilter)
      filtered = filtered.filter((c) =>
        statusFilter === "active" ? !c.is_blocked : c.is_blocked
      );

    if (dateFrom) filtered = filtered.filter((c) => c.created_at >= dateFrom);
    if (dateTo) filtered = filtered.filter((c) => c.created_at <= dateTo);

    return filtered;
  }, [customers, searchTerm, statusFilter, dateFrom, dateTo]);

  // --- Table Columns ---
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "profile",
        header: "Profile",
        cell: ({ row }: { row: Row<Customer> }) => {
          const customer = row.original;
          return customer.profile_picture ? (
            <img
              src={customer.profile_picture}
              alt={customer.full_name}
              className="w-9 h-9 rounded-full object-cover border border-primary-400/20"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-400/10 text-primary-400 font-semibold uppercase">
              {customer.full_name.slice(0, 2)}
            </div>
          );
        },
      }),
      columnHelper.accessor("full_name", {
        header: "Full Name",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("phone", {
        header: "Phone Number",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue() || "—"}</span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Join Date",
        cell: (info) => (
          <span className="text-primary-400">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ),
      }),
      columnHelper.accessor("is_blocked", {
        header: "Status",
        cell: (info) => {
          const isBlocked = info.getValue();
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                isBlocked
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {isBlocked ? "Blocked" : "Active"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Customer> }) => {
          const customer = row.original;
          return (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsModalOpen(true);
                }}
                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:cursor-pointer rounded"
                title="View Details"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              {mutatingId === customer.id ? (
                <div className="p-1.5 flex items-center justify-center">
                  <span className="w-3.5 h-3.5 animate-spin border border-primary-400 rounded-full border-t-transparent"></span>
                </div>
              ) : (
                <button
                  onClick={() => handleBlockToggle(customer.id)}
                  className={`p-1.5 cursor-pointer ${
                    customer.is_blocked
                      ? "bg-green-50 text-green-600 hover:bg-green-100"
                      : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                  } rounded`}
                  title={customer.is_blocked ? "Unblock" : "Block"}
                >
                  {customer.is_blocked ? (
                  <Unlock className="w-3.5 h-3.5 " />
                ) : (
                  <Ban className="w-3.5 h-3.5" />
                )}
                </button>
              )}
            </div>
          );
        },
      }),
    ],
    [handleBlockToggle, mutatingId]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 7 } },
  });

  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark mb-1">
          Customer Management
        </h1>
        <p className="text-primary-300 text-sm sm:text-base mb-4">
          Search, filter, and manage customer accounts.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-primary-400 font-semibold text-base sm:text-lg">
              All Customers
            </h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full border border-border-light rounded-lg bg-primary-100/30 text-primary-300 focus:outline-none focus:ring-2 focus:ring-border text-sm"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-end gap-2 mb-4">
            <div className="flex flex-col min-w-[120px]">
              <label className="text-xs text-primary-300 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border cursor-pointer border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:ring-primary-400"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-300 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border cursor-pointer border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:ring-primary-400"
              />
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-300 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border cursor-pointer border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:ring-primary-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max">
              <thead>
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id} className="border-b border-border">
                    {hg.headers.map((header) => (
                      <th
                        key={header.id}
                        className={`text-left py-2 px-3 text-primary-400 font-semibold text-xs sm:text-sm ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
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
                {loading ? (
                  <TableRowSkeleton rows={8} columns={7} />
                ) : table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b border-primary-400/5 hover:bg-primary-400/5"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-2 px-3 text-xs sm:text-sm text-primary-300"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-4 text-primary-400/60 text-sm"
                    >
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 border-t border-border pt-2">
            <div className="text-xs sm:text-sm text-primary-400">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="cursor-pointer px-3 py-1 border border-primary-400/20 text-xs text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="cursor-pointer px-3 py-1 border border-primary-400/20 text-xs text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <ViewCustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onToggleBlock={(id) => handleBlockToggle(id)}
      />
    </div>
  );
};

export default CustomerList;
