import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { useAdminOrderStore } from "../../store/Admin/adminOrderStore";
import { getAllOrders } from "../../api/adminApi";

export const useFetchOrders = () => {
  const { setOrders, setError, setLoading } = useAdminOrderStore();

  const query = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
    retry: false,
  });

  useEffect(() => {
    setLoading(query.isFetching);

    if (query.isSuccess && query.data) {
      setOrders(query.data);
      setError(null);
    }

    if (query.isError && query.error) {
      const message = query.error.message || "Failed to fetch orders";
      setError(message);
      toast.error(message);
    }
  }, [
    query.isFetching,
    query.isSuccess,
    query.data,
    query.isError,
    query.error,
    setLoading,
    setOrders,
    setError,
  ]);

  return query;
};
