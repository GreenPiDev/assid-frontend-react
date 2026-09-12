import type { Member } from "../../types";
import MemberCardContent from "./MemberCardContent";

export default function MemberDetailPanel({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const open = !!member;

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-17 flex w-full flex-col overflow-y-auto rounded-r-2xl border-r border-white/35 bg-[rgba(9,34,58,.92)] text-white shadow-[18px_0_48px_rgba(6,18,30,.4)] backdrop-blur-xl transition-transform duration-350 [transition-timing-function:cubic-bezier(.22,.9,.3,1)] lg:w-[min(420px,92vw)] ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <button
        className="absolute right-4.5 top-4.5 z-[1] grid h-9.5 w-9.5 flex-none place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white transition duration-250 hover:bg-[rgba(30,155,255,.42)]"
        aria-label="Kapat"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="px-8.5 pb-8.5 pt-10">{member && <MemberCardContent member={member} />}</div>
    </aside>
  );
}
