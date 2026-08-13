const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

export interface MyMemberProfile {
  _id: string;
  fullName: string;
  companyName?: string;
  title?: string;
  companyAddress?: string;
  phone?: string;
  mobilePhone?: string;
  email: string;
  sectors: string[];
  businessActivityTypes: string[];
  membershipType: "individual" | "corporate";
  isApproved: boolean;
  logo?: string;
  activityAreas: string[];
  productsAndServices: string[];
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export function fetchMyMemberProfile() {
  return request<MyMemberProfile>("/members/me");
}

export function updateMyMemberProfile(dto: { activityAreas?: string[]; productsAndServices?: string[] }) {
  return request<MyMemberProfile>("/members/me", { method: "PATCH", body: JSON.stringify(dto) });
}

export async function uploadMyLogo(file: File): Promise<MyMemberProfile> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/members/me/logo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<MyMemberProfile>;
}

export function changeMyPassword(currentPassword: string, newPassword: string) {
  return request<{ success: boolean }>("/users/me/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
