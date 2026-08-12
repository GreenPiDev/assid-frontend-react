import { Paths, useGetList } from "../factory";
import type { BackendEvent } from "../client";

// GET /events?upcoming=true&limit=n — derneğin yaklaşan etkinlikleri
export function useUpcomingEvents(limit = 4) {
  const query = useGetList(Paths.Events, {
    params: { upcoming: true, limit },
    queryKey: [Paths.Events, "upcoming", limit],
  });
  return { ...query, data: query.data as BackendEvent[] };
}
