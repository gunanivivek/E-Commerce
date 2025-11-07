import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Wallet, Landmark, MapPin, Package } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";
import { useAddresses } from "../../hooks/useAddresses";
import { useAddressStore } from "../../store/addressStore";
import { useCartStore } from "../../store/cartStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../../api/orderApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import type { Address as UserAddress } from "../../types/Address";
import type { CartItem as StoreCartItem } from "../../store/cartStore";

// Use real API createOrder via react-query

// Define types for clarity
type PaymentMethod = "card" | "wallet" | "bank" | "cod";

const Checkout: React.FC = () => {
  // State management using useState for local UI logic (e.g., selections)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  // Default to Cash on Delivery. Other payment methods are visible but not yet functional.
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("cod");
  const [cardNumber] = useState<string>("");
  const [expiry] = useState<string>("");
  const [cvv] = useState<string>("");

  const { addresses: fetchedAddresses, isLoading: isLoadingAddresses } =
    useAddresses();
  const setSelectedAddress = useAddressStore((s) => s.setSelectedAddress);
  const cartItems = useCartStore((s) => s.cartItems);
  const fetchCart = useCartStore((s) => s.fetchCart);
  const storeSubtotal = useCartStore((s) => s.subtotal);
  const storeDiscount = useCartStore((s) => s.discount);
  const storeTotal = useCartStore((s) => s.total);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const clearCart = useCartStore((s) => s.clearCart);

  // Replace local placeholder with a react-query mutation that calls createOrder
  const placeOrderMutation = useMutation({
    mutationFn: (payload: unknown) => createOrder(payload),
    onMutate: () => {
      const id = toast.loading("Placing order...");
      return id;
    },
    onSuccess: async (data, _vars, context) => {
      // 👈 ADD 'async' HERE
      if (context) {
        toast.update(context, {
          render: "Order placed successfully!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        toast.success("Order placed successfully!");
      }

      // clear cart
      try {
        clearCart();
      } catch {
        // ignore
      }

      // 💡 FIX: Invalidate and AWAIT the refetch of the orders query
      try {
        await queryClient.refetchQueries({
          queryKey: ["orders"],
          type: "active",
        });
        // Alternatively, you can use:
        // await queryClient.invalidateQueries({ queryKey: ["orders"], refetchType: 'all' });
      } catch (e) {
        console.error("Failed to refetch orders:", e);
      }

      // Navigate ONLY after the refetch attempt completes
      try {
        navigate("/profile/orders");
      } catch {
        // ignore
      }
    },
    onError: (err: AxiosError<{ detail?: string }>, _vars, context) => {
      if (context) {
        toast.update(context, {
          render: err.response?.data?.detail || "Failed to place order.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      } else {
        toast.error(err.response?.data?.detail || "Failed to place order.");
      }
    },
  });

  // use the mutation's mutate function in UI
  const placeOrderHandler = (data: unknown) => placeOrderMutation.mutate(data);
  const isPlacingOrder = placeOrderMutation.isLoading;

  // Use totals directly from cart store — do not recalculate here. Fallback to 0 when missing.
  const subtotal = typeof storeSubtotal === "number" ? storeSubtotal : 0;
  const shipping = 0; // shipping handled by cart page / backend; show 0 if not provided
  const taxRate = 0; // tax handled upstream
  const tax = 0;
  const discountAmount = typeof storeDiscount === "number" ? storeDiscount : 0;
  const total = typeof storeTotal === "number" ? storeTotal : 0;

  const addresses: UserAddress[] = fetchedAddresses || [];

  // Ensure cart is fresh when arriving on checkout
  useEffect(() => {
    try {
      fetchCart?.();
    } catch {
      // swallow: fetchCart logs internally
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If addresses loaded and none selected, auto-select the first one
  useEffect(() => {
    if (!selectedAddressId && addresses && addresses.length > 0) {
      setSelectedAddressId(String(addresses[0].id));
      setSelectedAddress(addresses[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addresses]);

  const handlePlaceOrder = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }
    const orderData = {
      address_id: selectedAddressId,
      payment_method: selectedPaymentMethod,
      items: cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };
    placeOrderHandler(orderData);
  };

  if (isLoadingAddresses) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] py-12 text-center text-[var(--color-text-primary)]">
        Loading addresses...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-tl from-background to-primary-100 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-heading font-extrabold text-accent-dark mb-8">
            Checkout
          </h1>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Addresses */}
              <div className="bg-[var(--color-white)] rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-primary-400" />
                  <h2 className="text-2xl font-semibold text-primary-400">
                    Shipping Address
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <p className="md:col-span-2 text-[var(--color-text-muted)]">
                      No saved addresses found. Please add one in your profile.
                    </p>
                  ) : (
                    addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`p-4 border-2 rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                          selectedAddressId === String(address.id)
                            ? "border-[var(--color-primary-400)] hover:border-border-light ring-4 ring-[var(--color-primary-100)]"
                            : "border-[var(--color-border-light)] hover:border-[var(--color-primary-300)]"
                        } bg-[var(--color-off-white)]`}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="address-selection"
                            value={String(address.id)}
                            checked={selectedAddressId === String(address.id)}
                            onChange={() =>
                              setSelectedAddressId(String(address.id))
                            }
                            // Styling for native radio button is tricky, usually done via custom icons/checked state
                            className="h-4 w-4 text-[var(--color-primary-400)] border-[var(--color-primary-300)] focus:ring-[var(--color-primary-400)]"
                          />
                          <span className="ml-3 text-base font-medium text-[var(--color-text-primary)]">
                            {address.address_line_1}
                          </span>
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)] ml-7 space-y-1">
                          <p>
                            {address.city}, {address.state}{" "}
                            {address.postal_code}
                          </p>
                          <p>Phone: {address.phone_number}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                  *To add or edit addresses, please visit your profile page.
                </p>
              </div>

              {/* Payment Method */}
              <div className="bg-[var(--color-white)] rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-[var(--color-primary-400)]" />
                  <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Only Cash on Delivery (COD) is currently functional. Other
                    payment methods are placeholders.
                  </p>
                  {/* Credit / Debit Card */}
                  <label
                    className={`flex flex-col p-4 border rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                      selectedPaymentMethod === "card"
                        ? "border-[var(--color-primary-400)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                    } bg-[var(--color-off-white)]`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment-method"
                        value="card"
                        checked={selectedPaymentMethod === "card"}
                        onChange={() => setSelectedPaymentMethod("card")}
                        className="h-4 w-4 text-[var(--color-primary-400)] border-[var(--color-primary-300)] focus:ring-[var(--color-primary-400)]"
                      />
                      <CreditCard className="h-5 w-5 text-[var(--color-text-muted)]" />
                      <span className="text-base font-medium text-[var(--color-text-primary)]">
                        Credit / Debit Card
                      </span>
                    </div>
                    {selectedPaymentMethod === "card" && (
                      <div className="pl-7 pt-4 space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="cardNumber"
                            className="text-sm font-medium text-[var(--color-text-secondary)]"
                          >
                            Card Number
                          </label>
                          <input
                            id="cardNumber"
                            type="text"
                            placeholder="Not implemented"
                            value={cardNumber}
                            onChange={() => {
                              /* disabled: no-op */
                            }}
                            disabled
                            className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-gray-50)] text-[var(--color-text-muted)] cursor-not-allowed"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="expiry"
                              className="text-sm font-medium text-[var(--color-text-secondary)]"
                            >
                              Expiry Date
                            </label>
                            <input
                              id="expiry"
                              type="text"
                              placeholder="MM/YY"
                              value={expiry}
                              onChange={() => {
                                /* disabled: no-op */
                              }}
                              disabled
                              className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-gray-50)] text-[var(--color-text-muted)] cursor-not-allowed"
                            />
                          </div>
                          <div className="space-y-2">
                            <label
                              htmlFor="cvv"
                              className="text-sm font-medium text-[var(--color-text-secondary)]"
                            >
                              CVV
                            </label>
                            <input
                              id="cvv"
                              type="text"
                              placeholder="123"
                              value={cvv}
                              onChange={() => {
                                /* disabled: no-op */
                              }}
                              disabled
                              className="w-full p-2 border border-[var(--color-border)] rounded-[var(--radius-sm)] bg-[var(--color-gray-50)] text-[var(--color-text-muted)] cursor-not-allowed"
                            />
                          </div>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Card payments are not integrated yet. This is a
                          placeholder.
                        </p>
                      </div>
                    )}
                  </label>

                  {/* Digital Wallet */}
                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                      selectedPaymentMethod === "wallet"
                        ? "border-[var(--color-primary-400)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                    } bg-[var(--color-off-white)]`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="wallet"
                      checked={selectedPaymentMethod === "wallet"}
                      onChange={() => setSelectedPaymentMethod("wallet")}
                      className="h-4 w-4 text-[var(--color-primary-400)] border-[var(--color-primary-300)] focus:ring-[var(--color-primary-400)]"
                    />
                    <Wallet className="h-5 w-5 text-[var(--color-text-muted)]" />
                    <span className="text-base font-medium text-[var(--color-text-primary)]">
                      Digital Wallet
                    </span>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                      selectedPaymentMethod === "bank"
                        ? "border-[var(--color-primary-400)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                    } bg-[var(--color-off-white)]`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="bank"
                      checked={selectedPaymentMethod === "bank"}
                      onChange={() => setSelectedPaymentMethod("bank")}
                      className="h-4 w-4 text-[var(--color-primary-400)] border-[var(--color-primary-300)] focus:ring-[var(--color-primary-400)]"
                    />
                    <Landmark className="h-5 w-5 text-[var(--color-text-muted)]" />
                    <span className="text-base font-medium text-[var(--color-text-primary)]">
                      Bank Transfer
                    </span>
                  </label>

                  {/* Cash on Delivery (COD) */}
                  <label
                    className={`flex items-center space-x-3 p-4 border rounded-[var(--radius-md)] cursor-pointer transition-colors ${
                      selectedPaymentMethod === "cod"
                        ? "border-[var(--color-primary-400)]"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary-300)]"
                    } bg-[var(--color-off-white)]`}
                  >
                    <input
                      type="radio"
                      name="payment-method"
                      value="cod"
                      checked={selectedPaymentMethod === "cod"}
                      onChange={() => setSelectedPaymentMethod("cod")}
                      className="h-4 w-4 text-[var(--color-primary-400)] border-[var(--color-primary-300)] focus:ring-[var(--color-primary-400)]"
                    />
                    <Package className="h-5 w-5 text-[var(--color-text-muted)]" />
                    <span className="text-base font-medium text-[var(--color-text-primary)]">
                      Cash on Delivery (COD)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[var(--color-white)] rounded-xl p-6 shadow-lg sticky top-8">
                <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                  {cartItems.map((item: StoreCartItem) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <img
                        src={item.image ?? undefined}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-[var(--radius-sm)] bg-[var(--color-gray-100)]"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-[var(--color-text-primary)] truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Qty: {item.quantity}
                        </p>
                        <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                          ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-6 border-[var(--color-border-light)]" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Shipping</span>
                    <span>₹{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[var(--color-text-muted)]">
                    <span>Tax ({taxRate * 100}%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {/* Discount */}
                  <div className="flex justify-between text-[var(--color-success)] font-medium">
                    <span>Discount</span>
                    <span>- ₹{discountAmount.toFixed(2)}</span>
                  </div>

                  <hr className="border-[var(--color-border-light)]" />

                  <div className="flex justify-between text-lg font-bold text-[var(--color-text-primary)]">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={
                    isPlacingOrder ||
                    !selectedAddressId ||
                    selectedPaymentMethod !== "cod"
                  }
                  style={{
                    backgroundColor: "var(--color-primary-400)", // Use CSS var in style prop for background
                    boxShadow: "var(--shadow-accent)",
                  }}
                  className="w-full mt-6 py-3 px-4 text-white font-semibold rounded-[var(--radius-md)] transition-colors hover:bg-[var(--color-accent-dark)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </button>

                <p className="text-xs text-[var(--color-text-muted)] text-center mt-4">
                  By placing your order, you agree to our{" "}
                  <Link
                    to="/terms"
                    className="text-[var(--color-primary-400)] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
