import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { get } from "./client";

// Tüm API kaynak yolları burada toplanır; her resource dosyası (bkz.
// api/resources/*) bu yolları kullanır. Backend adresleri değişse bile
// tüketen tarafta hiçbir şey değişmez.
export const Paths = {
  Members: "/members",
  News: "/news",
  Events: "/events",
  Stats: "/stats",
  OrganizationSettings: "/organization-settings",
  MembershipFees: "/membership-fees",
};

interface GetOptions extends Partial<Omit<UseQueryOptions, "queryKey" | "queryFn">> {
  params?: { sector?: string; q?: string; limit?: number; upcoming?: boolean };
  queryKey?: unknown[];
}

// Generic GET hook'u: tekil bir kaynak getirir. path + params'a göre otomatik
// bir queryKey üretir, istenirse dışarıdan queryKey/enabled/... override edilebilir.
export function useGet(path: string, { params, queryKey, ...options }: GetOptions = {}) {
  return useQuery({
    queryKey: queryKey || [path, params],
    queryFn: () => get({ path, params }),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    ...options,
  });
}

// useGet'in liste döndüren varyantı: data hiç gelmediyse boş dizi verir,
// bileşenlerde "data ?? []" tekrarını önler.
export function useGetList(path: string, options?: GetOptions) {
  const query = useGet(path, options);
  return { ...query, data: (query.data as unknown[]) ?? [] };
}
