import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchMyCardInfo,
  fetchMyMemberProfile,
  removeMyCompanyDocument,
  removeMyPortfolioSlide,
  updateMyCardInfo,
  updateMyMemberProfile,
  uploadMyCompanyDocuments,
  uploadMyLogo,
  uploadMyPortfolioSlides,
  type UpdateMyMemberProfileDto,
} from "../../api/member";
import Badge from "../../components/admin/Badge";
import MemberCardContent from "../../components/directory/MemberCardContent";
import TagEditor from "../../components/forms/TagEditor";
import CardInfoSection from "../../components/forms/CardInfoSection";
import {
  businessActivityOptions,
  contactPreferenceOptions,
  maritalStatusOptions,
  membershipTypeOptions,
} from "../../constants/memberEnums";
import { SECTORS } from "../../constants/sectors";
import { LOCATIONS } from "../../constants/locations";
import { useToast } from "../../context/ToastContext";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <h2 className="mb-5 text-[1.05rem] font-bold text-assid-ink">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.78rem] font-bold text-assid-muted">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50";

const profileQueryKey = ["member", "profile"];
const MAX_PORTFOLIO_SLIDES = 25;

type EditableFields = Required<
  Pick<
    UpdateMyMemberProfileDto,
    | "companyName"
    | "title"
    | "companyAddress"
    | "phone"
    | "mobilePhone"
    | "references"
    | "faxPhone"
    | "personalMobilePhone"
    | "affiliatedOrganizations"
  >
> & {
  membershipType: "individual" | "corporate" | "";
  contactPreference: "email" | "sms" | "phone" | "";
  maritalStatus: "married" | "single" | "";
  sectors: string[];
  locations: string[];
  businessActivityTypes: string[];
  activityAreas: string[];
  productsAndServices: string[];
};

const emptyFields: EditableFields = {
  companyName: "",
  title: "",
  companyAddress: "",
  phone: "",
  mobilePhone: "",
  references: "",
  faxPhone: "",
  personalMobilePhone: "",
  affiliatedOrganizations: "",
  membershipType: "",
  contactPreference: "",
  maritalStatus: "",
  sectors: [],
  locations: [],
  businessActivityTypes: [],
  activityAreas: [],
  productsAndServices: [],
};

