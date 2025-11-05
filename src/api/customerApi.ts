import type { User } from "../types/auth";
import API from "./axiosInstance";


export const updateCustomerProfile = async (
  customerId: string,
  data: Partial<User>
): Promise<User> => {
  const res = await API.patch(`/users/${customerId}`, data);
  return res.data;
};

