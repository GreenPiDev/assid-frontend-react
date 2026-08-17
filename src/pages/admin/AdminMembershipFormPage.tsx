import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMembershipFee,
  deleteMembershipFee,
  fetchMembershipFees,
  fetchOrganizationSettings,
  updateMembershipFee,
  updateOrganizationSettings,
  type AdminMembershipFee,
  type AdminOrganizationSettings,
} from "../../api/admin";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

function formatAmount(amount: number) {
  return `${amount.toLocaleString("tr-TR")}₺`;
}

const feesQueryKey = ["admin", "membership-fees"];
const orgSettingsQueryKey = ["admin", "organization-settings"];

function invalidateOrgSettings(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: orgSettingsQueryKey });
  queryClient.invalidateQueries({ queryKey: ["/organization-settings"] });
}

export default function AdminMembershipFormPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data: fees = [], isLoading, isError: isFeesError } = useQuery({
    queryKey: feesQueryKey,
    queryFn: fetchMembershipFees,
  });
  const { data: settings, isError: isSettingsError } = useQuery({
    queryKey: orgSettingsQueryKey,
    queryFn: fetchOrganizationSettings,
  });
  const [formTarget, setFormTarget] = useState<AdminMembershipFee | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMembershipFee | null>(null);

  const [showMembershipFeesTable, setShowMembershipFeesTable] = useState(true);
  const [showAttachmentsSection, setShowAttachmentsSection] = useState(true);
  const [showMembershipClassSection, setShowMembershipClassSection] = useState(true);
  const [showKvkkConsent, setShowKvkkConsent] = useState(true);
  const [requireKvkkConsent, setRequireKvkkConsent] = useState(true);
  const [showBylawsConsent, setShowBylawsConsent] = useState(true);
  const [requireBylawsConsent, setRequireBylawsConsent] = useState(true);

  useEffect(() => {
    if (isFeesError) showToast("Ücretler yüklenemedi.");
    if (isSettingsError) showToast("Ayarlar yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFeesError, isSettingsError]);

  useEffect(() => {
    if (!settings) return;
    setShowMembershipFeesTable(settings.showMembershipFeesTable ?? true);
    setShowAttachmentsSection(settings.showAttachmentsSection ?? true);
    setShowMembershipClassSection(settings.showMembershipClassSection ?? true);
    setShowKvkkConsent(settings.showKvkkConsent ?? true);
    setRequireKvkkConsent(settings.requireKvkkConsent ?? true);
    setShowBylawsConsent(settings.showBylawsConsent ?? true);
    setRequireBylawsConsent(settings.requireBylawsConsent ?? true);
  }, [settings]);

  const settingsMutation = useMutation({
    mutationFn: (dto: Partial<AdminOrganizationSettings>) => updateOrganizationSettings(dto),
    onSuccess: () => invalidateOrgSettings(queryClient),
  });

  async function handleToggleVisibility(
    field: "showMembershipFeesTable" | "showAttachmentsSection" | "showMembershipClassSection",
    checked: boolean,
  ) {
    const setState =
      field === "showMembershipFeesTable"
        ? setShowMembershipFeesTable
        : field === "showAttachmentsSection"
          ? setShowAttachmentsSection
          : setShowMembershipClassSection;
    setState(checked);
    try {
      await settingsMutation.mutateAsync({ [field]: checked });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
      setState(!checked);
    }
  }

  async function handleShowKvkkChange(checked: boolean) {
    const nextRequire = checked && requireKvkkConsent;
    setShowKvkkConsent(checked);
    setRequireKvkkConsent(nextRequire);
    try {
      await settingsMutation.mutateAsync({ showKvkkConsent: checked, requireKvkkConsent: nextRequire });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
      setShowKvkkConsent(!checked);
      setRequireKvkkConsent(requireKvkkConsent);
    }
  }

  async function handleRequireKvkkChange(checked: boolean) {
    setRequireKvkkConsent(checked);
    try {
      await settingsMutation.mutateAsync({ requireKvkkConsent: checked });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
      setRequireKvkkConsent(!checked);
    }
  }

  async function handleShowBylawsChange(checked: boolean) {
    const nextRequire = checked && requireBylawsConsent;
    setShowBylawsConsent(checked);
    setRequireBylawsConsent(nextRequire);
    try {
      await settingsMutation.mutateAsync({ showBylawsConsent: checked, requireBylawsConsent: nextRequire });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
      setShowBylawsConsent(!checked);
      setRequireBylawsConsent(requireBylawsConsent);
    }
  }

  async function handleRequireBylawsChange(checked: boolean) {
    setRequireBylawsConsent(checked);
    try {
      await settingsMutation.mutateAsync({ requireBylawsConsent: checked });
      showToast("Ayarlar güncellendi.");
    } catch {
      showToast("Güncelleme başarısız oldu.");
      setRequireBylawsConsent(!checked);
    }
  }

  const deleteFeeMutation = useMutation({
    mutationFn: (id: string) => deleteMembershipFee(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feesQueryKey }),
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteFeeMutation.mutateAsync(deleteTarget._id);
      showToast("Ücret kaydı silindi.");
      setDeleteTarget(null);
    } catch {
      showToast("Silme işlemi başarısız oldu.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Yönetim Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Üye Kayıt Formu</h1>
      </div>

      <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Ücretler</h2>
            <p className="mt-1 text-[0.78rem] text-assid-muted">
              /uyelik-basvurusu sayfasındaki "Ücretler" tablosunda görüntülenir.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormTarget("new")}
            className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
          >
            <PlusIcon className="h-4 w-4" /> Yeni Ücret Kaydı
          </button>
        </div>

        <label className="mb-5 flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
          <input
            type="checkbox"
            checked={showMembershipFeesTable}
            onChange={(e) => handleToggleVisibility("showMembershipFeesTable", e.target.checked)}
          />
          Üyelik başvuru formunda göster
        </label>

        <div className="overflow-x-auto rounded-[12px] border border-assid-line">
          <table className="w-full min-w-[480px] border-collapse text-left text-[0.85rem]">
            <thead>
              <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
                <th className="px-5 py-3.5">Üyelik Sınıfı</th>
                <th className="px-5 py-3.5">Tutar</th>
                <th className="px-5 py-3.5">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-assid-muted">
                    Yükleniyor...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center text-assid-muted">
                    Henüz ücret kaydı yok.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee._id} className="border-b border-assid-line last:border-0">
                    <td className="px-5 py-3.5 font-bold text-assid-ink">{fee.label}</td>
                    <td className="px-5 py-3.5 text-assid-muted">{formatAmount(fee.amount)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFormTarget(fee)}
                          aria-label="Düzenle"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(fee)}
                          aria-label="Sil"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-[#c0392b]"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-1 text-[1.02rem] font-bold text-assid-ink">Üyelik Sınıfı</h2>
        <p className="mb-5 text-[0.78rem] text-assid-muted">
          /uyelik-basvurusu sayfasındaki "Üyelik Sınıfı" bölümünde görüntülenir.
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
          <input
            type="checkbox"
            checked={showMembershipClassSection}
            onChange={(e) => handleToggleVisibility("showMembershipClassSection", e.target.checked)}
          />
          Üyelik başvuru formunda göster
        </label>
      </div>

      <div className="mt-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-1 text-[1.02rem] font-bold text-assid-ink">Ekler</h2>
        <p className="mb-5 text-[0.78rem] text-assid-muted">
          /uyelik-basvurusu sayfasındaki "Ekler" bölümünde görüntülenir.
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
          <input
            type="checkbox"
            checked={showAttachmentsSection}
            onChange={(e) => handleToggleVisibility("showAttachmentsSection", e.target.checked)}
          />
          Üyelik başvuru formunda göster
        </label>
      </div>

      <div className="mt-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
        <h2 className="mb-1 text-[1.02rem] font-bold text-assid-ink">Onaylar</h2>
        <p className="mb-5 text-[0.78rem] text-assid-muted">
          Metinler /dashboard/organizasyon-bilgileri sayfasından düzenlenir; bu bölüm sadece üyelik başvuru
          formundaki görünürlük ve zorunluluk ayarlarını yönetir.
        </p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="grid gap-2">
            <span className="text-[0.78rem] font-bold text-assid-muted">KVKK Aydınlatma Metni</span>
            <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
              <input
                type="checkbox"
                checked={showKvkkConsent}
                onChange={(e) => handleShowKvkkChange(e.target.checked)}
              />
              Üye başvuru formunda görünsün
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
              <input
                type="checkbox"
                checked={requireKvkkConsent}
                disabled={!showKvkkConsent}
                onChange={(e) => handleRequireKvkkChange(e.target.checked)}
              />
              Üyelik başvurusu için zorunlu
            </label>
          </div>
          <div className="grid gap-2">
            <span className="text-[0.78rem] font-bold text-assid-muted">Dernek Tüzüğü</span>
            <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
              <input
                type="checkbox"
                checked={showBylawsConsent}
                onChange={(e) => handleShowBylawsChange(e.target.checked)}
              />
              Üye başvuru formunda görünsün
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[0.85rem] text-assid-ink">
              <input
                type="checkbox"
                checked={requireBylawsConsent}
                disabled={!showBylawsConsent}
                onChange={(e) => handleRequireBylawsChange(e.target.checked)}
              />
              Üyelik başvurusu için zorunlu
            </label>
          </div>
        </div>
      </div>

      {formTarget && (
        <MembershipFeeFormModal
          fee={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Ücret kaydını sil"
          message={`"${deleteTarget.label}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          isDanger
          isLoading={deleteFeeMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function MembershipFeeFormModal({
  fee,
  onClose,
  onSaved,
}: {
  fee: AdminMembershipFee | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    label: fee?.label ?? "",
    amount: fee?.amount !== undefined ? String(fee.amount) : "",
  });

  const saveMutation = useMutation({
    mutationFn: (dto: { label: string; amount: number }) =>
      fee ? updateMembershipFee(fee._id, dto) : createMembershipFee(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: feesQueryKey }),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await saveMutation.mutateAsync({ label: form.label, amount: Number(form.amount) });
      showToast(fee ? "Ücret kaydı güncellendi." : "Ücret kaydı oluşturuldu.");
      onSaved();
    } catch {
      showToast("Kaydetme işlemi başarısız oldu.");
    }
  }

  return (
    <Modal title={fee ? "Ücret Kaydını Düzenle" : "Yeni Ücret Kaydı"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Üyelik Sınıfı</span>
          <input
            required
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Tutar (₺)</span>
          <input
            required
            type="number"
            min={0}
            step="1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
