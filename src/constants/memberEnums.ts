export const businessActivityLabels: Record<string, string> = {
  manufacturer: "Üretici",
  importer: "İthalatçı",
  exporter: "İhracatçı",
  seller: "Satıcı",
  service_other: "Hizmet / Diğer",
};

export const businessActivityOptions = Object.entries(businessActivityLabels).map(([value, label]) => ({
  value,
  label,
}));

export const sectorStatusLabels: Record<string, string> = {
  in_sector: "Sektör İçi",
  out_of_sector: "Sektör Dışı",
};

export const sectorStatusOptions = Object.entries(sectorStatusLabels).map(([value, label]) => ({ value, label }));

export const contactPreferenceLabels: Record<string, string> = {
  email: "E-posta",
  sms: "SMS",
  phone: "Telefon",
};

export const contactPreferenceOptions = Object.entries(contactPreferenceLabels).map(([value, label]) => ({
  value,
  label,
}));

export const membershipTypeLabels: Record<string, string> = {
  individual: "Bireysel",
  corporate: "Kurumsal",
};

export const membershipTypeOptions = Object.entries(membershipTypeLabels).map(([value, label]) => ({
  value,
  label,
}));

export const maritalStatusLabels: Record<string, string> = {
  married: "Evli",
  single: "Bekar",
};

export const maritalStatusOptions = Object.entries(maritalStatusLabels).map(([value, label]) => ({
  value,
  label,
}));
