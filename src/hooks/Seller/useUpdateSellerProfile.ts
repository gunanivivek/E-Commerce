/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSellerProfile } from "../../api/sellerApi";

export const useUpdateSellerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sellerId, payload }: { sellerId: number; payload: any }) =>
      updateSellerProfile(sellerId, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["sellerProfile", variables.sellerId], data);
    },
  });
};
