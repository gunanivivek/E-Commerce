import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { toggleCustomerBlock } from "../../api/customerApi";
import type { Customer } from "../../types/admin";

export const useCustomerActions = () => {
  const queryClient = useQueryClient();
  const [mutatingId, setMutatingId] = useState<number | null>(null);

  const mutation = useMutation<Customer, Error, number>({
    mutationFn: toggleCustomerBlock,
    onMutate: (variables) => {
      setMutatingId(variables);
    },
    onSuccess: () => {
      toast.success("Customer status updated!");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: () => {
      toast.error("Something went wrong");
    },
    onSettled: () => {
      setMutatingId(null); // clear active id
    },
  });

  return {
    toggleBlockCustomer: mutation.mutate,
    mutatingId,             // <-- return current id
    isPending: mutation.isPending,
  };
};
