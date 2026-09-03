import { API_BASE_URL } from "./env";

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
  membershipType?: "individual" | "corporate";
  sectorStatus?: string;
  birthPlace?: string;
  birthDate?: string;
  nationality?: string;
  maritalStatus?: string;
  faxPhone?: string;
  personalMobilePhone?: string;
  affiliatedOrganizations?: string;
  contactPreference?: string;
  applicationDate: string;
  applicationStatus: "pending" | "approved" | "rejected";
  approvedAt?: string;
  isActive: boolean;
  logo?: string;
  activityAreas: string[];
  productsAndServices: string[];
  documents: { label: string; url: string }[];
  kvkkConsentAt?: string;
  bylawsAcknowledgedAt?: string;
  infoAccuracyConfirmedAt?: string;
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
}

export interface AdminNews {
  _id: string;
  title: string;
  summary?: string;
  content?: string;
  imageUrls: string[];
  publishedAt: string;
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
  kvkkText?: string;
  bylawsText?: string;
  cookiePolicyText?: string;
  privacyPolicyText?: string;
  showKvkkConsent?: boolean;
  requireKvkkConsent?: boolean;
  showBylawsConsent?: boolean;
  requireBylawsConsent?: boolean;
  showLoginMembershipCta?: boolean;
  showMembershipFeesTable?: boolean;
  showAttachmentsSection?: boolean;
  showMembershipClassSection?: boolean;
}

export interface AdminAboutPage {
  _id: string;
  title?: string;
  subtitle?: string;
  bodyParagraph1?: string;
  bodyParagraph2?: string;
  visionText?: string;
  missionText?: string;
  image1?: string;
  image2?: string;
}

export interface AdminPresidentMessage {
  _id: string;
  image?: string;
  messageHtml?: string;
}

export interface AdminMembershipFee {
  _id: string;
  label: string;
  amount: number;
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
export function fetchAdminMembers(params?: {
  status?: "pending" | "approved" | "rejected";
  q?: string;
}) {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  return request<AdminMember[]>(`/members/admin${qs ? `?${qs}` : ""}`);
}

export function fetchAdminMember(id: string) {
  return request<AdminMember>(`/members/${id}`);
}

export function fetchMemberMaskedNationalId(id: string) {
  return request<{ maskedNationalId: string | null }>(`/members/${id}/national-id`);
}

export function setMemberApplicationStatus(id: string, applicationStatus: "pending" | "approved" | "rejected") {
  return request<AdminMember>(`/members/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ applicationStatus }),
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

export async function uploadAdminEventImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/events/upload-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  const { url } = (await res.json()) as { url: string };
  return url;
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

export async function uploadAdminNewsImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const res = await fetch(`${API_BASE_URL}/news/upload-images`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  const { urls } = (await res.json()) as { urls: string[] };
  return urls;
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

// --- About page ---
export function fetchAdminAboutPage() {
  return request<AdminAboutPage>("/about-page");
}

export function updateAdminAboutPage(dto: Partial<AdminAboutPage>) {
  return request<AdminAboutPage>("/about-page", { method: "PATCH", body: JSON.stringify(dto) });
}

async function uploadAdminAboutImage(field: "image1" | "image2", file: File): Promise<AdminAboutPage> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/about-page/${field}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<AdminAboutPage>;
}

export function uploadAdminAboutImage1(file: File) {
  return uploadAdminAboutImage("image1", file);
}

export function uploadAdminAboutImage2(file: File) {
  return uploadAdminAboutImage("image2", file);
}

// --- President message ---
export function fetchAdminPresidentMessage() {
  return request<AdminPresidentMessage>("/president-message");
}

export function updateAdminPresidentMessage(dto: Partial<AdminPresidentMessage>) {
  return request<AdminPresidentMessage>("/president-message", { method: "PATCH", body: JSON.stringify(dto) });
}

export async function uploadAdminPresidentMessageImage(file: File): Promise<AdminPresidentMessage> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}/president-message/image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<AdminPresidentMessage>;
}

// --- Membership fees ---
export function fetchMembershipFees() {
  return request<AdminMembershipFee[]>("/membership-fees");
}

export function createMembershipFee(dto: { label: string; amount: number }) {
  return request<AdminMembershipFee>("/membership-fees", { method: "POST", body: JSON.stringify(dto) });
}

export function updateMembershipFee(id: string, dto: Partial<{ label: string; amount: number }>) {
  return request<AdminMembershipFee>(`/membership-fees/${id}`, { method: "PATCH", body: JSON.stringify(dto) });
}

export function deleteMembershipFee(id: string) {
  return request<void>(`/membership-fees/${id}`, { method: "DELETE" });
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
