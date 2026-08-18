import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/auth/AuthShell";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useOrganizationSettings } from "../api/resources/organizationSettings";

export default function LoginPage() {
  const showToast = useToast();
  const { data: settings } = useOrganizationSettings();
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
    <AuthShell title="Üye Girişi" subtitle="Yönetim panelinize erişmek için giriş yapın.">
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

        <label className="grid gap-1.5">
          <span className="text-[0.79rem] font-bold tracking-wide text-white/70 uppercase">Şifre</span>
          <span className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-white/25 bg-white/10 px-4 backdrop-blur-sm transition duration-200 focus-within:border-white focus-within:bg-white/16">
            <input
              type={isPasswordVisible ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-0 bg-transparent text-white outline-none placeholder:text-white/45"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((v) => !v)}
              aria-label={isPasswordVisible ? "Şifreyi gizle" : "Şifreyi göster"}
              className="grid shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-white/60 hover:text-white"
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
          className="justify-self-end text-[0.82rem] font-bold text-assid-lime hover:underline"
        >
          Şifremi unuttum
        </Link>

        <Button type="submit" variant="light" className="mt-2 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </form>

      {(settings?.showLoginMembershipCta ?? true) && (
        <p className="mt-6 text-center text-[0.86rem] text-white/70">
          Henüz üye değil misiniz?{" "}
          <Link to="/uyelik-basvurusu" className="font-bold text-assid-lime hover:underline">
            Üyelik başvurusu yapın
          </Link>
        </p>
      )}
    </AuthShell>
  );
}
