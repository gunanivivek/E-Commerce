import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../api/sellerApi";

export const useProductQuery = (productId?: number) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId!),
    enabled: !!productId, // only fetch when ID exists
  });
};
