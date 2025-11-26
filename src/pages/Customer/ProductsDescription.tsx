import { useParams, useNavigate, useLocation } from "react-router-dom";
import React from "react";
import * as productsApi from "../../api/productsApi";
import { useQuery } from "@tanstack/react-query";
import type { ProductResponse } from "../../types/product";
import {
  useGetWishlist,
  useRemoveWishlist,
  useAddWishlist,
} from "../../hooks/Customer/useWishlistHooks";
import { useAuthStore } from "../../store/authStore";
import ProductImageGallery from "../../components/Customer/ProductImageGallery";
import { Star, Truck, ShieldCheck, BadgeCheck, Headset } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Link } from "react-router-dom";
import LoadingState from "../../components/LoadingState";
import {
  useReviews,
  useCreateReview,
  useSummarizeReviews,
} from "../../hooks/Customer/useReviewHooks";
import { toast } from "react-toastify";
import { useState } from "react";
import {
  useCart,
  useRemoveFromCart,
  useAddToCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";
import ChatbotContainer from "../../components/Customer/ChatbotContainer";
import { Heart, Handbag } from "lucide-react";

const ProductDescription: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const idNum = productId ? Number(productId) : NaN;

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<ProductResponse, Error>({
    queryKey: ["product", idNum],
    queryFn: () => productsApi.getProductById(idNum),
    enabled: Number.isFinite(idNum),
    retry: 1,
  });

  // wishlist hook (mutations mirror cart hooks)
  const { data: wishlistData } = useGetWishlist(true);
  const addWishlistMutation = useAddWishlist();
  const removeWishlistMutation = useRemoveWishlist();
  const { data: cartData } = useCart(true); // gives you cart items and totals
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCart();
  const addMutation = useAddToCart();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const cartItems = cartData?.items ?? [];

  const isProductInWishlist = (
    prodId: number | string | undefined,
    data: unknown
  ) => {
    if (prodId == null) return false;
    const idNum = Number(prodId);
    if (!data) return false;
    const items = Array.isArray(data)
      ? data
      : (data as { items?: unknown }).items ?? [];
    return (items as unknown[]).some((it) => {
      if (it == null) return false;
      if (typeof it === "number") return Number(it) === idNum;
      if (typeof it === "object") {
        const obj = it as Record<string, unknown>;
        const maybe = (key: string) => obj[key] as unknown;
        const v1 = maybe("product_id");
        if (v1 !== undefined && v1 !== null)
          return Number(String(v1)) === idNum;
        const prod = obj["product"] as Record<string, unknown> | undefined;
        if (prod && prod["id"] !== undefined && prod["id"] !== null)
          return Number(String(prod["id"])) === idNum;
        const v2 = maybe("id");
        if (v2 !== undefined && v2 !== null)
          return Number(String(v2)) === idNum;
        const v3 = maybe("productId");
        if (v3 !== undefined && v3 !== null)
          return Number(String(v3)) === idNum;
      }
      return false;
    });
  };

  const isInWishlist = isProductInWishlist(product?.id, wishlistData);

  // Fetch reviews using the centralized review hooks
  const { data: reviews = [], isLoading: reviewsLoading } = useReviews(
    product?.id
  );

  // Ensure `reviews` is always an array in the UI to avoid runtime errors
  type LocalReview = {
    id: string | number;
    author?: string | null;
    rating?: number | null;
    comment?: string | null;
    date?: string | null;
  };

  // normalize different backend shapes into LocalReview[]
  const rawArray: unknown[] = Array.isArray(reviews)
    ? (reviews as unknown[])
    : reviews && typeof reviews === "object"
    ? ((reviews as Record<string, unknown>).reviews as unknown[]) ??
      ((reviews as Record<string, unknown>).data as unknown[]) ??
      []
    : [];

  const normalizedReviews: LocalReview[] = rawArray.map((rev, idx) => {
    const r = rev as Record<string, unknown>;
    const id =
      (r["id"] as string | number | undefined) ??
      `${product?.id ?? "p"}-${idx}`;
    const author =
      (r["name"] as string | undefined) ??
      (r["author"] as string | undefined) ??
      null;
    const ratingRaw = r["rating"];
    const rating =
      typeof ratingRaw === "number"
        ? (ratingRaw as number)
        : Number(String(ratingRaw ?? "0"));
    const comment =
      (r["comment"] as string | undefined) ??
      (r["text"] as string | undefined) ??
      null;
    const date =
      (r["date"] as string | undefined) ??
      (r["created_at"] as string | undefined) ??
      null;
    return {
      id,
      author,
      rating,
      comment,
      date,
    };
  });

  const { data: summaryData, isLoading: summaryLoading } =
    useSummarizeReviews(productId);

  // Show Review Visible Count State
  const [visibleCount, setVisibleCount] = useState(3);

  // Add Review modal state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showInlineReviewForm, setShowInlineReviewForm] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const [reviewAuthor] = useState<string>(user?.full_name ?? "");
  const [expandSummary, setExpandSummary] = useState(false);

  const { mutateAsync: createReviewAsync, isPending: isCreatingReview } =
    useCreateReview(product?.id);

  const handleAddReview = () => {
    if (!user)
      return navigate("/login", {
        state: { from: location.pathname + location.search },
      });
    setShowInlineReviewForm(true);
  };

  const toggleExpand = (id: string | number) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleSaveReview = async () => {
    if (!product) return;
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    type CreateReviewPayload = {
      rating: number;
      comment: string;
      author?: string;
    };

    const payload: CreateReviewPayload = {
      rating: reviewRating,
      comment: reviewComment.trim(),
      author: reviewAuthor?.trim() || undefined,
    };

    try {
      await createReviewAsync(payload);
      setShowInlineReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
    } catch {
      setShowInlineReviewForm(false);
      setReviewComment("");
      setReviewRating(5);
    }
  };

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

  const primaryImage: string | undefined =
    product.images && product.images.length
      ? product.images[0].url
      : (product as unknown as { image?: string }).image;
  const imagesUrls: string[] | undefined = product.images
    ? product.images.map((i) => i.url)
    : undefined;

  const ratingValue = product.average_rating ?? 0;

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
    average_rating: ratingValue,
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, normalizedReviews.length));
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(prev - 3, 3));
  };

  /* Summary HTML Component */
  const ReviewSummaryHTML = ({ html }: { html: string }) => {
    return (
      <div
        className=" 
        prose prose-sm max-w-full
        prose-h1:text-accent-darker prose-h2:text-accent-darker prose-h3:text-accent-dark
        prose-p:text-accent-darker
        prose-strong:text-accent-dark
        prose-ul:list-disc prose-ul:pl-5 prose-li:text-accent-darker
        prose-ol:list-decimal prose-ol:pl-5
        prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:pl-4 prose-blockquote:italic
        whitespace-normal "
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
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
      <section>
        <div className="bg-[var(--color-background)] px-6 md:px-20">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 md:gap-10 gap-3">
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
              <p className="text-[var(--color-text-muted)] md:text-md text-sm mb-1">
                {product.description}
              </p>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(ratingValue)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-slate-300"
                    }`}
                  />
                ))}
                <span className="text-sm font-medium text-slate-600 ml-1">
                  {ratingValue > 0 ? ratingValue.toFixed(1) : "No ratings"}
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
                  </>
                )}
              </div>
              <p className="text-green-600 mb-8 text-sm md:text-md">
                Inclusive of all taxes
              </p>

              {/* Bottom Actions */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                {/* ===== Quantity Buttons (When in cart) ===== */}
                {cartItems.find((c) => c.product_id === product.id) ? (
                  (() => {
                    const c = cartItems.find(
                      (ci) => ci.product_id === product.id
                    )!;

                    const dec = () => {
                      if (c.quantity <= 1)
                        removeMutation.mutate({ product_id: c.product_id });
                      else
                        updateMutation.mutate({
                          product_id: c.product_id,
                          quantity: Math.max(1, c.quantity - 1),
                        });
                    };

                    const inc = () =>
                      updateMutation.mutate({
                        product_id: c.product_id,
                        quantity: c.quantity + 1,
                      });

                    return (
                      <div className="flex flex-2 items-center gap-3 lg:min-w-61">
                        <button
                          onClick={dec}
                          className="px-3 py-2 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md font-semibold"
                          aria-label="decrease"
                        >
                          –
                        </button>

                        <span className="px-4 py-2 border rounded-md min-w-[40px] text-center font-semibold">
                          {c.quantity}
                        </span>

                        <button
                          onClick={inc}
                          className="px-3 py-2 bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-dark)] cursor-pointer rounded-md font-semibold"
                          aria-label="increase"
                        >
                          +
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  /* ===== Add to Bag Button ===== */
                  <button
                    onClick={async () => {
                      if (!user)
                        return navigate("/login", {
                          state: { from: location.pathname + location.search },
                        });
                      try {
                        await addMutation.mutateAsync({
                          product_id: storeProduct.id,
                          quantity: 1,
                        });
                      } catch {
                        // ignore
                      }
                    }}
                    disabled={product.stock === 0}
                    className={`flex flex-1 min-w-[200px] items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-150 shadow-sm
        ${
          product.stock === 0
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-[var(--color-accent)] text-primary-100 hover:bg-[var(--color-accent-dark)] hover:shadow-md transform hover:-translate-y-0.5 cursor-pointer"
        }`}
                  >
                    <Handbag
                      size={18}
                      className="transition-colors duration-150"
                      stroke={product.stock === 0 ? "none" : "currentColor"}
                      fill={product.stock === 0 ? "currentColor" : "none"}
                    />
                    {product.stock === 0 ? "Out of stock" : "ADD TO BAG"}
                  </button>
                )}

                {/* ===== Wishlist Button ===== */}
                <button
                  onClick={async () => {
                    if (!user)
                      return navigate("/login", {
                        state: { from: location.pathname + location.search },
                      });

                    try {
                      if (isInWishlist) {
                        await removeWishlistMutation.mutateAsync({
                          product_id: product.id,
                        });
                      } else {
                        await addWishlistMutation.mutateAsync({
                          product_id: product.id,
                        });
                      }
                    } catch {
                      // ignore
                    }
                  }}
                  disabled={
                    addWishlistMutation.isPending ||
                    removeWishlistMutation.isPending
                  }
                  className={`flex flex-1 min-w-[200px] items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold whitespace-nowrap transition-all duration-150 shadow-sm
      ${
        isInWishlist
          ? "bg-accent text-primary-100 border border-accent hover:bg-transparent hover:text-accent"
          : "border border-accent bg-transparent text-accent hover:bg-accent hover:text-primary-100"
      }
      cursor-pointer`}
                >
                  <Heart
                    size={18}
                    className="transition-colors duration-150"
                    stroke={isInWishlist ? "none" : "currentColor"}
                    fill={isInWishlist ? "currentColor" : "none"}
                  />

                  {isInWishlist
                    ? addWishlistMutation.isPending ||
                      removeWishlistMutation.isPending
                      ? "Removing..."
                      : "ADDED TO WISHLIST"
                    : addWishlistMutation.isPending
                    ? "Adding..."
                    : "ADD TO WISHLIST"}
                </button>
              </div>
              <hr className="my-3 border-[var(--color-gray-300)]" />

              {/* Bottom Info */}
              <div className="grid lg:grid-cols-4 grid-cols-2 gap-4 pt-3">
                <div className="cursor-pointer rounded flex flex-col items-center text-center gap-2 text-accent p-2">
                  <Truck className="h-8 w-8 text-accent-darker" />
                  <span className="text-sm font-medium text-accent-darker">
                    Free Shipping
                  </span>
                </div>
                <div className="cursor-pointer rounded flex flex-col items-center text-center gap-2 text-accent p-2">
                  <ShieldCheck className="h-8 w-8 text-accent-darker" />
                  <span className="text-sm font-medium text-accent-darker">
                    Secure Payments
                  </span>
                </div>
                <div className="cursor-pointer rounded flex flex-col items-center text-center gap-2 text-accent p-2">
                  <Headset className="h-8 w-8 text-accent-darker" />
                  <span className="text-sm font-medium text-accent-darker">
                    24/7 Customer Support
                  </span>
                </div>
                <div className="cursor-pointer rounded flex flex-col items-center text-center gap-2 text-accent p-2">
                  <BadgeCheck className="h-8 w-8 text-accent-darker" />
                  <span className="text-sm font-medium text-accent-darker">
                    Quality Checked
                  </span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-3 border-accent max-w-7xl mx-auto" />

          {/* Average Review from all customers */}
          <div className="mx-auto max-w-7xl p-6 pb-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold mb-1 text-accent-dark">
                Average Customer Ratings and Reviews
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(ratingValue)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-primary-100"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-accent-dark">
                  {ratingValue > 0 ? ratingValue.toFixed(1) : "No ratings yet"}
                </span>
              </div>
            </div>
            <div className="mt-2">
              <div className="rounded-xl border border-primary-50 bg-background shadow-sm p-5">
                <p className="text-accent-dark font-semibold">
                  Based on {normalizedReviews.length} customer reviews, here is
                  the summarized review for this product.
                </p>

                <div className="mt-2 text-accent-light text-sm">
                  {summaryLoading ? (
                    <span>Loading summary...</span>
                  ) : summaryData ? (
                    <div className="text-primary-400 leading-relaxed">
                      {summaryData.summary ? (
                        <>
                          <ReviewSummaryHTML
                            html={
                              expandSummary
                                ? summaryData.summary
                                : summaryData.summary.length > 320
                                ? summaryData.summary.slice(0, 320) + "..."
                                : summaryData.summary
                            }
                          />

                          {/* Read More / Read Less Button */}
                          {summaryData.summary.length > 200 && (
                            <div className="flex justify-end mt-1">
                              <button
                                onClick={() => setExpandSummary(!expandSummary)}
                                className="text-accent-dark hover:underline cursor-pointer text-sm font-bold"
                              >
                                {expandSummary ? "Read less" : "Read more"}
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        "No summary available"
                      )}
                    </div>
                  ) : (
                    <span>No summary available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="mx-auto max-w-7xl p-6 pb-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-accent-dark">
                Customer Reviews ({normalizedReviews.length})
              </h3>
              <button
                className="border cursor-pointer border-accent px-5 py-2 rounded-lg text-accent-darker hover:bg-accent hover:text-primary-100 transition-all"
                onClick={handleAddReview}
              >
                Add Review
              </button>
            </div>

            {/* Always render inline review form outside conditional */}
            {showInlineReviewForm && (
              <div className="rounded-xl border border-primary-50 bg-background shadow-sm p-5 my-5">
                {/* Top: Avatar + Name + Star Selector */}
                <div className="flex flex-col sm:flex-row justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-400">
                      {(
                        reviewAuthor?.[0] ??
                        user?.full_name?.[0] ??
                        "A"
                      ).toUpperCase()}
                    </div>
                    <span className="font-medium text-primary-400">
                      {reviewAuthor || user?.full_name || "Anonymous"}
                    </span>
                  </div>

                  <div className="flex items-center mt-4 sm:mt-0">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`sm:w-6 sm:h-6 h-5 w-5 cursor-pointer ${
                          star <= reviewRating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-primary-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review..."
                  className="mt-4 w-full border border-primary-100 rounded-lg px-3 py-3 text-gray-700 leading-relaxed focus:outline-none focus:ring focus:ring-accent-light h-28"
                />

                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => {
                      setShowInlineReviewForm(false);
                      setReviewComment("");
                      setReviewRating(5);
                    }}
                    className="px-4 py-2 rounded-md border border-accent-dark text-accent-darker hover:bg-accent-dark hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleSaveReview}
                    disabled={isCreatingReview}
                    className="px-4 py-2 rounded-md bg-accent-dark hover:bg-accent text-white transition cursor-pointer"
                  >
                    {isCreatingReview ? "Saving..." : "Submit Review"}
                  </button>
                </div>
              </div>
            )}

            {/* Now the actual review list OR empty message */}
            {reviewsLoading ? (
              <p className="text-accent-light">Loading reviews...</p>
            ) : normalizedReviews.length === 0 ? (
              <p className="text-accent-light">No reviews yet.</p>
            ) : (
              <div className="space-y-5 my-6">
                {normalizedReviews.slice(0, visibleCount).map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-primary-50 bg-background shadow-sm hover:shadow-lg p-5 transition-all duration-200 hover:-translate-y-[2px]"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-400">
                          {(r.author ?? "A")[0].toUpperCase()}
                        </div>
                        <span className="font-medium text-primary-400">
                          {r.author ?? "Anonymous"}
                        </span>
                      </div>

                      <div className="flex pt-2 md:pt-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < (r.rating ?? 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-primary-100"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 text-gray-700 leading-relaxed">
                      {r.comment ? (
                        <>
                          {expandedReviews[r.id]
                            ? r.comment
                            : r.comment.length > 200
                            ? r.comment.slice(0, 200) + "..."
                            : r.comment}

                          {r.comment.length > 200 && (
                            <button
                              className="text-accent-dark ml-2 hover:underline cursor-pointer text-sm font-bold"
                              onClick={() => toggleExpand(r.id)}
                            >
                              {expandedReviews[r.id]
                                ? "Read less"
                                : "Read more"}
                            </button>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                ))}

                {/* Show more / less */}
                <div className="flex gap-4 mt-10">
                  {visibleCount > 3 && (
                    <button
                      className="hover:underline text-accent-dark cursor-pointer"
                      onClick={handleShowLess}
                    >
                      Read less
                    </button>
                  )}
                  {visibleCount < normalizedReviews.length && (
                    <button
                      className="hover:underline text-accent-dark cursor-pointer"
                      onClick={handleShowMore}
                    >
                      Read more
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <ChatbotContainer />
      <Footer />
    </>
  );
};

export default ProductDescription;
