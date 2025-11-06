import React from "react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import WishlistCard from "../../components/Customer/WishlistCard";

const WishlistPage: React.FC = () => {
  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="px-6 md:px-20 mt-10 mb-5 bg-[var(--color-primary-50)] text-md">
        <nav className="flex items-center gap-2 justify-center">
          <a
            href="/"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Home
          </a>
          <span>/</span>
          <a
            href="/products"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Products
          </a>
          <span>/</span>
          <a
            className="text-[var(--color-accent)]"
          >
            Cart
          </a>
        </nav>
      </div>

      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
        <WishlistCard />
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
