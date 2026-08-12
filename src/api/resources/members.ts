import { Paths, useGet, useGetList } from "../factory";
import type { Member } from "../../types";

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
