import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";

// ✅ Extend both Axios config interfaces to add `skipRefresh`
declare module "axios" {
  export interface AxiosRequestConfig {
    skipRefresh?: boolean;
    _retry?: boolean;
  }
  export interface InternalAxiosRequestConfig {
    skipRefresh?: boolean;
    _retry?: boolean;
  }
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(null);
  });
  failedQueue = [];
};

API.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig;

    const status = error.response?.status;
    const requestUrl = `${originalRequest?.baseURL || ""}${originalRequest?.url || ""}`;

    // 🧠 Skip refresh logic if explicitly marked or for auth endpoints
    if (
      originalRequest.skipRefresh ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/forget-password") ||
      requestUrl.includes("/auth/change-password")
    ) {
      return Promise.reject(error);
    }

    // 🔐 Handle 401 Unauthorized (token expired)
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch(Promise.reject);
      }

      isRefreshing = true;

      try {
        await API.post("/auth/refresh", null, { skipRefresh: true });
        processQueue();
        return API(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error);
        const { logout } = useAuthStore.getState();
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API;
