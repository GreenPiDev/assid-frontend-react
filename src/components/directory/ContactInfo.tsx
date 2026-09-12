import type { MemberContact } from "../../types";

export default function ContactInfo({ contact }: { contact?: MemberContact }) {
  const fields = contact
    ? ([
        ["Temsilci", contact.representative],
        ["Telefon", contact.phone],
        ["Adres", contact.address],
      ] as const).filter(([, value]) => value)
    : [];

  if (fields.length === 0) {
    return <p className="text-[0.9rem] text-assid-muted">İletişim bilgisi paylaşılmamış.</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
      {fields.map(([label, value]) => (
        <div className={`flex flex-col gap-1.5 ${label === "Adres" ? "col-span-full" : ""}`} key={label}>
          <span className="text-[0.76rem] font-extrabold uppercase tracking-wide text-assid-muted">{label}</span>
          {label === "Adres" ? (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(value)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[1.05rem] leading-snug text-assid-ink underline decoration-assid-ink/30 underline-offset-4 transition duration-200 hover:text-assid-green hover:decoration-current"
            >
              {value}
            </a>
          ) : (
            <p className="m-0 text-[1.05rem] leading-snug text-assid-ink">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}
