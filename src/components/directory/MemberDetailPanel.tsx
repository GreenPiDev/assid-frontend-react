import type { Member } from "../../types";
import MemberCardContent from "./MemberCardContent";
import MemberProfileTabs from "./MemberProfileTabs";

export default function MemberDetailPanel({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const open = !!member;

  return (
    <aside
      className={`fixed inset-4 z-17 flex flex-col overflow-hidden rounded-3xl border border-assid-line bg-white/97 text-assid-ink shadow-[0_30px_80px_rgba(13,27,42,.22)] backdrop-blur-xl transition-[opacity,transform] duration-350 [transition-timing-function:cubic-bezier(.22,.9,.3,1)] lg:inset-6 lg:right-[444px] ${
        open ? "scale-100 opacity-100" : "pointer-events-none scale-97 opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        className="absolute right-4.5 top-4.5 z-[1] grid h-9.5 w-9.5 flex-none place-items-center rounded-full border border-assid-line bg-white text-assid-ink transition duration-250 hover:bg-assid-paper"
        aria-label="Kapat"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      {member && (
        <div className="min-h-0 flex-1 overflow-y-auto px-8.5 pb-8.5 pt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
            <MemberCardContent member={member} />
            <MemberProfileTabs member={member} />
          </div>
        </div>
      )}
    </aside>
  );
}
