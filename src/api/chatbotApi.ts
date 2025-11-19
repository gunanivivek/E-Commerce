import api from "./axiosInstance";

export const askProductQuestion = async (
  productId: number,
  question: string
): Promise<{ answer: string }> => {
  const res = await api.post(`/products/${productId}/qa`, {
    question,
  });
  return res.data;
};
