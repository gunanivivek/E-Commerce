/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderItemStatus } from "../../api/sellerOrderApi"; 
import { toast } from "react-toastify";
import { showToast } from "../toastManager";

interface StatusCellProps {
  orderId: number;
  itemId: number;
  initialStatus: string;
}

const OrderStatusCell: React.FC<StatusCellProps> = ({ orderId, itemId, initialStatus }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState(initialStatus);
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: (status: "pending" | "shipped" | "delivered" | "cancelled") =>
      updateOrderItemStatus({ order_id: orderId, item_id: itemId, new_status:status }),
    onSuccess: () => {
       showToast("Order status updated successfully!", "success");
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
      setIsEditing(false);
    },
    onError: (err: any) => {
      console.error(err);
      toast.error(err.response?.data?.detail ?? "Failed to update order status");
      setIsEditing(false);
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "pending" | "shipped" | "delivered" | "cancelled";
    setSelectedStatus(newStatus);
    updateStatus(newStatus);
  };

  const colorClass =
    selectedStatus === "delivered"
      ? "bg-green-100 text-green-700"
      : selectedStatus === "pending"
      ? "bg-gray-300 text-gray-800"
      : selectedStatus === "shipped"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="relative group">
      {isEditing ? (
        <select
          value={selectedStatus}
          onChange={handleStatusChange}
          onBlur={() => setIsEditing(false)}
          disabled={isPending}
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          autoFocus
        >
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`px-4 py-1 rounded-full text-xs font-medium cursor-pointer ${colorClass}`}
          title="Double click to change the status of product"
        >
          {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
        </span>
      )}

      
    </div>
  );
};

export default OrderStatusCell;
