import React from "react";
import { X } from "lucide-react";
import type { Order } from "../../types/orders";
import OrderStatusCell from "./OrderStatusCell";

interface OrderDetailModelProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
}

const OrderDetailModel: React.FC<OrderDetailModelProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Order #{order.order_number}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Placed on:{" "}
          {new Date(order.created_at).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>

        <div className="mb-6">
          <h3 className="font-semibold text-gray-700 mb-2">Customer Details</h3>
          <p className="text-gray-600">
            <span className="font-medium">Name:</span> {order.customer_name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Address:</span>{" "}
            {order.customer_address}
          </p>
        </div>

        {/* Order Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Payment</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.product_name}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">₹{item.price.toLocaleString()}</td>
                  <td className="p-3 font-medium text-green-600">
                    ₹{item.total_price}
                  </td>
                  <td className="p-3 capitalize">
                    <OrderStatusCell orderId={order.id} itemId={item.id} initialStatus={item.status} /> 
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.payment_status === "success"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.payment_status.toLocaleUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="mt-6 text-right">
          <p className="text-lg font-semibold text-gray-800">
            Total Amount:{" "}
            <span className="text-green-600">₹{order.total_amount}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModel;
