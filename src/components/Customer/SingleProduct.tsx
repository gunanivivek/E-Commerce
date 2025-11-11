import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
// import { useProductStore } from "../../store/useProductStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import useRemoveCartItem from "../../hooks/Customer/CartHooks/useRemoveCartItem";
import useDebouncedUpdateCart from "../../hooks/Customer/CartHooks/useDebouncedUpdateCart";
import useAddToCart from "../../hooks/Customer/CartHooks/useAddToCart";
import type { Product } from "../../store/useProductStore";

interface ProductCardProps {
  product: Product & { rating?: number; category?: string | null };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  // product store left for wishlist helper; addToCart replaced by react-query hook
  const { addToWishlist } = useWishlistStore();
  const { cartItems } = useCartStore();
  const removeMutation = useRemoveCartItem();
  const debouncedUpdater = useDebouncedUpdateCart();
  const addToCartMutation = useAddToCart();

  const stock = Number(product.stock ?? NaN);
  const inCart = cartItems.find((c) => c.id === product.id);

  // ✅ Always allow navigation
  const handleNavigate = () => navigate(`/product/${product.id}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stock === 0) return; // Still block cart action
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    addToCartMutation.mutate({ id: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    addToWishlist(product);
  };

  return (
    <div
      key={product.id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-transform transform flex flex-col justify-between"
      onClick={handleNavigate} // ✅ Entire card clickable (except buttons)
    >
      <div className="relative h-40 w-full rounded-md overflow-hidden mb-3 flex items-center justify-center">
        {stock === 0 && (
          <div className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-3 py-1 rounded-full text-xs font-semibold">
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
          <span className="text-primary-200 text-sm">No Image Available</span>
        )}
      </div>

      <div className="cursor-pointer">
        <h3 className="text-accent-dark font-semibold text-lg text-center mb-2 hover:underline">
          {product.name.length > 15 ? product.name.slice(0, 15) + "..." : product.name}
        </h3>

        <p className="text-sm text-accent mb-1 min-h-[60px]">
          {(() => {
            const desc = product.description ?? "";
            const maxWords = 8;
            const words = desc.trim().split(/\s+/).filter(Boolean);
            return words.length <= maxWords
              ? desc
              : words.slice(0, maxWords).join(" ") + "...";
          })()}
        </p>

        <p className="text-[var(--color-primary-400)] font-bold text-lg">
          ₹{product.discount_price ?? product.price}
          {product.discount_price && (
            <span className="text-gray-400 line-through text-sm ml-2">
              ₹{product.price}
            </span>
          )}
        </p>

        {Number.isFinite(stock) && (
          <p className="text-xs text-gray-500 mb-2">
            Stock: {stock > 0 ? stock : "Out of stock"}
          </p>
        )}

        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={index < (product.rating ?? 0) ? "#facc15" : "#e5e7eb"}
              className="w-5 h-5"
            >
              <path d="M12 .587l3.668 7.568L24 9.75l-6 5.854L19.335 24 12 19.896 4.665 24 6 15.604 0 9.75l8.332-1.595z" />
            </svg>
          ))}
          <span className="text-sm text-gray-600 ml-2">{product.rating ?? 4.5}</span>
        </div>
      </div>

      {/* Buttons */}
      <div
        className="flex items-center justify-between mt-3"
        onClick={(e) => e.stopPropagation()} // ✅ prevent card click on button clicks
      >
        {inCart ? (
          (() => {
            const c = inCart!;
            const dec = (ev: React.MouseEvent) => {
              ev.stopPropagation();
              if (c.quantity <= 1) removeMutation.mutate(c.id);
              else debouncedUpdater.scheduleUpdate({ id: c.id, quantity: Math.max(1, c.quantity - 1) });
            };
            const inc = (ev: React.MouseEvent) => {
              ev.stopPropagation();
              debouncedUpdater.scheduleUpdate({ id: c.id, quantity: c.quantity + 1 });
            };
            return (
              <div className="flex items-center gap-2">
                <button
                  onClick={dec}
                  className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                >
                  -
                </button>
                <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                  {c.quantity}
                </span>
                <button
                  onClick={inc}
                  className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                >
                  +
                </button>
              </div>
            );
          })()
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all duration-150 shadow-sm ${
              stock === 0
                ? "bg-accent-light text-accent-light cursor-not-allowed"
                : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
            }`}
          >
            Add to Cart
          </button>
        )}
        <button
          onClick={handleWishlist}
          className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
          aria-label="add to wishlist"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-5 h-5"
          >
            <path d="M12 21C12 21 4 13.647 4 8.75C4 6.17893 6.17893 4 8.75 4C10.2355 4 11.6028 4.80549 12 6.00613C12.3972 4.80549 13.7645 4 15.25 4C17.8211 4 20 6.17893 20 8.75C20 13.647 12 21 12 21Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
