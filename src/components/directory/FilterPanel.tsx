import { useMemo, useState } from "react";
import type { Member, SelectItem } from "../../types";
import CustomDropdown from "./CustomDropdown";
import MemberCard from "./MemberCard";

function normalize(text?: string) {
  return (text || "").toLocaleLowerCase("tr").trim();
}

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  sectorItems: SelectItem[];
  sectorValue: string | null;
  onSectorChange: (value: string) => void;
  locationItems: SelectItem[];
  locationValue: string | null;
  onLocationChange: (value: string) => void;
  panelName: string;
  activityItems: SelectItem[];
  activityValue: string;
  onActivityChange: (value: string) => void;
  filteredMembers: Member[];
  totalMembers: number;
  nameQuery: string;
  onNameQueryChange: (value: string) => void;
  onMemberClick: (member: Member) => void;
}

export default function FilterPanel({
  open,
  onClose,
  sectorItems,
  sectorValue,
  onSectorChange,
  locationItems,
  locationValue,
  onLocationChange,
  panelName,
  activityItems,
  activityValue,
  onActivityChange,
  filteredMembers,
  totalMembers,
  nameQuery,
  onNameQueryChange,
  onMemberClick,
}: FilterPanelProps) {
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);

  const visibleMembers = useMemo(() => {
    if (!nameQuery.trim()) return filteredMembers;
    const q = normalize(nameQuery);
    return filteredMembers.filter((member) => normalize(member.name).includes(q));
  }, [filteredMembers, nameQuery]);

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-16 flex w-[min(420px,92vw)] flex-col rounded-l-2xl border-l border-assid-line bg-white/95 text-assid-ink shadow-[-18px_0_48px_rgba(13,27,42,.14)] backdrop-blur-xl transition-transform duration-350 [transition-timing-function:cubic-bezier(.22,.9,.3,1)] ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex flex-none items-start justify-between gap-3.5 border-b border-assid-line px-5.5 pb-4.5 pt-5.5">
        <div>
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[.12em] text-assid-muted">
            {locationValue ? "Lokasyon Firmaları" : "Sektör Firmaları"}
          </span>
          <h2 className="mt-1.5 text-[1.35rem] tracking-tight text-assid-ink">{panelName || "—"}</h2>
        </div>
        <button
          className="flex-none grid h-8.5 w-8.5 place-items-center rounded-lg border border-assid-line bg-assid-paper text-assid-ink transition duration-250 hover:bg-assid-line/60"
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
        className="flex flex-none items-center justify-between border-0 border-b border-assid-line bg-transparent px-5.5 py-3.5 text-[0.78rem] font-extrabold uppercase tracking-wide text-assid-ink"
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
        className={`flex-none border-b border-assid-line transition-[max-height,border-color] duration-300 ${
          filtersCollapsed ? "max-h-0 overflow-hidden border-transparent" : "max-h-125 overflow-visible"
        }`}
      >
        <div className="flex flex-col gap-3 px-5.5 py-4.5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-muted">Firma Ara</label>
            <div className="flex items-center gap-2.5 rounded-lg border border-assid-line bg-assid-paper px-3.5 py-3 transition duration-200 focus-within:border-assid-green/50 focus-within:bg-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-assid-muted">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.8-3.8" />
              </svg>
              <input
                type="text"
                autoComplete="off"
                placeholder="Firma adı ara..."
                value={nameQuery}
                onChange={(e) => onNameQueryChange(e.target.value)}
                className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.87rem] font-bold text-assid-ink outline-none placeholder:font-bold placeholder:text-assid-muted"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-muted">Sektör</label>
            <CustomDropdown
              items={sectorItems}
              value={sectorValue}
              onChange={onSectorChange}
              placeholder="Sektör ara..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-muted">Lokasyon</label>
            <CustomDropdown
              items={locationItems}
              value={locationValue}
              onChange={onLocationChange}
              placeholder="Lokasyon ara..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-muted">Faaliyet Alanı</label>
            <CustomDropdown
              items={activityItems}
              value={activityValue}
              onChange={onActivityChange}
              placeholder="Faaliyet alanı ara..."
            />
          </div>
        </div>
      </div>

      <div className="flex-none px-5.5 pt-3.5 text-[0.78rem] font-bold text-assid-muted">
        {visibleMembers.length} / {totalMembers} firma listeleniyor
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-5.5 pb-6.5 pt-3.5">
        {visibleMembers.length === 0 ? (
          <div className="px-1 py-7.5 text-center text-[0.86rem] text-assid-muted">
            Seçilen filtrelere uyan firma bulunamadı.
          </div>
        ) : (
          visibleMembers.map((member) => (
            <MemberCard member={member} key={member.id} onClick={onMemberClick} />
          ))
        )}
      </div>
    </aside>
  );
}
