import { api } from "@/app/lib/api/axios";
import { tokenStorage } from "@/app/lib/auth/token-storage";
import type { AuthTokens, User, RegisterPayload } from "@/app/types/auth";

export async function registerUser(data: RegisterPayload) {
  const response = await api.post("/auth/register/", {
    username: data.username,
    email: data.email,
    password: data.password,
    confirm_password: data.confirmPassword, 
  });
  return response.data;
}

export async function loginUser(credentials: { email: string; password: string }) {
  const { data } = await api.post<AuthTokens>("/auth/login/", credentials);
  tokenStorage.setAccessToken(data.access);
  tokenStorage.setRefreshToken(data.refresh ?? null);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get<User>("/auth/me/");
  return data;
}

export function logoutUser() {
  tokenStorage.clear();
}