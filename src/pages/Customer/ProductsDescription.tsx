import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import type { ProductResponse } from "../../types/product";
import { useWishlistStore } from "../../store/wishlistStore";
import type { Product } from "../../store/useProductStore";
import { useCartStore } from "../../store/cartStore";
import useRemoveCartItem from "../../hooks/Customer/CartHooks/useRemoveCartItem";
import useDebouncedUpdateCart from "../../hooks/Customer/CartHooks/useDebouncedUpdateCart";
import useAddToCart from "../../hooks/Customer/CartHooks/useAddToCart";
import { useAuthStore } from "../../store/authStore";
import ProductImageGallery from "../../components/Customer/ProductImageGallery";
import { Star, Truck, RotateCcw, Shield } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import { getProductReviews } from "../../api/reviewApi"; // you'll create this file next

const ProductDescription: React.FC = () => {
  // route is defined as /product/:productId in App.tsx, so read productId here
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  // sanitize and validate productId from route
  const idNum = productId ? Number(productId) : NaN;

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<ProductResponse, Error>({
    queryKey: ["product", idNum],
    queryFn: () => productsApi.getProductById(idNum),
    enabled: Number.isFinite(idNum), // only run when we have a valid numeric id
    retry: 1,
  });

  // use centralized wishlist store so wishlist is consistent across the app
  const { addToWishlist } = useWishlistStore();
  const { cartItems } = useCartStore();
  const removeMutation = useRemoveCartItem();
  const debouncedUpdater = useDebouncedUpdateCart();
  const addToCartMutation = useAddToCart();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<
    "description" | "specs" | "reviews"
  >("description");

  // Fetch reviews using TanStack Query (lightweight, read-only)
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: () => getProductReviews(product!.id),
    enabled: !!product?.id,
    staleTime: 1000 * 60 * 5,
  });
  // use reviewsLoading only in the Reviews tab

  // If product is still loading or failed, show early states
  if (isLoading)
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <LoadingState message="Loading product details..." />
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
            {Number.isFinite(idNum)
              ? "Product Not Found"
              : "Invalid product id"}
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

  const priceNum = Number(product.price ?? 0);
  const discountPriceNum = product.discount_price
    ? Number(product.discount_price)
    : null;
  const discountPercent = discountPriceNum
    ? Math.round(((priceNum - discountPriceNum) / priceNum) * 100)
    : 0;

  const primaryImage: string | undefined =
    product.images && product.images.length
      ? product.images[0].url
      : (product as unknown as { image?: string }).image;
  const imagesUrls: string[] | undefined = product.images
    ? product.images.map((i) => i.url)
    : undefined;

  const ratingValue = (product as unknown as { rating?: number }).rating ?? 4.5;

  // normalize to the local Product shape expected by useProductStore
  const storeProduct = {
    id: product.id,
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price ?? 0),
    discount_price: product.discount_price
      ? Number(product.discount_price)
      : undefined,
    stock: product.stock,
    images: imagesUrls,
    slug: product.slug,
    image: primaryImage ?? "",
    is_active: product.is_active,
    created_at: product.created_at,
    rating: ratingValue,
  };

  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 pt-5 pb-5 bg-[var(--color-white)] text-md">
        <nav className="flex items-center gap-2 justify-center">
          <Link
            to="/"
            className="text-[var(--color-accent-light)] hover:text-[var(--color-accent-darker)] transition"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="text-[var(--color-accent-light)] hover:text-[var(--color-accent-darker)] transition"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-[var(--color-accent-darker)]">
            {product.name.length > 20
              ? product.name.slice(0, 20) + "..."
              : product.name}
          </span>
        </nav>
      </div>

      {/* Main section */}
      <section className="pb-8 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[var(--color-background)] p-6 rounded-xl shadow-md">
          {/* Left - Images */}
          <div className="p-4">
            <ProductImageGallery
              image={primaryImage ?? ""}
              images={imagesUrls}
            />
          </div>

          {/* Right - Product Info */}
          <div className="p-6 flex flex-col justify-center">
            {/* Product Info */}
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 mb-1">
              {product.name}
            </h1>
            <p className="text-[var(--color-text-muted)] text-md mb-1">
              {product.description}
            </p>

            {/* Seller */}
            <p className="text-sm text-gray-600 mb-4">
              Seller:
              <span className="font-semibold text-gray-800">Indiflashmart</span>
            </p>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < ratingValue
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {ratingValue} | 2.7k Ratings
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-4 mb-0">
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-primary-400)]">
                ₹{discountPriceNum ?? priceNum}
              </p>
              {discountPriceNum && (
                <>
                  <p className="text-gray-400 line-through">₹{priceNum}</p>
                  <span className="ml-2 text-[var(--color-accent)] font-medium">
                    ({discountPercent}% OFF)
                  </span>
                </>
              )}
            </div>
            <p className="text-green-600 mb-8">Inclusive of all taxes</p>

            {/* Bottom Actions */}
            <div className="flex items-center gap-4 mb-6">
              {/* If product in cart show quantity controls, else show add button */}
              {cartItems.find((c) => c.id === product.id) ? (
                (() => {
                  const c = cartItems.find((ci) => ci.id === product.id)!;
                  const dec = () => {
                    if (c.quantity <= 1) removeMutation.mutate(c.id);
                    else
                      debouncedUpdater.scheduleUpdate({
                        id: c.id,
                        quantity: Math.max(1, c.quantity - 1),
                      });
                  };
                  const inc = () =>
                    debouncedUpdater.scheduleUpdate({
                      id: c.id,
                      quantity: c.quantity + 1,
                    });

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
                  onClick={async () => {
                    if (!user)
                      return navigate("/login", {
                        state: { from: location.pathname + location.search },
                      });
                    try {
                      await addToCartMutation.mutateAsync({
                        id: storeProduct.id,
                        quantity: 1,
                      });
                    } catch {
                      // handled in hook
                    }
                  }}
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
                onClick={() => {
                  if (!user)
                    return navigate("/login", {
                      state: { from: location.pathname + location.search },
                    });
                  addToWishlist(storeProduct as Product);
                }}
                className="flex-1 py-3 cursor-pointer rounded-lg font-semibold transition-all duration-150 border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-primary-100"
              >
                WISHLIST
              </button>
            </div>
            <hr className="my-3 border-[var(--color-gray-300)]" />

            {/* Bottom Info */}
            <div className="grid grid-cols-3 gap-4 pt-3">
              <div className="cursor-pointer rounded hover:bg-gray-100 flex flex-col items-center text-center gap-2 text-accent p-2">
                <Truck className="h-8 w-8 text-accent-darker" />
                <span className="text-sm font-medium text-accent-darker">
                  Free Shipping
                </span>
              </div>
              <div className="cursor-pointer rounded hover:bg-gray-100 flex flex-col items-center text-center gap-2 text-accent p-2">
                <Shield className="h-8 w-8 text-accent-darker" />
                <span className="text-sm font-medium text-accent-darker">
                  2 Year Warranty
                </span>
              </div>
              <div className="cursor-pointer rounded hover:bg-gray-100 flex flex-col items-center text-center gap-2 p-2">
                <RotateCcw className="h-8 w-8 text-accent-darker" />
                <span className="text-sm font-medium text-accent-darker">
                  30-Day Returns
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-20 mb-15 bg-surface rounded-xl shadow-md p-6">
        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-4">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-4 py-2 font-semibold cursor-pointer ${
              activeTab === "description"
                ? "text-[var(--color-primary-400)] border-b-2 border-[var(--color-accent)]"
                : "text-gray-600 hover:text-[var(--color-primary-400)]"
            }`}
          >
            Description
          </button>

          <button
            onClick={() => setActiveTab("specs")}
            className={`px-4 py-2 font-semibold cursor-pointer ${
              activeTab === "specs"
                ? "text-[var(--color-primary-400)] border-b-2 border-[var(--color-accent)]"
                : "text-gray-600 hover:text-[var(--color-primary-400)]"
            }`}
          >
            Specifications
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 font-semibold cursor-pointer ${
              activeTab === "reviews"
                ? "text-[var(--color-primary-400)] border-b-2 border-[var(--color-accent)]"
                : "text-gray-600 hover:text-[var(--color-primary-400)]"
            }`}
          >
            Reviews ({reviews?.length ?? 0})
          </button>
        </div>

        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="mt-4 text-gray-700 leading-relaxed">
            {product?.description ?? "No description available."}
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specs" && (
          <div className="mt-4 text-gray-700 leading-relaxed">
            {product.specifications ? (
              <ul className="list-disc pl-6 space-y-1">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}: </strong> {value}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No specifications available.</p>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

            {reviewsLoading ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="border border-gray-200 rounded-lg p-4 bg-[var(--color-background)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-[var(--color-primary-400)]">
                        {r.author ?? "Anonymous"}
                      </div>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < (r.rating ?? 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm">{r.comment}</p>
                    <p className="text-xs text-gray-500 mt-1">{r.date}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDescription;
