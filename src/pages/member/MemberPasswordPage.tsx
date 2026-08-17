import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { changeMyPassword } from "../../api/member";
import { useToast } from "../../context/ToastContext";

export default function MemberPasswordPage() {
  const showToast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useMutation({
    mutationFn: ({ current, next }: { current: string; next: string }) => changeMyPassword(current, next),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Yeni şifreler eşleşmiyor.");
      return;
    }
    try {
      await changePasswordMutation.mutateAsync({ current: currentPassword, next: newPassword });
      showToast("Şifreniz güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Şifre güncellenemedi.");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Üye Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Şifre Değiştir</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid max-w-md gap-4 rounded-[20px] border border-assid-line bg-white p-6 md:p-8"
      >
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Mevcut Şifre</span>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Yeni Şifre</span>
          <input
            required
            minLength={8}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Yeni Şifre (Tekrar)</span>
          <input
            required
            minLength={8}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="mt-2 flex justify-end">
          <button
            type="submit"
            disabled={changePasswordMutation.isPending}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-6 py-3 text-[0.88rem] font-bold text-white disabled:opacity-60"
          >
            {changePasswordMutation.isPending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
          </button>
        </div>
      </form>
    </div>
  );
}
