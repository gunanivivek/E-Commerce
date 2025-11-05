import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../store/productStore";
import { useProductStore } from "../../store/useProductStore";
import { useCartStore } from "../../store/cartStore";
import ProductImageGallery from "../../components/Customer/ProductImageGallery";
import { Star } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

const SingleProductPage: React.FC = () => {
  // route is defined as /product/:productId in App.tsx, so read productId here
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(Number(productId)),
  });

  const { addToCart, addToWishlist } = useProductStore();
  const { cartItems, updateQuantity, removeItem } = useCartStore();

  if (isLoading)
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading product details...</p>
        </div>
        <Footer />
      </>
    );

  if (isError || !product)
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Products Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 cursor-pointer hover:bg-[var(--color-primary-400)] hover:text-white rounded-md text-[var(--color-primary-400)] bg-[var(--color-primary-500)] transition"
          >
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );

  const discountPercent = product.discount_price
    ? Math.round(
        ((product.price - product.discount_price) / product.price) * 100
      )
    : 0;

  return (
    <>
      <Header />
      <section className="min-h-screen bg-[var(--color-background)] py-8 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[var(--color-primary-100)] p-6 rounded-xl shadow-md">
          {/* Left - Images */}
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <ProductImageGallery image={product.image} images={product.images} />
          </div>

          {/* Right - Product Info */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-4">{product.description}</p>

            {/* Seller */}
            <p className="text-sm text-gray-600 mb-4">
              Seller:{" "}
              <span className="font-semibold text-gray-800">Indiflashmart</span>
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < (product.rating ?? 4)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating ?? 4.5} | 2.7k Ratings
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-4 mb-4">
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-primary-400)]">
                ₹{product.discount_price ?? product.price}
              </p>
              {product.discount_price && (
                <>
                  <p className="text-gray-400 line-through">
                    ₹{product.price}
                  </p>
                  <span className="ml-2 text-[var(--color-accent)] font-medium">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>

            <p className="text-green-600 mb-4">Inclusive of all taxes</p>

            {/* Size (Static for now) */}
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-1">SELECT SIZE</p>
              <button className="border border-gray-400 rounded-full px-4 py-2 text-sm hover:border-[var(--color-primary-400)] transition">
                125-150 ML
              </button>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-6">
              {/* If product in cart show quantity controls, else show add button */}
              {cartItems.find((c) => c.id === product.id) ? (
                (() => {
                  const c = cartItems.find((ci) => ci.id === product.id)!;
                  const dec = () => {
                    if (c.quantity <= 1) removeItem(c.id);
                    else updateQuantity(c.id, -1);
                  };
                  const inc = () => updateQuantity(c.id, 1);

                  return (
                    <div className="flex items-center gap-2 min-w-61">
                      <button
                        onClick={dec}
                        className="px-3 py-1 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md"
                        aria-label="decrease"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border rounded-md min-w-[36px] text-center">
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
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all duration-150 shadow-sm ${
                    product.stock === 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5"
                  }`}
                >
                  {product.stock === 0 ? "Out of stock" : "ADD TO BAG"}
                </button>
              )}

              <button
                onClick={() => addToWishlist(product)}
                className="flex-1 py-3 rounded-lg font-semibold transition-all duration-150 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-black"
              >
                WISHLIST
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default SingleProductPage;
