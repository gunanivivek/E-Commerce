import API from "./axiosInstance";
import type { Order, OrderItem, UpdateOrderItemStatusRequest } from "../types/orders";

export const getSellerOrders = async (): Promise<Order[]> => {
  const res = await API.get("/seller/orders"); // 🔹 Adjust backend route if different
  return res.data;
};

export const getOrderById = async (orderId: number): Promise<Order> => {
  const res = await API.get(`/seller/orders/${orderId}/`);
  return res.data;
};

export const updateOrderItemStatus = async (
  payload: UpdateOrderItemStatusRequest
): Promise<OrderItem> => {
  const { order_id, item_id, status } = payload;
  const res = await API.patch(`/orders/${order_id}/items/${item_id}/status`, { status });
  return res.data;
};