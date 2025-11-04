import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/ui/ProductsCard";

const ProductsPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  const filters = [
    {
      title: "Category",
      options: ["All Categories", "Electronics", "Fashion", "Home & Kitchen", "Beauty"],
    },
    {
      title: "Price Range",
      options: ["₹0 - ₹1,000", "₹1,000 - ₹5,000", "₹5,000 - ₹10,000", "₹10,000+"],
    },
    {
      title: "Rating",
      options: ["All Ratings", "4★ & above", "3★ & above", "2★ & above", "1★ & above"],
    },
    {
      title: "Sort By",
      options: ["Default", "Price: Low to High", "Price: High to Low", "Rating", "Newest"],
    },
  ];

  return (
    <>
      <Header />
      <div
        className="min-h-screen text-[var(--color-text)] bg-background"
      
      >
        {/*  Hero Section */}
        <section className="px-8 md:px-20 py-16 md:py-24 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold font-logo "
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] bg-clip-text text-transparent">
              Premium
            </span>{" "}
            Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto"
          >
            Find the best deals across all categories — smart, stylish, and high quality.
          </motion.p>
        </section>

      
<section className="px-6 md:px-16 pb-12">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-wrap gap-6 justify-between"
  >
    {filters.map((filter, i) => {
      const isOpen = activeFilter === i;
      return (
        <div key={i} className="flex-1 min-w-[200px] relative">
          <button
            onClick={() => setActiveFilter(isOpen ? null : i)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors duration-200"
          >
            {filter.title}
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
            className="text-4xl font-bold text-center mb-12 font-logo"
          >
            All Products
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className=""
          >
            <ProductsCard />
          </motion.div>
        </section>

       
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
