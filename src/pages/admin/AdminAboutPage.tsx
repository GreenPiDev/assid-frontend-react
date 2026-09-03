import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAdminAboutPage,
  updateAdminAboutPage,
  uploadAdminAboutImage1,
  uploadAdminAboutImage2,
  type AdminAboutPage,
} from "../../api/admin";
import { useToast } from "../../context/ToastContext";

const aboutPageQueryKey = ["admin", "about-page"];

function invalidateAboutPage(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: aboutPageQueryKey });
  queryClient.invalidateQueries({ queryKey: ["/about-page"] });
}

type FormState = {
  title: string;
  subtitle: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  visionText: string;
  missionText: string;
};

function toForm(s: AdminAboutPage): FormState {
  return {
    title: s.title ?? "",
    subtitle: s.subtitle ?? "",
    bodyParagraph1: s.bodyParagraph1 ?? "",
    bodyParagraph2: s.bodyParagraph2 ?? "",
    visionText: s.visionText ?? "",
    missionText: s.missionText ?? "",
  };
}

function ImageUploadField({
  label,
  imageUrl,
  isUploading,
  onChange,
}: {
  label: string;
  imageUrl?: string;
  isUploading: boolean;
  onChange: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) onChange(file);
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      <div className="grid h-24 w-40 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-assid-line bg-assid-paper">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[0.72rem] text-assid-muted">Görsel yok</span>
        )}
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink disabled:opacity-60"
        >
          {isUploading ? "Yükleniyor..." : `${label} Yükle`}
        </button>
        <p className="mt-2 text-[0.78rem] text-assid-muted">PNG, JPEG veya WEBP — en fazla 5MB.</p>
      </div>
    </div>
  );
}

export default function AdminAboutPage() {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState | null>(null);
  const [image1, setImage1] = useState<string | undefined>(undefined);
  const [image2, setImage2] = useState<string | undefined>(undefined);

  const { data: aboutPage, isLoading, isError } = useQuery({
    queryKey: aboutPageQueryKey,
    queryFn: fetchAdminAboutPage,
  });

  useEffect(() => {
    if (isError) showToast("Hakkımızda içeriği yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  useEffect(() => {
    if (!aboutPage) return;
    setForm(toForm(aboutPage));
    setImage1(aboutPage.image1);
    setImage2(aboutPage.image2);
  }, [aboutPage]);

  const uploadImage1Mutation = useMutation({
    mutationFn: uploadAdminAboutImage1,
    onSuccess: (updated) => {
      setImage1(updated.image1);
      invalidateAboutPage(queryClient);
    },
  });

  const uploadImage2Mutation = useMutation({
    mutationFn: uploadAdminAboutImage2,
    onSuccess: (updated) => {
      setImage2(updated.image2);
      invalidateAboutPage(queryClient);
    },
  });

  async function handleImage1Change(file: File) {
    try {
      await uploadImage1Mutation.mutateAsync(file);
      showToast("Görsel güncellendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    }
  }

  async function handleImage2Change(file: File) {
    try {
      await uploadImage2Mutation.mutateAsync(file);
      showToast("Görsel güncellendi.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Görsel yüklenemedi.");
    }
  }

  const saveMutation = useMutation({
    mutationFn: updateAdminAboutPage,
    onSuccess: () => invalidateAboutPage(queryClient),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    try {
      await saveMutation.mutateAsync({
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        bodyParagraph1: form.bodyParagraph1 || undefined,
        bodyParagraph2: form.bodyParagraph2 || undefined,
        visionText: form.visionText || undefined,
        missionText: form.missionText || undefined,
      });
      showToast("Hakkımızda içeriği güncellendi.");
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
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Hakkımızda</h1>
      </div>

      {isLoading || !form ? (
        <p className="text-assid-muted">Yükleniyor...</p>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="grid gap-5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <h2 className="text-[1.02rem] font-bold text-assid-ink">Görseller</h2>
            <ImageUploadField
              label="Görsel 1"
              imageUrl={image1}
              isUploading={uploadImage1Mutation.isPending}
              onChange={handleImage1Change}
            />
            <ImageUploadField
              label="Görsel 2"
              imageUrl={image2}
              isUploading={uploadImage2Mutation.isPending}
              onChange={handleImage2Change}
            />
          </div>

          <div className="grid gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
            <label className="grid gap-1.5">
              <span className="text-[0.78rem] font-bold text-assid-muted">Başlık</span>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ASSİD"
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[0.78rem] font-bold text-assid-muted">Alt Başlık</span>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Siteler Sanayisinin Kurumsal Gücü"
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[0.78rem] font-bold text-assid-muted">1. Paragraf</span>
              <textarea
                rows={5}
                value={form.bodyParagraph1}
                onChange={(e) => setForm({ ...form, bodyParagraph1: e.target.value })}
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </label>
            <label className="grid gap-1.5">
              <span className="text-[0.78rem] font-bold text-assid-muted">2. Paragraf</span>
              <textarea
                rows={5}
                value={form.bodyParagraph2}
                onChange={(e) => setForm({ ...form, bodyParagraph2: e.target.value })}
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="grid gap-1.5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
              <span className="text-[0.78rem] font-bold text-assid-muted">Vizyon</span>
              <textarea
                rows={5}
                value={form.visionText}
                onChange={(e) => setForm({ ...form, visionText: e.target.value })}
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </div>
            <div className="grid gap-1.5 rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
              <span className="text-[0.78rem] font-bold text-assid-muted">Misyon</span>
              <textarea
                rows={5}
                value={form.missionText}
                onChange={(e) => setForm({ ...form, missionText: e.target.value })}
                className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
            >
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
