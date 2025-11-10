import React from "react";
import { XCircle, FileDown } from "lucide-react";
import { useOrders } from "../../hooks/useOrders";
import { useOrderStore } from "../../store/orderStore";

const Orders: React.FC = () => {
  const { isLoading, cancelMutation, downloadInvoiceMutation } = useOrders();
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

  /** Skeleton Loader for Order Card **/
  const OrderSkeleton = () => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-md p-6 animate-pulse">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            <div className="w-16 h-16 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t border-gray-200 pt-4 flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>
    </div>
  );

  /** Show skeleton while loading **/
  if (isLoading) {
    return (
      <section className="bg-[var(--color-background)] py-5 px-4 md:px-10">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary-400)]">
          My Orders
        </h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  /** No orders fallback **/
  if (!storeOrders || storeOrders.length === 0) {
    return (
      <section className="bg-[var(--color-background)] py-5 px-4 md:px-10">
        <p className="text-gray-500 text-center py-12">
          You currently have no orders.
        </p>
      </section>
    );
  }

  /** Orders Display **/
  return (
    <section className="bg-[var(--color-background)] py-5 px-2 md:px-6">
      <h2 className="text-3xl font-bold mb-8 text-[var(--color-primary-400)]">
        My Orders
      </h2>

      <div className="space-y-6">
        {storeOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg border border-gray-200 shadow-md p-4 md:p-6 hover:shadow-lg transition-transform"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
              <div>
                <h3 className="text-[var(--color-primary-400)] font-semibold text-lg">
                  Order ID:{" "}
                  <span className="text-gray-700 font-medium">{order.id}</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  Date: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(order.status)}

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelMutation.mutate(order.id)}
                    className="flex items-center gap-1 text-sm px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <XCircle size={16} />
                    Cancel
                  </button>
                )}

                {order.status === "delivered" && (
                  <button
                    onClick={() => downloadInvoiceMutation.mutate(order.id)}
                    className="flex items-center gap-1 text-sm px-3 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-black rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <FileDown size={16} />
                    Invoice
                  </button>
                )}
              </div>
            </div>

            {/* Product List */}
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-3">
                  <img
                    src={item.product?.image || "https://via.placeholder.com/80x80?text=Product"}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                  />
                  <div className="flex-1">
                    <h4 className="text-[var(--color-primary-400)] font-semibold">
                      {item.product?.name ?? "-"}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      ₹{item.unit_price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0">{getStatusBadge(item.status)}</div>
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
