import { API_BASE_URL } from "./env";

export type Role = "admin" | "member";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  memberId?: string;
}

async function authRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function login(email: string, password: string) {
  return authRequest<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function logout() {
  return authRequest<{ success: boolean }>("/auth/logout", { method: "POST" });
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    return await authRequest<AuthUser>("/auth/me");
  } catch {
    return null;
  }
}

export function forgotPassword(email: string) {
  return authRequest<{ success: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, newPassword: string) {
  return authRequest<{ success: boolean }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
