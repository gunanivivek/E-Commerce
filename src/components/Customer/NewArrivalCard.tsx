import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useProductStore } from "../../store/useProductStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import type {
  ProductResponse,
  ProductImageResponse,
} from "../../types/product";
import {
  type SortingState,
  type FilterFn,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../../store/useProductStore";
import LoadingState from "../LoadingState";

type LocalProduct = Product & { category?: string | null };

type FilterShape = {
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  ratingGte?: number | null;
  ordering?: string | null;
  in_stock?: boolean | null;
  search?: string | null;
};

const NewArrivalCard: React.FC<{ filters?: FilterShape }> = ({ filters }) => {
  const { data: apiNewArrivals, isLoading } = useQuery<
    ProductResponse[],
    Error
  >({
    queryKey: ["new-arrivals"],
    queryFn: () => productsApi.getNewArrivals(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const data = useMemo<LocalProduct[]>(() => {
    if (!apiNewArrivals?.length) return [];
    return apiNewArrivals.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : undefined,
      stock: p.stock,
      images: p.images?.map((i: ProductImageResponse) => i.url),
      slug: p.slug,
      image: p.images?.[0]?.url ?? "",
      is_active: p.is_active,
      created_at: p.created_at,
      rating: (p as unknown as { rating?: number }).rating ?? 4.5,
      category: p.category?.name ?? null,
    }));
  }, [apiNewArrivals]);

  const between: FilterFn<LocalProduct> = (
    row,
    id,
    range: { min?: number; max?: number }
  ) => {
    const val = Number(row.getValue(id) ?? 0);
    if (range?.min != null && val < range.min) return false;
    if (range?.max != null && val > range.max) return false;
    return true;
  };

  const columns = useMemo<ColumnDef<LocalProduct>[]>(
    () => [
      { accessorKey: "name", header: "Name" },
      {
        accessorKey: "price",
        header: "Price",
        sortingFn: "auto",
        filterFn: between,
      },
      {
        accessorKey: "category",
        header: "Category",
        sortingFn: "auto",
      },
      {
        accessorKey: "stock",
        header: "Stock",
        filterFn: (row, id, value: boolean) => {
          const stock = Number(row.getValue(id) ?? 0);
          return value ? stock > 0 : true;
        },
      },
      { accessorKey: "description", header: "Description" },
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  // reactively apply filters from props
  useEffect(() => {
    const next: ColumnFiltersState = [];

    if (!filters) {
      setColumnFilters([]);
      setGlobalFilter("");
      return;
    }

    if (filters.search) setGlobalFilter(filters.search);

    if (filters.minPrice != null || filters.maxPrice != null) {
      next.push({
        id: "price",
        value: {
          min: filters.minPrice ?? null,
          max: filters.maxPrice ?? null,
        },
      });
    }

    if (filters.in_stock != null) {
      next.push({
        id: "stock",
        value: filters.in_stock,
      });
    }

    if (filters.category) {
      next.push({
        id: "category",
        value: filters.category,
      });
    }

    setColumnFilters(next);

    // handle ordering
    if (filters.ordering) {
      const ord = filters.ordering;
      if (ord.startsWith("-")) {
        setSorting([{ id: ord.substring(1), desc: true }]);
      } else {
        setSorting([{ id: ord, desc: false }]);
      }
    }
  }, [filters]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      between: (row, id, range: { min?: number; max?: number }) => {
        const val = Number(row.getValue(id) ?? 0);
        if (range?.min != null && val < range.min) return false;
        if (range?.max != null && val > range.max) return false;
        return true;
      },
    },
  });

  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { addToCart } = useProductStore();
  const { addToWishlist } = useWishlistStore();
  const location = useLocation();
  const { cartItems, updateQuantity, removeItem } = useCartStore();

  const filteredProducts = table.getRowModel().rows.map((r) => r.original);

  // show loading only if we're actually loading AND have no cached products to show
  const hasProducts =
    Array.isArray(apiNewArrivals) && apiNewArrivals.length > 0;
  if (isLoading && !hasProducts)
    return <LoadingState message="Loading products..." />;

  if (!filteredProducts.length) return <p>No products available right now.</p>;

  return (
    <section className="py-5 px-6 md:px-20">
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stock = Number(product.stock ?? NaN);

          const handleNavigate = () => {
            if (stock === 0) return;
            navigate(`/product/${product.id}`);
          };

          const handleAddToCart = (e: React.MouseEvent) => {
            e.stopPropagation();
            // don't add if out of stock
            if (stock === 0) return;
            // require login to add to cart
            if (!user)
              return navigate("/login", {
                state: { from: location.pathname + location.search },
              });
            // add via product store which already syncs to cartStore
            addToCart(product as Product);
          };

          const handleWishlist = (e: React.MouseEvent) => {
            e.stopPropagation();
            // require login to add to wishlist
            if (!user)
              return navigate("/login", {
                state: { from: location.pathname + location.search },
              });
            addToWishlist(product as Product);
          };

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
            >
              <div className="relative h-40 w-full cursor-pointer rounded-md overflow-hidden mb-3 flex items-center justify-center">
                {/* Out of stock badge - overlays the image when stock === 0 */}
                {stock === 0 && (
                  <div
                    aria-hidden
                    className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    Out of stock
                  </div>
                )}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    onClick={handleNavigate}
                  />
                ) : (
                  <span
                    className="text-primary-200 text-sm"
                    onClick={handleNavigate}
                  >
                    No Image Available
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div onClick={handleNavigate} className="cursor-pointer">
                <h3 className="text-accent-dark font-semibold text-lg text-center mb-2 hover:underline">
                  {product.name.length > 15
                    ? product.name.slice(0, 15) + "..."
                    : product.name}
                </h3>
                <p className="text-sm text-accent mb-1 min-h-[60px]">
                  {(() => {
                    const desc = product.description ?? "";
                    const maxWords = 8;
                    const words = desc.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= maxWords) return desc;
                    return words.slice(0, maxWords).join(" ") + "...";
                  })()}
                </p>

                {/* Price */}
                <p className="text-[var(--color-primary-400)] font-bold text-lg">
                  ₹{product.discount_price ?? product.price}
                  {product.discount_price && (
                    <span className="text-gray-400 line-through text-sm ml-2">
                      ₹{product.price}
                    </span>
                  )}
                </p>

                {Number.isFinite(stock) && stock <= 0 ? (
                  <p className="text-xs text-gray-500 mb-2">
                    Stock: {stock > 0 ? stock : "Out of stock"}
                  </p>
                ) : null}

                {/* Rating */}
                <div className="flex items-center mb-3">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={index < 4 ? "#facc15" : "#e5e7eb"}
                      className="w-5 h-5"
                    >
                      <path d="M12 .587l3.668 7.568L24 9.75l-6 5.854L19.335 24 12 19.896 4.665 24 6 15.604 0 9.75l8.332-1.595z" />
                    </svg>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating}
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between mt-3">
                {/* If product exists in cart, show quantity controls */}
                {cartItems.find((c) => c.id === product.id) ? (
                  (() => {
                    const c = cartItems.find((ci) => ci.id === product.id)!;
                    const dec = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      if (c.quantity <= 1) {
                        removeItem(c.id);
                      } else {
                        updateQuantity(c.id, -1);
                      }
                    };
                    const inc = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      updateQuantity(c.id, 1);
                    };

                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={dec}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                          aria-label="decrease"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={inc}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                          aria-label="increase"
                        >
                          +
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={stock === 0}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-150 shadow-sm ${
                      stock === 0
                        ? "bg-accent-light text-accent-light cursor-not-allowed"
                        : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                    }`}
                  >
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
                  aria-label="add to wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    className="w-5 h-5"
                  >
                    <path d="M12 21C12 21 4 13.647 4 8.75C4 6.17893 6.17893 4 8.75 4C10.2355 4 11.6028 4.80549 12 6.00613C12.3972 4.80549 13.7645 4 15.25 4C17.8211 4 20 6.17893 20 8.75C20 13.647 12 21 12 21Z" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default NewArrivalCard;
