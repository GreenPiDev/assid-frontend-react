const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

export interface AdminMember {
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
  references?: string;
  membershipType: "individual" | "corporate";
  sectorStatus?: string;
  birthPlace?: string;
  birthDate?: string;
  nationality?: string;
  maritalStatus?: string;
  affiliatedOrganizations?: string;
  contactPreference?: string;
  applicationDate: string;
  isApproved: boolean;
  approvedAt?: string;
  isActive: boolean;
  logo?: string;
  activityAreas: string[];
  productsAndServices: string[];
  documents: { label: string; url: string }[];
  kvkkConsentAt?: string;
  bylawsAcknowledgedAt?: string;
  createdAt: string;
}

export interface AdminEvent {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isFeatured: boolean;
}

export interface AdminNews {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  sectors: string[];
  publishedAt: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export interface AdminOrganizationSettings {
  _id: string;
  name: string;
  shortName?: string;
  logo?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  footerText?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "member";
  memberId?: string;
  isActive: boolean;
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
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// --- Members ---
export function fetchAdminMembers(params?: { isApproved?: boolean; q?: string }) {
  const search = new URLSearchParams();
  if (params?.isApproved !== undefined) search.set("isApproved", String(params.isApproved));
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return request<AdminMember[]>(`/members/admin${qs ? `?${qs}` : ""}`);
}

export function fetchAdminMember(id: string) {
  return request<AdminMember>(`/members/${id}`);
}

export function setMemberApproval(id: string, isApproved: boolean) {
  return request<AdminMember>(`/members/${id}/approval`, {
    method: "PATCH",
    body: JSON.stringify({ isApproved }),
  });
}

export function updateAdminMember(id: string, dto: Partial<AdminMember>) {
  return request<AdminMember>(`/members/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
}

export function deleteAdminMember(id: string) {
  return request<void>(`/members/${id}`, { method: "DELETE" });
}

// --- Events ---
export function fetchAdminEvents() {
  return request<AdminEvent[]>("/events");
}

export function createAdminEvent(dto: Partial<AdminEvent>) {
  return request<AdminEvent>("/events", { method: "POST", body: JSON.stringify(dto) });
}

export function updateAdminEvent(id: string, dto: Partial<AdminEvent>) {
  return request<AdminEvent>(`/events/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
}

export function deleteAdminEvent(id: string) {
  return request<void>(`/events/${id}`, { method: "DELETE" });
}

// --- News ---
export function fetchAdminNews() {
  return request<AdminNews[]>("/news");
}

export function createAdminNews(dto: Partial<AdminNews>) {
  return request<AdminNews>("/news", { method: "POST", body: JSON.stringify(dto) });
}

export function updateAdminNews(id: string, dto: Partial<AdminNews>) {
  return request<AdminNews>(`/news/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
}

export function deleteAdminNews(id: string) {
  return request<void>(`/news/${id}`, { method: "DELETE" });
}

// --- Organization settings ---
export function fetchOrganizationSettings() {
  return request<AdminOrganizationSettings>("/organization-settings");
}

export function updateOrganizationSettings(dto: Partial<AdminOrganizationSettings>) {
  return request<AdminOrganizationSettings>("/organization-settings", {
    method: "PATCH",
    body: JSON.stringify(dto),
  });
}

export async function uploadOrganizationLogo(file: File): Promise<AdminOrganizationSettings> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/organization-settings/logo`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<AdminOrganizationSettings>;
}

// --- Users (login credentials) ---
export function fetchAdminUsers() {
  return request<AdminUser[]>("/users");
}

export function createAdminUser(dto: { email: string; password: string; role: "admin" | "member"; memberId?: string }) {
  return request<AdminUser>("/users", { method: "POST", body: JSON.stringify(dto) });
}

export function setUserActive(id: string, isActive: boolean) {
  return request<AdminUser>(`/users/${id}/active`, { method: "PATCH", body: JSON.stringify({ isActive }) });
}

export function resetUserPassword(id: string, newPassword: string) {
  return request<{ success: boolean }>(`/users/${id}/password`, {
    method: "PATCH",
    body: JSON.stringify({ newPassword }),
  });
}
