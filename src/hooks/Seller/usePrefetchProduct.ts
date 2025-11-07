import { useQueryClient } from "@tanstack/react-query";
import { getProductById } from "../../api/sellerApi";

export const usePrefetchProduct = () => {
  const queryClient = useQueryClient();
  return (productId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["product", productId],
      queryFn: () => getProductById(productId),
    });
  };
};
