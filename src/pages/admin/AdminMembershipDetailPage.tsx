import { useEffect, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAdminMember, fetchMemberMaskedNationalId } from "../../api/admin";
import Badge from "../../components/admin/Badge";
import { ArrowLeftIcon } from "../../components/admin/icons";
import {
  businessActivityLabels,
  contactPreferenceLabels,
  maritalStatusLabels,
  sectorStatusLabels,
} from "../../constants/memberEnums";
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <h2 className="mb-5 text-[1.05rem] font-bold text-assid-ink">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}

export default function AdminMembershipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showToast = useToast();

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
      </div>

      <div className="grid gap-5">
        <Section title="Genel Bilgiler">
          <Field label="Ad Soyad" value={member.fullName} />
          <Field label="Firma Adı" value={member.companyName} />
          <Field label="Unvan" value={member.title} />
          <Field label="E-posta" value={member.email} />
          <Field label="Telefon" value={member.phone} />
          <Field label="Cep Telefonu" value={member.mobilePhone} />
          <Field label="Firma Adresi" value={member.companyAddress} />
          <Field label="Sektörler" value={member.sectors.map((s) => getSectorName(s)).join(", ")} />
          <Field
            label="Faaliyet Türleri"
            value={member.businessActivityTypes.map((t) => businessActivityLabels[t] ?? t).join(", ")}
          />
          <Field label="Referanslar" value={member.references} />
        </Section>

        <Section title="Üyelik Sınıfı">
          <Field
            label="Üyelik Tipi"
            value={
              member.membershipType === "corporate"
                ? "Kurumsal"
                : member.membershipType === "individual"
                  ? "Bireysel"
                  : undefined
            }
          />
          <Field label="Sektör Durumu" value={member.sectorStatus ? sectorStatusLabels[member.sectorStatus] : undefined} />
        </Section>

        <Section title="Kişisel Bilgiler">
          <Field label="Doğum Yeri" value={member.birthPlace} />
          <Field
            label="Doğum Tarihi"
            value={member.birthDate ? new Date(member.birthDate).toLocaleDateString("tr-TR") : undefined}
          />
          <Field label="Uyruk" value={member.nationality} />
          <Field label="TC Kimlik No" value={maskedNationalId} />
          <Field label="Medeni Hal" value={member.maritalStatus ? maritalStatusLabels[member.maritalStatus] : undefined} />
          <Field label="Telefon / Faks" value={member.faxPhone} />
          <Field label="Cep Telefonu" value={member.personalMobilePhone} />
          <Field label="Bağlı Olduğu Kuruluşlar" value={member.affiliatedOrganizations} />
          <Field
            label="İletişim Tercihi"
            value={member.contactPreference ? contactPreferenceLabels[member.contactPreference] : undefined}
          />
        </Section>

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
      </div>
    </div>
  );
}