export default function MemberProfilePage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchMyMemberProfile,
  });
  const [fields, setFields] = useState<EditableFields>(emptyFields);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isError) showToast("Profil bilgileri yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (!profile) return;
    setFields({
      companyName: profile.companyName ?? "",
      title: profile.title ?? "",
      companyAddress: profile.companyAddress ?? "",
      phone: profile.phone ?? "",
      mobilePhone: profile.mobilePhone ?? "",
      references: profile.references ?? "",
      faxPhone: profile.faxPhone ?? "",
      personalMobilePhone: profile.personalMobilePhone ?? "",
      affiliatedOrganizations: profile.affiliatedOrganizations ?? "",
      membershipType: profile.membershipType ?? "",
      contactPreference: profile.contactPreference ?? "",
      maritalStatus: profile.maritalStatus ?? "",
      sectors: profile.sectors,
      locations: profile.locations,
      businessActivityTypes: profile.businessActivityTypes,
      activityAreas: profile.activityAreas,
      productsAndServices: profile.productsAndServices,
    });
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: updateMyMemberProfile,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });

  function toggleSector(slug: string) {
    setFields((f) => ({
      ...f,
      sectors: f.sectors.includes(slug) ? f.sectors.filter((s) => s !== slug) : [...f.sectors, slug],
    }));
  }

  function toggleLocation(slug: string) {
    setFields((f) => ({
      ...f,
      locations: f.locations.includes(slug) ? f.locations.filter((s) => s !== slug) : [...f.locations, slug],
    }));
  }

  function toggleActivityType(value: string) {
    setFields((f) => ({
      ...f,
      businessActivityTypes: f.businessActivityTypes.includes(value)
        ? f.businessActivityTypes.filter((v) => v !== value)
        : [...f.businessActivityTypes, value],
    }));
  }

  async function handleSave() {
    try {
      const dto: UpdateMyMemberProfileDto = {
        companyName: fields.companyName || undefined,
        title: fields.title || undefined,
        companyAddress: fields.companyAddress || undefined,
        phone: fields.phone || undefined,
        mobilePhone: fields.mobilePhone || undefined,
        references: fields.references || undefined,
        faxPhone: fields.faxPhone || undefined,
        personalMobilePhone: fields.personalMobilePhone || undefined,
        affiliatedOrganizations: fields.affiliatedOrganizations || undefined,
        membershipType: fields.membershipType || undefined,
        contactPreference: fields.contactPreference || undefined,
        maritalStatus: fields.maritalStatus || undefined,
        sectors: fields.sectors,
        locations: fields.locations,
        businessActivityTypes: fields.businessActivityTypes as UpdateMyMemberProfileDto["businessActivityTypes"],
        activityAreas: fields.activityAreas,
        productsAndServices: fields.productsAndServices,
      };
      await saveMutation.mutateAsync(dto);
      showToast("Profil güncellendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Güncelleme başarısız oldu.");
    }
  }

  const uploadLogoMutation = useMutation({
    mutationFn: uploadMyLogo,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await uploadLogoMutation.mutateAsync(file);
      showToast("Logo güncellendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Logo yüklenemedi.");
    }
  }

  const uploadPortfolioMutation = useMutation({
    mutationFn: uploadMyPortfolioSlides,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });
  const removePortfolioMutation = useMutation({
    mutationFn: removeMyPortfolioSlide,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });

  async function handlePortfolioChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length || !profile) return;
    if (profile.portfolioSlides.length + files.length > MAX_PORTFOLIO_SLIDES) {
      showToast(`En fazla ${MAX_PORTFOLIO_SLIDES} slayt yükleyebilirsiniz.`);
      return;
    }
    try {
      await uploadPortfolioMutation.mutateAsync(files);
      showToast("Slaytlar yüklendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Slayt yüklenemedi.");
    }
  }

  async function handleRemovePortfolioSlide(url: string) {
    try {
      await removePortfolioMutation.mutateAsync(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Slayt kaldırılamadı.");
    }
  }

  const uploadCompanyDocsMutation = useMutation({
    mutationFn: uploadMyCompanyDocuments,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });
  const removeCompanyDocMutation = useMutation({
    mutationFn: removeMyCompanyDocument,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });

  async function handleCompanyDocsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    try {
      await uploadCompanyDocsMutation.mutateAsync(files);
      showToast("PDF dosyaları yüklendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "PDF yüklenemedi.");
    }
  }

  async function handleRemoveCompanyDoc(url: string) {
    try {
      await removeCompanyDocMutation.mutateAsync(url);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Dosya kaldırılamadı.");
    }
  }

  if (isLoading || !profile) {
    return <p className="text-assid-muted">Yükleniyor...</p>;
  }

  const isDirty =
    (fields.companyName !== (profile.companyName ?? "") ||
      fields.title !== (profile.title ?? "") ||
      fields.companyAddress !== (profile.companyAddress ?? "") ||
      fields.phone !== (profile.phone ?? "") ||
      fields.mobilePhone !== (profile.mobilePhone ?? "") ||
      fields.references !== (profile.references ?? "") ||
      fields.faxPhone !== (profile.faxPhone ?? "") ||
      fields.personalMobilePhone !== (profile.personalMobilePhone ?? "") ||
      fields.affiliatedOrganizations !== (profile.affiliatedOrganizations ?? "") ||
      fields.membershipType !== (profile.membershipType ?? "") ||
      fields.contactPreference !== (profile.contactPreference ?? "") ||
      fields.maritalStatus !== (profile.maritalStatus ?? "") ||
      JSON.stringify(fields.sectors) !== JSON.stringify(profile.sectors) ||
      JSON.stringify(fields.locations) !== JSON.stringify(profile.locations) ||
      JSON.stringify(fields.businessActivityTypes) !== JSON.stringify(profile.businessActivityTypes) ||
      JSON.stringify(fields.activityAreas) !== JSON.stringify(profile.activityAreas) ||
      JSON.stringify(fields.productsAndServices) !== JSON.stringify(profile.productsAndServices));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Üye Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Profilim</h1>
        </div>
        <Badge variant={profile.applicationStatus === "approved" ? "success" : profile.applicationStatus === "rejected" ? "danger" : "pending"}>
          {profile.applicationStatus === "approved"
            ? "Onaylı Üye"
            : profile.applicationStatus === "rejected"
              ? "Başvurusu Reddedildi"
              : "Onay Bekliyor"}
        </Badge>
      </div>

      <div className="mb-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-4 text-[1.02rem] font-bold text-assid-ink">Logo</h2>
        <div className="flex flex-wrap items-center gap-5">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper">
            {profile.logo ? (
              <img src={profile.logo} alt="Firma logosu" className="h-full w-full object-contain p-1.5" />
            ) : (
              <span className="text-[1.6rem] font-black text-assid-green">
                {(profile.companyName || profile.fullName).charAt(0)}
              </span>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              disabled={uploadLogoMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
            >
              {uploadLogoMutation.isPending ? "Yükleniyor..." : "Logo Yükle"}
            </button>
            <p className="mt-2 text-[0.78rem] text-assid-muted">PNG, JPEG, WEBP veya SVG — en fazla 5MB.</p>
          </div>
        </div>
      </div>

      <div className="mb-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-1 text-[1.02rem] font-bold text-assid-ink">Portfolyo Slaytları</h2>
        <p className="mb-4 text-[0.78rem] text-assid-muted">
          Firma rehberindeki profilinizde gösterilecek slayt görselleri ({profile.portfolioSlides.length}/
          {MAX_PORTFOLIO_SLIDES}).
        </p>
        {profile.portfolioSlides.length > 0 && (
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {profile.portfolioSlides.map((url) => (
              <div key={url} className="group relative aspect-square overflow-hidden rounded-[10px] border border-assid-line">
                <img src={url} alt="Portfolyo slaytı" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemovePortfolioSlide(url)}
                  disabled={removePortfolioMutation.isPending}
                  aria-label="Slaytı kaldır"
                  className="absolute right-1 top-1 grid h-6 w-6 cursor-pointer place-items-center rounded-full border-0 bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handlePortfolioChange}
          className="hidden"
          id="portfolio-slide-input"
        />
        <button
          type="button"
          disabled={uploadPortfolioMutation.isPending || profile.portfolioSlides.length >= MAX_PORTFOLIO_SLIDES}
          onClick={() => document.getElementById("portfolio-slide-input")?.click()}
          className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
        >
          {uploadPortfolioMutation.isPending ? "Yükleniyor..." : "Slayt Ekle"}
        </button>
      </div>

      <div className="mb-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-4 text-[1.02rem] font-bold text-assid-ink">Firma PDF'leri</h2>
        {profile.companyDocuments.length > 0 && (
          <ul className="mb-4 grid gap-2">
            {profile.companyDocuments.map((doc) => (
              <li key={doc.url} className="flex items-center justify-between gap-3 rounded-[10px] border border-assid-line px-3.5 py-2.5">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="truncate text-[0.85rem] font-bold text-assid-ink underline">
                  {doc.label}
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveCompanyDoc(doc.url)}
                  disabled={removeCompanyDocMutation.isPending}
                  className="cursor-pointer border-0 bg-transparent text-assid-muted hover:text-[#c0392b]"
                  aria-label={`${doc.label} dosyasını kaldır`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleCompanyDocsChange}
          className="hidden"
          id="company-document-input"
        />
        <button
          type="button"
          disabled={uploadCompanyDocsMutation.isPending}
          onClick={() => document.getElementById("company-document-input")?.click()}
          className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
        >
          {uploadCompanyDocsMutation.isPending ? "Yükleniyor..." : "PDF Yükle"}
        </button>
        <p className="mt-2 text-[0.78rem] text-assid-muted">En fazla 10MB, sadece PDF.</p>
      </div>

      <div className="grid gap-5">
        <Section title="Başvuru Bilgileri">
          <p className="mb-4 -mt-2 text-[0.78rem] text-assid-muted">
            Ad Soyad ve e-posta adresiniz giriş bilginizdir; değişiklik için ASSİD ile iletişime geçin. Diğer
            alanları aşağıdan güncelleyebilirsiniz.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Ad Soyad">
              <input value={profile.fullName} disabled className={`${inputClass} opacity-60`} />
            </Field>
            <Field label="E-posta">
              <input value={profile.email} disabled className={`${inputClass} opacity-60`} />
            </Field>
            <Field label="Firma Adı">
              <input
                value={fields.companyName}
                onChange={(e) => setFields((f) => ({ ...f, companyName: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Unvan">
              <input
                value={fields.title}
                onChange={(e) => setFields((f) => ({ ...f, title: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Telefon">
              <input
                value={fields.phone}
                onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Cep Telefonu">
              <input
                value={fields.mobilePhone}
                onChange={(e) => setFields((f) => ({ ...f, mobilePhone: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Firma Adresi">
              <input
                value={fields.companyAddress}
                onChange={(e) => setFields((f) => ({ ...f, companyAddress: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Üyelik Tipi">
              <select
                value={fields.membershipType}
                onChange={(e) =>
                  setFields((f) => ({ ...f, membershipType: e.target.value as EditableFields["membershipType"] }))
                }
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {membershipTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Referanslar">
              <input
                value={fields.references}
                onChange={(e) => setFields((f) => ({ ...f, references: e.target.value }))}
                className={inputClass}
              />
            </Field>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Sektörler</span>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map((sector) => (
                <button
                  type="button"
                  key={sector.slug}
                  onClick={() => toggleSector(sector.slug)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                    fields.sectors.includes(sector.slug)
                      ? "border-assid-green bg-assid-green text-white"
                      : "border-assid-line bg-transparent text-assid-ink"
                  }`}
                >
                  {sector.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Lokasyonlar</span>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc.slug}
                  onClick={() => toggleLocation(loc.slug)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                    fields.locations.includes(loc.slug)
                      ? "border-assid-green bg-assid-green text-white"
                      : "border-assid-line bg-transparent text-assid-ink"
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Faaliyet Türleri</span>
            <div className="flex flex-wrap gap-2">
              {businessActivityOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => toggleActivityType(opt.value)}
                  className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                    fields.businessActivityTypes.includes(opt.value)
                      ? "border-assid-green bg-assid-green text-white"
                      : "border-assid-line bg-transparent text-assid-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        <Section title="Kişisel / İletişim Bilgileri">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Telefon / Faks">
              <input
                value={fields.faxPhone}
                onChange={(e) => setFields((f) => ({ ...f, faxPhone: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Kişisel Cep Telefonu">
              <input
                value={fields.personalMobilePhone}
                onChange={(e) => setFields((f) => ({ ...f, personalMobilePhone: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="Bağlı Olduğu Kuruluşlar">
              <input
                value={fields.affiliatedOrganizations}
                onChange={(e) => setFields((f) => ({ ...f, affiliatedOrganizations: e.target.value }))}
                className={inputClass}
              />
            </Field>
            <Field label="İletişim Tercihi">
              <select
                value={fields.contactPreference}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    contactPreference: e.target.value as EditableFields["contactPreference"],
                  }))
                }
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {contactPreferenceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Medeni Hal">
              <select
                value={fields.maritalStatus}
                onChange={(e) =>
                  setFields((f) => ({ ...f, maritalStatus: e.target.value as EditableFields["maritalStatus"] }))
                }
                className={inputClass}
              >
                <option value="">Seçiniz</option>
                {maritalStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Firma Rehberinde Görünecek Bilgiler">
          <div className="grid gap-5">
            <div>
              <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Alt Faaliyet Alanları</span>
              <TagEditor
                items={fields.activityAreas}
                onChange={(items) => setFields((f) => ({ ...f, activityAreas: items }))}
                placeholder="Faaliyet alanı ekle..."
              />
            </div>
            <div>
              <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Ürün ve Hizmetler</span>
              <TagEditor
                items={fields.productsAndServices}
                onChange={(items) => setFields((f) => ({ ...f, productsAndServices: items }))}
                placeholder="Ürün / hizmet ekle..."
              />
            </div>
          </div>
        </Section>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saveMutation.isPending || !isDirty}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saveMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </div>

      <div className="mt-5">
        <CardInfoSection
          queryKey={["member", "card-info"]}
          fetchCardInfo={fetchMyCardInfo}
          updateCardInfo={updateMyCardInfo}
        />
      </div>

      <div className="mt-5">
        <span className="mb-3 block text-[0.78rem] font-bold uppercase tracking-wide text-assid-muted">
          Firma Rehberinde Böyle Görünecek
        </span>
        <div className="rounded-3xl border border-white/35 bg-[rgba(9,34,58,.92)] px-8.5 py-8.5 text-white shadow-[0_30px_80px_rgba(6,18,30,.5)] backdrop-blur-xl">
          <MemberCardContent
            member={{
              id: profile._id,
              name: profile.companyName || profile.fullName,
              logo: profile.logo,
              sectors: fields.sectors,
              activityAreas: fields.activityAreas,
              productsAndServices: fields.productsAndServices,
              contact: {
                memberType: profile.membershipType === "corporate" ? "Kurumsal" : "Bireysel",
                representative: profile.fullName,
                phone: profile.phone || profile.mobilePhone || "",
                address: profile.companyAddress || "",
              },
            }}
          />
        </div>
        <p className="mt-3 text-[0.78rem] text-assid-muted">
          Önizleme anlıktır — herkese açık rehberde görünmesi için "Değişiklikleri Kaydet"e basmanız gerekir.
        </p>
      </div>
    </div>
  );
}
