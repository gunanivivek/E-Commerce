import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import type {
  ProductResponse,
  ProductImageResponse,
} from "../../types/product";

import ProductCard from "./SingleProduct";

type LocalProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock: number;
  images?: string[];
  image: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  average_rating: number;
  category?: string | null;
};

type FilterShape = {
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  ratingGte?: number | null;
  ordering?: string | null;
  in_stock?: boolean | null;
  search?: string | null;
};

// Skeleton
const ProductSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 px-20 lg:grid-cols-4 gap-6">
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
  const { data, isLoading } = useQuery<ProductResponse[]>({
    queryKey: ["new-arrivals"],
    queryFn: () => productsApi.getNewArrivals(),
    staleTime: 1000 * 60 * 20,
  });

  // Transform API → Local structure
  const products = useMemo<LocalProduct[]>(() => {
    if (!data) return [];

    return data.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : undefined,
      stock: p.stock,
      images: p.images?.map((i: ProductImageResponse) => i.url),
      image: p.images?.[0]?.url ?? "",
      slug: p.slug,
      is_active: p.is_active,
      created_at: p.created_at,
      average_rating: p.average_rating ?? 0,
      category: p.category?.name ?? null,
    }));
  }, [data]);

  // Apply Filters (Same logic as ProductsCard)
  const filtered = useMemo(() => {
    if (!products) return [];

    let list = [...products];
    const f = filters ?? {};

    // Search
    if (f.search) {
      const q = f.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category
    if (f.category)
      list = list.filter(
        (p) => p.category?.toLowerCase() === f.category?.toLowerCase()
      );

    // Price range
    if (f.minPrice != null) list = list.filter((p) => p.price >= f.minPrice!);
    if (f.maxPrice != null) list = list.filter((p) => p.price <= f.maxPrice!);

    // Rating
    if (f.ratingGte != null)
      list = list.filter((p) => p.average_rating >= f.ratingGte!);

    // In stock
    if (f.in_stock != null && f.in_stock)
      list = list.filter((p) => p.stock > 0);

    // Sort logic (Same map as original component)
    if (f.ordering) {
      const sortMap: Record<
        string,
        (a: LocalProduct, b: LocalProduct) => number
      > = {
        price: (a, b) => a.price - b.price,
        "-price": (a, b) => b.price - a.price,
        rating: (a, b) => b.average_rating - a.average_rating,
        "-created": (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      };

      const sorter = sortMap[f.ordering];
      if (sorter) list.sort(sorter);
    }

    return list;
  }, [products, filters]);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => setPage(1), [filters]);

  // Loading view
  if (isLoading && !data) return <ProductSkeleton />;

  if (!paginated.length)
    return (
      <p className="text-center text-gray-600 py-10">
        No new arrival products found.
      </p>
    );

  return (
    <section className="pb-5 px-6 md:px-16 ">
      <div
        className="grid 
        grid-cols-1
        
        md:grid-cols-3 
        lg:grid-cols-4 
        gap-4"
      >
        {paginated.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-2 font-semibold">
            {page} / {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default NewArrivalCard;
