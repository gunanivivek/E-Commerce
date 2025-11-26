// hooks/useProductQA.ts
import { useMutation } from "@tanstack/react-query";
import * as qaApi from "../../api/chatbotApi";
import { toast } from "react-toastify";
import axios from "axios";

export const useProductQA = () => {
  return useMutation({
    mutationFn: ({
      productId,
      question,
    }: {
      productId: number;
      question: string;
    }) => qaApi.askProductQuestion(productId, question),

    onError: (err: unknown) => {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        toast.error(String(err.response.data.message));
        return;
      }

      if (err instanceof Error && err.message) {
        toast.error(err.message);
        return;
      }

      toast.error("Something went wrong");
    },
  });
};
