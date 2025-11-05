import React from "react";
import { useCartStore } from "../../store/cartStore";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "../../components/ui/Header";
import Footer from "../../components/ui/Footer";

const Cart: React.FC = () => {
  const { cartItems, removeItem, updateQuantity } = useCartStore();

  const { data: taxRate } = useQuery({
    queryKey: ["taxRate"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 300));
      return 0.1;
    },
    initialData: 0.1,
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0;
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
        <>
        <Header />
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
    <section className="min-h-screen bg-[var(--color-background)] py-12 px-6 md:px-20">
      <h1 className="text-3xl font-bold text-[var(--color-primary-100)] mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center gap-6">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-semibold text-lg text-[var(--color-primary-200)] mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xl font-bold text-[var(--color-accent)]">
                    ₹{item.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4">
                <button
                  className="text-gray-500 hover:text-[var(--color-error)] transition"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex items-center border rounded-lg px-2 py-1">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:text-[var(--color-accent)] transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:text-[var(--color-accent)] transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <span>Tax</span>
              <span>₹{tax.toFixed(2)}</span>
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
            <input
              type="text"
              placeholder="Coupon code"
              className="w-full border border-[var(--color-gray-300)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            />
            <button className="w-full border border-[var(--color-accent)] text-[var(--color-accent)] py-2 rounded-lg hover:bg-[var(--color-accent-light)] hover:text-white transition">
              Apply Coupon
            </button>
          </div>

          <button className="w-full bg-[var(--color-accent)] text-white mt-4 py-3 rounded-lg font-medium hover:bg-[var(--color-accent-dark)] transition">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Cart;
