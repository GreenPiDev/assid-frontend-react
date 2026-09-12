import type { Member } from "../../types";

export default function MemberCard({ member, onClick }: { member: Member; onClick: (member: Member) => void }) {
  return (
    <button
      type="button"
      className={`flex w-full flex-none items-center justify-between gap-2.5 rounded-md border px-4 py-3.5 text-left transition duration-200 ${
        member.isFeatured
          ? "border-assid-lime bg-assid-lime/20 hover:border-assid-green/50 hover:bg-assid-lime/30"
          : "border-assid-line bg-white hover:border-assid-green/40 hover:bg-assid-paper"
      }`}
      onClick={() => onClick(member)}
    >
      <b className="text-[0.89rem] font-extrabold tracking-tight text-assid-ink">{member.name}</b>
      {member.isFeatured && (
        <span className="flex-none rounded-full bg-assid-lime px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-ink">
          Öne Çıkan
        </span>
      )}
    </button>
  );
}
