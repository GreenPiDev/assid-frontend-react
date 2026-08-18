import { useEffect, useRef, useState } from "react";
import type { SelectItem } from "../../types";

function normalize(text?: string) {
  return (text || "").toLocaleLowerCase("tr").trim();
}

interface CustomDropdownProps {
  items: SelectItem[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function CustomDropdown({ items, value, onChange, placeholder }: CustomDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel = items.find((item) => item.value === value)?.label || "";

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const filtered = !search.trim()
    ? items
    : items.filter((item) => normalize(item.label).includes(normalize(search)));

  function select(item: SelectItem) {
    onChange(item.value);
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="relative" ref={rootRef}>
      <div
        className={`flex items-center justify-between gap-2.5 rounded-lg border px-3.5 py-3 transition duration-200 ${
          open ? "border-white bg-[rgba(8,31,56,.75)]" : "border-white/40 bg-[rgba(8,31,56,.45)] hover:bg-[rgba(8,31,56,.65)] hover:border-white"
        }`}
      >
        <input
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          value={open ? search : selectedLabel}
          onFocus={() => setOpen(true)}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
              e.currentTarget.blur();
            }
            if (e.key === "Enter" && filtered.length) {
              select(filtered[0]);
              e.currentTarget.blur();
            }
          }}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[0.87rem] font-bold text-white outline-none placeholder:font-bold placeholder:text-white/65"
        />
        <button
          type="button"
          className="flex flex-none items-center justify-center border-0 bg-transparent p-0 text-white"
          tabIndex={-1}
          aria-label="Listeyi aç/kapat"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`block transition-transform duration-250 ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
      <div
        className={`absolute inset-x-0 top-[calc(100%+8px)] z-25 max-h-65 overflow-y-auto rounded-lg border border-white/30 bg-[rgba(6,18,30,.96)] shadow-[0_18px_40px_rgba(6,18,30,.4)] backdrop-blur-md transition duration-180 ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1.5 opacity-0"
        }`}
      >
        {filtered.length === 0 ? (
          <div className="px-3.5 py-2.5 text-[0.85rem] font-semibold text-white/60">Sonuç bulunamadı</div>
        ) : (
          filtered.map((item) => (
            <div
              className={`cursor-pointer px-3.5 py-2.5 text-[0.85rem] font-semibold text-white hover:bg-white/12 ${
                item.value === value ? "bg-white/18 font-extrabold" : ""
              }`}
              key={item.value || "all"}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                select(item);
              }}
            >
              {item.label}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
