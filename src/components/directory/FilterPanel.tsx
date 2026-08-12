import { useState } from "react";
import type { Member, SelectItem } from "../../types";
import CustomDropdown from "./CustomDropdown";
import MemberCard from "./MemberCard";

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  sectorItems: SelectItem[];
  sectorValue: string | null;
  onSectorChange: (value: string) => void;
  sectorName: string;
  activityItems: SelectItem[];
  activityValue: string;
  onActivityChange: (value: string) => void;
  filteredMembers: Member[];
  totalMembers: number;
  onMemberClick: (member: Member) => void;
}

export default function FilterPanel({
  open,
  onClose,
  sectorItems,
  sectorValue,
  onSectorChange,
  sectorName,
  activityItems,
  activityValue,
  onActivityChange,
  filteredMembers,
  totalMembers,
  onMemberClick,
}: FilterPanelProps) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-16 flex w-[min(420px,92vw)] flex-col border-l border-white/50 bg-[rgba(30,155,255,.28)] text-white shadow-[-18px_0_48px_rgba(6,18,30,.35)] backdrop-blur-xl transition-transform duration-350 [transition-timing-function:cubic-bezier(.22,.9,.3,1)] ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex flex-none items-start justify-between gap-3.5 border-b border-white/22 px-5.5 pb-4.5 pt-5.5">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[.12em] text-white/80">Sektör Firmaları</span>
          <h2 className="mt-1.5 text-[1.35rem] tracking-tight text-white">{sectorName || "—"}</h2>
        </div>
        <button
          className="flex-none grid h-8.5 w-8.5 place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white transition duration-250 hover:bg-[rgba(30,155,255,.42)]"
          aria-label="Paneli kapat"
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className="flex flex-none items-center justify-between border-0 border-b border-white/22 bg-transparent px-5.5 py-3.5 text-[0.78rem] font-extrabold uppercase tracking-wide text-white"
        onClick={() => setFiltersCollapsed((prev) => !prev)}
      >
        <span>Filtreler</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-250 ${filtersCollapsed ? "-rotate-90" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div
        className={`flex-none overflow-visible border-b border-white/22 transition-[max-height,border-color] duration-300 ${
          filtersCollapsed ? "max-h-0 overflow-hidden border-transparent" : "max-h-125"
        }`}
      >
        <div className="flex flex-col gap-3 px-5.5 py-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-white/75">Sektör</label>
            <CustomDropdown
              items={sectorItems}
              value={sectorValue}
              onChange={onSectorChange}
              placeholder="Sektör ara..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-white/75">Faaliyet Alanı</label>
            <CustomDropdown
              items={activityItems}
              value={activityValue}
              onChange={onActivityChange}
              placeholder="Faaliyet alanı ara..."
            />
          </div>
        </div>
      </div>

      <div className="flex-none px-5.5 pt-3.5 text-[0.78rem] font-bold text-white/80">
        {filteredMembers.length} / {totalMembers} firma listeleniyor
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5.5 pb-6.5 pt-3.5">
        {filteredMembers.length === 0 ? (
          <div className="px-1 py-7.5 text-center text-[0.86rem] text-white/80">
            Seçilen filtrelere uyan firma bulunamadı.
          </div>
        ) : (
          filteredMembers.map((member) => (
            <MemberCard member={member} key={member.id} onClick={onMemberClick} />
          ))
        )}
      </div>
    </aside>
  );
}
