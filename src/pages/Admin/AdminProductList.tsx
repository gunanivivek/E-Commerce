import React, { useState, useMemo, useCallback } from "react";
import {
  Search,
  Check,
  X,
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
import type { Product } from "../../types/admin";
import ViewProductModal from "../../components/Admin/ViewProductModal";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import { useProductStatusActions } from "../../hooks/Admin/useProductStatusActions";
import { useAdminProductStore } from "../../store/Admin/adminProductStore";
import { useFetchProducts } from "../../hooks/Admin/useFetchProducts";

const columnHelper = createColumnHelper<Product>();

const AdminProductList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { approveProduct, rejectProduct, isPending } =
    useProductStatusActions();

 const { products } = useAdminProductStore();
  const { isError, isLoading } = useFetchProducts();

  const uniqueCategories = useMemo(() => {
    const categories = products
      .map((p: Product) => p.category?.name)
      .filter(Boolean);
    return Array.from(new Set(categories)).sort();
  }, [products]);

  const handleApprove = useCallback(
    (id: number) => {
      approveProduct(id);
    },
    [approveProduct]
  );

  const handleReject = useCallback(
    (id: number) => {
      rejectProduct(id);
    },
    [rejectProduct]
  );

  const handleApproveInModal = useCallback(
    (id: number) => {
      handleApprove(id);
      setIsModalOpen(false);
      setSelectedProduct(null);
    },
    [handleApprove]
  );

  const handleRejectInModal = useCallback(
    (id: number) => {
      handleReject(id);
      setIsModalOpen(false);
      setSelectedProduct(null);
    },
    [handleReject]
  );

  const handleView = useCallback(
    (id: number) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        setSelectedProduct(product);
        setIsModalOpen(true);
      }
    },
    [products]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  }, []);

  const filteredData = useMemo(() => {
    return products.filter((p: Product) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter
        ? p.category?.name === categoryFilter
        : true;
      const matchesStatus = statusFilter ? p.status === statusFilter : true;
      const matchesDateFrom = dateFrom ? p.created_at >= dateFrom : true;
      const matchesDateTo = dateTo ? p.created_at <= dateTo : true;
      const matchesPriceMin =
        priceMin !== "" ? Number(p.price) >= priceMin : true;
      const matchesPriceMax =
        priceMax !== "" ? Number(p.price) <= priceMax : true;
      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesDateFrom &&
        matchesDateTo &&
        matchesPriceMin &&
        matchesPriceMax
      );
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    statusFilter,
    dateFrom,
    dateTo,
    priceMin,
    priceMax,
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Product Name",
        cell: (info) => {
          const name = info.getValue() || "";
          const truncated =
            name.length > 25 ? name.substring(0, 25) + "..." : name;
          return (
            <span className="font-medium text-primary-400" title={name}>
              {truncated}
            </span>
          );
        },
      }),

      columnHelper.accessor("category.name", {
        header: "Category",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue() || "N/A"}</span>
        ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => (
          <span className="text-primary-400">
            ₹{Number(info.getValue()).toFixed(2)}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue();
          let badgeColor = "";
          switch (status) {
            case "approved":
              badgeColor = "bg-green-100 text-green-700 border-green-300";
              break;
            case "pending":
              badgeColor = "bg-primary-100 text-muted border-border-light";
              break;
            case "rejected":
              badgeColor = "bg-red-100 text-red-700 border-red-300";
              break;
            default:
              badgeColor = "bg-gray-100 text-gray-700 border-gray-300";
          }
          return (
            <span
              className={`px-3 py-1 border rounded-full text-xs font-medium ${badgeColor}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
      }),
      columnHelper.accessor("created_at", {
        header: "Added Date",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }: { row: Row<Product> }) => {
          const product = row.original;
          return (
            <div className="flex gap-1">
              {product.status === "pending" && (
                <>
                  <button
                    disabled={isPending}
                    onClick={() => handleApprove(product.id)}
                    className={`p-1.5 rounded transition-colors ${
                      isPending
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                    title="Approve"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>

                  <button
                    disabled={isPending}
                    onClick={() => handleReject(product.id)}
                    className={`p-1.5 rounded transition-colors ${
                      isPending
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    title="Reject"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleView(product.id)}
                className="p-1.5 bg-blue-50 text-blue-600 hover:cursor-pointer hover:bg-blue-100 rounded transition-colors"
                title="View Product"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
      }),
    ],
    [handleApprove, handleReject, handleView]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  if (isError)
    return (
      <p className="text-center text-red-500 mt-10">
        Failed to load products 😕
      </p>
    );

  return (
    <>
      <div className="min-h-screen py-4 sm:py-6">
        <div className="px-4 sm:px-8">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-accent-dark mb-1">
              Product Management
            </h1>
            <p className="text-primary-300 text-sm sm:text-base">
              Review and approve products from sellers.
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
            {/* Controls Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
              <h2 className="text-primary-400 font-semibold text-base sm:text-lg">
                All Products
              </h2>

              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full border border-border-light rounded-lg bg-primary-100/30 text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
                />
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex flex-wrap items-end gap-2 mb-4">
              <div className="flex flex-col min-w-[120px]">
                <label className="text-xs text-primary-400 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Categories</option>
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col min-w-[100px]">
                <label className="text-xs text-primary-300 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                >
                  <option value="">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex flex-col min-w-[130px]">
                <label className="text-xs text-primary-300 mb-1">
                  From Date
                </label>
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

              <div className="flex flex-col min-w-[100px]">
                <label className="text-xs text-primary-300 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceMin}
                  onChange={(e) =>
                    setPriceMin(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="0.00"
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              <div className="flex flex-col min-w-[100px]">
                <label className="text-xs text-primary-300 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                  placeholder="100.00"
                  className="border border-border-light rounded-lg bg-primary-100/30 text-primary-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr
                      key={headerGroup.id}
                      className="border-b border-border"
                    >
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className={`text-left py-2 sm:py-4 px-2 sm:px-4 text-primary-400 font-semibold text-xs sm:text-sm ${
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
                            {header.isPlaceholder
                              ? null
                              : flexRender(
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
                    // ✅ Skeleton rows when loading
                    <TableRowSkeleton rows={8} columns={6} />
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
                        colSpan={6}
                        className="text-center py-4 text-primary-400/60 text-sm"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-1 border-t border-border pt-2 gap-2 sm:gap-0">
              <div className="text-xs sm:text-sm text-primary-400">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex space-x-1 sm:space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-2 sm:px-3 py-1 border border-primary-400/20 text-xs sm:text-sm text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
                >
                  Previous
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-2 sm:px-3 py-1 border border-primary-400/20 text-xs sm:text-sm text-primary-400 rounded-lg hover:bg-primary-400/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex-1 sm:flex-none"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ViewProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
        onApprove={handleApproveInModal}
        onReject={handleRejectInModal}
      />
    </>
  );
};

export default AdminProductList;
