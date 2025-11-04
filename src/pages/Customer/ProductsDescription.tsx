import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById } from "../../store/productStore";
import { useProductStore } from "../../store/useProductStore";
import ProductImageGallery from "../../components/Customer/ProductImageGallery";
import { Star } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

const SingleProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProductById(Number(id)),
  });

  const { addToCart, addToWishlist } = useProductStore();

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
            Product Not Found
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="px-4 py-2 bg-[var(--color-primary-400)] text-white rounded-md hover:bg-[var(--color-primary-500)] transition"
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
          <ProductImageGallery image={product.image} />

          {/* Right - Product Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-600">{product.description}</p>

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
            <div className="flex items-center">
              <p className="text-2xl font-bold text-[var(--color-primary-400)]">
                ₹{product.discount_price ?? product.price}
              </p>
              {product.discount_price && (
                <>
                  <p className="text-gray-400 line-through ml-3">
                    ₹{product.price}
                  </p>
                  <span className="ml-2 text-[var(--color-primary-400)] font-medium">
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
              <button
                onClick={() => addToCart(product)}
                className="flex-1 bg-[var(--color-primary-400)] hover:bg-[var(--color-primary-500)] text-white py-3 rounded-lg font-semibold transition"
              >
                ADD TO BAG
              </button>
              <button
                onClick={() => addToWishlist(product)}
                className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
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
