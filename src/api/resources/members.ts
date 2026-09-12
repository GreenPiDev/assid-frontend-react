import { Paths, useGet, useGetList } from "../factory";
import { API_BASE_URL } from "../env";
import type { Member } from "../../types";

export interface InfoRequestDto {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

// POST /members/:id/info-request — ziyaretçi bilgi talebi
export async function submitInfoRequest(memberId: string, dto: InfoRequestDto): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/members/${memberId}/info-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
}

// GET /members — dernek üyesi firmalar
export function useMembers() {
  const query = useGetList(Paths.Members);
  return { ...query, data: query.data as Member[] };
}

// GET /members?sector=slug
export function useMembersBySector(slug: string | null | undefined) {
  const query = useGetList(Paths.Members, {
    params: { sector: slug ?? undefined },
    queryKey: [Paths.Members, "sector", slug],
    enabled: !!slug,
  });
  return { ...query, data: query.data as Member[] };
}

// GET /members/:id
export function useMemberById(id: string | number | null | undefined) {
  const query = useGet(`${Paths.Members}/${id}`, {
    queryKey: [Paths.Members, "detail", id],
    enabled: !!id,
  });
  return { ...query, data: query.data as Member | null | undefined };
}

// GET /members?q=query&limit=8
export function useMemberSearch(query: string, limit = 8) {
  const result = useGetList(Paths.Members, {
    params: { q: query, limit },
    queryKey: [Paths.Members, "search", query],
    enabled: !!query?.trim(),
  });
  return { ...result, data: result.data as Member[] };
}
