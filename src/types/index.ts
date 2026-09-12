export interface Sector {
  slug: string;
  name: string;
  image: string;
  pin: { left: string; top: string };
}

export interface MemberContact {
  memberType: string;
  representative: string;
  phone: string;
  address: string;
}

export interface Member {
  id: string;
  name: string;
  logo?: string;
  sectors: string[];
  activityAreas: string[];
  productsAndServices: string[];
  contact: MemberContact;
  notes?: Record<string, string>;
  companyDocuments?: { label: string; url: string }[];
  portfolioSlides?: string[];
  isFeatured?: boolean;
}

export interface SelectItem {
  value: string;
  label: string;
}
