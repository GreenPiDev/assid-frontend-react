import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-78px)] items-center justify-center bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center px-5 py-16">
      <div className="w-full max-w-[420px] rounded-[32px] border border-white/20 bg-white/12 p-8 shadow-[0_18px_48px_rgba(6,18,30,.35)] backdrop-blur-xl md:p-11">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-[1.8rem] leading-tight tracking-[-.03em] text-white">{title}</h1>
          <p className="mt-2 max-w-xs text-[0.88rem] text-white/70">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
