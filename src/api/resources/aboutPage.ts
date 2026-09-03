import { Paths, useGet } from "../factory";
import type { BackendAboutPage } from "../client";

// GET /about-page — "Hakkımızda" sayfası içeriği
export function useAboutPage() {
  const query = useGet(Paths.AboutPage);
  return { ...query, data: query.data as BackendAboutPage | undefined };
}
