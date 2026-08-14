import { useEffect, useState } from "react";

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:3000/api";

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
