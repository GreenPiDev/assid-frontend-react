import type { Member } from "../types";
import { API_BASE_URL } from "./env";

// Gerçek backend (NestJS + MongoDB) buradan çağrılıyor. get() imzası
// (path, params) sabit kaldığı sürece factory.ts ve api/resources/* hiç
// dokunulmadan kalır — backend adresi veya kaynak isimleri değişirse
// sadece bu dosya güncellenir.

interface GetParams {
  sector?: string;
  q?: string;
  limit?: number;
  upcoming?: boolean;
}

// --- Backend'in gerçek şekli (NestJS Member şeması) ---
interface BackendMember {
  _id: string;
  fullName: string;
  companyName?: string;
  email: string;
  sectors: string[];
  activityAreas?: string[];
  productsAndServices?: string[];
  membershipType: "corporate" | "individual";
  phone?: string;
  mobilePhone?: string;
  companyAddress?: string;
  logo?: string;
  notes?: Record<string, string>;
  isApproved: boolean;
}

export interface BackendNews {
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

export interface BackendEvent {
  _id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  isFeatured: boolean;
}

export interface BackendStats {
  approvedMembersCount: number;
  sectorsCount: number;
  activityAreasCount: number;
  eventsCount: number;
}

export interface BackendMembershipFee {
  _id: string;
  label: string;
  amount: number;
}

export interface BackendOrganizationSettings {
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

// Yönetim panelinden onaylanmamış (isApproved:false) üyeler herkese açık
// sitede hiçbir yerde görünmemeli; bu yüzden filtre burada, tek noktada uygulanır.
function toFrontendMember(m: BackendMember): Member {
  return {
    id: m._id,
    name: m.companyName || m.fullName,
    logo: m.logo,
    sectors: m.sectors,
    activityAreas: m.activityAreas ?? [],
    productsAndServices: m.productsAndServices ?? [],
    contact: {
      memberType: m.membershipType === "corporate" ? "Kurumsal" : "Bireysel",
      representative: m.fullName,
      phone: m.phone || m.mobilePhone || "",
      address: m.companyAddress || "",
    },
    notes: m.notes,
  };
}

function buildQuery(params?: Record<string, unknown>) {
  if (!params) return "";
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request<T>(path: string, params?: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}${buildQuery(params)}`);
  if (!res.ok) throw new Error(`API isteği başarısız: ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export async function get({
  path,
  params,
}: {
  path: string;
  params?: GetParams & Record<string, unknown>;
}) {
  const [resource, id] = path.split("/").filter(Boolean);

  switch (resource) {
    case "members": {
      if (id) {
        try {
          const member = await request<BackendMember>(`/members/${id}`);
          return member.isApproved ? toFrontendMember(member) : null;
        } catch {
          return null;
        }
      }
      const list = await request<BackendMember[]>("/members", { ...params, isApproved: true });
      return list.map(toFrontendMember);
    }

    case "news": {
      if (id) return request<BackendNews>(`/news/${id}`);
      return request<BackendNews[]>("/news", { ...params, isPublished: true });
    }

    case "events": {
      if (id) return request<BackendEvent>(`/events/${id}`);
      return request<BackendEvent[]>("/events", params);
    }

    case "stats":
      return request<BackendStats>("/stats");

    case "organization-settings":
      return request<BackendOrganizationSettings>("/organization-settings");

    case "membership-fees":
      return request<BackendMembershipFee[]>("/membership-fees");

    default:
      throw new Error(`Bilinmeyen kaynak: ${path}`);
  }
}
