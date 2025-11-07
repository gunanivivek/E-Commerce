export interface OrderItem {
  id: number;
  product: {
    name: string;
    sku?: string;
    image?: string;
  };
  seller_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
}

export interface OrderAddress {
  id: number;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface Order {
  id: number;
  total_amount: number;
  status: "pending" | "in_progress" | "delivered" | "cancelled";
  payment_status: "paid" | "unpaid";
  payment_method: string;
  created_at: string;
  updated_at: string;
  address: OrderAddress;
  items: OrderItem[];
}
