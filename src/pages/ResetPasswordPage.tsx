import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../api/auth";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

export default function ResetPasswordPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) => resetPassword(token, password),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Şifreler eşleşmiyor.");
      return;
    }
    try {
      await resetPasswordMutation.mutateAsync(newPassword);
      showToast("Şifreniz güncellendi, giriş yapabilirsiniz.");
      navigate("/login", { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Bağlantının süresi dolmuş olabilir.");
    }
  }

  if (!token) {
    return (
      <AuthShell title="Geçersiz Bağlantı" subtitle="Şifre sıfırlama bağlantısı eksik veya hatalı.">
        <div className="mt-8 text-center">
          <Link to="/forgot-password" className="text-[0.85rem] font-bold text-assid-lime hover:underline">
            Yeni bağlantı iste
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Yeni Şifre Belirle" subtitle="Hesabınız için yeni bir şifre oluşturun.">
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-white/70 uppercase">Yeni Şifre</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-white/25 bg-white/10 px-4 backdrop-blur-sm transition duration-200 focus-within:border-white focus-within:bg-white/16">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-white outline-none placeholder:text-white/45"
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-white/70 uppercase">Şifre (Tekrar)</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-white/25 bg-white/10 px-4 backdrop-blur-sm transition duration-200 focus-within:border-white focus-within:bg-white/16">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-white outline-none"
            />
          </span>
        </label>

        <Button type="submit" variant="light" className="mt-2 w-full" disabled={resetPasswordMutation.isPending}>
          {resetPasswordMutation.isPending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
    </AuthShell>
  );
}
