import React from "react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import { useProductStore } from "../../store/useProductStore";
import type { Product } from "../../store/useProductStore";

const WishlistCard: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist } = useWishlistStore();
  const { cartItems, updateQuantity, removeItem } = useCartStore();
  const { addToCart } = useProductStore();

  if (!wishlist || wishlist.length === 0) {
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
        {wishlist.map((product: Product) => {
          const inCart = cartItems.find((c) => c.id === product.id);
          const stock = Number(product.stock ?? 0);

          const handleAdd = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (stock === 0) return;
            addToCart(product as Product);
          };

          return (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
            >
              <div
                className="relative h-40 w-full cursor-pointer rounded-md overflow-hidden mb-3 flex items-center justify-center"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {/* Out of stock badge - mirrors ProductsCard style */}
                {stock === 0 && (
                  <div
                    aria-hidden
                    className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-3 py-1 rounded-full text-xs font-semibold"
                  >
                    Out of stock
                  </div>
                )}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </div>

              <h3
                onClick={() => navigate(`/product/${product.id}`)}
                className="text-[var(--color-primary-400)] cursor-pointer font-semibold text-lg text-center mb-2"
              >
                {product.name?.length > 20
                  ? product.name.slice(0, 20) + "..."
                  : product.name}
              </h3>

              <p className="text-[var(--color-primary-300)] text-md">
                {product.description
                  ? product.description.length > 55
                    ? product.description.slice(0, 55) + "..."
                    : product.description
                  : ""}
              </p>

              <p className="text-[var(--color-primary-400)] font-bold text-lg">
                ₹{product.discount_price ?? product.price}
                {product.discount_price && (
                  <span className="text-gray-400 line-through text-sm ml-2">
                    ₹{product.price}
                  </span>
                )}
              </p>

              {Number.isFinite(stock) && stock <= 0 ? (
                <p className="text-xs text-gray-500 mb-2">
                  Stock: {stock > 0 ? stock : "Out of stock"}
                </p>
              ) : null}

              {/* Rating */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <svg
                    key={index}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={index < 4 ? "#facc15" : "#e5e7eb"}
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.854L19.335 24 12 19.896 4.665 24 6 15.604 0 9.75l8.332-1.595z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {product.rating}
                </span>
              </div>

              <div className="flex items-center justify-between mt-3">
                {inCart ? (
                  (() => {
                    const c = inCart!;
                    const dec = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      if (c.quantity <= 1) removeItem(c.id);
                      else updateQuantity(c.id, -1);
                    };
                    const inc = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      updateQuantity(c.id, 1);
                    };
                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={dec}
                          className="px-3 py-1 cursor-pointer bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                          aria-label="decrease"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={inc}
                          className="px-3 py-1 cursor-pointer bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                          aria-label="increase"
                        >
                          +
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <button
                    onClick={handleAdd}
                    disabled={stock === 0}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-150 shadow-sm ${
                      stock === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                    }`}
                  >
                    {stock === 0 ? "Out of stock" : "Add to Cart"}
                  </button>
                )}

                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default WishlistCard;
