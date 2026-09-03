import { usePresidentMessage } from "../api/resources/presidentMessage";

export default function PresidentMessagePage() {
  const { data: presidentMessage } = usePresidentMessage();

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Kurumsal
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-.05em]">
            Başkanın Mesajı
          </h1>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),1240px)] py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-assid-line bg-assid-paper">
            {presidentMessage?.image ? (
              <img src={presidentMessage.image} alt="ASSİD Başkanı" className="h-full w-full object-contain" />
            ) : (
              <div className="grid h-full w-full place-items-center text-[0.85rem] text-assid-muted">Görsel yok</div>
            )}
          </div>
          {presidentMessage?.messageHtml ? (
            <div
              className="president-message-content text-[1rem] leading-relaxed text-assid-ink"
              dangerouslySetInnerHTML={{ __html: presidentMessage.messageHtml }}
            />
          ) : (
            <p className="text-assid-muted">Mesaj henüz eklenmedi.</p>
          )}
        </div>
      </section>
    </main>
  );
}
