import type { ReactNode } from "react";

export default function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-2 left-1/2 z-50 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-assid-ink px-2.5 py-1.5 text-[0.72rem] font-bold text-white opacity-0 shadow-card transition duration-150 group-hover:opacity-100"
      >
        {label}
        <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-assid-ink" />
      </span>
    </span>
  );
}
