import { createContext, useCallback, useContext, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest, type AuthUser } from "../api/auth";

export const authMeQueryKey = ["auth", "me"];

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useQuery({
    queryKey: authMeQueryKey,
    queryFn: fetchCurrentUser,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const { user: loggedInUser } = await loginRequest(email, password);
      queryClient.setQueryData(authMeQueryKey, loggedInUser);
      return loggedInUser;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    await logoutRequest();
    queryClient.setQueryData(authMeQueryKey, null);
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth, AuthProvider içinde kullanılmalı");
  return ctx;
}
