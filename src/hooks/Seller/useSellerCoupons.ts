// src/hooks/useCoupons.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as couponApi from "../../api/couponApi"
import { toast } from "react-toastify";

export const useCoupons = () => {
  return useQuery({
    queryKey: ["SellerCoupons"],
    queryFn: couponApi.getCoupons,
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponApi.deleteCoupon,
    onSuccess: () => {
      toast.success("Coupon deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["SellerCoupons"] });
    },
    onError: () => toast.error("Failed to delete coupon."),
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponApi.createCoupon,
    onSuccess: () => {
      toast.success("Coupon created successfully!");
      queryClient.invalidateQueries({ queryKey: ["SellerCoupons"] });
    },
    onError: () => toast.error("Failed to create coupon."),
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: couponApi.updateCoupon,
    onSuccess: () => {
      toast.success("Coupon updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["SellerCoupons"] });
    },
    onError: () => toast.error("Failed to update coupon."),
  });
};


