import { Paths, useGetList } from "../factory";
import type { BackendNews } from "../client";

// GET /news?isPublished=true&limit=n — dernek haberleri / duyurular
export function useHomeNews(limit = 3) {
  const query = useGetList(Paths.News, {
    params: { limit },
    queryKey: [Paths.News, "home", limit],
  });
  return { ...query, data: query.data as BackendNews[] };
}

// GET /news?isPublished=true — yayındaki tüm haberler (yeniden eskiye)
export function useAllNews() {
  const query = useGetList(Paths.News, {
    queryKey: [Paths.News, "all"],
  });
  return { ...query, data: query.data as BackendNews[] };
}
