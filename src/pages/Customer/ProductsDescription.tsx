import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as productsApi from "../../api/productsApi";
import type { ProductResponse } from "../../types/product";
import { useProductStore } from "../../store/useProductStore";
import type { Product } from "../../store/useProductStore";
import { useCartStore } from "../../store/cartStore";
import ProductImageGallery from "../../components/Customer/ProductImageGallery";
import { Star } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { Link } from "react-router-dom";

const SingleProductPage: React.FC = () => {
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

  const { addToCart, addToWishlist } = useProductStore();
  const { cartItems, updateQuantity, removeItem } = useCartStore();
  // const [activeTab, setActiveTab] = useState("description");

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
      <section className="min-h-screen pb-8 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-[var(--color-background)] p-6 rounded-xl shadow-md">
          {/* Left - Images */}
          <div className="p-4">
            <ProductImageGallery
              image={primaryImage ?? ""}
              images={imagesUrls}
            />
          </div>

          {/* Right - Product Info */}
          <div className="p-6">
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
                  onClick={() => addToCart(storeProduct as Product)}
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
                onClick={() => addToWishlist(storeProduct as Product)}
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
