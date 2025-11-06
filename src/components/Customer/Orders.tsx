import React from "react";
import { XCircle, FileDown } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useOrderStore } from "../../store/orderStore"; // To read state

const Orders: React.FC = () => {
  const {  isLoading, cancelMutation, downloadInvoiceMutation } = useOrders();
  const storeOrders = useOrderStore((s) => s.orders);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
            Delivered
          </span>
        );

      case "in_progress":
      case "pending":
        return (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
            In Progress
          </span>
        );

      case "cancelled":
        return (
          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
            Cancelled
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <section className="bg-[var(--color-background)] py-5 px-6 md:px-20">
        <p className="text-gray-500 text-center py-12">Loading your orders...</p>
      </section>
    );
  }

  if (!storeOrders || storeOrders.length === 0) {
    return (
      <section className="bg-[var(--color-background)] py-5 px-6 md:px-20">
        <p className="text-gray-500 text-center py-12">You currently have no orders.</p>
      </section>
    );
  }

  return (
    <section className="bg-[var(--color-background)] py-5 px-6 md:px-6">
      <h2 className="text-3xl font-bold mb-8 leading-tight text-[var(--color-primary-400)]">
        My Orders
      </h2>

      <div className="space-y-6">
        {storeOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 shadow-md p-6 hover:shadow-lg transition-transform"
          >
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center mb-4">
              <div>
                <h3 className="text-[var(--color-primary-400)] font-semibold text-lg">
                  Order ID:{" "}
                  <span className="text-gray-700 font-medium">{order.id}</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelMutation.mutate(order.id)}
                    className="flex items-center gap-1 text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}

                {order.status === "delivered" && (
                  <button
                    onClick={() => downloadInvoiceMutation.mutate(order.id)}
                    className="flex items-center gap-1 text-sm px-4 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-black rounded-lg shadow-sm hover:shadow-md transform "
                  >
                    <FileDown size={16} />
                    Invoice
                  </button>
                )}
              </div>
            </div>

            {/* Product List */}
            <div className="divide-y divide-gray-200 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3">
                  <img
                    src={item.product?.image || "https://via.placeholder.com/80x80?text=Product"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-[var(--color-primary-400)] font-semibold">
                      {item.product.name}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      ₹{item.unit_price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div>{getStatusBadge(item.status)}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm font-medium">Total:</p>
              <p className="text-[var(--color-primary-400)] font-bold text-lg">
                ₹{order.total_amount.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Orders;
