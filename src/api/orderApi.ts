import API from "./axiosInstance";

// GET all user orders
export const getUserOrders = async () => {
  const res = await API.get("/user/orders");
  return res.data;
};

// Place order (create)
export const createOrder = async (payload: {
  address_id: number;
  payment_method: string;
}) => {
  const res = await API.post("/user/orders", payload);
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

// Create payment intent (default card)
export const createPaymentIntent = async (orderId: number) => {
  const res = await API.post("/payments/create-intent", {
    order_id: orderId,
    currency: "usd",
    metadata: {},
  });
  return res.data; // { client_secret: string }
};

// Confirm payment
export const confirmPayment = async (payment_intent_id: string) => {
  const res = await API.post("/payments/confirm", { payment_intent_id });
  return res.data;
};
