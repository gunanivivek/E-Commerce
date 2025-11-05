import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { 
  getAllAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from "../api/addressApi";
import { useAddressStore } from "../store/addressStore";
import type { Address } from "../types/Address";


export const useAddresses = () => {
  const queryClient = useQueryClient();
  const setAddresses = useAddressStore((s) => s.setAddresses);

  // Fetch all
  const { data, isLoading, isError, error, isSuccess } = useQuery<Address[], AxiosError<{ detail?: string }>>({
    queryKey: ["addresses"],
    queryFn: getAllAddresses,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setAddresses(data || []);
    }
  }, [isSuccess, data, setAddresses]);

  useEffect(() => {
    if (isError && error) {
      const message = error.response?.data?.detail || "Failed to load addresses.";
      toast.error(message);
    }
  }, [isError, error]);

  //  CREATE Mutation
  const createMutation = useMutation({
    mutationFn: createAddress,
    onMutate: () => {
      return toast.loading("Adding address...");
    },
    onSuccess: (_, __, context) => {
      toast.update(context, { render: "Address added successfully!", type: "success", isLoading: false, autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: AxiosError<{ detail?: string }>, __, context) => {
      const message = error.response?.data?.detail || "Failed to add address.";
      if (context) toast.update(context, { render: message, type: "error", isLoading: false, autoClose: 3000 });
    },
  });

  //  UPDATE Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Address }) =>
      updateAddress(id, data),
    onMutate: () => {
      return toast.loading("Updating address...");
    },
    onSuccess: (_, __, context) => {
      toast.update(context, { render: "Address updated successfully!", type: "success", isLoading: false, autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: AxiosError<{ detail?: string }>, __, context) => {
      const message = error.response?.data?.detail || "Failed to update address.";
      if (context) toast.update(context, { render: message, type: "error", isLoading: false, autoClose: 3000 });
    },
  });

  //  DELETE Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onMutate: () => {
      return toast.loading("Deleting address...");
    },
    onSuccess: (_, __, context) => {
      toast.update(context, { render: "Address deleted.", type: "success", isLoading: false, autoClose: 2000 });
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (error: AxiosError<{ detail?: string }>, __, context) => {
      const message = error.response?.data?.detail || "Failed to delete address.";
      if (context) toast.update(context, { render: message, type: "error", isLoading: false, autoClose: 3000 });
    },
  });

  return {
    addresses: data,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
