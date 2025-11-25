import type { Customer } from "../types/admin";
import type { User } from "../types/auth";
import type { ContactFormPayload, ContactFormResponse } from "../types/customer";
import API from "./axiosInstance";


export const updateCustomerProfile = async (
  customerId: string,
  data: Partial<User>
): Promise<User> => {
  const res = await API.patch(`/users/${customerId}`, data);
  return res.data;
};
export const toggleCustomerBlock = async (
  userId: number
): Promise<Customer> => {
  const res = await API.patch(`/users/${userId}/toggle-block`);
  return res.data;
};

export const sendContactForm = async (
  payload: ContactFormPayload
): Promise<ContactFormResponse> => {
  const res = await API.post("/users/contact", payload);
  return res.data;
};