import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizationSettings,
  updateOrganizationSettings,
  uploadOrganizationLogo,
  type AdminOrganizationSettings,
} from "../../api/admin";
import { useToast } from "../../context/ToastContext";
import FooterPreview from "../../components/admin/FooterPreview";

const orgSettingsQueryKey = ["admin", "organization-settings"];

function invalidateOrgSettings(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: orgSettingsQueryKey });
  queryClient.invalidateQueries({ queryKey: ["/organization-settings"] });
}

type FormState = {
  name: string;
  shortName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  footerText: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  kvkkText: string;
  bylawsText: string;
  cookiePolicyText: string;
  privacyPolicyText: string;
};

function toForm(s: AdminOrganizationSettings): FormState {
  return {
    name: s.name ?? "",
    shortName: s.shortName ?? "",
    description: s.description ?? "",
    address: s.address ?? "",
    phone: s.phone ?? "",
    email: s.email ?? "",
    website: s.website ?? "",
    footerText: s.footerText ?? "",
    facebook: s.socialLinks?.facebook ?? "",
    instagram: s.socialLinks?.instagram ?? "",
    linkedin: s.socialLinks?.linkedin ?? "",
    twitter: s.socialLinks?.twitter ?? "",
    kvkkText: s.kvkkText ?? "",
    bylawsText: s.bylawsText ?? "",
    cookiePolicyText: s.cookiePolicyText ?? "",
    privacyPolicyText: s.privacyPolicyText ?? "",
  };
}

export default function AdminSettingsPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: orgSettingsQueryKey,
    queryFn: fetchOrganizationSettings,
  });

  useEffect(() => {
    if (isError) showToast("Ayarlar yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (!settings) return;
    setForm(toForm(settings));
    setLogoUrl(settings.logo);
  }, [settings]);

  const uploadLogoMutation = useMutation({
    mutationFn: uploadOrganizationLogo,
    onSuccess: (updated) => {
      setLogoUrl(updated.logo);
      invalidateOrgSettings(queryClient);
    },
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

  const saveMutation = useMutation({
    mutationFn: updateOrganizationSettings,
    onSuccess: () => invalidateOrgSettings(queryClient),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    try {
      await saveMutation.mutateAsync({
        name: form.name,
        shortName: form.shortName,
        description: form.description || undefined,
        address: form.address || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
        website: form.website || undefined,
        footerText: form.footerText || undefined,
        socialLinks: {
          facebook: form.facebook || undefined,
          instagram: form.instagram || undefined,
          linkedin: form.linkedin || undefined,
          twitter: form.twitter || undefined,
        },
        kvkkText: form.kvkkText || undefined,
        bylawsText: form.bylawsText || undefined,
        cookiePolicyText: form.cookiePolicyText || undefined,
        privacyPolicyText: form.privacyPolicyText || undefined,
      });
      showToast("Kurum ayarları güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Yönetim Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Organizasyon Bilgileri</h1>
      </div>

      {isLoading || !form ? (
        <p className="text-assid-muted">Yükleniyor...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Organizasyon Logosu</h2>
            <p className="mb-4 mt-1 text-[0.78rem] text-assid-muted">Web sayfasında üst ve alt çubuklarında görüntülenecektir</p>
            <div className="flex flex-wrap items-center gap-5">
              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper">
                {logoUrl ? (
                  <img src={logoUrl} alt="Kurum logosu" className="h-full w-full object-contain p-1.5" />
                ) : (
                  <span className="text-[1.6rem] font-black text-assid-green">A</span>
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
            <div className="grid gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
              <div>
                <h2 className="text-[1.02rem] font-bold text-assid-ink">Genel Bilgiler</h2>
                <p className="mt-1 text-[0.78rem] text-assid-muted">Web sayfasının alt bilgi (footer) bölümünde görüntülenecektir</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-bold text-assid-muted">Kurum Adı</span>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-bold text-assid-muted">Kısaltma</span>
                  <input
                    value={form.shortName}
                    onChange={(e) => setForm({ ...form, shortName: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                </label>
              </div>

              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Açıklama</span>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Adres</span>
                <input
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>

              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Footer Metni</span>
                <input
                  value={form.footerText}
                  onChange={(e) => setForm({ ...form, footerText: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>
            </div>

            <div className="grid gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
              <div>
                <h2 className="text-[1.02rem] font-bold text-assid-ink">İletişim</h2>
                <p className="mt-1 text-[0.78rem] text-assid-muted">Web sayfasının alt bilgi (footer) bölümünde görüntülenecektir</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-bold text-assid-muted">Telefon</span>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-[0.78rem] font-bold text-assid-muted">E-posta</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                </label>
              </div>
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Web Sitesi</span>
                <input
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>

              <div className="mt-1 border-t border-assid-line pt-4">
                <span className="mb-3 block text-[0.78rem] font-bold text-assid-muted">Sosyal Medya</span>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    placeholder="Instagram URL"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                  <input
                    placeholder="Facebook URL"
                    value={form.facebook}
                    onChange={(e) => setForm({ ...form, facebook: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                  <input
                    placeholder="LinkedIn URL"
                    value={form.linkedin}
                    onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                  <input
                    placeholder="Twitter / X URL"
                    value={form.twitter}
                    onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                    className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                  />
                </div>
              </div>
            </div>
          </div>

          <FooterPreview
            logoUrl={logoUrl}
            shortName={form.shortName}
            name={form.name}
            description={form.description}
            address={form.address}
            phone={form.phone}
            email={form.email}
            footerText={form.footerText}
            instagram={form.instagram}
            facebook={form.facebook}
            linkedin={form.linkedin}
          />

          <div className="grid gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Yasal Metinler</h2>
            <p className="text-[0.78rem] text-assid-muted">
              Bu metinler footer'daki KVKK, Çerez Politikası ve Gizlilik pencerelerinde; KVKK ve Dernek Tüzüğü
              metinleri ayrıca üyelik başvuru formunda gösterilir.
            </p>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">KVKK Aydınlatma Metni</span>
                <textarea
                  rows={6}
                  value={form.kvkkText}
                  onChange={(e) => setForm({ ...form, kvkkText: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Dernek Tüzüğü</span>
                <textarea
                  rows={6}
                  value={form.bylawsText}
                  onChange={(e) => setForm({ ...form, bylawsText: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Çerez Politikası</span>
                <textarea
                  rows={6}
                  value={form.cookiePolicyText}
                  onChange={(e) => setForm({ ...form, cookiePolicyText: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-[0.78rem] font-bold text-assid-muted">Gizlilik Politikası</span>
                <textarea
                  rows={6}
                  value={form.privacyPolicyText}
                  onChange={(e) => setForm({ ...form, privacyPolicyText: e.target.value })}
                  className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:opacity-60"
            >
              {saveMutation.isPending ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
