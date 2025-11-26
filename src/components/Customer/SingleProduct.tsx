import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  useGetWishlist,
  useRemoveWishlist,
  useAddWishlist,
} from "../../hooks/Customer/useWishlistHooks";
import {
  useCart,
  useRemoveFromCart,
  useAddToCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";
import type { Product } from "../../store/useProductStore";
import { Heart, Star } from "lucide-react";

interface ProductCardProps {
  product: Product & { rating?: number; category?: string | null };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const { data: wishlistData } = useGetWishlist(true);
  const { data: cartData } = useCart(true);
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCart();
  const addMutation = useAddToCart();
  const addWishlistMutation = useAddWishlist();
  const removeWishlistMutation = useRemoveWishlist();

  const isProductInWishlist = (
    prodId: number | string | undefined,
    data: unknown
  ) => {
    if (prodId == null) return false;
    const idNum = Number(prodId);
    if (!data) return false;
    const items = Array.isArray(data) ? data : (data as { items?: unknown }).items ?? [];
    return (items as unknown[]).some((it) => {
      if (it == null) return false;
      if (typeof it === "number") return Number(it) === idNum;
      if (typeof it === "object") {
        const obj = it as Record<string, unknown>;
        const maybe = (key: string) => obj[key] as unknown;
        const v1 = maybe("product_id");
        if (v1 !== undefined && v1 !== null) return Number(String(v1)) === idNum;
        const prod = obj["product"] as Record<string, unknown> | undefined;
        if (prod && prod["id"] !== undefined && prod["id"] !== null)
          return Number(String(prod["id"])) === idNum;
        const v2 = maybe("id");
        if (v2 !== undefined && v2 !== null) return Number(String(v2)) === idNum;
        const v3 = maybe("productId");
        if (v3 !== undefined && v3 !== null) return Number(String(v3)) === idNum;
      }
      return false;
    });
  };

  const inWishlist = user && isProductInWishlist(product.id, wishlistData);
  const stock = Number(product.stock ?? NaN);
  const inCart = user && cartData?.items.find((c) => c.product_id === product.id);

  const handleNavigate = () => navigate(`/product/${product.id}`);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (stock === 0) return;
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    addMutation.mutate({ product_id: product.id, quantity: 1 });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname + location.search },
      });

    if (inWishlist) removeWishlistMutation.mutate({ product_id: product.id });
    else addWishlistMutation.mutate({ product_id: product.id });
  };

  const isUpdating = updateMutation.isPending || removeMutation.isPending;

  const hasRating =
    typeof product.average_rating === "number" && product.average_rating > 0;

  return (
    <div
      className="
        w-full h-full 
        bg-white rounded-xl shadow-sm 
        hover:shadow-md hover:-translate-y-0.5 
        transition-transform duration-150 
        flex flex-col
        cursor-pointer
        p-3
      "
      onClick={handleNavigate}
    >
      {/* IMAGE WRAPPER */}
      <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
        {stock === 0 && (
          <div className="absolute top-2 right-2 z-20 bg-[var(--color-light)] text-black px-2.5 py-1 rounded-full text-[10px] font-semibold">
            Out of stock
          </div>
        )}

        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
            No Image Available
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 pt-2 ">
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
              {hasRating ? product.average_rating!.toFixed(1) : "No Ratings"}
            </span>
          </div>
        </div>

        {/* PUSH BUTTONS TO BOTTOM */}
        <div
          className="mt-3 flex items-center justify-between gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* CART SECTION */}
          {inCart ? (
            (() => {
              const c = inCart!;
              const dec = (ev: React.MouseEvent) => {
                ev.stopPropagation();
                if (isUpdating) return;
                if (c.quantity <= 1)
                  removeMutation.mutate({ product_id: c.product_id });
                else
                  updateMutation.mutate({
                    product_id: c.product_id,
                    quantity: Math.max(1, c.quantity - 1),
                  });
              };
              const inc = (ev: React.MouseEvent) => {
                ev.stopPropagation();
                if (isUpdating) return;
                updateMutation.mutate({
                  product_id: c.product_id,
                  quantity: Math.max(1, c.quantity + 1),
                });
              };
              return (
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    disabled={isUpdating}
                    onClick={dec}
                    className={`px-2.5 py-1 rounded-md text-sm cursor-pointer
                      ${
                        isUpdating
                            ? "bg-primary-100 text-accent cursor-not-allowed"
                            : "bg-accent text-primary-100 hover:bg-accent-dark"
                      }
                    `}
                  >
                    -
                  </button>
                  <span className="px-2.5 py-1 border rounded-md text-sm min-w-[2.5rem] text-center">
                    {isUpdating ? (
                      <div className="mx-auto w-4 h-4 rounded-full border-2 border-gray-300 border-t-[var(--color-accent)] animate-spin" />
                    ) : (
                      c.quantity
                    )}
                  </span>
                  <button
                    disabled={isUpdating}
                    onClick={inc}
                    className={`px-2.5 py-1 rounded-md text-sm cursor-pointer
                      ${
                        isUpdating
                          ? "bg-primary-100 text-accent cursor-not-allowed"
                          : "bg-accent text-primary-100 hover:bg-accent-dark"
                      }
                    `}
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
              className={`flex-1 py-3 sm:py-2 cursor-pointer rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 shadow-sm
                ${
                  stock === 0
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md"
                }
              `}
            >
              Add to Cart
            </button>
          )}

          {/* WISHLIST BUTTON */}
          <button
            onClick={handleWishlist}
            className={`
    flex items-center justify-center
    ml-1.5 p-2 rounded-lg border 
    transition-all duration-150 shrink-0 cursor-pointer
    ${
      inWishlist
        ? "bg-transparent text-accent border-accent hover:bg-accent hover:text-primary-100"
        : "border-accent text-accent hover:bg-accent hover:text-primary-100"
    }
  `}
          >
            <Heart
              size={18}
              className="transition-colors duration-150"
              stroke={inWishlist ? "none" : "currentColor"}
              fill={inWishlist ? "currentColor" : "none"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
