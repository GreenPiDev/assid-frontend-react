import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyMemberProfile, updateMyMemberProfile, uploadMyLogo } from "../../api/member";
import Badge from "../../components/admin/Badge";
import MemberCardContent from "../../components/directory/MemberCardContent";
import TagEditor from "../../components/forms/TagEditor";
import { businessActivityLabels } from "../../constants/memberEnums";
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
      {children}
    </div>
  );
}

const profileQueryKey = ["member", "profile"];

export default function MemberProfilePage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchMyMemberProfile,
  });
  const [activityAreas, setActivityAreas] = useState<string[]>([]);
  const [productsAndServices, setProductsAndServices] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isError) showToast("Profil bilgileri yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (!profile) return;
    setActivityAreas(profile.activityAreas);
    setProductsAndServices(profile.productsAndServices);
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: updateMyMemberProfile,
    onSuccess: (updated) => queryClient.setQueryData(profileQueryKey, updated),
  });

  async function handleSave() {
    try {
      await saveMutation.mutateAsync({ activityAreas, productsAndServices });
      showToast("Profil güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
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

  if (isLoading || !profile) {
    return <p className="text-assid-muted">Yükleniyor...</p>;
  }

  const isDirty =
    JSON.stringify(activityAreas) !== JSON.stringify(profile.activityAreas) ||
    JSON.stringify(productsAndServices) !== JSON.stringify(profile.productsAndServices);

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

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <Section title="Başvuru Bilgileri">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Ad Soyad" value={profile.fullName} />
            <Field label="Firma Adı" value={profile.companyName} />
            <Field label="Unvan" value={profile.title} />
            <Field label="E-posta" value={profile.email} />
            <Field label="Telefon" value={profile.phone} />
            <Field label="Cep Telefonu" value={profile.mobilePhone} />
            <Field label="Firma Adresi" value={profile.companyAddress} />
            <Field label="Üyelik Tipi" value={profile.membershipType === "corporate" ? "Kurumsal" : "Bireysel"} />
            <Field label="Sektörler" value={profile.sectors.map((s) => getSectorName(s)).join(", ")} />
            <Field
              label="Faaliyet Türleri"
              value={profile.businessActivityTypes.map((t) => businessActivityLabels[t] ?? t).join(", ")}
            />
          </div>
          <p className="mt-4 text-[0.78rem] text-assid-muted">
            Bu bilgiler başvurunuzda belirttiğiniz bilgilerdir. Değişiklik için lütfen ASSİD ile iletişime geçin.
          </p>
        </Section>

        <Section title="Firma Rehberinde Görünecek Bilgiler">
          <div className="grid gap-5">
            <div>
              <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Alt Faaliyet Alanları</span>
              <TagEditor items={activityAreas} onChange={setActivityAreas} placeholder="Faaliyet alanı ekle..." />
            </div>
            <div>
              <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">Ürün ve Hizmetler</span>
              <TagEditor
                items={productsAndServices}
                onChange={setProductsAndServices}
                placeholder="Ürün / hizmet ekle..."
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending || !isDirty}
              className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saveMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </Section>
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
              sectors: profile.sectors,
              activityAreas,
              productsAndServices,
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
          Faaliyet alanları/ürünler için önizleme anlıktır — herkese açık rehberde görünmesi için "Değişiklikleri
          Kaydet"e basmanız gerekir.
        </p>
      </div>
    </div>
  );
}
