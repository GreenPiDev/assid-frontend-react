import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Şifreler eşleşmiyor.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(token, newPassword);
      showToast("Şifreniz güncellendi, giriş yapabilirsiniz.");
      navigate("/login", { replace: true });
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Bağlantının süresi dolmuş olabilir.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <AuthShell title="Geçersiz Bağlantı" subtitle="Şifre sıfırlama bağlantısı eksik veya hatalı.">
        <div className="mt-8 text-center">
          <Link to="/forgot-password" className="text-[0.85rem] font-bold text-assid-green hover:underline">
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
          <span className="text-[0.79rem] font-bold tracking-wide text-[#405048] uppercase">Yeni Şifre</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-transparent bg-assid-paper px-4 shadow-[0_8px_20px_rgba(18,58,99,.05)] focus-within:border-assid-green/50">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="En az 8 karakter"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-assid-ink outline-none"
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-[#405048] uppercase">Şifre (Tekrar)</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-transparent bg-assid-paper px-4 shadow-[0_8px_20px_rgba(18,58,99,.05)] focus-within:border-assid-green/50">
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-assid-ink outline-none"
            />
          </span>
        </label>

        <Button type="submit" variant="primary" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </Button>
      </form>
    </AuthShell>
  );
}
