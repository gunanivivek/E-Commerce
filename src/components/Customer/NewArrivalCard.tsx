import React, { useEffect, useMemo, useState } from "react";
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

import ProductCard from "./SingleProduct";

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
  <div className="grid grid-cols-1  md:grid-cols-2 px-20 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-md p-4 flex flex-col animate-pulse"
      >
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
    ))}
  </div>
);

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
      average_rating: p.average_rating ?? 0,
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

  const filteredProducts = table.getRowModel().rows.map((r) => r.original);

  // show loading only if we're actually loading AND have no cached products to show
  const hasProducts =
    Array.isArray(apiNewArrivals) && apiNewArrivals.length > 0;
  if (isLoading && !hasProducts) return <ProductSkeleton />;

  if (!filteredProducts.length) return <p>No products available right now.</p>;

  return (
    <section className="py-5 px-6 md:px-20">
      {/* Product Grid */}
      <div
        className="grid 
  grid-cols-2 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  gap-4"
      >
        {filteredProducts.map((product) => {
          return <ProductCard key={product.id} product={product} />;
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
