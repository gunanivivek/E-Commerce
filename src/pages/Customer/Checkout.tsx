import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  CreditCard,
  ShoppingBag,
  CheckCircle2,
  MapPinPlus,
} from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { useAddresses } from "../../hooks/useAddresses";
import { useAddressStore } from "../../store/addressStore";
import { useCart } from "../../hooks/Customer/useCartHooks";

import CardPaymentModal from "../../components/Customer/PaymentModal";

const AddressSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div key={i} className="p-5 border-2 rounded-xl bg-white animate-pulse">
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const Checkout: React.FC = () => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const { addresses: fetchedAddresses, isLoading: isLoadingAddresses } =
    useAddresses();
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);
  const { data: cartData } = useCart(true);
  const cartItems = cartData?.items;
  const subtotal = cartData?.subtotal ?? 0;
  const discount = cartData?.discount ?? 0;
  const total = cartData?.total ?? 0;
  const coupon = cartData?.coupon;

  useEffect(() => {
    if (!selectedAddressId && fetchedAddresses && fetchedAddresses.length > 0) {
      setSelectedAddressId(String(fetchedAddresses[0].id));
      setSelectedAddress(fetchedAddresses[0]);
    }
  }, [fetchedAddresses]);

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }
    setShowPaymentModal(true);
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-background)] px-4">
          <div className="bg-white shadow rounded-2xl p-10 max-w-md text-center border border-gray-200">
            <ShoppingBag className="w-12 h-12 text-primary-400 mx-auto mb-4" />

            <h2 className="text-xl font-bold text-[var(--color-primary-400)] mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Add items to your cart before proceeding to checkout.
            </p>

            <Link
              to="/products"
              className="inline-block bg-primary-400 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const addresses = fetchedAddresses || [];

  return (
    <>
      <Header />
      {/* Breadcrumb */}
      <div className="px-6 md:px-20 my-5 bg-[var(--color-primary-50)] text-md">
        <nav className="flex items-center gap-2 justify-center">
          <Link
            to="/"
            className="text-black hover:text-[var(--color-primary-400)] transition-colors"
          >
            Home
          </Link>
          <span className="text-[var(--color-text-muted)]">/</span>
          <Link
            to="/products"
            className="text-black hover:text-[var(--color-primary-400)] transition-colors"
          >
            Products
          </Link>
          <span className="text-[var(--color-text-muted)]">/</span>
          <Link
            to="/cart"
            className="text-black hover:text-[var(--color-primary-400)] transition-colors"
          >
            Cart
          </Link>
          <span className="text-[var(--color-text-muted)]">/</span>
          <span className="text-[var(--color-primary-400)] font-semibold">
            Checkout
          </span>
        </nav>
      </div>

      {/* Main section */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-3 sm:px-6 md:px-14 lg:px-20">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Address & Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
                <div className="bg-primary-300 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white">
                          Delivery Address
                        </h2>
                        <p className="text-primary-100 text-sm">
                          Select where you want your order delivered
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {isLoadingAddresses ? (
                    <AddressSkeleton />
                  ) : addresses.length === 0 ? (
                    <>
                      {/* Empty Address UI (unchanged) */}
                      <div className="text-center py-12">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-[var(--color-text-muted)] mb-4">
                          No saved addresses found
                        </p>
                        <Link
                          to="/profile/address"
                          className="text-primary-400 font-medium hover:underline justify-center flex items-center gap-2"
                        >
                          <div className="w-7 h-7 bg-primary-400 rounded-full flex items-center justify-center">
                            <MapPinPlus className="w-5 h-5 text-white" />
                          </div>
                          Add an address in your profile
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Existing Address Cards — NO DESIGN CHANGE */}
                      <div className="grid md:grid-cols-2 gap-4 items-center">
                        {addresses.map((address) => (
                          <label
                            key={address.id}
                            className={`group relative p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                              selectedAddressId === String(address.id)
                                ? "border-primary-400 bg-primary-50 shadow-md scale-[1.02]"
                                : "border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="address-selection"
                                value={String(address.id)}
                                checked={
                                  selectedAddressId === String(address.id)
                                }
                                onChange={() => {
                                  setSelectedAddressId(String(address.id));
                                  setSelectedAddress(address);
                                }}
                                className="mt-1 h-5 w-5 text-primary-400"
                              />

                              <div className="flex-1">
                                <h3 className="font-semibold text-[var(--color-text-primary)] mb-1 line-clamp-2">
                                  {address.address_line_1}
                                </h3>
                                <div className="text-sm text-[var(--color-text-muted)] space-y-1">
                                  <p>
                                    {address.city}, {address.state}{" "}
                                    {address.postal_code}
                                  </p>
                                  <p className="flex items-center gap-1">
                                    <span className="font-medium">Phone:</span>{" "}
                                    {address.phone_number}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {selectedAddressId === String(address.id) && (
                              <div className="absolute top-3 right-3">
                                <div className="w-6 h-6 bg-primary-400 rounded-full flex items-center justify-center">
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                          </label>
                        ))}
                        <Link
                          to="/profile/address"
                          className="text-primary-400 font-medium hover:underline justify-center flex items-center gap-2"
                        >
                          <div className="w-7 h-7 bg-primary-400 rounded-full flex items-center justify-center">
                            <MapPinPlus className="w-5 h-5 text-white" />
                          </div>
                          Add other address in your profile
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="bg-white rounded-2xl shadow p-6 border border-primary-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="h-6 w-6 text-primary-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                      Order Items
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {cartItems.length} items in your cart
                    </p>
                  </div>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {cartItems.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-4 items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={item.image_url ?? undefined}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg bg-white border border-gray-200"
                        />
                        <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--color-text-primary)] mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)] mb-2">
                          Quantity: {item.quantity}
                        </p>
                        <p className="font-bold text-primary-400">
                          ₹{item.unit_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 lg:sticky lg:top-18">
              <div className="bg-white rounded-2xl shadow overflow-hidden border border-primary-100">
                <div className="bg-primary-300 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      Order Summary
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="text-[var(--color-text-muted)]">
                        Subtotal
                      </span>
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-green-600 font-medium">
                          Discount
                        </span>
                        <span className="font-semibold text-green-600">
                          - ₹{discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {coupon && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-sm text-[var(--color-text-muted)]">
                          Coupon Applied
                        </span>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          {coupon}
                        </span>
                      </div>
                    )}

                    <div className="rounded-xl p-4 border-2 border-primary-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-[var(--color-text-primary)]">
                          Total Amount
                        </span>
                        <span className="font-bold text-primary-400">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddressId || cartItems.length === 0}
                    className={`w-full cursor-pointer py-3 sm:py-4 px-4 sm:px-6 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg ${
                      !selectedAddressId || cartItems.length === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-primary-400 hover:bg-primary-300"
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </button>

                  <div className="text-center pt-4 border-t border-gray-200">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      🔒 Secure checkout powered by Stripe
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && selectedAddressId && (
        <CardPaymentModal
          selectedAddressId={selectedAddressId}
          cartItems={cartItems.map((item) => ({
            ...item,
            id: String(item.product_id),
            image: item.image_url ?? undefined,
          }))}
          total={total}
          onClose={() => setShowPaymentModal(false)}
        />
      )}

      <Footer />
    </>
  );
};

export default Checkout;
