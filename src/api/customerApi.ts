import type { Customer } from "../types/admin";
import type { User } from "../types/auth";
import API from "./axiosInstance";


export const updateCustomerProfile = async (
  customerId: string,
  data: Partial<User>
): Promise<User> => {
  const res = await API.patch(`/users/${customerId}`, data);
  return res.data;
};

export const updateCustomerStatus = async (
  id: number,
  isBlocked: boolean
): Promise<Customer> => {
  const res = await API.patch(`/admin/customers/${id}/`, {
    is_blocked: isBlocked,
  });
  return res.data;
};