import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import { useToast } from "../context/ToastContext";

export default function LoginPage() {
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    showToast("Kullanıcı girişi altyapısı yakında eklenecek.");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-assid-paper px-5 py-16">
      <Link
        className="group fixed left-6 top-6 z-10 grid h-11.5 w-11.5 place-items-center rounded-full border border-assid-line bg-white text-assid-green shadow-[0_8px_20px_rgba(18,58,99,.08)] transition duration-250 hover:-translate-x-0.5 hover:border-assid-green/40"
        to="/"
        aria-label="Ana sayfaya dön"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </Link>

      <div className="w-full max-w-[420px] rounded-[32px] bg-white p-8 shadow-card md:p-11">
        <div className="flex flex-col items-center text-center">
          <span className="relative grid h-[52px] w-[52px] place-items-center overflow-hidden rounded-full bg-assid-green text-lg font-black tracking-tighter text-white">
            A
            <span className="absolute -right-4 -top-3 h-8 w-8 rounded-full border-[3px] border-assid-lime" />
          </span>
          <h1 className="mt-5 text-[1.8rem] leading-tight tracking-[-.03em]">Kullanıcı Girişi</h1>
          <p className="mt-2 max-w-xs text-[0.88rem] text-assid-muted">
            ASSİD üye panelinize erişmek için giriş yapın.
          </p>
        </div>

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
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-0 bg-transparent text-assid-ink outline-none"
              />
            </span>
          </label>

          <button
            type="button"
            className="cursor-pointer justify-self-end border-0 bg-transparent p-0 text-[0.82rem] font-bold text-assid-green hover:underline"
            onClick={() => showToast("Şifre sıfırlama yakında eklenecek.")}
          >
            Şifremi unuttum
          </button>

          <Button type="submit" variant="primary" className="mt-2 w-full">
            Giriş Yap
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
      </div>
    </div>
  );
}
