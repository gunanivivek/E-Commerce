import React from "react";
import ReactDOM from "react-dom";
import {
  X,
  User,
  MapPin,
  ShoppingCart,
  Calendar,
  IndianRupee,
  Package,
} from "lucide-react";
import type { Order } from "../../types/admin";



interface ViewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-700 border-green-300";
    case "shipped":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "confirmed":
      return "bg-indigo-100 text-indigo-700 border-indigo-300";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-600 border-gray-300";
  }
};

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  return ReactDOM.createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white border border-primary-border rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-primary-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-300 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary-400">
                  Order Details
                </h2>
                <p className="text-sm text-primary-400/70">Order #{order.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 border rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
              <button
                onClick={onClose}
                className="p-1 bg-primary-100/50 rounded-full hover:bg-primary-200/40"
              >
                <X size={20} className="text-primary-400" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Order Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-primary-100/30">
                <User className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs text-primary-400">Customer</p>
                  <p className="font-medium text-primary-600">
                    {order.address.full_name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-primary-100/30">
                <IndianRupee className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs text-primary-400">Total Amount</p>
                  <p className="font-medium text-primary-600">
                    ₹{order.total_amount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-primary-100/30">
                <Calendar className="w-5 h-5 text-primary-400" />
                <div>
                  <p className="text-xs text-primary-400">Order Date</p>
                  <p className="font-medium text-primary-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary-400" />
                <h3 className="text-primary-400 font-semibold">Shipping Address</h3>
              </div>
              <div className="p-4 border rounded-lg bg-primary-100/30 text-sm text-primary-600 leading-relaxed">
                <p>{order.address.full_name}</p>
                <p>{order.address.address_line_1}</p>
                {order.address.address_line_2 && <p>{order.address.address_line_2}</p>}
                <p>
                  {order.address.city}, {order.address.state} -{" "}
                  {order.address.postal_code}
                </p>
                <p>{order.address.country}</p>
                <p className="mt-1 text-primary-400 text-xs">
                  Phone: {order.address.phone_number}
                </p>
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-5 h-5 text-primary-400" />
                <h3 className="text-primary-400 font-semibold">Items</h3>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-primary-100/40">
                    <tr className="text-left">
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Qty</th>
                      <th className="py-2 px-3">Unit Price</th>
                      <th className="py-2 px-3">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t hover:bg-primary-100/20"
                      >
                        <td className="py-2 px-3">{item.product.name}</td>
                        <td className="py-2 px-3">{item.quantity}</td>
                        <td className="py-2 px-3">₹{item.unit_price}</td>
                        <td className="py-2 px-3">₹{item.total_price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>,
    document.body
  );
};

export default ViewOrderModal;
