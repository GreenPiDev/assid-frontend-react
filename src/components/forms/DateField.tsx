import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent } from "react";
import { createPortal } from "react-dom";
import { Calendar } from "./Calendar";

interface DateFieldProps {
  id: string;
  value: string;
  onChange: (isoValue: string) => void;
  required?: boolean;
  className?: string;
}

function isoToDigits(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return "";
  return `${day}${month}${year}`;
}

function digitsToFormatted(digits: string): string {
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  let formatted = day;
  if (month) formatted += `.${month}`;
  if (year) formatted += `.${year}`;
  return formatted;
}

function digitsToIso(digits: string): string {
  if (digits.length !== 8) return "";
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
}

// akya-digital-hr-management/frontend/src/components/DateField.tsx'ten port
// edildi — /uyelik-basvurusu formundaki takvim seçimi için (react-i18next
// bağımlılığı kaldırıldı, Türkçe metinler sabitlendi, Tailwind stilleri
// kullanıldı).
export function DateField({ id, value, onChange, required, className }: DateFieldProps) {
  const [digits, setDigits] = useState(() => isoToDigits(value));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDigits(isoToDigits(value));
  }, [value]);

  useLayoutEffect(() => {
    if (!calendarOpen) return;
    function updatePosition() {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const popoverHeight = popoverRef.current?.offsetHeight ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = popoverHeight > 0 && spaceBelow < popoverHeight + 12 && rect.top > popoverHeight + 12;
      const top = openUpward ? rect.top - popoverHeight - 6 : rect.bottom + 6;
      setCalendarPosition({ top, left: rect.left });
    }
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [calendarOpen]);

  useEffect(() => {
    if (!calendarOpen) return;
    function handleFocusIn(event: FocusEvent) {
      const target = event.target as Node;
      if (wrapRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      setCalendarOpen(false);
    }
    document.addEventListener("focusin", handleFocusIn);
    return () => document.removeEventListener("focusin", handleFocusIn);
  }, [calendarOpen]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const rawDigits = event.target.value.replace(/\D/g, "").slice(0, 8);
    setDigits(rawDigits);
    onChange(digitsToIso(rawDigits));
  }

  function handleCalendarSelect(isoValue: string) {
    setDigits(isoToDigits(isoValue));
    onChange(isoValue);
    setCalendarOpen(false);
  }

  return (
    <div className="relative" ref={wrapRef}>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="GG.AA.YYYY"
        value={digitsToFormatted(digits)}
        onChange={handleChange}
        onFocus={() => setCalendarOpen(true)}
        maxLength={10}
        required={required}
        autoComplete="off"
        className={`w-full pr-9 ${className ?? ""}`}
      />
      <button
        type="button"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-assid-muted hover:bg-assid-paper"
        onClick={() => setCalendarOpen((open) => !open)}
        aria-label="Takvimi aç"
        tabIndex={-1}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-[18px] w-[18px]">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>
      {calendarOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[300]"
            style={{ top: calendarPosition.top, left: calendarPosition.left }}
          >
            <Calendar value={digitsToIso(digits)} onSelect={handleCalendarSelect} onClose={() => setCalendarOpen(false)} />
          </div>,
          document.body,
        )}
    </div>
  );
}
