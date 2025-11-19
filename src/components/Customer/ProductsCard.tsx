import React, { useMemo, useState } from "react";
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
  <div className="bg-white rounded-lg shadow-md p-8 flex flex-col animate-pulse">
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

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 12,
  });

  const { data: apiProducts, isLoading: ProductsLoading } = useQuery<ProductResponse[], Error>({
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
      average_rating: p.average_rating,
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
        list = list.filter((p) => (p.average_rating ?? 0) >= (filters.ratingGte ?? 0));
      }
      if (filters.ordering) {
        const ord = filters.ordering;
        if (ord === "price") list.sort((a, b) => a.price - b.price);
        else if (ord === "-price") list.sort((a, b) => b.price - a.price);
        else if (ord === "rating")
          list.sort((a, b) => (a.average_rating ?? 0) - (b.average_rating ?? 0));
        else if (ord === "-rating")
          list.sort((a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0));
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


 
  const table = useReactTable({
    
    data: filteredAndSorted,
    columns: [] as ColumnDef<Product>[],
    state: { globalFilter, columnFilters, pagination },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const paginatedProducts = table
    .getPaginationRowModel()
    .rows.map((r) => r.original);

  const hasProducts = Array.isArray(apiProducts) && apiProducts.length > 0;

  // ✅ Skeletons during loading
  if (ProductsLoading && !hasProducts)
    return (
      <section className="py-5 px-6 md:px-20">
        <div className="grid grid-cols-1  md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      </section>
    );

  if (!paginatedProducts.length)
    return (
      <p className="text-center py-10 text-gray-600">
        No products available right now.
      </p>
    );

  return (
    <section className="py-5 px-6 md:px-20">
      <div className="grid 
  grid-cols-1
  md:grid-cols-3 
  lg:grid-cols-4 
 
  gap-4 ">
        {paginatedProducts.map((product) => {
     return <ProductCard key={product.id} product={product} />;
        })}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-primary-100 hover:cursor-pointer disabled:cursor-not-allowed  font-heading rounded-md disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-primary-100 hover:cursor-pointer disabled:cursor-not-allowed font-heading rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default ProductsCard;
