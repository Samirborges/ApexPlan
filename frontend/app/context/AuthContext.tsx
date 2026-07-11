"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/app/types/auth";
import { fetchCurrentUser, logoutUser } from "@/app/services/auth.service";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Como o token vive em memória, ao recarregar a página ele some.
    // Se houver refresh token via cookie httpOnly, essa chamada
    // consegue restaurar a sessão silenciosamente. Caso contrário,
    // vai falhar e o usuário permanece deslogado até logar de novo.
    fetchCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}