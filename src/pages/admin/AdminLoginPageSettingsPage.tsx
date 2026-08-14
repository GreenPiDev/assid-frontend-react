import { useEffect, useState } from "react";
import { fetchOrganizationSettings, updateOrganizationSettings } from "../../api/admin";
import { useToast } from "../../context/ToastContext";

export default function AdminLoginPageSettingsPage() {
  const showToast = useToast();
  const [showMembershipCta, setShowMembershipCta] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchOrganizationSettings()
      .then((s) => setShowMembershipCta(s.showLoginMembershipCta ?? true))
      .catch(() => showToast("Ayarlar yüklenemedi."))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateOrganizationSettings({ showLoginMembershipCta: showMembershipCta });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Yönetim Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Üye Girişi Sayfası</h1>
      </div>

      {isLoading ? (
        <p className="text-assid-muted">Yükleniyor...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-3 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Üyelik Başvurusu Yönlendirmesi</h2>
            <p className="text-[0.78rem] text-assid-muted">/login sayfasında görüntülenir.</p>
            <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
              <input
                type="checkbox"
                checked={showMembershipCta}
                onChange={(e) => setShowMembershipCta(e.target.checked)}
              />
              "Henüz üye değil misiniz? Üyelik başvurusu yapın" bölümünü göster
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:opacity-60"
            >
              {isSaving ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
