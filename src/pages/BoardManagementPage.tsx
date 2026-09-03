import { useBoardMembers } from "../api/resources/boardMembers";
import type { BackendBoardMember, BoardMemberCategory } from "../api/client";

const CATEGORIES: { key: BoardMemberCategory; label: string }[] = [
  { key: "yonetim_kurulu_asil", label: "Yönetim Kurulu Asıl Üye Listesi" },
  { key: "yonetim_kurulu_yedek", label: "Yönetim Kurulu Yedek Üye Listesi" },
  { key: "denetleme_kurulu_asil", label: "Denetleme Kurulu Asıl Üye Listesi" },
  { key: "denetleme_kurulu_yedek", label: "Denetleme Kurulu Yedek Üye Listesi" },
  { key: "disiplin_kurulu_asil", label: "Disiplin Kurulu Asıl Üye Listesi" },
  { key: "disiplin_kurulu_yedek", label: "Disiplin Kurulu Yedek Üye Listesi" },
];

function CategorySection({ label, members }: { label: string; members: BackendBoardMember[] }) {
  if (members.length === 0) return null;

  return (
    <div className="mb-14 last:mb-0">
      <h2 className="mb-6 text-[1.4rem] tracking-[-.03em] text-assid-ink">{label}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <div
            key={member._id}
            className="rounded-[20px] border border-assid-line bg-white p-6 text-center shadow-card"
          >
            <b className="block text-[1.05rem] tracking-tight text-assid-ink">{member.name}</b>
            {member.title && <span className="mt-1 block text-[0.82rem] text-assid-muted">{member.title}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BoardManagementPage() {
  const { data: members, isLoading } = useBoardMembers();

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Kurumsal
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-.05em]">
            Dernek Yönetimi
          </h1>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),1240px)] py-14">
        {isLoading ? (
          <p className="text-assid-muted">Yükleniyor...</p>
        ) : members.length === 0 ? (
          <p className="text-assid-muted">Henüz kurul üyesi eklenmedi.</p>
        ) : (
          CATEGORIES.map(({ key, label }) => (
            <CategorySection key={key} label={label} members={members.filter((m) => m.category === key)} />
          ))
        )}
      </section>
    </main>
  );
}
