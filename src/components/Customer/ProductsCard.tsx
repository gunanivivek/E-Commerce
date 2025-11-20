import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import { useCategoryStore } from "../../store/categoryStore";
import ProductCard from "./SingleProduct";
import type {
  ProductResponse,
  ProductImageResponse,
} from "../../types/product";

type FilterOption = {
  label: string;
  value: Partial<FilterShape> | null;
};

type FilterDefinition = { title: string; options: FilterOption[] };

type LocalProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  stock: number;
  image: string;
  images?: string[];
  slug: string;
  is_active: boolean;
  category: string | null;
  created_at: string;
  average_rating: number | null;
};

type FilterShape = {
  category?: string | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  ratingGte?: number | null;
  ordering?: string | null;
};

// Skeleton
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

const ProductsCard: React.FC = () => {
  const categories = useCategoryStore((state) => state.categories);
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterShape>({});

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedFilters]);

  const filtersList: FilterDefinition[] = [
    {
      title: "Category",
      options: [
        { label: "All Categories", value: { category: null } },
        ...categories.map((c) => ({
          label: c.name,
          value: { category: c.name },
        })),
      ],
    },
    {
      title: "Price Range",
      options: [
        { label: "Price Range", value: { minPrice: null, maxPrice: null } },
        { label: "₹0 - ₹1,000", value: { minPrice: 0, maxPrice: 1000 } },
        { label: "₹1,000 - ₹5,000", value: { minPrice: 1000, maxPrice: 5000 } },
        { label: "₹5,000 - ₹10,000", value: { minPrice: 5000, maxPrice: 10000 } },
        { label: "₹10,000 - ₹20,000", value: { minPrice: 10000, maxPrice: 20000 } },
        { label: "₹20,000 +", value: { minPrice: 20000, maxPrice: null } },
      ],
    },
    {
      title: "Rating",
      options: [
        { label: "All Ratings", value: { ratingGte: null } },
        { label: "4★ & above", value: { ratingGte: 4 } },
        { label: "3★ & above", value: { ratingGte: 3 } },
        { label: "2★ & above", value: { ratingGte: 2 } },
        { label: "1★ & above", value: { ratingGte: 1 } },
      ],
    },
    {
      title: "Sort By",
      options: [
        { label: "Default", value: { ordering: null } },
        { label: "Price: Low to High", value: { ordering: "price" } },
        { label: "Price: High to Low", value: { ordering: "-price" } },
        { label: "Rating", value: { ordering: "rating" } },
        { label: "Newest", value: { ordering: "-created" } },
      ],
    },
  ];

  // API fetch
  const { data, isLoading } = useQuery<ProductResponse[]>({
    queryKey: ["products"],
    queryFn: () => productsApi.getProducts(),
    staleTime: 1000 * 60 * 30,
  });

  // Filter + Sort results
  const filteredProducts = useMemo(() => {
    if (!data?.length) return [];

    let list: LocalProduct[] = data.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : undefined,
      stock: p.stock,
      image: p.images?.[0]?.url ?? "",
      images: p.images?.map((i: ProductImageResponse) => i.url),
      slug: p.slug,
      is_active: p.is_active,
      category: p.category?.name ?? null,
      created_at: p.created_at,
      average_rating: p.average_rating,
    }));

    const f = selectedFilters;

    if (f.category)
      list = list.filter(
        (p) => p.category?.toLowerCase() === f.category?.toLowerCase()
      );

    if (f.minPrice != null) list = list.filter((p) => p.price >= f.minPrice!);

    if (f.maxPrice != null) list = list.filter((p) => p.price <= f.maxPrice!);
 
    if (f.ratingGte != null)
      list = list.filter((p) => (p.average_rating ?? 0) >= f.ratingGte!);

    if (f.ordering) {
      const sortMap: Record<string, (a: LocalProduct, b: LocalProduct) => number> = {
        price: (a, b) => a.price - b.price,
        "-price": (a, b) => b.price - a.price,
        rating: (a, b) => (b.average_rating ?? 0) - (a.average_rating ?? 0),
        "-created": (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      };

      list.sort(sortMap[f.ordering]);
    }

    return list;
  }, [data, selectedFilters]);

  // PAGINATE
  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / pageSize);

  const paginated = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Compute filter text
  const computeLabel = (filter: FilterDefinition) => {
    const findSelectedOption = (
      options: FilterOption[],
      selected: FilterShape
    ) => {
      return options.find((opt) => {
        if (opt.value === null) {
          // Check if all relevant filter keys are null/undefined in selectedFilters
          const firstOptionKeys = Object.keys(options[1].value!);
          return firstOptionKeys.every((key) => selected[key as keyof FilterShape] == null);
        }
        // Check if all key-value pairs in the option's value match the selected filters
        return Object.entries(opt.value!).every(
          ([key, value]) => selected[key as keyof FilterShape] === value
        );
      });
    };

    const selectedOption = findSelectedOption(filter.options, selectedFilters);
    return selectedOption?.label || filter.title;
  };

  return (
    <section className="px-6 md:px-16 pb-5">
      {/* FILTER BAR */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap gap-6 justify-between"
      >
        {filtersList.map((filter, i) => {
          const isOpen = activeFilter === i;
          const label = computeLabel(filter);

          return (
            <div key={i} className="flex-1 min-w-[200px] relative">
              <button
                onClick={() => setActiveFilter(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200"
              >
                {label}
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={18} />
                </motion.div>
              </button>

              <AnimatePresence>
                {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 left-0 mt-2 w-full rounded-lg border bg-white shadow-lg overflow-hidden"
                >
                    {filter.options.map((option, j) => (
                    <button
                      key={j}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedFilters((prev) => ({ ...prev, ...option.value }));
                        setActiveFilter(null);
                      }}
                    >
                        {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* PRODUCT GRID */}
      <div className="pt-12 px-4 md:px-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <p className="text-center text-gray-600 py-16">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-10 gap-3">
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

export default ProductsCard;
