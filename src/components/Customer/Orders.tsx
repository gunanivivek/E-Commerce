import { useState } from "react";
import { Package, XCircle, FileDown } from "lucide-react";
import { toast } from "react-toastify";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  status: "delivered" | "in_progress" | "cancelled";
}

interface Order {
  id: string;
  totalPrice: number;
  status: "delivered" | "in_progress" | "cancelled";
  products: Product[];
  date: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-1001",
      totalPrice: 2399,
      status: "in_progress",
      date: "2025-10-28",
      products: [
        {
          id: 1,
          name: "Wireless Headphones",
          image: "https://via.placeholder.com/80x80?text=Headphones",
          price: 1299,
          status: "in_progress",
        },
        {
          id: 2,
          name: "Bluetooth Speaker",
          image: "https://via.placeholder.com/80x80?text=Speaker",
          price: 1100,
          status: "in_progress",
        },
      ],
    },
    {
      id: "ORD-1002",
      totalPrice: 1599,
      status: "delivered",
      date: "2025-09-20",
      products: [
        {
          id: 3,
          name: "Smart Watch",
          image: "https://via.placeholder.com/80x80?text=Watch",
          price: 1599,
          status: "delivered",
        },
      ],
    },
  ]);

  // 🔹 Cancel Order (for in-progress only)
  const handleCancel = async (orderId: string) => {
    try {
      // Example API call: await axios.post(`/api/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "cancelled" } : o
        )
      );
      toast.success("Order cancelled successfully.");
    } catch (err) {
        console.log(err);
        
      toast.error("Failed to cancel order.");
    }
  };

  // 🔹 Download invoice (for delivered orders only)
  const handleDownloadInvoice = async (orderId: string) => {
    try {
      toast.info("Preparing invoice...");

      // Example API call — change to your endpoint
      const response = await fetch(`/api/orders/${orderId}/invoice`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch invoice.");
      }

      // Convert response to Blob for file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      a.click();
      a.remove();

      toast.success("Invoice downloaded successfully.");
    } catch (error) {
      toast.error("Error downloading invoice.");
      console.error(error);
    }
  };

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "delivered":
        return <span className="bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs">Delivered</span>;
      case "in_progress":
        return <span className="bg-yellow-600/20 text-yellow-400 px-3 py-1 rounded-full text-xs">In Progress</span>;
      case "cancelled":
        return <span className="bg-red-600/20 text-red-400 px-3 py-1 rounded-full text-xs">Cancelled</span>;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
        <Package className="text-accent" />
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400">You currently have no orders.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <h3 className="text-white font-medium">
                    Order ID: <span className="text-accent">{order.id}</span>
                  </h3>
                  <p className="text-gray-400 text-sm">Date: {order.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(order.status)}

                  {order.status === "in_progress" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-lg transition"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  )}

                  {order.status === "delivered" && (
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center gap-1 text-sm px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      <FileDown size={16} />
                      Invoice
                    </button>
                  )}
                </div>
              </div>

              {/* Product List */}
              <div className="divide-y divide-gray-700">
                {order.products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 py-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-700"
                    />
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{product.name}</h4>
                      <p className="text-gray-400 text-sm">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(product.status)}</div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 flex justify-between items-center border-t border-gray-700 pt-4">
                <p className="text-gray-400 text-sm">Total:</p>
                <p className="text-lg font-semibold text-white">
                  ₹{order.totalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
