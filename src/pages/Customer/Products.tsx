import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/Customer/ProductsCard";

const ProductsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  type FilterShape = {
    category?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
    ratingGte?: number | null;
    ordering?: string | null;
  };

  const [selectedFilters, setSelectedFilters] = useState<FilterShape>({});

  const filters = [
    {
      title: "Category",
      options: [
        "All Categories",
        "Electronics",
        "Fashion",
        "Home & Kitchen",
        "Beauty",
      ],
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
      options: [
        "Default",
        "Price: Low to High",
        "Price: High to Low",
        "Rating",
        "Newest",
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen text-[var(--color-text)] bg-background">
        {/*  Hero Section */}
        <section className="px-8 md:px-20 py-10 md:py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold font-logo "
          >
            Explore Our
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] bg-clip-text text-transparent">
              Premium
            </span>
            Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto"
          >
            Find the best deals across all categories — smart, stylish, and high
            quality.
          </motion.p>
        </section>

        <section className="px-6 md:px-16 pb-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-wrap gap-6 justify-between"
          >
            {filters.map((filter, i) => {
              const isOpen = activeFilter === i;
              // compute a human friendly label for the current selection
              const computeLabel = () => {
                const s = selectedFilters as typeof selectedFilters;
                if (filter.title === "Category") {
                  if (Object.prototype.hasOwnProperty.call(s, "category")) {
                    // null means 'All Categories' (we store null for that option)
                    return s.category === null ? "All Categories" : s.category || filter.title;
                  }
                  return filter.title;
                }

                if (filter.title === "Price Range") {
                  const min = s.minPrice;
                  const max = s.maxPrice;
                  if (min == null && max == null) return filter.title;
                  if (min === 0 && max === 1000) return "₹0 - ₹1,000";
                  if (min === 1000 && max === 5000) return "₹1,000 - ₹5,000";
                  if (min === 5000 && max === 10000) return "₹5,000 - ₹10,000";
                  if (min === 10000 && (max === null || max === undefined)) return "₹10,000+";
                  return filter.title;
                }

                if (filter.title === "Rating") {
                  if (s.ratingGte == null) return filter.title;
                  return `${s.ratingGte}★ `;
                }

                if (filter.title === "Sort By") {
                  if (!s.ordering) return filter.title;
                  if (s.ordering === "price") return "Price: Low to High";
                  if (s.ordering === "-price") return "Price: High to Low";
                  if (s.ordering === "rating") return "Rating";
                  if (s.ordering === "-created") return "Newest";
                  return filter.title;
                }

                return filter.title;
              };

              const label = computeLabel();
              return (
                <div key={i} className="flex-1 min-w-[200px] relative">
                  <button
                    onClick={() => setActiveFilter(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
                  >
                    {label}
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={18} color="#ff6b00" />
                    </motion.div>
                  </button>

                  {/* Dropdown options */}
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute z-10 left-0 mt-2 w-full rounded-lg border border-gray-300 bg-white shadow-lg overflow-hidden"
                    >
                      {filter.options.map((option, j) => (
                        <button
                          key={j}
                          className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                          onClick={() => {
                            // map option to filter values
                            const next = { ...selectedFilters };
                            if (filter.title === "Category") {
                              next.category =
                                option === "All Categories" ? null : option;
                            } else if (filter.title === "Price Range") {
                              if (option === "Price Range") {
                                next.minPrice = null;
                                next.maxPrice = null;
                              } else if (option === "₹0 - ₹1,000") {
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
                              }
                            } else if (filter.title === "Rating") {
                              if (option === "All Ratings")
                                next.ratingGte = null;
                              else if (option.startsWith("4★"))
                                next.ratingGte = 4;
                              else if (option.startsWith("3★"))
                                next.ratingGte = 3;
                              else if (option.startsWith("2★"))
                                next.ratingGte = 2;
                              else if (option.startsWith("1★"))
                                next.ratingGte = 1;
                            } else if (filter.title === "Sort By") {
                              if (option === "Default") next.ordering = null;
                              else if (option === "Price: Low to High")
                                next.ordering = "price";
                              else if (option === "Price: High to Low")
                                next.ordering = "-price";
                              else if (option === "Rating")
                                next.ordering = "rating";
                              else if (option === "Newest")
                                next.ordering = "-created";
                            }

                            setSelectedFilters(next);
                            setActiveFilter(null);
                          }}
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

        {/* 🧱 Product Listing */}
        <section className="px-6 md:px-16 py-10">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-0 font-logo"
          >
            All Products
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className=""
          >
            <ProductsCard
              filters={selectedFilters}
              key={JSON.stringify(selectedFilters)}
            />
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
