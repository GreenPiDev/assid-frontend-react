import { useState } from "react";
import { useMembers } from "../../api/resources/members";
import { CloseIcon } from "../admin/icons";

interface NewMessageModalProps {
  onClose: () => void;
  onSelectMember: (memberId: string) => void;
  onSelectAdmin?: () => void;
  excludeMemberId?: string;
  title?: string;
}

export default function NewMessageModal({
  onClose,
  onSelectMember,
  onSelectAdmin,
  excludeMemberId,
  title = "Yeni Mesaj",
}: NewMessageModalProps) {
  const { data: members = [] } = useMembers();
  const [search, setSearch] = useState("");

  const filtered = members
    .filter((m) => m.id !== excludeMemberId)
    .filter((m) => m.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(9,20,33,.55)] p-4" onClick={onClose}>
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-[18px] bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-assid-line px-5 py-4">
          <span className="text-[1rem] font-extrabold text-assid-ink">{title}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-assid-paper text-assid-muted"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-assid-line p-3">
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Firma ara..."
            className="w-full rounded-[10px] border border-assid-line bg-assid-paper px-3.5 py-2.5 text-[0.88rem] outline-none focus:border-assid-green/50"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {onSelectAdmin && (
            <button
              type="button"
              onClick={onSelectAdmin}
              className="flex w-full items-center gap-3 border-b border-assid-line px-5 py-3 text-left transition hover:bg-assid-paper"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-assid-green text-[0.85rem] font-black text-white">
                A
              </span>
              <span className="text-[0.9rem] font-bold text-assid-ink">ASSİD Yönetimi</span>
            </button>
          )}
          {filtered.length === 0 ? (
            <div className="px-5 py-6 text-center text-[0.85rem] text-assid-muted">Firma bulunamadı</div>
          ) : (
            filtered.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() => onSelectMember(member.id)}
                className="flex w-full items-center gap-3 border-b border-assid-line px-5 py-3 text-left transition hover:bg-assid-paper last:border-b-0"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper">
                  {member.logo ? (
                    <img src={member.logo} alt="" className="h-full w-full object-contain p-1" />
                  ) : (
                    <span className="text-[0.8rem] font-black text-assid-green">{member.name.charAt(0)}</span>
                  )}
                </span>
                <span className="text-[0.9rem] font-bold text-assid-ink">{member.name}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
