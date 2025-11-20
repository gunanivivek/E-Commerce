export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total_price: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  payment_status: "success" | "failed"
}

export interface AllOrder {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  created_at: string;
  total_amount: number;
  payment_status: "paid" | "failed";
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
}

export interface UpdateOrderItemStatusRequest {
  order_id: number;
  item_id: number;
  new_status: "pending" | "shipped" | "delivered" | "cancelled";
}