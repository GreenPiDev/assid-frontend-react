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

export default function MemberModal({ member, onClose }: { member: Member | null; onClose: () => void }) {
  const open = !!member;

  const contactFields = member?.contact
    ? [
        ["Temsilci", member.contact.representative],
        ["Telefon", member.contact.phone],
        ["Adres", member.contact.address],
      ].filter(([, value]) => value)
    : [];

  return (
    <div
      className={`fixed left-1/2 top-1/2 z-40 flex max-h-[86vh] w-[min(880px,92vw)] -translate-x-1/2 flex-col rounded-3xl border border-white/35 bg-[rgba(9,34,58,.92)] text-white shadow-[0_30px_80px_rgba(6,18,30,.5)] backdrop-blur-xl transition duration-300 ${
        open ? "pointer-events-auto -translate-y-1/2 scale-100 opacity-100" : "pointer-events-none -translate-y-1/2 scale-96 opacity-0"
      }`}
      aria-hidden={!open}
    >
      <button
        className="absolute right-4.5 top-4.5 z-[1] grid h-9.5 w-9.5 place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white transition duration-250 hover:bg-[rgba(30,155,255,.42)]"
        aria-label="Kapat"
        onClick={onClose}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
      <div className="flex flex-col gap-5.5 overflow-y-auto px-8.5 pb-8.5 pt-10">
        {member && (
          <>
            <div className="pr-10">
              <span className="text-[0.78rem] font-extrabold uppercase tracking-[.12em] text-white/75">Firma Profili</span>
              <h2 className="mt-2 text-[clamp(1.6rem,3.4vw,2.3rem)] leading-[1.15] tracking-[-.03em]">{member.name}</h2>
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

            {member.notes &&
              Object.entries(member.notes).map(([slug, note]) => (
                <div
                  key={slug}
                  className="rounded-xl border border-assid-orange/40 bg-assid-orange/15 px-4 py-3.5 text-[0.98rem] text-white"
                >
                  <b className="mb-1 block text-[0.8rem] uppercase tracking-wide text-[#ffb387]">
                    Not ({getSectorName(slug)})
                  </b>
                  {note}
                </div>
              ))}
          </>
        )}
      </div>
    </div>
  );
}
