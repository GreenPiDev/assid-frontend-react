import type { ReactNode } from "react";
import type { Member } from "../../types";
import { getSectorName } from "../../utils/directory";

function Tags({ items }: { items?: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {!items || items.length === 0 ? (
        <span>—</span>
      ) : (
        items.map((item) => (
          <span
            key={item}
            className="rounded-full border border-white/30 bg-white/12 px-3.5 py-1.5 text-[0.95rem] font-bold text-white/92"
          >
            {item}
          </span>
        ))
      )}
    </div>
  );
}

function ModalSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[0.8rem] font-extrabold uppercase tracking-wide text-white/60">{label}</span>
      {children}
    </div>
  );
}

export default function MemberCardContent({ member }: { member: Member }) {
  const contactFields = member.contact
    ? [
        ["Temsilci", member.contact.representative],
        ["Telefon", member.contact.phone],
        ["Adres", member.contact.address],
      ].filter(([, value]) => value)
    : [];

  return (
    <div className="flex flex-col gap-5.5">
      <div className="flex items-start justify-between gap-4 pr-10">
        <div>
          <span className="text-[0.78rem] font-extrabold uppercase tracking-[.12em] text-white/75">
            Firma Profili
          </span>
          <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.15] tracking-[-.03em]">{member.name}</h2>
        </div>
        {member.logo && (
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border border-white/30 bg-white/10 sm:h-24 sm:w-24">
            <img src={member.logo} alt={`${member.name} logosu`} className="h-full w-full object-contain p-2" />
          </div>
        )}
      </div>

      <ModalSection label="Sektörler">
        <Tags items={member.sectors.map(getSectorName)} />
      </ModalSection>
      <ModalSection label="Alt Faaliyet Alanları">
        <Tags items={member.activityAreas} />
      </ModalSection>
      <ModalSection label="Ürün ve Hizmetler">
        <Tags items={member.productsAndServices} />
      </ModalSection>

      {contactFields.length > 0 && (
        <ModalSection label="İletişim">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
            {contactFields.map(([label, value]) => (
              <div className={`flex flex-col gap-1.5 ${label === "Adres" ? "col-span-full" : ""}`} key={label}>
                <span className="text-[0.76rem] font-extrabold uppercase tracking-wide text-white/60">{label}</span>
                {label === "Adres" ? (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(value)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[1.05rem] leading-snug text-white underline decoration-white/40 underline-offset-4 transition duration-200 hover:text-assid-lime hover:decoration-current"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="m-0 text-[1.05rem] leading-snug text-white">{value}</p>
                )}
              </div>
            ))}
          </div>
        </ModalSection>
      )}
    </div>
  );
}
