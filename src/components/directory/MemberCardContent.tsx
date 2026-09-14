import type { Member } from "../../types";
import { MessageIcon } from "../admin/icons";
import { getSectorName } from "../../utils/directory";

function FeaturedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-assid-lime bg-gradient-to-r from-assid-lime/25 to-assid-lime/5 px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-wide text-assid-green">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.5 14.5 9l6.9.6-5.2 4.5 1.6 6.7L12 17.3l-5.8 3.5 1.6-6.7L2.6 9.6 9.5 9z" />
      </svg>
      Öne Çıkan Üye
    </span>
  );
}

function SidebarList({ label, items }: { label: string; items?: string[] }) {
  return (
    <div className="flex w-full flex-col items-start gap-2 text-left">
      <span className="text-[0.72rem] font-extrabold uppercase tracking-wide text-assid-muted">{label}</span>
      {!items || items.length === 0 ? (
        <span className="text-[0.9rem] text-assid-muted">—</span>
      ) : (
        <ul className="flex w-full flex-col gap-1.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-[0.92rem] font-semibold leading-snug text-assid-ink">
              <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-assid-green/50" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function MemberCardContent({
  member,
  onMessageClick,
}: {
  member: Member;
  onMessageClick?: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[280px] flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper shadow-[0_8px_24px_rgba(13,27,42,.08)]">
          {member.logo ? (
            <img src={member.logo} alt={`${member.name} logosu`} className="h-full w-full object-contain p-3" />
          ) : (
            <span className="text-[2rem] font-black text-assid-green">{member.name.charAt(0)}</span>
          )}
        </div>
        <h2 className="text-[1.4rem] leading-[1.2] tracking-[-.02em] text-assid-ink">{member.name}</h2>
        {member.isFeatured && <FeaturedBadge />}
      </div>

      <div className="h-px w-full bg-assid-line" />

      <div className="flex w-full flex-col gap-5">
        <SidebarList label="Sektörler" items={member.sectors.map(getSectorName)} />
        <SidebarList label="Alt Faaliyet Alanları" items={member.activityAreas} />
        <SidebarList label="Ürün ve Hizmetler" items={member.productsAndServices} />
      </div>

      {onMessageClick && (
        <button
          type="button"
          onClick={onMessageClick}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-0 bg-assid-green px-5 py-3 text-[0.88rem] font-bold text-white transition hover:opacity-90"
        >
          <MessageIcon className="h-4.5 w-4.5" />
          Mesaj Gönder
        </button>
      )}
    </div>
  );
}
