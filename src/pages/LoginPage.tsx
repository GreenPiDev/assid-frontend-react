import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const showToast = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      const from = (location.state as { from?: Location } | null)?.from;
      navigate(from ? `${from.pathname}${from.search}` : "/dashboard", { replace: true });
    } catch {
      showToast("E-posta veya şifre hatalı.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell title="Kullanıcı Girişi" subtitle="Yönetim panelinize erişmek için giriş yapın.">
      <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-[#405048] uppercase">E-posta</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-transparent bg-assid-paper px-4 shadow-[0_8px_20px_rgba(18,58,99,.05)] focus-within:border-assid-green/50">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="ornek@sirket.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-0 bg-transparent text-assid-ink outline-none"
            />
          </span>
        </label>

        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-[#405048] uppercase">Şifre</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-transparent bg-assid-paper px-4 shadow-[0_8px_20px_rgba(18,58,99,.05)] focus-within:border-assid-green/50">
            <input
              type={isPasswordVisible ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-assid-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((v) => !v)}
              aria-label={isPasswordVisible ? "Şifreyi gizle" : "Şifreyi göster"}
              className="grid shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-assid-muted hover:text-assid-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12Z" />
                <circle cx="12" cy="12" r="3" />
                {!isPasswordVisible && <line x1="3" y1="3" x2="21" y2="21" />}
              </svg>
            </button>
          </span>
        </label>

        <Link
          to="/forgot-password"
          className="justify-self-end text-[0.82rem] font-bold text-assid-green hover:underline"
        >
          Şifremi unuttum
        </Link>

        <Button type="submit" variant="primary" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      <p className="mt-6 text-center text-[0.86rem] text-assid-muted">
        Henüz üye değil misiniz?{" "}
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0 font-bold text-assid-green hover:underline"
          onClick={() => showToast("Üyelik başvuru sayfası WordPress formuna bağlanacak.")}
        >
          Üyelik başvurusu yapın
        </button>
      </p>
    </AuthShell>
  );
}
