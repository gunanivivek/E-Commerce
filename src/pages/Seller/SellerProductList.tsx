/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
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
import BulkUploadModal from "../../components/Seller/BulkUploadModal";
import AddProductModal from "../../components/Seller/AddProductModal";
import UpdateProductForm from "../../components/Seller/UpdateProductForm";
import DeleteProductModal from "../../components/Seller/DeleteProductModal";
import type { Product } from "../../types/seller";
import { deleteProduct, getSellerProducts } from "../../api/sellerApi";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const columnHelper = createColumnHelper<Product>();

const getStatusColor = (status: Product["status"]) => {
  switch (status) {
    case "approved":
      return "bg-primary-300 text-white";
    case "pending":
      return "bg-light/60 text-primary-400";
    case "rejected":
      return "bg-red-200 text-red-800";
    default:
      return "bg-gray-200 text-gray-800";
  }
};

const SellerProductList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [isViewProdOpen, setIsViewProdOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const user = useAuthStore((state) => state.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [priceMin, setPriceMin] = useState<number | "">("");
  const [priceMax, setPriceMax] = useState<number | "">("");

  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getSellerProducts(String(user?.id));
        setData(products);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  const uniqueCategories = useMemo(() => {
    const categories = (data ?? [])
      .map((p) => p.category)
      .filter((c): c is string => !!c);

    return Array.from(new Set(categories)).sort();
  }, [data]);

  const handleView = useCallback((id: number) => {
    console.log("View product:", id);
    setIsViewProdOpen(true);
    // Add your view logic here, e.g., navigate to product details
  }, []);

  const handleDelete = useCallback(async (ProductId: number) => {
    const prevData = data;
    setData((prev) => prev.filter((p) => p.id !== ProductId));
    try {
      const res = await deleteProduct(ProductId);
      toast.success(res.message || "Product deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete product:", error);

      // Rollback if backend failed
      setData(prevData);
      toast.error(error.response?.data?.message || "Failed to delete product");
    } finally {
      setIsDeleteOpen(false);
      setSelectedProduct(null);
    }
  },
  [data, setData]);

  const filteredData = useMemo(() => {
    let filtered = data.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.includes(searchTerm.toLowerCase())
    );

    if (categoryFilter) {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter((p) => p.addedDate >= dateFrom);
    }

    if (dateTo) {
      filtered = filtered.filter((p) => p.addedDate <= dateTo);
    }

    if (priceMin !== "") {
      filtered = filtered.filter((p) => p.price >= (priceMin as number));
    }

    if (priceMax !== "") {
      filtered = filtered.filter((p) => p.price <= (priceMax as number));
    }

    return filtered;
  }, [
    data,
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
        cell: (info) => (
          <span className="font-medium text-primary-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <span className="text-primary-400">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("price", {
        header: "Price",
        cell: (info) => {
          const rawValue = info.getValue();
          const value =
            typeof rawValue === "number"
              ? rawValue
              : parseFloat(String(rawValue)); // ✅ safely handle both number/string

          return (
            <span className="text-primary-400">
              {isNaN(value) ? "—" : `$${value.toFixed(2)}`}
            </span>
          );
        },
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
          const status = info.getValue() as Product["status"] | undefined;
          const colorClass = getStatusColor(status ?? "pending"); // fallback color

          return (
            <span
              className={`px-4 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "Pending"}
            </span>
          );
        },
      }),

      columnHelper.accessor("addedDate", {
        header: "Added Date",
        cell: (info) => {
          const date = new Date(info.getValue());
          const formattedDate = date.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return <span className="text-primary-400">{formattedDate}</span>;
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }: { row: Row<Product> }) => {
          const product = row.original;
          return (
            <div className="flex gap-1">
              <button
                onClick={() => handleView(product.id)}
                className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="View Product"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setSelectedProduct({ id: Number(product.id), name: product.name });
                  setIsDeleteOpen(true);
                }}
                className="p-1.5 bg-blue-50 text-red-600 hover:bg-blue-100 rounded transition-colors"
                title="View Product"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        },
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
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="px-4 sm:px-8">
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          {/* Left side — title and subtitle */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-400">
              Product Management
            </h1>
            <p className="text-primary-400 text-xs sm:text-sm">
              Upload and review all your products from here.
            </p>
          </div>

          {/* Right side — buttons */}
          <div className="flex items-center gap-x-3 mt-3 sm:mt-0">
            <button
              className="flex items-center gap-1 text-sm sm:text-base text-primary-500 border border-primary-300 rounded-lg px-3 py-1.5 hover:bg-primary-200 hover:cursor-pointer transition"
              onClick={() => setIsModalOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4-4m0 0l-4 4m4-4v12"
                />
              </svg>
              Bulk Upload
            </button>

            <button
              className="flex items-center gap-1 text-sm sm:text-base bg-primary-300 text-white rounded-lg px-3 py-1.5 hover:cursor-pointer hover:bg-primary-400 transition"
              onClick={() => setIsAddModelOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
          {/* Controls Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
            <h2 className="text-primary-400 font-semibold text-base sm:text-lg">
              All Products
            </h2>

            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400/50 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 w-full border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              />
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex flex-wrap items-end gap-2 mb-4">
            <div className="flex flex-col min-w-[120px]">
              <label className="text-xs text-primary-400 mb-1">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
              <label className="text-xs text-primary-400 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-400 mb-1">From Date</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-col min-w-[130px]">
              <label className="text-xs text-primary-400 mb-1">To Date</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-col min-w-[100px]">
              <label className="text-xs text-primary-400 mb-1">Min Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceMin}
                onChange={(e) =>
                  setPriceMin(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                placeholder="0.00"
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="flex flex-col min-w-[100px]">
              <label className="text-xs text-primary-400 mb-1">Max Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={priceMax}
                onChange={(e) =>
                  setPriceMax(
                    e.target.value === "" ? "" : parseFloat(e.target.value)
                  )
                }
                placeholder="100.00"
                className="border border-primary-400/20 rounded-lg bg-primary-400/5 text-primary-400 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                    className="border-b border-primary-400/10"
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
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-primary-400/5 hover:bg-primary-400/5"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-primary-400"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-1 border-t border-primary-400/10 pt-2 gap-2 sm:gap-0">
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
      <BulkUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AddProductModal
        isOpen={isAddModelOpen}
        onClose={() => setIsAddModelOpen(false)}
      />
      <UpdateProductForm
        isOpen={isViewProdOpen}
        onClose={() => setIsViewProdOpen(false)}
        existingData={{
          name: "Green Tea",
          description: "Organic premium tea leaves",
          price: 250,
          stock: 80,
          category: "Beverages",
        }}
      />

      <DeleteProductModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        productId={selectedProduct?.id ?? 0}
        productName="Wireless Headphones"
      />
    </div>
  );
};

export default SellerProductList;
