import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { submitInfoRequest } from "../../api/resources/members";
import { useToast } from "../../context/ToastContext";

const inputClass =
  "rounded-[10px] border border-white/30 bg-white/10 px-3.5 py-2.5 text-white placeholder:text-white/50 outline-none focus:border-white/60";

export default function InfoRequestForm({ memberId }: { memberId: string }) {
  const showToast = useToast();
  const [fields, setFields] = useState({ name: "", email: "", phone: "", message: "" });

  const mutation = useMutation({
    mutationFn: () => submitInfoRequest(memberId, { ...fields, phone: fields.phone || undefined }),
    onSuccess: () => {
      showToast("Talebiniz iletildi.");
      setFields({ name: "", email: "", phone: "", message: "" });
    },
    onError: (err) => showToast(err instanceof Error ? err.message : "Talep gönderilemedi."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.name.trim() || !fields.email.trim() || !fields.message.trim()) {
      showToast("Ad, e-posta ve mesaj alanları zorunludur.");
      return;
    }
    mutation.mutate();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          value={fields.name}
          onChange={(e) => setFields((f) => ({ ...f, name: e.target.value }))}
          placeholder="Ad Soyad"
          className={inputClass}
        />
        <input
          value={fields.email}
          onChange={(e) => setFields((f) => ({ ...f, email: e.target.value }))}
          placeholder="E-posta"
          type="email"
          className={inputClass}
        />
      </div>
      <input
        value={fields.phone}
        onChange={(e) => setFields((f) => ({ ...f, phone: e.target.value }))}
        placeholder="Telefon (opsiyonel)"
        className={inputClass}
      />
      <textarea
        value={fields.message}
        onChange={(e) => setFields((f) => ({ ...f, message: e.target.value }))}
        placeholder="Mesajınız"
        rows={3}
        className={`${inputClass} resize-none`}
      />
      <button
        type="submit"
        disabled={mutation.isPending}
        className="cursor-pointer self-start rounded-full border-0 bg-assid-lime px-5 py-2.5 text-[0.85rem] font-extrabold text-assid-ink disabled:cursor-not-allowed disabled:opacity-60"
      >
        {mutation.isPending ? "Gönderiliyor..." : "Bilgi Talep Et"}
      </button>
    </form>
  );
}
