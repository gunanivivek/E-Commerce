// src/api/axiosInstance.ts
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // your Zustand store


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important if token in cookies
});

// A helper logout function
const handleLogout = () => {
  try {
    localStorage.removeItem("authData");
    const { logout } = useAuthStore.getState(); // Zustand logout function
    if (logout) logout();
  } catch (err) {
    console.error("Error clearing auth:", err);
  }
  // Redirect to login
  window.location.href = "/login";
};

// Add interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403 || status === 500) {
      handleLogout();
    }

    return Promise.reject(error);
  }
);

export default api;
