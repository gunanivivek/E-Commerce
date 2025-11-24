import { toast, type ToastOptions } from "react-toastify";

let isToastActive = false; // global lock

const defaultOptions: ToastOptions = {
  autoClose: 2800,
};

export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  options: ToastOptions = {}
) => {
  if (isToastActive) return; // block extra toasts

  isToastActive = true;

  toast[type](message, {
    ...defaultOptions,
    ...options,
    onClose: () => {
      isToastActive = false; // release lock
    },
  });
};
