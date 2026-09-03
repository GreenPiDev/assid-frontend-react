import { useAllEvents } from "../api/resources/events";
import { formatEventDateTime } from "../utils/date";
import type { BackendEvent } from "../api/client";

function EventCard({ event, isPast }: { event: BackendEvent; isPast: boolean }) {
  return (
    <article
      className={`flex flex-col overflow-hidden rounded-[24px] border border-assid-line bg-white sm:flex-row ${
        isPast ? "opacity-60" : ""
      }`}
    >
      <div
        className="h-48 shrink-0 bg-cover bg-center sm:h-auto sm:w-72"
        style={{
          backgroundImage: `url('${event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85"}')`,
        }}
      />
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
        <span className="text-[0.8rem] text-assid-muted">{formatEventDateTime(event.startDate)}</span>
        <h3 className="text-[1.3rem] leading-tight tracking-[-.02em] text-assid-ink">{event.title}</h3>
        {event.location && <p className="text-[0.88rem] text-assid-muted">{event.location}</p>}
        {event.description && <p className="text-[0.88rem] text-assid-muted">{event.description}</p>}
      </div>
    </article>
  );
}

export default function AllEventsPage() {
  const { data: events, isLoading } = useAllEvents();

  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.startDate) >= now);
  const past = events
    .filter((e) => new Date(e.startDate) < now)
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Etkinlik takvimi
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-.05em]">
            Tüm Etkinlikler
          </h1>
          <p className="text-white/75 whitespace-nowrap">
            ASSİD tarafından düzenlenen yaklaşan ve geçmiş tüm etkinlikleri buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),1240px)] py-14">
        {isLoading ? (
          <p className="text-assid-muted">Yükleniyor...</p>
        ) : events.length === 0 ? (
          <p className="text-assid-muted">Şu anda planlanmış bir etkinlik bulunmuyor.</p>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-14">
                <h2 className="mb-6 text-[1.3rem] tracking-[-.03em] text-assid-ink">Yaklaşan Etkinlikler</h2>
                <div className="grid grid-cols-1 gap-6">
                  {upcoming.map((event) => (
                    <EventCard key={event._id} event={event} isPast={false} />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="mb-6 text-[1.3rem] tracking-[-.03em] text-assid-ink">Geçmiş Etkinlikler</h2>
                <div className="grid grid-cols-1 gap-6">
                  {past.map((event) => (
                    <EventCard key={event._id} event={event} isPast />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
