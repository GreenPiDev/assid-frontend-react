import { useState } from "react";
import { Link } from "react-router-dom";
import { useUpcomingEvents } from "../../api/resources/events";
import type { BackendEvent } from "../../api/client";
import { formatEventDateTime, formatEventDay, formatEventMonth, formatEventTime } from "../../utils/date";
import Button from "../ui/Button";

function EventModal({ event, onClose }: { event: BackendEvent; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-black/70 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[24px] bg-white shadow-card">
        <div
          className="relative h-56 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(0deg,rgba(2,25,21,.85),rgba(2,25,21,.05)), url('${event.imageUrl || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85"}')`,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-white/20 text-lg text-white hover:bg-white/30"
          >
            ✕
          </button>
          <span className="absolute bottom-5 left-6 inline-block w-max rounded-xl bg-assid-lime px-3.5 py-2.5 text-[0.78rem] font-black text-assid-green-dark">
            {formatEventDateTime(event.startDate)}
          </span>
        </div>
        <div className="p-6 md:p-7">
          <h3 className="text-[1.4rem] leading-tight tracking-[-.03em] text-assid-ink">{event.title}</h3>
          {event.location && <p className="mt-2 text-[0.92rem] text-assid-muted">{event.location}</p>}
          {event.description && (
            <p className="mt-4 whitespace-pre-wrap text-[0.94rem] leading-relaxed text-assid-ink">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EventsSection() {
  const { data: events } = useUpcomingEvents(4);
  const [selectedEvent, setSelectedEvent] = useState<BackendEvent | null>(null);

  if (events.length === 0) return null;

  const [featuredEvent, ...restEvents] = events;

  return (
    <section
      id="etkinlikler"
      className="relative scroll-mt-[78px] overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-17 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] md:py-24"
    >
      <div className="relative z-10 mx-auto w-[min(calc(100%-40px),1240px)]">
        <div className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Etkinlik takvimi
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em]">
              Bir araya gelmek, yeni işlerin başlangıcıdır.
            </h2>
          </div>
          <Button as={Link} to="/tum-etkinlikler" variant="light">
            Tüm Etkinlikler →
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-6.5 lg:grid-cols-[1.12fr_.88fr]">
          <article
            onClick={() => setSelectedEvent(featuredEvent)}
            className="relative isolate flex min-h-80 cursor-pointer flex-col justify-end overflow-hidden rounded-[32px] p-6 text-white md:min-h-[320px] md:p-8.5 lg:h-[340px] lg:min-h-0"
          >
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
          <div className="grid grid-rows-3 gap-2.5 lg:h-[340px]">
            {restEvents.map((event) => (
              <article
                key={event._id}
                onClick={() => setSelectedEvent(event)}
                className="grid cursor-pointer grid-cols-[74px_1fr] items-center gap-4 rounded-[17px] border border-white/18 bg-white/9 p-4.5 backdrop-blur-md transition duration-250 hover:translate-x-1 hover:bg-white/14"
              >
                <div className="rounded-xl bg-assid-lime/90 px-1.5 py-2.5 text-center text-assid-green-dark">
                  <strong className="block text-[1.46rem] leading-none tracking-[-.05em]">
                    {formatEventDay(event.startDate)}
                  </strong>
                  <span className="text-[0.7rem] font-extrabold uppercase">{formatEventMonth(event.startDate)}</span>
                </div>
                <div>
                  <b className="block text-[0.97rem] tracking-tight">{event.title}</b>
                  <span className="mt-1 block text-[0.78rem] text-white/65">
                    {formatEventTime(event.startDate)}
                    {event.location ? ` · ${event.location}` : ""}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </section>
  );
}
