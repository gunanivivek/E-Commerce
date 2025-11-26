import API from "./axiosInstance";

export interface NewsletterPayload {
  email: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export const subscribeNewsletter = async (
  payload: NewsletterPayload
): Promise<NewsletterResponse> => {
  const res = await API.post("/newsletter/subscribe", payload);
  return res.data;
};

export const unsubscribeNewsletter = async (
  payload: NewsletterPayload
): Promise<NewsletterResponse> => {
  const res = await API.post("/newsletter/unsubscribe", payload);
  return res.data;
};
