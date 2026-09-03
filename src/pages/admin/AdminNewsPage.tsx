import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminNews,
  deleteAdminNews,
  fetchAdminNews,
  updateAdminNews,
  uploadAdminNewsImages,
  type AdminNews,
} from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import { CloseIcon, PencilIcon, PlusIcon, TrashIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

const MAX_IMAGES = 5;
const newsQueryKey = ["admin", "news"];

export default function AdminNewsPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data: news = [], isLoading, isError } = useQuery({ queryKey: newsQueryKey, queryFn: fetchAdminNews });
  const [formTarget, setFormTarget] = useState<AdminNews | "new" | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminNews | null>(null);

  useEffect(() => {
    if (isError) showToast("Haberler yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminNews(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsQueryKey }),
  });

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget._id);
      showToast("Haber silindi.");
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
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Haberler</h1>
        </div>
        <button
          type="button"
          onClick={() => setFormTarget("new")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
        >
          <PlusIcon className="h-4 w-4" /> Yeni Haber Ekle
        </button>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">Başlık</th>
              <th className="px-5 py-3.5">Tarih</th>
              <th className="px-5 py-3.5">Durum</th>
              <th className="px-5 py-3.5">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-assid-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : news.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-assid-muted">
                  Henüz haber yok.
                </td>
              </tr>
            ) : (
              news.map((item) => (
                <tr key={item._id} className="border-b border-assid-line last:border-0">
                  <td className="px-5 py-3.5 font-bold text-assid-ink">{item.title}</td>
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
          onSaved={() => setFormTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Haberi sil"
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
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: news?.title ?? "",
    summary: news?.summary ?? "",
    content: news?.content ?? "",
    isPublished: news?.isPublished ?? true,
  });
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(news?.imageUrls ?? []);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const totalImageCount = existingImageUrls.length + newImages.length;

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const remaining = MAX_IMAGES - totalImageCount;
    if (remaining <= 0) {
      showToast(`En fazla ${MAX_IMAGES} görsel ekleyebilirsiniz.`);
      return;
    }
    const accepted = files.slice(0, remaining);
    setNewImages((prev) => [...prev, ...accepted.map((file) => ({ file, preview: URL.createObjectURL(file) }))]);
  }

  function removeExistingImage(url: string) {
    setExistingImageUrls((prev) => prev.filter((u) => u !== url));
  }

  function removeNewImage(preview: string) {
    setNewImages((prev) => prev.filter((img) => img.preview !== preview));
  }

  const saveMutation = useMutation({
    mutationFn: (dto: Partial<AdminNews>) => (news ? updateAdminNews(news._id, dto) : createAdminNews(dto)),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: newsQueryKey }),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      let imageUrls = existingImageUrls;
      if (newImages.length > 0) {
        setIsUploadingImages(true);
        const uploadedUrls = await uploadAdminNewsImages(newImages.map((img) => img.file));
        setIsUploadingImages(false);
        imageUrls = [...existingImageUrls, ...uploadedUrls].slice(0, MAX_IMAGES);
      }
      const dto = {
        title: form.title,
        summary: form.summary || undefined,
        content: form.content || undefined,
        isPublished: form.isPublished,
        imageUrls,
      };
      await saveMutation.mutateAsync(dto);
      showToast(news ? "Haber güncellendi." : "Haber oluşturuldu.");
      onSaved();
    } catch (err) {
      setIsUploadingImages(false);
      showToast(err instanceof Error ? err.message : "Kaydetme işlemi başarısız oldu.");
    }
  }

  return (
    <Modal title={news ? "Haberi Düzenle" : "Yeni Haber"} onClose={onClose} size="large">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Başlık *</span>
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

        <div className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">
            Görseller ({totalImageCount}/{MAX_IMAGES})
          </span>
          <div className="flex flex-wrap gap-3">
            {existingImageUrls.map((url) => (
              <div key={url} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[12px] border border-assid-line">
                <img src={url} alt="Haber görseli" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(url)}
                  aria-label="Kaldır"
                  className="absolute right-1 top-1 grid h-5 w-5 cursor-pointer place-items-center rounded-full border-0 bg-black/60 text-white"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            {newImages.map((img) => (
              <div
                key={img.preview}
                className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[12px] border border-assid-line"
              >
                <img src={img.preview} alt="Yeni haber görseli" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewImage(img.preview)}
                  aria-label="Kaldır"
                  className="absolute right-1 top-1 grid h-5 w-5 cursor-pointer place-items-center rounded-full border-0 bg-black/60 text-white"
                >
                  <CloseIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
            {totalImageCount < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid h-20 w-28 shrink-0 cursor-pointer place-items-center rounded-[12px] border border-dashed border-assid-line bg-assid-paper text-[0.78rem] font-bold text-assid-muted"
              >
                + Görsel Ekle
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImagesChange}
            className="hidden"
          />
          <p className="text-[0.78rem] text-assid-muted">
            PNG, JPEG veya WEBP — en fazla {MAX_IMAGES} görsel, her biri en fazla 5MB. Kaydet'e basınca yüklenir.
          </p>
        </div>

        <label className="flex items-center gap-2.5 text-[0.85rem] font-bold text-assid-ink">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="h-4 w-4"
          />
          Yayında
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
            disabled={saveMutation.isPending || isUploadingImages}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            {isUploadingImages ? "Görseller Yükleniyor..." : saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
