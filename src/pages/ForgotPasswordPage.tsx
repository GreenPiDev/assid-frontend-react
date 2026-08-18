import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);
  const forgotPasswordMutation = useMutation({ mutationFn: forgotPassword });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await forgotPasswordMutation.mutateAsync(email);
    } finally {
      // Backend always resolves the same way regardless of whether the
      // email exists, so the UI can't leak that info either.
      setIsSent(true);
    }
  }

  return (
    <AuthShell
      title="Şifremi Unuttum"
      subtitle="E-posta adresinizi girin, şifre sıfırlama bağlantısını gönderelim."
    >
      {isSent ? (
        <div className="mt-8 grid gap-4 text-center">
          <p className="text-[0.92rem] text-white">
            <strong>{email}</strong> adresine kayıtlıysa, şifre sıfırlama bağlantısını içeren bir e-posta gönderdik.
          </p>
          <p className="text-[0.95rem] font-bold text-white">
            Lütfen mail hesabınızda spam / gereksiz klasörünü de kontrol edin.
          </p>
          <Button as={Link} to="/login" variant="light" className="mt-2 w-full">
            Giriş Sayfasına Dön
          </Button>
        </div>
      ) : (
        <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-1.5">
            <span className="text-[0.79rem] font-bold tracking-wide text-white/70 uppercase">E-posta</span>
            <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-white/25 bg-white/10 px-4 backdrop-blur-sm transition duration-200 focus-within:border-white focus-within:bg-white/16">
              <input
                type="email"
                required
                autoComplete="email"
                placeholder="ornek@sirket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-0 bg-transparent text-white outline-none placeholder:text-white/45"
              />
            </span>
          </label>

          <Button type="submit" variant="light" className="mt-2 w-full" disabled={forgotPasswordMutation.isPending}>
            {forgotPasswordMutation.isPending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </Button>

          <Link
            to="/login"
            className="justify-self-center text-[0.82rem] font-bold text-assid-lime hover:underline"
          >
            Giriş sayfasına dön
          </Link>
        </form>
      )}
    </AuthShell>
  );
}
