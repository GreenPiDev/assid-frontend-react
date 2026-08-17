import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminEvent,
  deleteAdminEvent,
  fetchAdminEvents,
  updateAdminEvent,
  type AdminEvent,
} from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

function toDateInputValue(iso?: string) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

const eventsQueryKey = ["admin", "events"];

export default function AdminEventsPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading, isError } = useQuery({
    queryKey: eventsQueryKey,
    queryFn: fetchAdminEvents,
  });
  const [formTarget, setFormTarget] = useState<AdminEvent | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminEvent | null>(null);

  useEffect(() => {
    if (isError) showToast("Etkinlikler yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      showToast("Etkinlik silindi.");
      setDeleteTarget(null);
    } catch {
      showToast("Silme işlemi başarısız oldu.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Etkinlikler</h1>
        </div>
        <button
          type="button"
          onClick={() => setFormTarget("new")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
        >
          <PlusIcon className="h-4 w-4" /> Yeni Etkinlik
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">Başlık</th>
              <th className="px-5 py-3.5">Konum</th>
              <th className="px-5 py-3.5">Tarih</th>
              <th className="px-5 py-3.5">Öne Çıkan</th>
              <th className="px-5 py-3.5">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-assid-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-assid-muted">
                  Henüz etkinlik yok.
                </td>
              </tr>
            ) : (
              events.map((ev) => (
                <tr key={ev._id} className="border-b border-assid-line last:border-0">
                  <td className="px-5 py-3.5 font-bold text-assid-ink">{ev.title}</td>
                  <td className="px-5 py-3.5 text-assid-muted">{ev.location || "—"}</td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {new Date(ev.startDate).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3.5">
                    {ev.isFeatured ? <Badge variant="success">Evet</Badge> : <Badge variant="neutral">Hayır</Badge>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormTarget(ev)}
                        aria-label="Düzenle"
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(ev)}
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

      {formTarget && (
        <EventFormModal
          event={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Etkinliği sil"
          message={`"${deleteTarget.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          isDanger
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function EventFormModal({
  event,
  onClose,
  onSaved,
}: {
  event: AdminEvent | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: event?.title ?? "",
    description: event?.description ?? "",
    location: event?.location ?? "",
    startDate: toDateInputValue(event?.startDate),
    endDate: toDateInputValue(event?.endDate),
    imageUrl: event?.imageUrl ?? "",
    isFeatured: event?.isFeatured ?? false,
  });

  const saveMutation = useMutation({
    mutationFn: (dto: Partial<AdminEvent>) =>
      event ? updateAdminEvent(event._id, dto) : createAdminEvent(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: eventsQueryKey }),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const dto = {
        title: form.title,
        description: form.description || undefined,
        location: form.location || undefined,
        startDate: form.startDate,
        endDate: form.endDate || undefined,
        imageUrl: form.imageUrl || undefined,
        isFeatured: form.isFeatured,
      };
      await saveMutation.mutateAsync(dto);
      showToast(event ? "Etkinlik güncellendi." : "Etkinlik oluşturuldu.");
      onSaved();
    } catch {
      showToast("Kaydetme işlemi başarısız oldu.");
    }
  }

  return (
    <Modal title={event ? "Etkinliği Düzenle" : "Yeni Etkinlik"} onClose={onClose} size="large">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Başlık</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Açıklama</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Başlangıç Tarihi</span>
            <input
              required
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Bitiş Tarihi</span>
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Konum</span>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Görsel URL</span>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="flex items-center gap-2.5 text-[0.85rem] font-bold text-assid-ink">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="h-4 w-4"
          />
          Öne çıkan etkinlik
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
