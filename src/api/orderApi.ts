import API from "./axiosInstance";

// GET all user orders
export const getUserOrders = async () => {
  const res = await API.get("/user/orders");
  return res.data;
};

// Cancel order (only when status = pending)
export const cancelOrder = async (orderId: number) => {
  const res = await API.patch(`/user/orders/${orderId}/cancel`);
  return res.data;
};

// Download Invoice (only when delivered)
export const downloadInvoice = async (orderId: number) => {
  const res = await API.get(`/invoice/${orderId}`, {
    responseType: "blob",
  });
  return res.data;
};
