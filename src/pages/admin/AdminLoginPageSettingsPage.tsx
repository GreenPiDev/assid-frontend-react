import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrganizationSettings, updateOrganizationSettings } from "../../api/admin";
import { useToast } from "../../context/ToastContext";

const orgSettingsQueryKey = ["admin", "organization-settings"];

export default function AdminLoginPageSettingsPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [showMembershipCta, setShowMembershipCta] = useState(true);

  const { data: settings, isLoading, isError } = useQuery({
    queryKey: orgSettingsQueryKey,
    queryFn: fetchOrganizationSettings,
  });

  useEffect(() => {
    if (isError) showToast("Ayarlar yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (settings) setShowMembershipCta(settings.showLoginMembershipCta ?? true);
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: updateOrganizationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orgSettingsQueryKey });
      queryClient.invalidateQueries({ queryKey: ["/organization-settings"] });
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveMutation.mutateAsync({ showLoginMembershipCta: showMembershipCta });
      showToast("Ayarlar güncellendi.");
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
