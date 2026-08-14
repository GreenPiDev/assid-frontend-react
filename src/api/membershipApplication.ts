import { API_BASE_URL } from "./env";

export interface MembershipApplicationPayload {
  fullName: string;
  companyName?: string;
  title?: string;
  companyAddress?: string;
  phone?: string;
  mobilePhone?: string;
  email: string;
  sectors: string[];
  businessActivityTypes?: string[];
  references?: string;
  membershipType: "individual" | "corporate";
  sectorStatus?: string;
  birthPlace?: string;
  birthDate?: string;
  nationality?: string;
  maritalStatus?: string;
  affiliatedOrganizations?: string;
  contactPreference?: string;
  activityAreas?: string[];
  productsAndServices?: string[];
  kvkkConsent: boolean;
  bylawsAcknowledged: boolean;
}

export interface MembershipApplicationFiles {
  photos?: File[];
  criminalRecord?: File[];
  idCopy?: File[];
  tradeRegistryGazette?: File[];
  taxCertificate?: File[];
  signatureCircular?: File[];
}

export async function applyForMembership(payload: MembershipApplicationPayload, files: MembershipApplicationFiles) {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  for (const [field, fileList] of Object.entries(files)) {
    for (const file of fileList ?? []) {
      formData.append(field, file);
    }
  }

  const res = await fetch(`${API_BASE_URL}/members/apply`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
    throw new Error(message ?? `İstek başarısız (${res.status})`);
  }
  return res.json() as Promise<{ success: boolean }>;
}
