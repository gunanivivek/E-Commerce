/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  useGetWishlist,
  useRemoveWishlist,
  useClearWishlist,
} from "../../hooks/Customer/useWishlistHooks";
import {
  useCart,
  useRemoveFromCart,
  useAddToCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";
import type { Product } from "../../store/useProductStore";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import { Trash, Star } from "lucide-react";

const ProductSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md p-4 flex flex-col animate-pulse">
    <div className="h-40 bg-gray-200 rounded-md mb-3"></div>
    <div className="h-5 bg-gray-200 rounded-md mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded-md mb-2 w-full"></div>
    <div className="h-4 bg-gray-200 rounded-md mb-3 w-2/3"></div>
    <div className="h-6 bg-gray-200 rounded-md w-1/2 mb-4"></div>
    <div className="flex gap-2 mt-auto">
      <div className="h-9 flex-1 bg-gray-200 rounded-md"></div>
      <div className="h-9 w-9 bg-gray-200 rounded-md"></div>
    </div>
  </div>
);

const WishlistCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: wishlistItems = [], isLoading: wishlistLoading } =
    useGetWishlist(true);
  const removeWishlistMutation = useRemoveWishlist();
  const clearWishlistMutation = useClearWishlist();
  const { data: cartData } = useCart(true); // gives you cart items and totals
  const removeCartMutation = useRemoveFromCart();
  const updateMutation = useUpdateCart();
  const addMutation = useAddToCart();
  const user = useAuthStore((s) => s.user);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<number | undefined>(
    undefined
  );
  // Normalize wishlist items safely
  const rawList = Array.isArray(wishlistItems)
    ? wishlistItems
    : wishlistItems?.items ?? [];

  const wishlistArray: Product[] = rawList
    .map((wi: any) => wi?.product ?? wi) // if { product }, use product
    .filter((p: any) => p && p.id); // remove undefined/bad entries

  const filteredWishlist = wishlistArray.filter(
    (product) =>
      // if cartData isn't available yet, don't filter anything out
      !(
        cartData?.items?.some(
          (cartItem) => cartItem.product_id === product.id
        ) ?? false
      )
  );

  if (wishlistLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (
    !wishlistLoading &&
    (!filteredWishlist || filteredWishlist.length === 0)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col text-center">
        <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary-400)]">
          Your wishlist is empty
        </h1>
        <p className="text-[var(--color-gray-600)] mb-8">
          Start shopping to add items to your wishlist
        </p>
        <Link
          to="/products"
          className="bg-[var(--color-accent)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-accent-dark)] transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="px-6 md:px-16 py-5 bg-[var(--color-background)] min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-center text-accent mb-0 font-logo">
          Your Wishlist
        </h2>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowClearConfirm(true);
            }}
            className="px-3 cursor-pointer py-2 text-accent-dark rounded-md border border-accent text-sm hover:bg-accent hover:text-primary-100 "
          >
            Clear Wishlist
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWishlist.map((product: Product) => {
          const inCart = cartData?.items.find(
            (c) => c.product_id === product.id
          );
          const stock = Number(product.stock ?? 0);
          const average_rating = product?.average_rating ?? 0;
          const hasRating = average_rating > 0;

          const handleAdd = async (e: React.MouseEvent) => {
            e.stopPropagation();
            if (stock === 0) return;
            if (!user)
              return navigate("/login", {
                state: { from: location.pathname + location.search },
              });
            try {
              await addMutation.mutateAsync({
                product_id: product.id,
                quantity: 1,
              });
            } catch {
              // handled in hook
            }
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
                {(() => {
                  const p = product as Partial<{
                    image?: string;
                    image_url?: string;
                    images?: { url?: string }[];
                    url?: string;
                  }>;
                  const imageSrc =
                    p.image ??
                    p.image_url ??
                    (Array.isArray(p.images) && p.images[0]?.url) ??
                    p.url ??
                    "";

                  return imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  );
                })()}
              </div>

              <h3 className=" sm:text-[15px] text-accent-dark font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.name.length > 75
                  ? product.name.slice(0, 75) + "..."
                  : product.name}
              </h3>

              <div className="mt-1 flex items-center justify-between gap-2">
                <p className="text-[var(--color-primary-400)] font-bold text-base sm:text-lg whitespace-nowrap">
                  ₹{product.discount_price ?? product.price}
                  {product.discount_price && (
                    <span className="text-gray-400 line-through text-xs sm:text-sm ml-1.5">
                      ₹{product.price}
                    </span>
                  )}
                </p>

                <div
                  className={`
              flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium shadow-sm
              ${
                hasRating
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-slate-200 text-slate-700"
              }
            `}
                >
                  <Star
                    size={12}
                    className={hasRating ? "text-yellow-500" : "text-slate-500"}
                  />
                  <span className="font-semibold">
                    {hasRating ? average_rating.toFixed(1) : "No Ratings"}
                  </span>
                </div>
              </div>

              {Number.isFinite(stock) && stock <= 0 ? (
                <p className="text-xs text-gray-500 mb-2">
                  Stock: {stock > 0 ? stock : "Out of stock"}
                </p>
              ) : null}

              <div className="flex items-center justify-between mt-3">
                {inCart ? (
                  (() => {
                    const c = inCart!;
                    const dec = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      if (c.quantity <= 1)
                        removeCartMutation.mutate({ product_id: c.product_id });
                      else
                        updateMutation.mutate({
                          product_id: c.product_id,
                          quantity: Math.max(1, c.quantity - 1),
                        });
                    };
                    const inc = (ev: React.MouseEvent) => {
                      ev.stopPropagation();
                      updateMutation.mutate({
                        product_id: c.product_id,
                        quantity: Math.max(1, c.quantity + 1),
                      });
                    };
                    return (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={dec}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                          aria-label="decrease"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 border rounded-md min-w-[70px] text-center">
                          {c.quantity}
                        </span>
                        <button
                          onClick={inc}
                          className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
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
                    className={`flex-1 py-2 cursor-pointer rounded-lg font-semibold transition-all duration-150 shadow-sm ${
                      stock === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                    }`}
                  >
                    {stock === 0 ? "Out of stock" : "Add to Cart"}
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRemoveTarget(product.id);
                    setShowRemoveConfirm(true);
                  }}
                  className="ml-2 p-2 border cursor-pointer rounded-lg transition-all duration-150 border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-accent hover:text-primary-100"
                >
                  <Trash />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Clear wishlist?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will remove all items from your wishlist. Are you sure you
              want to continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded border border-accent text-accent cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await clearWishlistMutation.mutateAsync();
                  } finally {
                    setShowClearConfirm(false);
                  }
                }}
                disabled={clearWishlistMutation.isPending}
                className="px-4 py-2 rounded bg-accent text-primary-100 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
              >
                {clearWishlistMutation.isPending ? "Clearing..." : "Clear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove single-item confirm modal */}
      {showRemoveConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowRemoveConfirm(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-3">Remove item?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This will remove the selected item from your wishlist. Continue?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRemoveConfirm(false)}
                className="px-4 py-2 rounded border border-accent text-accent cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    if (removeTarget != null) {
                      await removeWishlistMutation.mutateAsync({
                        product_id: removeTarget,
                      });
                    }
                  } finally {
                    setShowRemoveConfirm(false);
                    setRemoveTarget(undefined);
                  }
                }}
                disabled={removeWishlistMutation.isPending}
                className="px-4 py-2 rounded bg-accent text-primary-100 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
              >
                {removeWishlistMutation.isPending ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WishlistCard;
