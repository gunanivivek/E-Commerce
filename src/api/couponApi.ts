import API from "./axiosInstance";

export interface Coupon {
  id: number;
  coupon_name: string;
  coupon_description: string;
  discount_type: "flat" | "percentage";
  discount_value: number;
  minimum_value: number;
  expiry_date: string;
  usage_limit: number;
  used_count: number;
  user_id: number;
  coupon_code: string;
  created_at: string;
  updated_at: string;
}

export interface CouponInput {
  coupon_name: string;
  coupon_description: string;
  discount_type: "flat" | "percentage";
  discount_value: number;
  minimum_value: number;
  expiry_date: string;
  usage_limit: number;
  coupon_status?: true;
}

// Fetch all coupons
export const getCoupons = async (): Promise<Coupon[]> => {
  const res = await API.get("/coupons/?role=seller");
  return res.data;
};

export const getAdminCoupons = async (): Promise<Coupon[]> => {
  const res = await API.get("/coupons/?role=admin");
  return res.data;
};

// Create coupon
export const createCoupon = async (data: CouponInput): Promise<Coupon> => {
  const res = await API.post("/coupons/", data);
  return res.data;
};

export const updateCoupon = async ({
  id,
  data,
}: {
  id: number;
  data: CouponInput;
}): Promise<Coupon> => {
  const res = await API.patch(`/coupons/${id}`, data);
  return res.data;
};

// Delete coupon
export const deleteCoupon = async (id: number): Promise<void> => {
  await API.delete(`/coupons/${id}`);
};
