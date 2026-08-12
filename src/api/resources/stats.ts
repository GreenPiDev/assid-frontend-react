import { Paths, useGet } from "../factory";
import type { BackendStats } from "../client";

// GET /stats — hero bölümündeki sayaçlar için özet istatistikler
export function useOrgStats() {
  const query = useGet(Paths.Stats);
  return { ...query, data: query.data as BackendStats | undefined };
}
