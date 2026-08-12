import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMemberSearch } from "../../api/resources/members";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { getSectorName } from "../../utils/directory";

export default function MemberSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const { data: results } = useMemberSearch(debouncedQuery);
  const showResults = open && query.trim();

  return (
    <div className="relative flex-1 basis-[270px]" ref={wrapRef}>
      <label className="flex min-h-13 items-center gap-2.5 rounded-[14px] border border-transparent bg-white px-4 shadow-[0_8px_20px_rgba(18,58,99,.05)] focus-within:border-assid-green/50">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-none text-assid-green">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.8-3.8" />
        </svg>
        <input
          autoComplete="off"
          placeholder="Firma, sektör veya ürün ara..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          className="w-full border-0 bg-transparent text-assid-ink outline-none"
        />
      </label>
      <div
        className={`absolute inset-x-0 top-[calc(100%+10px)] z-30 max-h-95 overflow-y-auto rounded-2xl bg-white shadow-card transition duration-180 ${
          showResults ? "pointer-events-auto -translate-y-0 opacity-100" : "pointer-events-none -translate-y-1.5 opacity-0"
        }`}
      >
        {results.length === 0 ? (
          <div className="px-4.5 py-5 text-center text-[0.86rem] text-assid-muted">Sonuç bulunamadı.</div>
        ) : (
          results.map((member) => (
            <div
              className="flex cursor-pointer flex-wrap items-center justify-between gap-2 border-b border-assid-line px-4.5 py-3.5 transition duration-150 last:border-b-0 hover:bg-assid-paper"
              key={member.id}
              onClick={() => navigate(`/firma-rehberi?firma=${member.id}`)}
            >
              <div className="flex-1 text-[0.92rem] font-extrabold tracking-tight text-assid-ink">{member.name}</div>
              <div className="flex flex-1 flex-wrap justify-end gap-1.5">
                {member.sectors.map((slug) => (
                  <span key={slug} className="rounded-full bg-assid-paper px-2.5 py-1 text-[0.68rem] font-bold text-assid-muted">
                    {getSectorName(slug)}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
