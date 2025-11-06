// src/api/axiosInstance.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const handleLogout = () => {
  try {
    localStorage.removeItem("authData");
    const { logout } = useAuthStore.getState();
    logout?.();
  } catch (err) {
    console.error("Error clearing auth:", err);
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401) {
  
      if (currentPath === "/login") {
      
        return Promise.reject(error);
      }

     
      handleLogout();
      toast.error("Session expired. Please login again.");

    
      setTimeout(() => {
        window.location.href = "/login";
      }, 200);

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
