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
  membershipType?: "individual" | "corporate";
  locations?: string[];
  birthPlace?: string;
  birthDate?: string;
  nationality?: string;
  nationalId?: string;
  maritalStatus?: string;
  faxPhone?: string;
  personalMobilePhone?: string;
  affiliatedOrganizations?: string;
  contactPreference?: string;
  activityAreas?: string[];
  productsAndServices?: string[];
  kvkkConsent: boolean;
  bylawsAcknowledged: boolean;
  infoAccuracyConfirmed: boolean;
  collectionType?: "entry_fee" | "monthly_fee" | "both";
  autoDebitDate?: string;
  autoDebitDayOfMonth?: number;
  paymentHolderFullName?: string;
  paymentHolderCompanyName?: string;
  paymentHolderTitle?: string;
  paymentHolderCompanyAddress?: string;
  cardHolderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  paymentConsent?: boolean;
}

export interface MembershipApplicationFiles {
  photos?: File[];
  criminalRecord?: File[];
  idCopy?: File[];
  tradeRegistryGazette?: File[];
  taxCertificate?: File[];
  signatureCircular?: File[];
}

// Backend, başvuru kaydedildikten sonra JSON değil, doldurulmuş üyelik
// başvuru formunun PDF'ini (application/pdf) döndürür — tarayıcı tarafında
// indirilmesi çağıran taraftadır (bkz. MembershipApplicationPage.tsx).
export async function applyForMembership(
  payload: MembershipApplicationPayload,
  files: MembershipApplicationFiles,
): Promise<Blob> {
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
  return res.blob();
}
