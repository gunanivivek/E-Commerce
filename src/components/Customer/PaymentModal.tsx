import React, { useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  CreditCard,
  Lock,
  X,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Calendar,
  Shield,
  Loader2,
} from "lucide-react";
import {
  createOrder,
  createPaymentIntent,
  confirmPayment,
} from "../../api/orderApi";

import { useNavigate } from "react-router";
import { useCart } from "../../hooks/Customer/useCartHooks";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

interface CardPaymentModalProps {
  cartItems: OrderItem[];
  total: number;
  selectedAddressId: string;
  onClose: () => void;
}

const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  cartItems,
  total,
  selectedAddressId,
  onClose,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { data: cartData } = useCart(true);
  const subtotal = cartData?.subtotal ?? 0;
  const discount = cartData?.discount ?? 0;
  const coupon = cartData?.coupon;
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [zip, setZip] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const orderMutation = useMutation({
    mutationFn: () =>
      createOrder({
        address_id: Number(selectedAddressId),
        payment_method: "card",
      }),
    onSuccess: async (orderData) => {
      if (!stripe || !elements) throw new Error("Stripe not loaded");

      const paymentIntentResp = await createPaymentIntent(orderData.id);
      const clientSecret = paymentIntentResp.client_secret;

      const cardElement = elements.getElement(CardNumberElement);
      if (!cardElement) throw new Error("Card element not found");

      const { paymentIntent: pi, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: { address: { postal_code: zip } },
          },
        }
      );

      if (error) throw new Error(error.message || "Payment failed");
      if (pi?.status !== "succeeded")
        throw new Error("Payment did not succeed");

      await confirmPayment(pi.id);

      setPaymentStatus("success");
    },
    onError: (err: Error) => {
      setPaymentStatus("failed");
      toast.error(err.message || "Payment failed.");
    },
  });

  const handlePayNow = () => {
    if (!zip) {
      toast.error("Please enter ZIP / Postal code.");
      return;
    }
    orderMutation.mutate();
  };

  const handleCheckOrder = () => {
    navigate("/profile/orders");
    queryClient.invalidateQueries({ queryKey: ["cart"] });
  };
  // Success/Failed Status Screen
  if (paymentStatus) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-4 sm:p-6 lg:p-8 relative text-center animate-in">
          {paymentStatus === "success" ? (
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto bg-green-50">
                  <CheckCircle
                    className="w-12 h-12 sm:w-16 sm:h-16 text-green-500"
                    strokeWidth={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Payment Successful!
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Your order has been confirmed
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCheckOrder}
                  className="w-full bg-primary-400 hover:from-primary-500 hover:to-primary-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Check Order Status
                </button>
                <p className="text-xs text-gray-500">
                  A confirmation email has been sent to your inbox
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto bg-red-50">
                <XCircle
                  className="w-12 h-12 sm:w-16 sm:h-16 text-red-400"
                  strokeWidth={3}
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Payment Failed
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Something went wrong with your payment
                </p>
              </div>

              <div className="bg-red-50 rounded-2xl p-3 sm:p-4 border border-red-200">
                <p className="text-sm text-red-800 text-center">
                  Please check your card details and try again
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full bg-red-400 hover:from-red-600 hover:to-red-700 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 sm:px-6 rounded-xl font-medium transition-all text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4 py-4 sm:py-8">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl sm:max-w-5xl max-h-[95vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-primary-400 p-3 sm:p-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>

          <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4 flex-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-md rounded-2xl sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-white text-base sm:text-lg flex items-center gap-2 flex-wrap">
                  Secure Payment
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                </h2>
                <p className="text-primary-100 text-xs sm:text-sm">
                  Protected by Stripe
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0 ml-auto"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:py-4 lg:px-8 max-h-[calc(95vh-100px)] sm:max-h-[calc(95vh-120px)] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {/* Payment Form - Left Side (3 columns on lg) */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-2 lg:order-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Card Information
                </h3>
              </div>

              <div className="space-y-4 sm:space-y-5 mt-2">
                <div>
                  <label className="mb-2 text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary-400 flex-shrink-0" />
                    Card Number
                  </label>
                  <div className="p-2 border-2 border-gray-200 rounded-xl focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all bg-gray-50">
                    <CardNumberElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#1f2937",
                            "::placeholder": { color: "#9ca3af" },
                          },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="mb-2 text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      Expiry Date
                    </label>
                    <div className="p-2 border-2 border-gray-200 rounded-xl focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all bg-gray-50">
                      <CardExpiryElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#1f2937",
                              "::placeholder": { color: "#9ca3af" },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary-400 flex-shrink-0" />
                      CVC
                    </label>
                    <div className="p-2 border-2 border-gray-200 rounded-xl focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all bg-gray-50">
                      <CardCvcElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#1f2937",
                              "::placeholder": { color: "#9ca3af" },
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-xs sm:text-sm font-semibold text-gray-700">
                    ZIP / Postal Code
                  </label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 text-gray-900 placeholder-gray-400 font-medium text-sm sm:text-base"
                    placeholder="Enter postal code"
                  />
                </div>
              </div>

              {/* Security Badge */}
              <div className=" rounded-2xl p-3 sm:p-4 border border-primary-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1">
                      Secure Payment
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayNow}
                disabled={orderMutation.isPending || !stripe || !elements}
                className={`w-full py-4 sm:py-5 px-4 sm:px-6 mb-4 md:mb-0 rounded-2xl font-bold text-base sm:text-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-xl ${
                  orderMutation.isPending || !stripe || !elements
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-primary-400 hover:from-primary-500 hover:to-primary-600 text-white hover:shadow-2xl"
                }`}
              >
                {orderMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5  sm:w-6 sm:h-6 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    Pay ₹{total.toFixed(2)}
                  </>
                )}
              </button>
            </div>

            {/* Order Summary - Right Side (2 columns on lg) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-primary-50 rounded-2xl p-3 sm:p-4 border border-gray-200 h-fit  lg:sticky top-0 lg:order-2 order-1 z-10 mb-4 lg:mb-0  lg:top-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Order Summary
                </h3>
              </div>

              <div className="space-y-3 mt-2 mb-3 sm:mb-6 max-h-48 sm:max-h-64 overflow-y-auto pr-1 sm:pr-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-2 sm:gap-3 items-center bg-white rounded-xl p-2 shadow-sm border border-gray-100"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-primary-400 whitespace-nowrap">
                      ₹{item.unit_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 pt-2 border-t-2 border-gray-200">
                <div className="flex justify-between items-center text-gray-600 text-xs sm:text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-xs sm:text-sm text-green-600">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">- ₹{discount.toFixed(2)}</span>
                  </div>
                )}

                {coupon && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Coupon
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                      {coupon}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-gray-600 items-center pt-1">
                  <span className="text-sm sm:text-base font-semibold">
                    Total Amount
                  </span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPaymentModal;
