import { useState } from "react";

const COUNTRY_CODES = [
  { code: "+90", label: "🇹🇷 +90" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+49", label: "🇩🇪 +49" },
  { code: "+33", label: "🇫🇷 +33" },
  { code: "+31", label: "🇳🇱 +31" },
];

function formatPhoneDigits(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 8);
  const p4 = digits.slice(8, 10);
  let out = "";
  if (p1) out += `(${p1}`;
  if (p1.length === 3) out += ")";
  if (p2) out += ` ${p2}`;
  if (p3) out += ` ${p3}`;
  if (p4) out += ` ${p4}`;
  return out;
}

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PhoneInput({ value, onChange }: PhoneInputProps) {
  const initialMatch = value.match(/^(\+\d{1,3})\s*(.*)$/);
  const [countryCode, setCountryCode] = useState(initialMatch?.[1] ?? "+90");
  const [digits, setDigits] = useState(() => (initialMatch?.[2] ?? value).replace(/\D/g, "").slice(0, 10));

  function emit(nextCountryCode: string, nextDigits: string) {
    onChange(nextDigits ? `${nextCountryCode} ${formatPhoneDigits(nextDigits)}` : "");
  }

  return (
    <div className="flex gap-2">
      <select
        value={countryCode}
        onChange={(e) => {
          setCountryCode(e.target.value);
          emit(e.target.value, digits);
        }}
        className="w-24 shrink-0 rounded-[12px] border border-assid-line bg-assid-paper px-2 py-2.5 outline-none focus:border-assid-green/50"
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </select>
      <input
        type="tel"
        inputMode="numeric"
        placeholder="(---) --- -- --"
        value={formatPhoneDigits(digits)}
        onChange={(e) => {
          const nextDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
          setDigits(nextDigits);
          emit(countryCode, nextDigits);
        }}
        className="min-w-0 flex-1 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
      />
    </div>
  );
}
