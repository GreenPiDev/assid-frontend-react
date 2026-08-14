import type { Member } from "../../types";
import MemberCardContent from "./MemberCardContent";

export default function MemberModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const open = !!member;

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-40 flex max-h-[86vh] w-[min(880px,92vw)] -translate-x-1/2 flex-col rounded-3xl border border-white/35 bg-[rgba(9,34,58,.92)] text-white shadow-[0_30px_80px_rgba(6,18,30,.5)] backdrop-blur-xl transition duration-300 ${
        open ? "pointer-events-auto -translate-y-1/2 scale-100 opacity-100" : "pointer-events-none -translate-y-1/2 scale-96 opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        className="absolute right-4.5 top-4.5 z-[1] grid h-9.5 w-9.5 place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white transition duration-250 hover:bg-[rgba(30,155,255,.42)]"
        aria-label="Kapat"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="overflow-y-auto px-8.5 pb-8.5 pt-10">{member && <MemberCardContent member={member} />}</div>
    </div>
  );
}
