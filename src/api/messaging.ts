import { API_BASE_URL } from "./env";

export type NotificationType = "new_message" | "info_request" | "new_conversation";

// Admin-üye konuşmalarında backend "otherMember"/karşı taraf olarak bu sabit id'yi
// döndürür (gerçek bir Member kaydı yok, karşı taraf dernek yönetiminin kendisi).
export const ADMIN_MEMBER_ID = "admin";

export interface ConversationMember {
  id: string;
  companyName: string | null;
  fullName: string;
  logo?: string | null;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderMemberId: string | null;
  senderIsAdmin: boolean;
  body: string;
  createdAt: string;
  readAt: string | null;
}

export interface ConversationSummary {
  id: string;
  otherMember: ConversationMember;
  lastMessage: MessageDto | null;
  updatedAt: string;
}

export interface AdminConversationSummary {
  id: string;
  isAdminConversation: boolean;
  memberA: ConversationMember;
  memberB: ConversationMember | null;
  lastMessage: MessageDto | null;
  updatedAt: string;
  adminReadAt: string | null;
}

export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  conversationId: string | null;
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

export const fetchConversations = () => request<ConversationSummary[]>("/messaging/conversations");

export const fetchMessages = (conversationId: string) =>
  request<MessageDto[]>(`/messaging/conversations/${conversationId}/messages`);

export const sendMessage = (payload: { recipientMemberId?: string; toAdmin?: boolean; body: string }) =>
  request<MessageDto>("/messaging/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const sendMessageAsAdmin = (memberId: string, body: string) =>
  request<MessageDto>("/messaging/admin/messages", {
    method: "POST",
    body: JSON.stringify({ memberId, body }),
  });

export const fetchUnreadCount = () => request<{ count: number }>("/messaging/unread-count");

export const fetchNotifications = () => request<NotificationDto[]>("/messaging/notifications");

export const markNotificationRead = (id: string) =>
  request<NotificationDto>(`/messaging/notifications/${id}/read`, { method: "PATCH" });

export const fetchAdminConversations = () => request<AdminConversationSummary[]>("/messaging/admin/conversations");

export const fetchAdminMessages = (conversationId: string) =>
  request<MessageDto[]>(`/messaging/admin/conversations/${conversationId}/messages`);

export const fetchAdminUnreadCount = () => request<{ count: number }>("/messaging/admin/unread-count");

export const fetchAdminNotifications = () => request<NotificationDto[]>("/messaging/admin/notifications");

export const markAdminNotificationRead = (id: string) =>
  request<NotificationDto>(`/messaging/admin/notifications/${id}/read`, { method: "PATCH" });
