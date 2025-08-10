import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import ENV_CONFIG from "./env.config";
import { refreshTokenApi } from "@/features/auth/apis/authApi";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const instance = axios.create({
  baseURL: ENV_CONFIG.URL_SERVER,
  withCredentials: true,
});

// ✅ Add access token nếu bạn dùng Authorization Header
instance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor với tránh vòng lặp vô hạn
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const responseStatus = error.response?.status;

    // ❗ Tránh gọi refreshToken nhiều lần
    if (responseStatus === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await refreshTokenApi();

        if (refreshResponse.status === 200) {
          // Sau khi refresh thành công, gửi lại request gốc
          return instance(originalRequest);
        }

        // Nếu refresh trả về 401
        if (refreshResponse.status === 401) {
          await useAuthStore.getState().signout();
          return Promise.reject({ status: 401, message: "Please login again" });
        }
      } catch (refreshError) {
        if (
          refreshError instanceof AxiosError &&
          refreshError.response?.status === 401
        ) {
          await useAuthStore.getState().signout();
          return Promise.reject({ status: 401, message: "Please login again" });
        }
        return Promise.reject(refreshError);
      }
    }

    // ✅ Trả lỗi phù hợp hơn
    const customError = error.response?.data ?? error;
    return Promise.reject(customError);
  }
);

export default instance;
