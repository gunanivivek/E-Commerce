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

export interface Order {
  id: number;
  order_number: string;
  customer_name: string;
  customer_address: string;
  created_at: string;
  items: OrderItem[];
}

export interface UpdateOrderItemStatusRequest {
  order_id: number;
  item_id: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
}