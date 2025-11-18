import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../api/adminApi";
import { toast } from "react-toastify";
import { useAdminProductStore } from "../../store/Admin/adminProductStore";

export const useFetchProducts = () => {
  const { setProducts, setError, setLoading, products } =
    useAdminProductStore();

  const query = useQuery({
    queryKey: ["admin-products"],
    queryFn: getAllProducts,
    retry: false,

    // 🔥 MAIN FIX → ALWAYS fetch fresh data when page loads
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  useEffect(() => {
    setLoading(query.isFetching);

    if (query.isSuccess && query.data) {
      // 🔥 FIX: Do not overwrite local mutation UI update
      if (JSON.stringify(products) !== JSON.stringify(query.data)) {
        setProducts(query.data);
      }

      setError(null);
    }

    if (query.isError && query.error) {
      const message = query.error.message || "Failed to fetch products";
      setError(message);
      toast.error(message);
    }
  }, [
    query.isFetching,
    query.isSuccess,
    query.data,
    query.isError,
    query.error,
    setProducts,
    setError,
    setLoading,
    products,
  ]);

  return query;
};
