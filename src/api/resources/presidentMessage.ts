import { Paths, useGet } from "../factory";
import type { BackendPresidentMessage } from "../client";

// GET /president-message — "Başkanın Mesajı" sayfası içeriği
export function usePresidentMessage() {
  const query = useGet(Paths.PresidentMessage);
  return { ...query, data: query.data as BackendPresidentMessage | undefined };
}
