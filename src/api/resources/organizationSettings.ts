import { Paths, useGet } from "../factory";
import type { BackendOrganizationSettings } from "../client";

// GET /organization-settings — footer ve iletişim bilgileri için kurum ayarları
export function useOrganizationSettings() {
  const query = useGet(Paths.OrganizationSettings);
  return { ...query, data: query.data as BackendOrganizationSettings | undefined };
}
