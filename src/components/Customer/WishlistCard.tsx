import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import type { Product } from "../../store/useProductStore";

const WishlistCard: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore() as unknown as { addToCart?: (p: Product) => void };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
        <p className="text-lg font-medium">Your wishlist is empty 💔</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-2 bg-[var(--color-accent)] text-black rounded-md hover:bg-[var(--color-accent-dark)]"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-16 py-10 bg-[var(--color-background)] min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-10 font-logo">
        Your Wishlist
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
          >
            <div
              className="relative h-40 w-full cursor-pointer rounded-md overflow-hidden mb-3 flex items-center justify-center"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
              />
            </div>

            <h3 className="text-[var(--color-primary-400)] font-semibold text-lg text-center mb-2">
              {product.name.length > 20
                ? product.name.slice(0, 20) + "..."
                : product.name}{" "}
            </h3>
            <p className="text-[var(--color-primary-300)] text-md text-center">
              {product.description.length > 55
                ? product.description.slice(0, 55) + "..."
                : product.description}
            </p>
            <p className="text-[var(--color-primary-300)] text-lg text-center">
              ₹{product.discount_price ?? product.price}
            </p>

            <div className="flex items-center justify-between mt-3">
              <button
                onClick={() => addToCart?.(product as Product)}
                className="flex-1 py-2 rounded-lg font-semibold bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] transition-all duration-150"
              >
                Add to Cart
              </button>

              <button
                onClick={() => removeFromWishlist(product.id)}
                className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WishlistCard;
