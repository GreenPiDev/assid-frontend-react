import type { Member } from "../../types";

export default function MemberCard({ member, onClick }: { member: Member; onClick: (member: Member) => void }) {
  return (
    <button
      type="button"
      className={`flex w-full flex-none items-center justify-between gap-2.5 rounded-md border px-4 py-3.5 text-left transition duration-200 ${
        member.isFeatured
          ? "border-assid-lime/60 bg-assid-lime/15 hover:border-assid-lime hover:bg-assid-lime/22"
          : "border-white/28 bg-white/10 hover:border-white/45 hover:bg-white/18"
      }`}
      onClick={() => onClick(member)}
    >
      <b className="text-[0.89rem] font-extrabold tracking-tight text-white">{member.name}</b>
      {member.isFeatured && (
        <span className="flex-none rounded-full bg-assid-lime px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-ink">
          Öne Çıkan
        </span>
      )}
    </button>
  );
}
