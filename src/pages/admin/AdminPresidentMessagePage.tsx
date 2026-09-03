import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  fetchAdminPresidentMessage,
  updateAdminPresidentMessage,
  uploadAdminPresidentMessageImage,
} from "../../api/admin";
import { useToast } from "../../context/ToastContext";

const presidentMessageQueryKey = ["admin", "president-message"];

function invalidatePresidentMessage(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: presidentMessageQueryKey });
  queryClient.invalidateQueries({ queryKey: ["/president-message"] });
}

// Sadece boyut, kalın ve italik/altı çizili biçimlendirmeye izin verilir —
// yazı tipi (font ailesi) seçimi bilinçli olarak yok.
const QUILL_MODULES = {
  toolbar: [[{ size: ["small", false, "large", "huge"] }], ["bold", "italic", "underline"], ["clean"]],
};
const QUILL_FORMATS = ["size", "bold", "italic", "underline"];

export default function AdminPresidentMessagePage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [messageHtml, setMessageHtml] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: presidentMessageQueryKey,
    queryFn: fetchAdminPresidentMessage,
  });

  useEffect(() => {
    if (isError) showToast("Başkanın mesajı yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (!data) return;
    setImageUrl(data.image);
    setMessageHtml(data.messageHtml ?? "");
  }, [data]);

  const uploadImageMutation = useMutation({
    mutationFn: uploadAdminPresidentMessageImage,
    onSuccess: (updated) => {
      setImageUrl(updated.image);
      invalidatePresidentMessage(queryClient);
    },
  });

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await uploadImageMutation.mutateAsync(file);
      showToast("Görsel güncellendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    }
  }

  const saveMutation = useMutation({
    mutationFn: updateAdminPresidentMessage,
    onSuccess: () => invalidatePresidentMessage(queryClient),
  });

  async function handleSave() {
    try {
      // Word/Google Docs'tan yapıştırılan metinlerde boşluklar &nbsp; (bölünemez
      // boşluk) olarak gelebiliyor; bu da tüm cümlenin tek bir kırılmaz satır
      // halinde kutunun dışına taşmasına yol açıyor. Normal boşluğa çeviriyoruz.
      const normalizedHtml = messageHtml.replace(/&nbsp;/gi, " ").replace(/ /g, " ");
      await saveMutation.mutateAsync({ messageHtml: normalizedHtml });
      setMessageHtml(normalizedHtml);
      showToast("Mesaj güncellendi.");
    } catch {
      showToast("Kaydetme işlemi başarısız oldu.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Yönetim Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Başkanın Mesajı</h1>
      </div>

      {isLoading ? (
        <p className="text-assid-muted">Yükleniyor...</p>
      ) : (
        <div className="grid gap-5">
          <div className="grid gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Fotoğraf</h2>
            <div className="flex flex-wrap items-center gap-5">
              <div className="grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-[16px] border border-assid-line bg-assid-paper">
                {imageUrl ? (
                  <img src={imageUrl} alt="Başkan fotoğrafı" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-[0.72rem] text-assid-muted">Görsel yok</span>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={uploadImageMutation.isPending}
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
                >
                  {uploadImageMutation.isPending ? "Yükleniyor..." : "Fotoğraf Yükle"}
                </button>
                <p className="mt-2 text-[0.78rem] text-assid-muted">PNG, JPEG veya WEBP — en fazla 5MB.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 overflow-hidden rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Mesaj</h2>
            <div className="president-message-editor w-full min-w-0">
              <ReactQuill
                theme="snow"
                value={messageHtml}
                onChange={setMessageHtml}
                modules={QUILL_MODULES}
                formats={QUILL_FORMATS}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
            >
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
