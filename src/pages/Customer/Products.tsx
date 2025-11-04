import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/Customer/ProductsCard";

const ProductsPage: React.FC = () => {
  return (
    <>
      <Header />

      <section className="min-h-screen bg-[var(--color-background)] py-10 px-4 md:px-16">
        {/* 🔹 Top Filter Bar */}
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              defaultValue=""
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Kitchen</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="flex flex-col w-full sm:w-auto">
            <label className="text-sm font-medium text-gray-700 mb-1">Price Range</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                className="accent-[var(--color-primary)] w-40"
              />
              <span className="text-sm text-gray-600">₹0 - ₹10,000+</span>
            </div>
          </div>

          {/* Rating Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              defaultValue=""
            >
              <option value="">All Ratings</option>
              <option value="4">4★ & above</option>
              <option value="3">3★ & above</option>
              <option value="2">2★ & above</option>
              <option value="1">1★ & above</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              className="border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              defaultValue="default"
            >
              <option value="default">Default</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* 🔹 Product Listing Section */}
        <main>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Products</h2>

          <div className="grid grid-cols-1 gap-6">
            <ProductsCard />
          </div>
        </main>
      </section>

      <Footer />
    </>
  );
};

export default ProductsPage;