/* eslint-disable @typescript-eslint/no-explicit-any */
import API from "./axiosInstance";
import type {  AllOrder,OrderItem, UpdateOrderItemStatusRequest } from "../types/orders";
import type { Order } from "../types/order";

export const getSellerOrders = async (): Promise<AllOrder[]> => {
  const res = await API.get("/seller/orders");
 const transformed: AllOrder[] = res.data.map((order: any) => ({
    id: order.id,
    order_number: `ORD-${order.id}`,
    customer_name: order.address?.full_name || "Unknown",
    customer_address: `${order.address?.address_line_1 || ""}, ${order.address?.city || ""}, ${order.address?.state || ""}`,
    created_at: order.created_at,
    total_amount: order.total_amount,
    payment_status: order.payment_status,
    status: order.status,
    items: order.items.map((item: any) => ({
      id: item.id,
      product_name: item.product?.name || "Unknown Product",
      quantity: item.quantity,
      price: item.unit_price,
      total_price: item.total_price,
      status: item.status,
    })),
  }));

  return transformed;
}

export const getOrderById = async (orderId: number): Promise<Order> => {
  const res = await API.get(`/seller/orders/${orderId}`);
  return res.data;
};

export const updateOrderItemStatus = async (
  payload: UpdateOrderItemStatusRequest
): Promise<OrderItem> => {
  const { order_id, item_id, new_status } = payload;
  const res = await API.patch(`/seller/orders/${order_id}/items/${item_id}/status`, { new_status });
  return res.data;
};