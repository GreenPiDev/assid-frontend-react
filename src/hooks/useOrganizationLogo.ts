import { useEffect, useState } from "react";
import { API_BASE_URL } from "../api/env";

export function useOrganizationLogo() {
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetch(`${API_BASE_URL}/organization-settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { logo?: string } | null) => setLogoUrl(data?.logo))
      .catch(() => {});
  }, []);

  return logoUrl;
}
