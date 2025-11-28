/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import ConfirmModal from "../../components/Customer/ConfirmModal";
import {
  useApplicableCoupons,
  useApplyCoupon,
  useCart,
  useClearCart,
  useRemoveFromCart,
  useUpdateCart,
} from "../../hooks/Customer/useCartHooks";
import { toast } from "react-toastify";

export function SkeletonCart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 animate-pulse">
      {/* Left: Cart items */}
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-4 sm:p-6 gap-4"
          >
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg"></div>

              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 w-full sm:w-auto">
              <div className="h-4 w-5 bg-gray-300 rounded"></div>

              <div className="flex items-center gap-3 border rounded-lg px-3 py-1">
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
                <div className="h-4 w-6 bg-gray-300 rounded"></div>
                <div className="h-4 w-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Summary */}
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 h-fit space-y-3">
        <div className="h-5 w-32 bg-gray-300 rounded"></div>

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

        <div className="h-10 w-full bg-gray-200 rounded mt-4"></div>
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
  const { data: coupons, isLoading: loadingCoupons } = useApplicableCoupons();
  const couponCodes =
    coupons?.adminCoupons
      ?.concat(coupons?.sellerCoupons || [])
      ?.map((c: any) => c.coupon_code) || [];

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

  const [showCoupons, setShowCoupons] = useState(false);

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

  if (cartItems.length === 0 && !cartLoading) {
    return (
      <>
        <Header />
        {/* Breadcrumb */}
        <div className="px-6 md:px-20 mt-5 mb-5 bg-[var(--color-primary-50)] text-md">
          <nav className="flex items-center gap-2 justify-center">
            <Link
              to="/"
              className="text-black hover:text-[var(--color-accent)] transition"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to="/products"
              className="text-black hover:text-[var(--color-accent)] transition"
            >
              Products
            </Link>
            <span>/</span>
            <a className="text-accent">My Cart</a>
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
            className="text-black hover:text-accent transition"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="text-black hover:text-accent transition"
          >
            Products
          </Link>
          <span>/</span>
          <span className="text-accent">My Cart</span>
        </nav>
      </div>

      {/* Main section */}
      <section className="min-h-screen bg-background py-8 px-3 sm:px-6 md:px-14 lg:px-20">
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-accent-darker">
            Shopping Cart
          </h1>

          <button
            onClick={() => setClearConfirmOpen(true)}
            className="px-4 py-2 bg-accent-dark text-white rounded-lg hover:opacity-90 hover:cursor-pointer w-full sm:w-auto"
          >
            Clear Cart
          </button>
        </div>

        {cartLoading ? (
          <SkeletonCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 px-4">
            {/* Left: Cart items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {cartItems.map((item) => {
                const isUpdating =
                  (updateMutation.isPending &&
                    updateMutation.variables?.product_id === item.product_id) ||
                  (removeMutation.isPending &&
                    removeMutation.variables?.product_id === item.product_id);

                return (
                  <div
                    key={item.product_id}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow-md p-4 sm:p-6 gap-4"
                  >
                    {/* LEFT content (image + name) */}
                    <div className="flex items-center gap-3 sm:gap-6 w-full sm:w-auto">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                      />

                      <div>
                        <h3 className="font-semibold text-md sm:text-lg mb-1 text-accent">
                          {item.name}
                        </h3>

                        <p className="text-lg sm:text-xl font-bold text-accent-light">
                          ₹{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT controls */}
                    <div className="flex flex-row sm:flex-col sm:items-end justify-end w-full sm:w-auto gap-3">
                      <button
                        className="text-red-500 hover:text-red-600 transition hover:cursor-pointer"
                        onClick={() => {
                          setPendingDelete(item.product_id);
                          setConfirmOpen(true);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>

                      {/* Quantity changer */}
                      <div className="flex items-center border border-accent rounded-lg px-3 py-1 w-fit">
                        {/* - */}
                        <button
                          disabled={isUpdating}
                          onClick={(ev) => {
                            ev.stopPropagation();

                            if (!isUpdating) {
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
                            }
                          }}
                          className={`p-1 hover:cursor-pointer ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-accent"
                          }`}
                        >
                          <Minus size={14} />
                        </button>

                        {/* Quantity */}
                        <span className="px-4 font-medium min-w-[25px] text-center">
                          {isUpdating ? (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-accent animate-spin mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>

                        {/* + */}
                        <button
                          disabled={isUpdating}
                          onClick={() =>
                            updateMutation.mutate({
                              product_id: item.product_id,
                              quantity: item.quantity + 1,
                            })
                          }
                          className={`p-1 hover:cursor-pointer ${
                            isUpdating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:text-accent"
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

            {/* Right: Summary */}
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 h-fit sticky top-4">
              <h2 className="text-lg sm:text-xl font-semibold mb-4 text-primary">
                Order Summary
              </h2>

              <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium">₹{discount.toFixed(2)}</span>
                </div>

                <hr className="my-3" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-4 space-y-2">
                {/* Coupon Tags */}
                {showCoupons && !loadingCoupons && couponCodes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {couponCodes.map((code: string) => (
                      <span
                        key={code}
                        onClick={() => {
                          setCouponCode(code);
                          setShowCoupons(false); // hide after select
                        }}
                        className="px-3 py-1 bg-surface-light text-accent border border-accent rounded-full text-xs cursor-pointer hover:bg-accent hover:text-white transition"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                )}

                {/* Coupon Input */}
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onFocus={() => setShowCoupons(true)} // show dropdown
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Coupon code"
                />

                {/* Apply Button */}
                <button
                  onClick={handleApplyCoupon}
                  disabled={isPending}
                  className="w-full border border-border-light text-accent py-2 rounded-lg hover:bg-primary-200 hover:text-white hover:cursor-pointer transition disabled:opacity-50"
                >
                  {isPending ? "Applying..." : "Apply Coupon"}
                </button>
              </div>

              <Link to="/checkout">
                <button className="w-full bg-primary-300 text-white mt-5 py-3 rounded-lg font-medium hover:bg-accent-dark hover:cursor-pointer transition">
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
