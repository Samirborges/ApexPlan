import axios from "axios";
import { tokenStorage } from "@/app/lib/auth/token-storage";
import { refreshAccessToken } from "@/app/lib/auth/refresh-token";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const hasRefreshToken = Boolean(tokenStorage.getRefreshToken());
      if (!hasRefreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return Promise.reject(error);
      }

      try {
        isRefreshing = true;
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenStorage.clear();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);