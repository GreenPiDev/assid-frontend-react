export default function LegalConsentBox({
  title,
  text,
  checked,
  onChange,
  checkboxLabel,
}: {
  title: string;
  text: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  checkboxLabel: string;
}) {
  return (
    <div className="sm:col-span-2">
      <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">{title}</span>
      <div className="max-h-48 overflow-y-auto whitespace-pre-line rounded-[12px] border border-assid-line bg-assid-paper p-4 text-[0.82rem] leading-relaxed text-assid-ink">
        {text}
      </div>
      <label className="mt-3 flex items-start gap-2.5 text-[0.85rem] font-bold text-assid-ink">
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0"
        />
        {checkboxLabel}
      </label>
    </div>
  );
}
