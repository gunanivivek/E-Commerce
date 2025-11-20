import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/Customer/ProductsCard";

const Products: React.FC = () => {
  return (
    <>
      <Header />

      <div className="min-h-screen text-[var(--color-text)] bg-background ">
        {/* Hero */}
        <section className="px-8 md:px-20 py-4  md:py-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold text-accent-light font-logo "
          >
            Explore Our{" "}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dark)] bg-clip-text text-accent-darker">
              Premium{" "}
            </span>
            Collection
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg text-accent-dark max-w-2xl mx-auto"
          >
            Find the best deals across all categories — smart, stylish, and
            high quality.
          </motion.p>
        </section>

        {/* 👉 Filters + Products moved inside ProductsCard */}
        <ProductsCard />
      </div>

      <Footer />
    </>
  );
};

export default Products;
