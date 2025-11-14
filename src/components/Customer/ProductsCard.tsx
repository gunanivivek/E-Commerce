import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useWishlistStore } from "../../store/wishlistStore";
import {
  useCart,
  useRemoveFromCart,
  useAddToCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";

import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import type {
  ProductResponse,
  ProductImageResponse,
} from "../../types/product";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Product } from "../../store/useProductStore";

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

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col animate-pulse">
    <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
    <div className="h-5 bg-gray-200 rounded-md mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
    <div className="h-4 bg-gray-200 rounded-md mb-3 w-2/3"></div>
    <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-4"></div>
    <div className="flex gap-2 mt-auto">
      <div className="h-9 flex-1 bg-gray-200 rounded-md"></div>
      <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

const ProductsCard: React.FC<{ filters?: FilterShape }> = ({ filters }) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { data: apiProducts, isLoading } = useQuery<ProductResponse[], Error>({
    queryKey: ["products"],
    queryFn: () => productsApi.getProducts(),
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const data = useMemo<LocalProduct[]>(() => {
    const apiList = (apiProducts ?? []) as ProductResponse[];
    if (!apiList.length) return [];
    return apiList.map((p) => ({
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
  }, [apiProducts]);

  const filteredAndSorted = useMemo<LocalProduct[]>(() => {
    let list = [...data];
    if (filters) {
      if (filters.category) {
        const cat = filters.category.toLowerCase().trim();
        list = list.filter(
          (p) => (p.category ?? "").toLowerCase().trim() === cat
        );
      }
      if (filters.ratingGte != null) {
        list = list.filter((p) => (p.rating ?? 0) >= (filters.ratingGte ?? 0));
      }
      if (filters.ordering) {
        const ord = filters.ordering;
        if (ord === "price") list.sort((a, b) => a.price - b.price);
        else if (ord === "-price") list.sort((a, b) => b.price - a.price);
        else if (ord === "rating")
          list.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
        else if (ord === "-rating")
          list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        else if (ord === "-created")
          list.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        else if (ord === "created")
          list.sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
      }
    }
    return list;
  }, [data, filters]);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  // product store kept for non-cart product helpers if needed
  const { wishlistItems, addToWishlist, removeFromWishlist } =
    useWishlistStore();
  const { data: cartData } = useCart(true); // gives you cart items and totals
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCart();
  const addMutation = useAddToCart();

  const table = useReactTable({
    data: filteredAndSorted,
    columns: [] as ColumnDef<Product>[],
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const filteredProducts = table
    .getFilteredRowModel()
    .rows.map((r) => r.original);

  const hasProducts = Array.isArray(apiProducts) && apiProducts.length > 0;

  // ✅ Skeletons during loading
  if (isLoading && !hasProducts)
    return (
      <section className="py-5 px-6 md:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );

  if (!filteredProducts.length)
    return (
      <p className="text-center py-10 text-gray-600">
        No products available right now.
      </p>
    );

  return (
    <section className="py-5 px-6 md:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => {
          const stock = Number(product.stock ?? NaN);
          const inCart = cartData?.items.find((c) => c.product_id === product.id);
          const inWishlist = wishlistItems.find((w) => w.id === product.id);

          const handleNavigate = () => navigate(`/product/${product.id}`);
          const handleAddToCart = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (stock === 0) return;
            if (!user)
              return navigate("/login", {
                state: { from: location.pathname + location.search },
              });
            try {
              await addMutation.mutateAsync({
                product_id: product.id,
                quantity: 1,
              });
            } catch {
              // handled in hook
            }
          };
          const handleWishlist = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (!user)
              return navigate("/login", {
                state: { from: location.pathname + location.search },
              });

            try {
              if (inWishlist) {
                await removeFromWishlist(product.id);
              } else {
                await addToWishlist(product as Product);
              }
            } catch {
              // errors are logged inside the store; optionally show toast here
            }
          };

          return (
            <div
              key={product.id}
              onClick={handleNavigate}
              className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between ${
                stock === 0 ? "opacity-90 grayscale-[0.3]" : ""
              }`}
            >
              {/* Image */}
              <div className="relative h-40 w-full rounded-md overflow-hidden mb-3 flex items-center justify-center">
                {stock === 0 && (
                  <div className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-3 py-1 rounded-full text-xs font-semibold">
                    Out of stock
                  </div>
                )}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <span className="text-primary-200 text-sm">
                    No Image Available
                  </span>
                )}
              </div>

              <h3 className="text-accent-dark font-semibold text-lg text-center mb-2 hover:underline cursor-pointer">
                {product.name.length > 15
                  ? product.name.slice(0, 15) + "..."
                  : product.name}
              </h3>

              <p className="text-sm text-accent mb-1 min-h-[60px]">
                {(() => {
                  const desc = product.description ?? "";
                  const maxWords = 8;
                  const words = desc.trim().split(/\s+/).filter(Boolean);
                  return words.length <= maxWords
                    ? desc
                    : words.slice(0, maxWords).join(" ") + "...";
                })()}
              </p>

              <p className="text-[var(--color-primary-400)] font-bold text-lg">
                ₹{product.discount_price ?? product.price}
                {product.discount_price && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    ₹{product.price}
                  </span>
                )}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={index < (product.rating ?? 0) ? "#facc15" : "#e5e7eb"}
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.854L19.335 24 12 19.896 4.665 24 6 15.604 0 9.75l8.332-1.595z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating}
                </span>
              </div>

              {/* Buttons */}
              <div
                className="flex items-center justify-between mt-3"
                onClick={(e) => e.stopPropagation()}
              >
                {inCart ? (
                  (() => {
                    const c = inCart;
                    const dec = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      if (c.quantity <= 1) removeMutation.mutate({ product_id: c.product_id });
                      else
                        updateMutation.mutate({ product_id: c.product_id, quantity: Math.max(1, c.quantity - 1)});
                    };
                    const inc = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      updateMutation.mutate({ product_id: c.product_id, quantity: Math.max(1, c.quantity + 1)});
                    };
                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={dec}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] rounded-md"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={inc}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] rounded-md"
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
                        ? "bg-accent text-primary-100 cursor-not-allowed"
                        : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                    }`}
                  >
                    Add to Cart
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className="ml-2 p-2 border rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                >
                  {inWishlist ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 21C12 21 4 13.647 4 8.75C4 6.17893 6.17893 4 8.75 4C10.2355 4 11.6028 4.80549 12 6.00613C12.3972 4.80549 13.7645 4 15.25 4C17.8211 4 20 6.17893 20 8.75C20 13.647 12 21 12 21Z" />
                    </svg>
                  ) : (
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
                  )}
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

export default ProductsCard;
