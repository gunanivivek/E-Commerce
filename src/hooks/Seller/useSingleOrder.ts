import { getOrderById } from "../../api/sellerOrderApi";
import type { Order } from "../../types/order";
import { useQuery } from "@tanstack/react-query";

export const useOrderById = (orderId: number) => {
  return useQuery<Order>({
    queryKey: ["SellerOrder", orderId],
    queryFn: () => getOrderById(orderId),
  });
};