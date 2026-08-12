import { useUpcomingEvents } from "../../api/resources/events";
import { useToast } from "../../context/ToastContext";
import { formatEventDateTime, formatEventDay, formatEventMonth, formatEventTime } from "../../utils/date";
import Button from "../ui/Button";

export default function EventsSection() {
  const showToast = useToast();
  const { data: events } = useUpcomingEvents(4);

  if (events.length === 0) return null;

  const featuredEvent = events.find((e) => e.isFeatured) ?? events[0];
  const restEvents = events.filter((e) => e !== featuredEvent).slice(0, 3);

  return (
    <section
      className="flex scroll-mt-[78px] flex-col py-17 md:py-24 lg:h-[calc(100vh-78px)] lg:py-11"
      id="etkinlikler"
    >
      <div className="mx-auto flex h-auto w-[min(calc(100%-40px),1240px)] flex-col lg:h-full">
        <div className="mb-9 flex flex-none flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
              Etkinlik takvimi
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em]">
              Bir araya gelmek, yeni işlerin başlangıcıdır.
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => showToast("Etkinlik takvimi yönetim panelinden yönetilecek.")}
          >
            Tüm Etkinlikler →
          </Button>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-6.5 lg:grid-cols-[1.12fr_.88fr]">
          <article className="relative isolate flex min-h-105 flex-col justify-end overflow-hidden rounded-[32px] p-6 text-white md:min-h-[418px] md:p-8.5 lg:min-h-0">
            <div
              className="absolute inset-0 -z-10 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(0deg,rgba(2,25,21,.94),rgba(2,25,21,.08)), url('${featuredEvent.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85"}')`,
              }}
            />
            <span className="inline-block w-max rounded-xl bg-assid-lime px-3.5 py-2.5 text-[0.78rem] font-black text-assid-green-dark">
              {formatEventDateTime(featuredEvent.startDate)}
            </span>
            <h3 className="my-4 max-w-165 text-[clamp(1.65rem,3vw,2.55rem)] leading-[1.05] tracking-[-.05em]">
              {featuredEvent.title}
            </h3>
            <p className="m-0 text-white/73">{featuredEvent.location}</p>
          </article>
          <div className="grid grid-rows-3 gap-3 lg:h-full">
            {restEvents.map((event) => (
              <article
                key={event._id}
                className="grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-[17px] border border-assid-line bg-white p-4.5 transition duration-250 hover:translate-x-1 hover:shadow-[0_12px_22px_rgba(15,77,64,.06)]"
              >
                <div className="rounded-xl bg-assid-sand px-1.5 py-2.5 text-center text-assid-green-dark">
                  <strong className="block text-[1.46rem] leading-none tracking-[-.05em]">
                    {formatEventDay(event.startDate)}
                  </strong>
                  <span className="text-[0.7rem] font-extrabold uppercase">{formatEventMonth(event.startDate)}</span>
                </div>
                <div>
                  <b className="block text-[0.97rem] tracking-tight">{event.title}</b>
                  <span className="mt-1 block text-[0.78rem] text-assid-muted">
                    {formatEventTime(event.startDate)}
                    {event.location ? ` · ${event.location}` : ""}
                  </span>
                </div>
                <span className="hidden h-8.5 w-8.5 place-items-center rounded-full border border-assid-line text-assid-green sm:grid">→</span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
