import { useState } from "react";

export default function TagEditor({
  items,
  onChange,
  placeholder,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function addTag() {
    const value = draft.trim();
    if (!value || items.includes(value)) {
      setDraft("");
      return;
    }
    onChange([...items, value]);
    setDraft("");
  }

  return (
    <div>
      <div className="mb-2.5 flex flex-wrap gap-2">
        {items.length === 0 ? (
          <span className="text-[0.85rem] text-assid-muted">Henüz eklenmedi.</span>
        ) : (
          items.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 rounded-full bg-assid-paper px-3.5 py-1.5 text-[0.82rem] font-bold text-assid-ink"
            >
              {item}
              <button
                type="button"
                onClick={() => onChange(items.filter((i) => i !== item))}
                aria-label={`${item} etiketini kaldır`}
                className="cursor-pointer border-0 bg-transparent p-0 text-assid-muted hover:text-[#c0392b]"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 text-[0.85rem] outline-none focus:border-assid-green/50"
        />
        <button
          type="button"
          onClick={addTag}
          className="cursor-pointer rounded-[12px] border border-assid-line bg-transparent px-4 py-2.5 text-[0.82rem] font-bold text-assid-ink"
        >
          Ekle
        </button>
      </div>
    </div>
  );
}
