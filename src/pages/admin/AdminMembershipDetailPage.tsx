import { useEffect, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminMember,
  fetchMemberCardInfo,
  fetchMemberMaskedNationalId,
  updateAdminMember,
  updateMemberCardInfo,
  type AdminMember,
} from "../../api/admin";
import Badge from "../../components/admin/Badge";
import { ArrowLeftIcon } from "../../components/admin/icons";
import CardInfoSection from "../../components/forms/CardInfoSection";
import {
  businessActivityOptions,
  contactPreferenceOptions,
  maritalStatusOptions,
  membershipTypeOptions,
  sectorStatusOptions,
} from "../../constants/memberEnums";
import { SECTORS } from "../../constants/sectors";
import { LOCATIONS, getLocationName } from "../../constants/locations";
import { useToast } from "../../context/ToastContext";
import { getSectorName } from "../../utils/directory";

function Field({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">{label}</div>
      <div className="mt-1 text-[0.92rem] text-assid-ink">{value && value.length > 0 ? value : "—"}</div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">{label}</span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <h2 className="mb-5 text-[1.05rem] font-bold text-assid-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

const inputClass =
  "rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50";

type EditableAdminFields = Pick<
  AdminMember,
  | "fullName"
  | "companyName"
  | "title"
  | "companyAddress"
  | "phone"
  | "mobilePhone"
  | "email"
  | "references"
  | "membershipType"
  | "sectorStatus"
  | "birthPlace"
  | "nationality"
  | "maritalStatus"
  | "faxPhone"
  | "personalMobilePhone"
  | "affiliatedOrganizations"
  | "contactPreference"
> & { sectors: string[]; locations: string[]; businessActivityTypes: string[] };

function toEditableFields(member: AdminMember): EditableAdminFields {
  return {
    fullName: member.fullName,
    companyName: member.companyName ?? "",
    title: member.title ?? "",
    companyAddress: member.companyAddress ?? "",
    phone: member.phone ?? "",
    mobilePhone: member.mobilePhone ?? "",
    email: member.email,
    references: member.references ?? "",
    membershipType: member.membershipType,
    sectorStatus: member.sectorStatus as AdminMember["sectorStatus"],
    birthPlace: member.birthPlace ?? "",
    nationality: member.nationality ?? "",
    maritalStatus: member.maritalStatus as AdminMember["maritalStatus"],
    faxPhone: member.faxPhone ?? "",
    personalMobilePhone: member.personalMobilePhone ?? "",
    affiliatedOrganizations: member.affiliatedOrganizations ?? "",
    contactPreference: member.contactPreference as AdminMember["contactPreference"],
    sectors: member.sectors,
    locations: member.locations,
    businessActivityTypes: member.businessActivityTypes,
  };
}

export default function AdminMembershipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState<EditableAdminFields | null>(null);

  const { data: member, isLoading, isError } = useQuery({
    queryKey: ["admin", "member", id],
    queryFn: () => fetchAdminMember(id as string),
    enabled: !!id,
  });
  const { data: nationalIdResult } = useQuery({
    queryKey: ["admin", "member", id, "national-id"],
    queryFn: () => fetchMemberMaskedNationalId(id as string),
    enabled: !!id,
  });
  const maskedNationalId = nationalIdResult?.maskedNationalId ?? null;

  useEffect(() => {
    if (isError) showToast("Üye bilgileri yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const saveMutation = useMutation({
    mutationFn: (dto: Partial<AdminMember>) => updateAdminMember(id as string, dto),
    onSuccess: (updated) => {
      queryClient.setQueryData(["admin", "member", id], updated);
      setIsEditing(false);
      showToast("Üye bilgileri güncellendi.");
    },
    onError: (err) => showToast(err instanceof Error ? err.message : "Güncelleme başarısız oldu."),
  });

  function startEditing() {
    if (!member) return;
    setFields(toEditableFields(member));
    setIsEditing(true);
  }

  function toggleSector(slug: string) {
    setFields((f) =>
      f ? { ...f, sectors: f.sectors.includes(slug) ? f.sectors.filter((s) => s !== slug) : [...f.sectors, slug] } : f,
    );
  }

  function toggleLocation(slug: string) {
    setFields((f) =>
      f
        ? { ...f, locations: f.locations.includes(slug) ? f.locations.filter((s) => s !== slug) : [...f.locations, slug] }
        : f,
    );
  }

  function toggleActivityType(value: string) {
    setFields((f) =>
      f
        ? {
            ...f,
            businessActivityTypes: f.businessActivityTypes.includes(value)
              ? f.businessActivityTypes.filter((v) => v !== value)
              : [...f.businessActivityTypes, value],
          }
        : f,
    );
  }

  function handleSave() {
    if (!fields) return;
    const dto: Partial<AdminMember> = {
      ...fields,
      companyName: fields.companyName || undefined,
      title: fields.title || undefined,
      companyAddress: fields.companyAddress || undefined,
      phone: fields.phone || undefined,
      mobilePhone: fields.mobilePhone || undefined,
      references: fields.references || undefined,
      sectorStatus: fields.sectorStatus || undefined,
      birthPlace: fields.birthPlace || undefined,
      nationality: fields.nationality || undefined,
      maritalStatus: fields.maritalStatus || undefined,
      faxPhone: fields.faxPhone || undefined,
      personalMobilePhone: fields.personalMobilePhone || undefined,
      affiliatedOrganizations: fields.affiliatedOrganizations || undefined,
      contactPreference: fields.contactPreference || undefined,
    };
    saveMutation.mutate(dto);
  }

  if (isLoading) {
    return <p className="text-assid-muted">Yükleniyor...</p>;
  }

  if (!member) {
    return <p className="text-assid-muted">Üye bulunamadı.</p>;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-5 flex cursor-pointer items-center gap-2 border-0 bg-transparent p-0 text-[0.85rem] font-bold text-assid-green"
      >
        <ArrowLeftIcon className="h-4 w-4" /> Geri Dön
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">
            {member.companyName || member.fullName}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={
              member.applicationStatus === "approved" ? "success" : member.applicationStatus === "rejected" ? "danger" : "pending"
            }
          >
            {member.applicationStatus === "approved"
              ? "Onaylı Üye"
              : member.applicationStatus === "rejected"
                ? "Başvurusu Reddedildi"
                : "Onay Bekliyor"}
          </Badge>
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={saveMutation.isPending}
                className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
              >
                {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
            >
              Düzenle
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-5">
        {isEditing && fields ? (
          <>
            <Section title="Genel Bilgiler">
              <EditField label="Ad Soyad">
                <input
                  value={fields.fullName}
                  onChange={(e) => setFields((f) => (f ? { ...f, fullName: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Firma Adı">
                <input
                  value={fields.companyName}
                  onChange={(e) => setFields((f) => (f ? { ...f, companyName: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Unvan">
                <input
                  value={fields.title}
                  onChange={(e) => setFields((f) => (f ? { ...f, title: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="E-posta">
                <input
                  value={fields.email}
                  onChange={(e) => setFields((f) => (f ? { ...f, email: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Telefon">
                <input
                  value={fields.phone}
                  onChange={(e) => setFields((f) => (f ? { ...f, phone: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Cep Telefonu">
                <input
                  value={fields.mobilePhone}
                  onChange={(e) => setFields((f) => (f ? { ...f, mobilePhone: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Firma Adresi">
                <input
                  value={fields.companyAddress}
                  onChange={(e) => setFields((f) => (f ? { ...f, companyAddress: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Referanslar">
                <input
                  value={fields.references}
                  onChange={(e) => setFields((f) => (f ? { ...f, references: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="mb-2 block text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
                  Sektörler
                </span>
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
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="mb-2 block text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
                  Lokasyonlar
                </span>
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
              <div className="sm:col-span-2 lg:col-span-3">
                <span className="mb-2 block text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
                  Faaliyet Türleri
                </span>
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

            <Section title="Üyelik Sınıfı">
              <EditField label="Üyelik Tipi">
                <select
                  value={fields.membershipType ?? ""}
                  onChange={(e) =>
                    setFields((f) =>
                      f ? { ...f, membershipType: (e.target.value || undefined) as AdminMember["membershipType"] } : f,
                    )
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
              </EditField>
              <EditField label="Sektör Durumu">
                <select
                  value={fields.sectorStatus ?? ""}
                  onChange={(e) => setFields((f) => (f ? { ...f, sectorStatus: e.target.value || undefined } : f))}
                  className={inputClass}
                >
                  <option value="">Seçiniz</option>
                  {sectorStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </EditField>
            </Section>

            <Section title="Kişisel Bilgiler">
              <EditField label="Doğum Yeri">
                <input
                  value={fields.birthPlace}
                  onChange={(e) => setFields((f) => (f ? { ...f, birthPlace: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Uyruk">
                <input
                  value={fields.nationality}
                  onChange={(e) => setFields((f) => (f ? { ...f, nationality: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Medeni Hal">
                <select
                  value={fields.maritalStatus ?? ""}
                  onChange={(e) => setFields((f) => (f ? { ...f, maritalStatus: e.target.value || undefined } : f))}
                  className={inputClass}
                >
                  <option value="">Seçiniz</option>
                  {maritalStatusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </EditField>
              <EditField label="Telefon / Faks">
                <input
                  value={fields.faxPhone}
                  onChange={(e) => setFields((f) => (f ? { ...f, faxPhone: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Cep Telefonu">
                <input
                  value={fields.personalMobilePhone}
                  onChange={(e) => setFields((f) => (f ? { ...f, personalMobilePhone: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="Bağlı Olduğu Kuruluşlar">
                <input
                  value={fields.affiliatedOrganizations}
                  onChange={(e) => setFields((f) => (f ? { ...f, affiliatedOrganizations: e.target.value } : f))}
                  className={inputClass}
                />
              </EditField>
              <EditField label="İletişim Tercihi">
                <select
                  value={fields.contactPreference ?? ""}
                  onChange={(e) => setFields((f) => (f ? { ...f, contactPreference: e.target.value || undefined } : f))}
                  className={inputClass}
                >
                  <option value="">Seçiniz</option>
                  {contactPreferenceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </EditField>
              <Field label="TC Kimlik No" value={maskedNationalId} />
              <p className="sm:col-span-2 lg:col-span-3 text-[0.78rem] text-assid-muted">
                TC Kimlik No güvenlik nedeniyle sadece maskelenmiş halde gösterilir ve bu formdan değiştirilemez.
              </p>
            </Section>
          </>
        ) : (
          <>
            <Section title="Genel Bilgiler">
              <Field label="Ad Soyad" value={member.fullName} />
              <Field label="Firma Adı" value={member.companyName} />
              <Field label="Unvan" value={member.title} />
              <Field label="E-posta" value={member.email} />
              <Field label="Telefon" value={member.phone} />
              <Field label="Cep Telefonu" value={member.mobilePhone} />
              <Field label="Firma Adresi" value={member.companyAddress} />
              <Field label="Sektörler" value={member.sectors.map((s) => getSectorName(s)).join(", ")} />
              <Field label="Lokasyonlar" value={member.locations.map((s) => getLocationName(s)).join(", ")} />
              <Field
                label="Faaliyet Türleri"
                value={member.businessActivityTypes
                  .map((t) => businessActivityOptions.find((o) => o.value === t)?.label ?? t)
                  .join(", ")}
              />
              <Field label="Referanslar" value={member.references} />
            </Section>

            <Section title="Üyelik Sınıfı">
              <Field
                label="Üyelik Tipi"
                value={membershipTypeOptions.find((o) => o.value === member.membershipType)?.label}
              />
              <Field
                label="Sektör Durumu"
                value={sectorStatusOptions.find((o) => o.value === member.sectorStatus)?.label}
              />
            </Section>

            <Section title="Kişisel Bilgiler">
              <Field label="Doğum Yeri" value={member.birthPlace} />
              <Field
                label="Doğum Tarihi"
                value={member.birthDate ? new Date(member.birthDate).toLocaleDateString("tr-TR") : undefined}
              />
              <Field label="Uyruk" value={member.nationality} />
              <Field label="TC Kimlik No" value={maskedNationalId} />
              <Field
                label="Medeni Hal"
                value={maritalStatusOptions.find((o) => o.value === member.maritalStatus)?.label}
              />
              <Field label="Telefon / Faks" value={member.faxPhone} />
              <Field label="Cep Telefonu" value={member.personalMobilePhone} />
              <Field label="Bağlı Olduğu Kuruluşlar" value={member.affiliatedOrganizations} />
              <Field
                label="İletişim Tercihi"
                value={contactPreferenceOptions.find((o) => o.value === member.contactPreference)?.label}
              />
            </Section>
          </>
        )}

        <Section title="Üye Panelinden Yönetilen Bilgiler">
          <Field label="Faaliyet Alanları" value={member.activityAreas.join(", ")} />
          <Field label="Ürün ve Hizmetler" value={member.productsAndServices.join(", ")} />
        </Section>

        <Section title="Başvuru ve Onay">
          <Field
            label="Başvuru Tarihi"
            value={member.applicationDate ? new Date(member.applicationDate).toLocaleDateString("tr-TR") : undefined}
          />
          <Field
            label="Onay Tarihi"
            value={member.approvedAt ? new Date(member.approvedAt).toLocaleDateString("tr-TR") : undefined}
          />
          <Field
            label="KVKK Onayı"
            value={
              member.kvkkConsentAt ? `Onaylandı — ${new Date(member.kvkkConsentAt).toLocaleDateString("tr-TR")}` : undefined
            }
          />
          <Field
            label="Tüzük Onayı"
            value={
              member.bylawsAcknowledgedAt
                ? `Onaylandı — ${new Date(member.bylawsAcknowledgedAt).toLocaleDateString("tr-TR")}`
                : undefined
            }
          />
          <Field
            label="Bilgi Doğruluğu Onayı"
            value={
              member.infoAccuracyConfirmedAt
                ? `Onaylandı — ${new Date(member.infoAccuracyConfirmedAt).toLocaleDateString("tr-TR")}`
                : undefined
            }
          />
        </Section>

        <Section title="Ekler">
          {(
            [
              ["2 Adet Fotoğraf", "Fotoğraf"],
              ["Adli Sicil Kaydı", "Adli Sicil Kaydı"],
              ["Kimlik Fotokopisi", "Kimlik Fotokopisi"],
              ["Ticaret Sicil Gazetesi (Kurumsal)", "Ticaret Sicil Gazetesi"],
              ["Vergi Levhası (Kurumsal)", "Vergi Levhası"],
              ["İmza Sirküleri (Kurumsal)", "İmza Sirküleri"],
            ] as const
          ).map(([displayLabel, docLabel]) => {
            const docs = member.documents.filter((d) => d.label === docLabel);
            return (
              <div key={displayLabel}>
                <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
                  {displayLabel}
                </div>
                {docs.length === 0 ? (
                  <div className="mt-1 text-[0.92rem] text-assid-ink">—</div>
                ) : (
                  <div className="mt-1 grid gap-1.5">
                    {docs.map((doc, index) => (
                      <a
                        key={`${doc.url}-${index}`}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 rounded-[12px] border border-assid-line bg-assid-paper px-4 py-3 text-[0.85rem] font-bold text-assid-green hover:underline"
                      >
                        {docs.length > 1 ? `${displayLabel} ${index + 1}` : displayLabel}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Section>

        <CardInfoSection
          queryKey={["admin", "member", id, "card-info"]}
          fetchCardInfo={() => fetchMemberCardInfo(id as string)}
          updateCardInfo={(dto) => updateMemberCardInfo(id as string, dto)}
        />
      </div>
    </div>
  );
}
