import axios from "axios";
import { tokenStorage } from "@/app/lib/auth/token-storage";


export async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`,
    { refresh: refreshToken } 
  );

  tokenStorage.setAccessToken(data.access);
  return data.access;
}