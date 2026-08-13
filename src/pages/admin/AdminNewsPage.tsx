import { useEffect, useState } from "react";
import { createAdminNews, deleteAdminNews, fetchAdminNews, updateAdminNews, type AdminNews } from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import { PencilIcon, PlusIcon, TrashIcon } from "../../components/admin/icons";
import { SECTORS } from "../../constants/sectors";
import { useToast } from "../../context/ToastContext";

export default function AdminNewsPage() {
  const showToast = useToast();
  const [news, setNews] = useState<AdminNews[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formTarget, setFormTarget] = useState<AdminNews | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNews | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
    fetchAdminNews()
      .then(setNews)
      .catch(() => showToast("Haberler yüklenemedi."))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteAdminNews(deleteTarget._id);
      showToast("Haber silindi.");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("Silme işlemi başarısız oldu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Haberler</h1>
        </div>
        <button
          type="button"
          onClick={() => setFormTarget("new")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
        >
          <PlusIcon className="h-4 w-4" /> Yeni Haber
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">Başlık</th>
              <th className="px-5 py-3.5">Kategori</th>
              <th className="px-5 py-3.5">Tarih</th>
              <th className="px-5 py-3.5">Durum</th>
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
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-assid-muted">
                  Henüz haber yok.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item._id} className="border-b border-assid-line last:border-0">
                  <td className="px-5 py-3.5 font-bold text-assid-ink">{item.title}</td>
                  <td className="px-5 py-3.5 text-assid-muted">{item.category || "—"}</td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {new Date(item.publishedAt).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3.5">
                    {item.isPublished ? (
                      <Badge variant="success">Yayında</Badge>
                    ) : (
                      <Badge variant="neutral">Taslak</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormTarget(item)}
                        aria-label="Düzenle"
                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(item)}
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
        <NewsFormModal
          news={formTarget === "new" ? null : formTarget}
          onClose={() => setFormTarget(null)}
          onSaved={() => {
            setFormTarget(null);
            load();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Haberi sil"
          message={`"${deleteTarget.title}" kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          isDanger
          isLoading={isSubmitting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

function NewsFormModal({
  news,
  onClose,
  onSaved,
}: {
  news: AdminNews | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const showToast = useToast();
  const [form, setForm] = useState({
    title: news?.title ?? "",
    summary: news?.summary ?? "",
    content: news?.content ?? "",
    imageUrl: news?.imageUrl ?? "",
    category: news?.category ?? "",
    sectors: news?.sectors ?? ([] as string[]),
    isFeatured: news?.isFeatured ?? false,
    isPublished: news?.isPublished ?? true,
  });
  const [isSaving, setIsSaving] = useState(false);

  function toggleSector(slug: string) {
    setForm((prev) => ({
      ...prev,
      sectors: prev.sectors.includes(slug) ? prev.sectors.filter((s) => s !== slug) : [...prev.sectors, slug],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const dto = {
        title: form.title,
        summary: form.summary || undefined,
        content: form.content || undefined,
        imageUrl: form.imageUrl || undefined,
        category: form.category || undefined,
        sectors: form.sectors,
        isFeatured: form.isFeatured,
        isPublished: form.isPublished,
      };
      if (news) {
        await updateAdminNews(news._id, dto);
        showToast("Haber güncellendi.");
      } else {
        await createAdminNews(dto);
        showToast("Haber oluşturuldu.");
      }
      onSaved();
    } catch {
      showToast("Kaydetme işlemi başarısız oldu.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title={news ? "Haberi Düzenle" : "Yeni Haber"} onClose={onClose} size="large">
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
          <span className="text-[0.78rem] font-bold text-assid-muted">Özet</span>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">İçerik</span>
          <textarea
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Kategori</span>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
        </div>
        <div>
          <span className="mb-1.5 block text-[0.78rem] font-bold text-assid-muted">Sektörler</span>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map((sector) => (
              <button
                type="button"
                key={sector.slug}
                onClick={() => toggleSector(sector.slug)}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[0.78rem] font-bold ${
                  form.sectors.includes(sector.slug)
                    ? "border-assid-green bg-assid-green text-white"
                    : "border-assid-line bg-transparent text-assid-ink"
                }`}
              >
                {sector.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2.5 text-[0.85rem] font-bold text-assid-ink">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="h-4 w-4"
            />
            Öne çıkan
          </label>
          <label className="flex items-center gap-2.5 text-[0.85rem] font-bold text-assid-ink">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
              className="h-4 w-4"
            />
            Yayında
          </label>
        </div>
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
            disabled={isSaving}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
