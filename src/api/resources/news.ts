import { Paths, useGetList } from "../factory";
import type { BackendNews } from "../client";

// GET /news?isPublished=true&limit=n — sektörel haberler / duyurular
export function useHomeNews(limit = 3) {
  const query = useGetList(Paths.News, {
    params: { limit },
    queryKey: [Paths.News, "home", limit],
  });
  return { ...query, data: query.data as BackendNews[] };
}
