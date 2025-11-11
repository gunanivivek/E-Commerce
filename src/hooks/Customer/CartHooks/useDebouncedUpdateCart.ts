import { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import useUpdateCartQuantity from "./useUpdateCartQuantity";
import { useCartStore } from "../../../store/cartStore";

type TimerMap = Map<number, ReturnType<typeof setTimeout>>;

export const useDebouncedUpdateCart = (delay = 500) => {
  const mutation = useUpdateCartQuantity();
  const timers = useRef<TimerMap>(new Map());

  useEffect(() => {
    const snapshot = timers.current;
    return () => {
      // clear all timers on unmount (use snapshot to avoid potential ref changes)
      snapshot.forEach((t) => clearTimeout(t));
    };
  }, []);

  const scheduleUpdate = ({ id, quantity }: { id: number; quantity: number }) => {
    // immediate optimistic UI update in zustand
    useCartStore.setState((state) => ({
      cartItems: state.cartItems.map((it) => (it.id === id ? { ...it, quantity } : it)),
    }));

    // debounce API call
    const existing = timers.current.get(id);
    if (existing) clearTimeout(existing);
    const t = setTimeout(() => {
      timers.current.delete(id);
      // fire mutation and show a single toast on success for the final quantity
      mutation.mutate(
        { id, quantity },
        {
          onSuccess: () => {
            toast.success("Quantity updated");
          },
        }
      );
    }, delay);
    timers.current.set(id, t);
  };

  const cancel = (id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
  };

  return { scheduleUpdate, cancel };
};

export default useDebouncedUpdateCart;
