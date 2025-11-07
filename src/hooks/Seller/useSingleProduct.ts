import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../api/sellerApi";
import type { ViewProduct } from "../../types/seller";

export const useProduct = (productId: number | null) => {
  return useQuery<ViewProduct>({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!), 
    enabled: !!productId,
  });
};