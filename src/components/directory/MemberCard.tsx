import type { Member } from "../../types";

export default function MemberCard({ member, onClick }: { member: Member; onClick: (member: Member) => void }) {
  return (
    <button
      type="button"
      className="flex w-full flex-none items-center justify-between gap-2.5 rounded-[14px] border border-white/28 bg-white/10 px-4 py-3.5 text-left transition duration-200 hover:border-white/45 hover:bg-white/18"
      onClick={() => onClick(member)}
    >
      <b className="text-[0.89rem] font-extrabold tracking-tight text-white">{member.name}</b>
    </button>
  );
}
