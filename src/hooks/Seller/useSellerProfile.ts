// src/hooks/useSellerProfile.ts
import { useQuery } from "@tanstack/react-query";
import { getSellerProfile } from "../../api/sellerApi";
import type { SellerProfile } from "../../types/seller";

export const useSellerProfile = (sellerId?: number) => {
  return useQuery<SellerProfile>({
    queryKey: ["sellerProfile", sellerId],
    queryFn: () => getSellerProfile(sellerId!),
    enabled: !!sellerId, // only run when sellerId exists
  });
};
