import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Check,
  X,
 
  Ban,
  Unlock,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
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
import { useFetchSellers } from "../../hooks/useFetchSellers";
import type { Seller } from "../../types/admin";
import { useSellerActions } from "../../hooks/Admin/useSellerAction";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ViewSellerModal from "../../components/Admin/ViewSellerModal";

const columnHelper = createColumnHelper<Seller>();

const SellerList: React.FC = () => {
  const { sellers, loading, error } = useAdminStore();
  useFetchSellers();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [blockFilter, setBlockFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const { approveSeller, rejectSeller,toggleBlockSeller } = useSellerActions();
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

   useEffect(() => {
    if (approveSeller.isSuccess || rejectSeller.isSuccess) {
      setIsModalOpen(false);
      setSelectedSeller(null);
      approveSeller.reset();
      rejectSeller.reset();
    }
  }, [approveSeller, rejectSeller]);
 
  const handleApprove = useCallback(
    (id: number) => {
      approveSeller.mutate(id); // 
    },
    [approveSeller]
  );

  const handleReject = useCallback(
    (id: number) => {
      rejectSeller.mutate(id); // 
    },
    [rejectSeller]
  );
const handleBlockToggle = useCallback(
  (id: number) => {
    toggleBlockSeller.mutate(id);
  },
  [toggleBlockSeller]
);


  const handleEdit = useCallback((id: number) => {
    console.log("Edit seller:", id);
  }, []);

  // const handleDelete = useCallback(
  //   (id: number) => {
  //     setSellers((prev) => prev.filter((s) => s.id !== id));
  //   },
  //   [setSellers]
  // );
  const handleView = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

 
 console.log(sellers);
  // --- FILTER + SEARCH LOGIC ---
  const filteredData = useMemo(() => {
    let filtered = sellers.filter(
      (s) =>
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.store_name ?? "—")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter)
      filtered = filtered.filter((s) =>
        statusFilter === "active" ? s.is_active : !s.is_active
      );

    if (blockFilter)
      filtered = filtered.filter((s) =>
        blockFilter === "blocked" ? s.is_blocked : !s.is_blocked
      );

    if (dateFrom) filtered = filtered.filter((s) => s.created_at >= dateFrom);

    if (dateTo) filtered = filtered.filter((s) => s.created_at <= dateTo);

    return filtered;
  }, [sellers, searchTerm, statusFilter, blockFilter, dateFrom, dateTo]);

  // --- TABLE COLUMNS ---
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "profile",
        header: "Profile",
        cell: ({ row }: { row: Row<Seller> }) => {
          const seller = row.original;
          return seller.profile_picture ? (
            <img
              src={seller.profile_picture}
              alt={seller.full_name}
              className="w-9 h-9 rounded-full object-cover border border-primary-400/20"
            />
          ) : (
            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-400/10 text-primary-400 font-semibold uppercase">
              {seller.full_name.slice(0, 2)}
            </div>
          );
        },
      }),
      columnHelper.accessor("store_name", {
        header: "Store Name",
        cell: (info) => (
          <span className="font-semibold text-primary-400">
            {info.getValue()}
          </span>
        ),
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
        header: "Phone",
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
      columnHelper.accessor("is_active", {
        header: "Status",
        cell: (info) => {
          const active = info.getValue();
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                active
                  ? "bg-green-100 text-green-700"
                  : "bg-primary-100 text-muted"
              }`}
            >
              {active ? "Active" : "Not Active"}
            </span>
          );
        },
      }),
      columnHelper.accessor("is_blocked", {
        header: "Blocked",
        cell: (info) => {
          const blocked = info.getValue();
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                blocked
                  ? "bg-red-100 text-red-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {blocked ? "Blocked" : "Unblocked"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: Row<Seller> }) => {
          const seller = row.original;
          return (
            <div className="flex gap-1">
              {!seller.is_active ? (
                <>
                  <button
                    onClick={() => handleApprove(seller.id)}
                    className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded"
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReject(seller.id)}
                    className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded"
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                   <button
                    onClick={() => handleView(seller)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                 
                     <button
                    onClick={() => handleView(seller)}
                    className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded"
                    title="View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleBlockToggle(seller.id)}
                    className={`p-1.5 ${
                      seller.is_blocked
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-yellow-50 text-yellow-600 hover:bg-yellow-100"
                    } rounded`}
                    title={seller.is_blocked ? "Unblock" : "Block"}
                  >
                    {seller.is_blocked ? (
                      <Unlock className="w-3.5 h-3.5" />
                    ) : (
                      <Ban className="w-3.5 h-3.5" />
                    )}
                  </button>
                </>
              )}
            </div>
          );
        },
      }),
    ],
    [handleApprove, handleReject, handleEdit, handleBlockToggle]
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
          Seller Management
        </h1>
        <p className="text-primary-300 text-sm sm:text-base mb-4">
          Search, filter, and manage sellers.
        </p>

        <div className="bg-white rounded-lg shadow-xl p-3 sm:p-4">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
            <h2 className="text-primary-400 font-semibold text-base sm:text-lg">
              All Sellers
            </h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 w-4 h-4" />
              <input
                type="text"
                placeholder="Search sellers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 w-full border border-border-light rounded-lg bg-primary-100/30 text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
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
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Not Active</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[120px]">
              <label className="text-xs text-primary-300 mb-1">
                Block Status
              </label>
              <select
                value={blockFilter}
                onChange={(e) => setBlockFilter(e.target.value)}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                <option value="">All</option>
                <option value="blocked">Blocked</option>
                <option value="unblocked">Unblocked</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-300 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              />
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-300 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
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
                  <TableRowSkeleton rows={8} columns={9} />
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
                      No sellers found
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
                className="px-3 py-1 border border-primary-400/20 text-xs text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border border-primary-400/20 text-xs text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      {selectedSeller && (
        <ViewSellerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          seller={selectedSeller}
          onApprove={handleApprove}
          onReject={handleReject}
          onToggleBlock={handleBlockToggle}
        />
      )}
    </div>
  );
};

export default SellerList;
