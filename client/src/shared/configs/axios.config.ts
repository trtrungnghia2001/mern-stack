import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import ENV_CONFIG from "./env.config";
import { refreshTokenApi } from "@/features/auth/apis/authApi";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const instance = axios.create({
  baseURL: ENV_CONFIG.URL_SERVER,
  withCredentials: true,
});

// Add access token
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const responseStatus = error.response?.status;
    const customError = error.response?.data ?? error;

    const authState = useAuthStore.getState();

    // ⛔️ Không refresh nếu chưa signin
    if (!authState.isAuthenticated) {
      return Promise.reject(customError);
    }

    // ✅ Tránh gọi refresh nhiều lần hoặc gọi chính nó
    if (
      responseStatus === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh-token"
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshTokenApi();

        if (refreshResponse.status === 200) {
          // Gửi lại request gốc
          return instance(originalRequest);
        }

        if (refreshResponse.status === 401) {
          await authState.signout();
          return Promise.reject({ status: 401, message: "Please login again" });
        }
      } catch (refreshError) {
        if (
          refreshError instanceof AxiosError &&
          refreshError.response?.status === 401
        ) {
          await authState.signout();
          return Promise.reject({ status: 401, message: "Please login again" });
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(customError);
  }
);

export default instance;
