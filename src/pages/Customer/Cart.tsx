import React from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ConfirmModal from "../../components/Customer/ConfirmModal";
import {
  useApplyCoupon,
  useCart,
  useClearCart,
  useRemoveFromCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";
import { toast } from "react-toastify";

export function SkeletonCart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      {/* Left: Cart Items Skeleton */}
      <div className="lg:col-span-2 space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center gap-6">
              {/* Image Skeleton */}
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>

              {/* Title + Price Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-200 rounded"></div>
                <div className="h-4 w-24 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Right Controls Skeleton */}
            <div className="flex flex-col items-end gap-4">
              <div className="h-4 w-5 bg-gray-300 rounded"></div>

              <div className="flex items-center gap-3 border rounded-lg px-2 py-1">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-6 bg-gray-300 rounded"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Order Summary Skeleton */}
      <div className="bg-white shadow-md rounded-lg p-6 h-fit space-y-4">
        <div className="h-5 w-40 bg-gray-300 rounded"></div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        <hr />

        <div className="flex justify-between">
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
          <div className="h-5 w-24 bg-gray-300 rounded"></div>
        </div>

        <div className="h-10 w-full bg-gray-200 rounded mt-5"></div>
        <div className="h-10 w-full bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

const Cart: React.FC = () => {
  const { data: cartData, isLoading: cartLoading } = useCart(true);
  const removeMutation = useRemoveFromCart();
  const updateMutation = useUpdateCart();
  const { mutate: applyCoupon, isPending } = useApplyCoupon();

  const cartItems = cartData?.items ?? [];
  const subtotal = cartData?.subtotal ?? 0;
  const discount = cartData?.discount ?? 0;
  const total = cartData?.total ?? 0;
  const storeCoupon = cartData?.coupon ?? null;

  const clearMutation = useClearCart();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [pendingDelete, setPendingDelete] = React.useState<number | null>(null);
  const [couponCode, setCouponCode] = React.useState("");
  const [clearConfirmOpen, setClearConfirmOpen] = React.useState(false);

  // Keep the coupon input in sync with the cart store so it remains visible after refresh
  React.useEffect(() => {
    setCouponCode(storeCoupon ?? "");
  }, [storeCoupon]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    applyCoupon(couponCode);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        {/* Breadcrumb */}
        <div className="px-6 md:px-20 mt-10 mb-5 bg-[var(--color-primary-50)] text-md">
          <nav className="flex items-center gap-2 justify-center">
            <Link
              to="/"
              className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-[var(--color-text-orange)]">My Cart</span>
          </nav>
        </div>
        {/* Main section */}
        <div className="min-h-screen flex items-center justify-center flex-col text-center">
          <h1 className="text-4xl font-bold mb-4 text-[var(--color-primary-400)]">
            Your cart is empty
          </h1>
          <p className="text-[var(--color-gray-600)] mb-8">
            Start shopping to add items to your cart
          </p>
          <Link
            to="/products"
            className="bg-[var(--color-accent)] text-white py-3 px-6 rounded-lg hover:bg-[var(--color-accent-dark)] transition"
          >
            Continue Shopping
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 my-5 bg-[var(--color-primary-50)] text-md">
        <nav className="flex items-center gap-2 justify-center">
          <Link
            to="/"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="text-[var(--color-text-dark)] hover:text-[var(--color-accent)] transition"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-[var(--color-text-orange)]">My Cart</span>
        </nav>
      </div>

      {/* Main section */}
      <section className="min-h-screen bg-background py-12 px-6 md:px-20">
        <div className="flex justify-between mb-6 itemns-center h-min">
          <h1 className="text-3xl font-bold text- mb-8 text-accent-darker">
            Shopping Cart
          </h1>
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="ml-2 px-4 py-2 h-min bg-accent-dark cursor-pointer text-white rounded-lg hover:opacity-90 transition"
          >
            Clear Cart
          </button>
        </div>
        {cartLoading ? (
          <SkeletonCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => {
                const isUpdating =
                  (updateMutation.isPending &&
                    updateMutation.variables?.product_id === item.product_id) ||
                  (removeMutation.isPending &&
                    removeMutation.variables?.product_id === item.product_id);
                return (
                  <div
                    key={item.product_id}
                    className="flex justify-between items-center bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex items-center gap-6">
                      <img
                        src={item.image_url || undefined}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-[var(--color-primary-200)] mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xl font-bold text-[var(--color-accent)]">
                          ₹{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4">
                      <button
                        className="text-gray-500 hover:text-[var(--color-error)] transition"
                        onClick={() => {
                          setPendingDelete(item.product_id);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>

                      <div className="flex items-center border rounded-lg px-2 py-1">
                        {/* DEC BUTTON */}
                        <button
                          disabled={isUpdating}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            if (isUpdating) return;

                            if (item.quantity <= 1) {
                              removeMutation.mutate({
                                product_id: item.product_id,
                              });
                            } else {
                              updateMutation.mutate({
                                product_id: item.product_id,
                                quantity: item.quantity - 1,
                              });
                            }
                          }}
                          className={`p-1 transition ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-[var(--color-accent)]"
                          }`}
                        >
                          <Minus size={14} />
                        </button>

                        {/* QUANTITY / LOADER */}
                        <span className="px-4 font-medium min-w-[25px] flex justify-center">
                          {isUpdating ? (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[var(--color-accent)] animate-spin"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>

                        {/* INC BUTTON */}
                        <button
                          disabled={isUpdating}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            if (isUpdating) return;

                            updateMutation.mutate({
                              product_id: item.product_id,
                              quantity: item.quantity + 1,
                            });
                          }}
                          className={`p-1 transition ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-[var(--color-accent)]"
                          }`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="bg-white shadow-md rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4 text-[var(--color-primary-200)]">
                Order Summary
              </h2>
              <div className="space-y-3 text-[var(--color-gray-700)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[var(--color-success)]">
                    FREE
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium">₹{discount.toFixed(2)}</span>
                </div>
                <hr className="my-3 border-[var(--color-gray-300)]" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[var(--color-primary-100)]">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="w-full border border-[var(--color-gray-300)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleApplyCoupon}
                    disabled={isPending}
                    className="cursor-pointer flex-1 border border-[var(--color-accent)] text-[var(--color-accent)] py-2 rounded-lg hover:bg-[var(--color-accent-light)] hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? "Applying..." : "Apply Coupon"}
                  </button>
                </div>
              </div>

              <Link to="/checkout">
                <button className="w-full cursor-pointer bg-[var(--color-accent)] text-white mt-5 py-3 rounded-lg font-medium hover:bg-[var(--color-accent-dark)] transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        )}
      </section>
      <Footer />
      <ConfirmModal
        isOpen={confirmOpen}
        title="Remove item from cart"
        message={
          <>
            Are you sure you want to remove this item from your cart? This
            action cannot be undone.
          </>
        }
        confirmText="Remove"
        cancelText="Cancel"
        danger
        onClose={() => {
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        onConfirm={async () => {
          if (pendingDelete != null) {
            try {
              // Call the remove mutation hook
              await removeMutation.mutateAsync({ product_id: pendingDelete });
            } catch {
              // error is handled by the hook
            }
          }
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
      />
      <ConfirmModal
        isOpen={clearConfirmOpen}
        title="Clear cart"
        message={
          <>
            Are you sure you want to clear your cart? This will remove all
            items.
          </>
        }
        confirmText="Clear"
        cancelText="Cancel"
        danger
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={async () => {
          try {
            await clearMutation.mutateAsync();
          } catch {
            // handled by hook
          }
          setClearConfirmOpen(false);
        }}
      />
    </>
  );
};

export default Cart;
