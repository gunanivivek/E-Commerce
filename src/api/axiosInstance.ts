import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { logoutUser } from "./authApi";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// secondary API instance (optional) - use when you need to call the alternate backend
const api2 = axios.create({
  baseURL: import.meta.env.VITE_API_URL_2 ?? import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// helper to pick instance at call site
export const getAPI = (useAlt = false) => (useAlt ? api2 : api);

const handleLogout = () => {
  try {
    localStorage.removeItem("authData");
    const { logout } = useAuthStore.getState();
    logout?.();
    logoutUser();
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

export { api2 };
export default api;
