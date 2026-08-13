import { useRef } from "react";

export default function FileUploadField({
  label,
  hint,
  files,
  onChange,
  multiple,
}: {
  label: string;
  hint?: string;
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!selected.length) return;
    onChange(multiple ? [...files, ...selected].slice(0, 2) : selected);
  }

  return (
    <div>
      <span className="mb-2 block text-[0.78rem] font-bold text-assid-muted">{label}</span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,application/pdf"
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-[12px] border border-assid-line bg-transparent px-4 py-2.5 text-[0.82rem] font-bold text-assid-ink"
      >
        Dosya Seç
      </button>
      {hint && <p className="mt-1.5 text-[0.74rem] text-assid-muted">{hint}</p>}
      {files.length > 0 && (
        <ul className="mt-2 grid gap-1">
          {files.map((file, index) => (
            <li key={`${file.name}-${index}`} className="flex items-center gap-2 text-[0.8rem] text-assid-ink">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                aria-label={`${file.name} dosyasını kaldır`}
                className="cursor-pointer border-0 bg-transparent p-0 text-assid-muted hover:text-[#c0392b]"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
