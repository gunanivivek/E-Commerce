import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import WishlistCard from "../../components/Customer/WishlistCard";

const WishlistPage: React.FC = () => {
  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 mt-5 mb-5 bg-[var(--color-primary-50)] text-md">
        <nav className="flex items-center gap-2 justify-center">
          <Link
            to="/"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Products
          </Link>
          <span>/</span>
          <a
            className="text-[var(--color-accent)]"
          >
            Wishlist
          </a>
        </nav>
      </div>

      <div className="min-h-screen bg-white text-[var(--color-text)]">
        <WishlistCard />
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
