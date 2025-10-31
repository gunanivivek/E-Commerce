import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ProductsCard from "../../components/ui/ProductsCard";

const ProductsPage: React.FC = () => {
  return (
    <>
      <Header />

      <section className="min-h-screen bg-[var(--color-background)] py-10 px-4 md:px-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-1/4 bg-white rounded-2xl shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase">
                Category
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--color-primary)]" /> Electronics
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--color-primary)]" /> Fashion
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--color-primary)]" /> Home & Kitchen
                  </label>
                </li>
                <li>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-[var(--color-primary)]" /> Beauty
                  </label>
                </li>
              </ul>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase">
                Price Range
              </h3>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>₹0</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2 uppercase">
                Rating
              </h3>
              <ul className="space-y-2 text-gray-600">
                {[4, 3, 2, 1].map((r) => (
                  <li key={r}>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-[var(--color-primary)]" /> {r}★ & above
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Listing Section */}
          <main className="flex-1 w-full">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-semibold text-gray-800">All Products</h2>
              <select
                className="border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                defaultValue="default"
              >
                <option value="default">Sort by: Default</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 gap-6">
              <ProductsCard />
            </div>
          </main>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ProductsPage;
