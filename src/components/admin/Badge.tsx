import type { ReactNode } from "react";

const variants = {
  success: "bg-[#e4f3e7] text-[#1e7a3c]",
  pending: "bg-[#fdf1de] text-[#a8641a]",
  danger: "bg-[#fbe6e3] text-[#c0392b]",
  neutral: "bg-assid-paper text-assid-muted",
};

export default function Badge({
  variant = "neutral",
  children,
}: {
  variant?: keyof typeof variants;
  children: ReactNode;
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.76rem] font-bold ${variants[variant]}`}>
      {children}
    </span>
  );
}
