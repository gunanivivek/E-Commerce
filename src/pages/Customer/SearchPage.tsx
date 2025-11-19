import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import ProductCard from "../../components/Customer/SingleProduct";
import type { ProductResponse, ProductImageResponse } from "../../types/product";
import type { Product } from "../../store/useProductStore";

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-4">
    <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="flex justify-between mt-4">
      <div className="h-8 bg-gray-200 rounded w-24"></div>
      <div className="h-8 bg-gray-200 rounded w-8"></div>
    </div>
  </div>
);

type LocalProduct = Product & { category?: string | null; rating?: number };
type FilterShape = {
  minPrice?: number | null;
  maxPrice?: number | null;
  ratingGte?: number | null;
  ordering?: string | null;
  category?: string | null;
};

const SearchPage = () => {
  const location = useLocation();
  const query = useMemo(
    () => new URLSearchParams(location.search).get("query") || "",
    [location.search]
  );

  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<FilterShape>({});
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const { data: apiProducts, isLoading } = useQuery<ProductResponse[], Error>({
    queryKey: ["search-products", query],
    queryFn: () => productsApi.searchProducts(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 10,
  });

  const allProducts = useMemo<LocalProduct[]>(() => {
    const apiList = apiProducts ?? [];
    return apiList.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description ?? "",
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : undefined,
      stock: p.stock,
      slug: p.slug,
      image: p.images?.length ? p.images[0].url : "",
      images: p.images?.map((i: ProductImageResponse) => i.url),
      is_active: p.is_active,
      created_at: p.created_at,
      average_rating: p.average_rating,
      category: p.category?.name ?? null,
    }));
  }, [apiProducts]);

  // 🧠 Extract unique categories for dropdown
  const categories = useMemo(
    () => Array.from(new Set(allProducts.map((p) => p.category).filter(Boolean))),
    [allProducts]
  );

  const filteredProducts = useMemo(() => {
    let list = [...allProducts];

    // Category filter
    if (selectedFilters.category) {
      list = list.filter((p) => p.category === selectedFilters.category);
    }

    // Price filters
    if (selectedFilters.minPrice != null || selectedFilters.maxPrice != null) {
      list = list.filter((p) => {
        const price = p.discount_price ?? p.price;
        if (selectedFilters.minPrice != null && price < selectedFilters.minPrice)
          return false;
        if (selectedFilters.maxPrice != null && price > selectedFilters.maxPrice)
          return false;
        return true;
      });
    }

    // Rating filter
    if (selectedFilters.ratingGte != null) {
      list = list.filter((p) => (p.rating ?? 0) >= (selectedFilters.ratingGte ?? 0));
    }

    // Sort
    if (selectedFilters.ordering) {
      const ord = selectedFilters.ordering;
      if (ord === "price") list.sort((a, b) => a.price - b.price);
      else if (ord === "-price") list.sort((a, b) => b.price - a.price);
      else if (ord === "-created")
        list.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return list;
  }, [allProducts, selectedFilters]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filters = [
    {
      title: "Category",
      options: ["All Categories", ...categories],
    },
    {
      title: "Price Range",
      options: [
        "Price Range",
        "₹0 - ₹1,000",
        "₹1,000 - ₹5,000",
        "₹5,000 - ₹10,000",
        "₹10,000 - ₹20,000",
        "₹20,000 +",
      ],
    },
    {
      title: "Rating",
      options: [
        "All Ratings",
        "4★ & above",
        "3★ & above",
        "2★ & above",
        "1★ & above",
      ],
    },
    {
      title: "Sort By",
      options: ["Default", "Price: Low to High", "Price: High to Low", "Newest"],
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-surface min-h-screen">
        <section className="px-8 md:px-20 py-5 md:py-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-2xl md:text-4xl text-white font-extrabold font-logo "
          >
            Search Results for{" "}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] bg-clip-text text-accent-darker">
              “{query}”
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-3 text text-accent max-w-3xl mx-auto"
          >
            Showing results matching your search query.
          </motion.p>
        </section>

        {/* 🧰 Filters Section */}
        <section className="px-6 md:px-16 pb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap gap-6 justify-between"
          >
            {filters.map((filter, i) => {
              const isOpen = activeFilter === i;
              return (
                <div key={i} className="flex-1 min-w-[200px] relative">
                  <button
                    onClick={() => setActiveFilter(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-primary-100 cursor-pointer border border-accent-dark text-accent-dark hover:bg-gray-200 transition-colors duration-200"
                  >
                    {filter.title}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} color="#7B5C52" />
                    </motion.div>
                  </button>

                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="absolute z-10 left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden"
                    >
                      {filter.options.map((option, j) => (
                        <button
                          key={j}
                          onClick={() => {
                            const next = { ...selectedFilters };

                            if (filter.title === "Category") {
                              next.category =
                                option === "All Categories" ? null : option;
                            } else if (filter.title === "Price Range") {
                              if (option === "₹0 - ₹1,000") {
                                next.minPrice = 0;
                                next.maxPrice = 1000;
                              } else if (option === "₹1,000 - ₹5,000") {
                                next.minPrice = 1000;
                                next.maxPrice = 5000;
                              } else if (option === "₹5,000 - ₹10,000") {
                                next.minPrice = 5000;
                                next.maxPrice = 10000;
                              } else if (option === "₹10,000 - ₹20,000") {
                                next.minPrice = 10000;
                                next.maxPrice = 20000;
                              } else if (option === "₹20,000 +") {
                                next.minPrice = 20000;
                                next.maxPrice = null;
                              } else {
                                next.minPrice = null;
                                next.maxPrice = null;
                              }
                            } else if (filter.title === "Rating") {
                              if (option === "All Ratings") next.ratingGte = null;
                              else if (option) next.ratingGte = parseInt(option[0]);
                            } else if (filter.title === "Sort By") {
                              if (option === "Default") next.ordering = null;
                              else if (option === "Price: Low to High")
                                next.ordering = "price";
                              else if (option === "Price: High to Low")
                                next.ordering = "-price";
                              else if (option === "Newest")
                                next.ordering = "-created";
                            }

                            setSelectedFilters(next);
                            setActiveFilter(null);
                            setPage(1);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          {option}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </section>

      
        <section className="px-6 md:px-40 py-10 bg-background mt-1 md:mt-5">
          {isLoading ? (
            <div className="grid 
  grid-cols-1
 
  md:grid-cols-3 
  lg:grid-cols-4 
 
  gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* ✅ Pagination */}
              <div className="flex justify-center mt-10 space-x-3">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-5 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
                >
                  Prev
                </button>
                <span className="text-gray-600 font-medium">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page >= totalPages}
                  className="px-5 py-2 bg-gray-200 rounded-md disabled:opacity-50 hover:bg-gray-300"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-gray-500">
                No products found for <strong>“{query}”</strong>.
              </p>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SearchPage;
