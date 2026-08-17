import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useUpcomingEvents } from "../api/resources/events";
import { useOrgStats } from "../api/resources/stats";
import { useToast } from "../context/ToastContext";
import { useCarousel } from "../hooks/useCarousel";
import { formatEventDateTime, formatEventDay, formatEventMonth, formatEventTime } from "../utils/date";
import { onHeroCarouselGoTo } from "../utils/heroCarouselBus";
import { scrollToId } from "../utils/scroll";
import Button from "../components/ui/Button";

const WHEEL_LOCK_MS = 700;
// Son/ilk slayta yeni ulaşıldığında, sayfa scroll'una geçmeden önce
// kullanıcının slaytı görebilmesi için biraz daha uzun tutulur.
const BOUNDARY_HOLD_MS = 1000;
const WHEEL_SIZE = 220;
const CENTER = WHEEL_SIZE / 2;
const TEETH_RADIUS = 102;
const RIM_RADIUS = 88;
const BOLT_RADIUS = 52;
const BADGE_RADIUS = 68;
const NEEDLE_LENGTH = BADGE_RADIUS;
const TOOTH_COUNT = 20;
// Açılar, çarkın sadece sol (görünür) yarısına yayılacak şekilde seçildi.
const BADGE_ANGLES = [145, 180, 215];
const SLIDE_COUNT = 3;

function pointOnCircle(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

function HeroSlide() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] lg:h-full">
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-end gap-10 py-16 pr-24 md:py-22 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.75fr)] lg:pr-32">
          <div>
            <h1 className="my-4 max-w-3xl text-[clamp(3rem,6vw,5.75rem)] leading-[.92] tracking-[-.07em]">
              Birlikte büyüyen <em>güçlü</em> bir sanayi ekosistemi.
            </h1>
            <p className="mb-7 max-w-2xl text-[clamp(1rem,1.6vw,1.17rem)] text-white/75">
              ASSİD; üyelerini, üretim gücünü ve yeni iş fırsatlarını tek bir dijital platformda buluşturur.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => scrollToId("firma-rehberi")} variant="light">
                Firma Rehberini Keşfet <span>→</span>
              </Button>
            </div>
          </div>
          <aside className="rounded-[32px] border border-white/18 bg-white/9 p-6 backdrop-blur-md">
            <span className="text-[0.75rem] font-extrabold uppercase tracking-[.12em] text-assid-lime">
              Başkanın mesajı
            </span>
            <h3 className="my-3 text-[1.55rem] leading-[1.1] tracking-tight">
              "Gücümüz, birbirimizi tanımaktan ve birlikte üretmekten gelir."
            </h3>
            <p className="m-0 text-[0.92rem] text-white/73">
              ASSİD, Ankara Siteler'in üretim ve ticaret potansiyelini dijital dünyaya taşımak için çalışır.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-assid-lime),#fff)] text-[0.8rem] font-black text-assid-green-dark">
                AŞ
              </span>
              <span className="text-[0.81rem] text-white/72">
                <b>ASSİD Yönetim Kurulu</b>
                <br />
                2026 Dönemi
              </span>
            </div>
          </aside>
        </div>
        <HeroStats />
      </div>
    </section>
  );
}

function HeroStats() {
  const { data: stats } = useOrgStats();
  const items = [
    { label: "Aktif üye firma", value: stats ? `${stats.approvedMembersCount}` : "—" },
    { label: "Farklı sektör", value: stats ? `${stats.sectorsCount}` : "—" },
    { label: "Faaliyet alanı", value: stats ? `${stats.activityAreasCount}` : "—" },
    { label: "Etkinlik", value: stats ? `${stats.eventsCount}` : "—" },
  ];
  const borderClasses = [
    "border-b border-r border-assid-line md:border-b-0",
    "border-b border-assid-line md:border-b-0 md:border-r",
    "border-r border-assid-line",
    "",
  ];

  return (
    <div className="relative z-3 mx-auto w-[min(calc(100%-40px),1240px)] pr-24 pb-11 lg:pr-32">
      <div className="grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-card md:grid-cols-4">
        {items.map((stat, index) => (
          <div key={stat.label} className={`px-5 py-5 md:px-7 ${borderClasses[index]}`}>
            <strong className="block text-[clamp(1.75rem,3.1vw,2.65rem)] leading-none tracking-tighter text-assid-green">
              {stat.value}
            </strong>
            <span className="mt-2 block text-[0.84rem] font-semibold text-assid-muted">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsSlide() {
  const showToast = useToast();
  const { data: events } = useUpcomingEvents(4);

  if (events.length === 0) {
    return (
      <section className="flex h-full flex-col items-center justify-center bg-assid-paper py-16 text-center">
        <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
          Etkinlik takvimi
        </div>
        <h2 className="mt-2.5 max-w-2xl text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.07] tracking-[-.045em] text-assid-ink">
          Şu anda planlanmış bir etkinlik bulunmuyor.
        </h2>
      </section>
    );
  }

  const featuredEvent = events.find((e) => e.isFeatured) ?? events[0];
  const restEvents = events.filter((e) => e !== featuredEvent).slice(0, 3);

  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-17 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] md:py-24 lg:py-11">
      <div className="relative z-10 mx-auto flex h-auto w-[min(calc(100%-40px),1240px)] flex-col pr-24 lg:h-full lg:pr-32">
        <div className="mb-9 flex flex-none flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Etkinlik takvimi
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em]">
              Bir araya gelmek, yeni işlerin başlangıcıdır.
            </h2>
          </div>
          <Button variant="light" onClick={() => showToast("Etkinlik takvimi yönetim panelinden yönetilecek.")}>
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
                className="grid grid-cols-[74px_1fr_auto] items-center gap-4 rounded-[17px] border border-white/18 bg-white/9 p-4.5 backdrop-blur-md transition duration-250 hover:translate-x-1 hover:bg-white/14"
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
                <span className="hidden h-8.5 w-8.5 place-items-center rounded-full border border-white/25 text-white sm:grid">
                  →
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinSlide() {
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-15 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] lg:py-11">
      <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-center gap-10 pr-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.75fr)] lg:pr-32">
        <div>
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            ASSİD ailesine katılın
          </div>
          <h2 className="my-3.5 max-w-3xl text-[clamp(2.4rem,4.6vw,4.2rem)] leading-[1.02] tracking-[-.055em]">
            Firmanızı doğru iş bağlantılarıyla buluşturun.
          </h2>
          <p className="mb-7 max-w-lg text-[clamp(1rem,1.4vw,1.1rem)] text-white/75">
            Markanızı dijital firma rehberinde görünür kılın, yeni iş birliklerine erişin ve sektörünüzdeki
            gelişmeleri yakından takip edin.
          </p>
          <Button as={Link} to="/uyelik-basvurusu" variant="light">
            Üyelik Başvurusu <span>→</span>
          </Button>
        </div>
        <aside className="rounded-[32px] border border-white/18 bg-white/9 p-7 backdrop-blur-md md:p-8">
          <span className="text-[0.85rem] font-extrabold uppercase tracking-[.12em] text-assid-lime">
            Üyelere sunulanlar
          </span>
          <ul className="my-4 flex flex-col gap-4 text-[1.1rem] leading-snug text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-lg text-assid-lime">✓</span>
              Dijital firma rehberinde görünürlük
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-lg text-assid-lime">✓</span>
              Etkinliklere öncelikli erişim
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 text-lg text-assid-lime">✓</span>
              Sektörel iş birliği fırsatları
            </li>
          </ul>
        </aside>
      </div>
    </section>
  );
}

const SLIDES = [
  { Component: HeroSlide, label: "Anasayfa" },
  { Component: EventsSlide, label: "Etkinlikler" },
  { Component: JoinSlide, label: "Üyelik" },
];

export default function HeroCarousel() {
  const { index, next, prev, goTo } = useCarousel(SLIDE_COUNT, 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const lockUntilRef = useRef(0);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => onHeroCarouselGoTo(goTo), [goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      const goingNext = e.deltaY > 0;
      const goingPrev = e.deltaY < 0;
      if (!goingNext && !goingPrev) return;

      const curIndex = indexRef.current;
      const atLast = curIndex === SLIDE_COUNT - 1;
      const atFirst = curIndex === 0;
      const atBoundary = (goingNext && atLast) || (goingPrev && atFirst);

      const now = Date.now();
      const locked = now < lockUntilRef.current;

      if (atBoundary) {
        // Sınıra yeni ulaşıldıysa scroll'u bir süre burada tut, kullanıcı
        // slaytı görsün; süre dolduktan sonra sayfa scroll'una bırak.
        if (locked) e.preventDefault();
        return;
      }

      e.preventDefault();
      if (locked) return;

      if (goingNext) next();
      else prev();

      const landingOnBoundary = (goingNext && curIndex === SLIDE_COUNT - 2) || (goingPrev && curIndex === 1);
      lockUntilRef.current = now + (landingOnBoundary ? BOUNDARY_HOLD_MS : WHEEL_LOCK_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const teeth = Array.from({ length: TOOTH_COUNT }, (_, i) => (i * 360) / TOOTH_COUNT);
  const bolts = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  const ActiveSlide = SLIDES[index].Component;

  return (
    <div id="anasayfa" ref={containerRef} className="relative isolate scroll-mt-[78px] lg:h-[calc(100vh-78px)]">
      <div key={index} className="animate-slide-fade h-full">
        <ActiveSlide />
      </div>

      {/* Kaydırma ipucu */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-[11px] tracking-[0.14em] text-assid-ink/45 uppercase lg:left-auto lg:right-32 lg:translate-x-0">
        {index < SLIDE_COUNT - 1 ? (
          <>
            <svg className="animate-scroll-hint h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4v16m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Sonraki bölüm için kaydırın
          </>
        ) : (
          <>
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4v16m0 0l-5-5m5 5l5-5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Devam etmek için kaydırın
          </>
        )}
      </div>

      {/* Dişli çark — sağ kenarda yarım görünür */}
      <div
        className="pointer-events-none absolute top-1/2 right-0 z-20 -translate-y-1/2 translate-x-1/2"
        style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      >
        {/* Dönen dişli halkası */}
        <svg
          className="animate-gear-spin absolute inset-0"
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        >
          <defs>
            <linearGradient id="hc-steel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#123a63" />
              <stop offset="45%" stopColor="#0d2c4c" />
              <stop offset="100%" stopColor="#081f38" />
            </linearGradient>
          </defs>
          {teeth.map((angle) => (
            <rect
              key={angle}
              x={CENTER - 4}
              y={CENTER - TEETH_RADIUS - 14}
              width={8}
              height={16}
              rx={2}
              fill="url(#hc-steel)"
              stroke="rgba(255,255,255,0.14)"
              transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            />
          ))}
          <circle cx={CENTER} cy={CENTER} r={RIM_RADIUS} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
          <circle cx={CENTER} cy={CENTER} r={RIM_RADIUS - 12} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
        </svg>

        {/* Sabit göbek + cıvatalar */}
        <svg className="absolute inset-0" width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
          <defs>
            <radialGradient id="hc-hub" cx="35%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#1a4a7c" />
              <stop offset="55%" stopColor="#0d2c4c" />
              <stop offset="100%" stopColor="#081f38" />
            </radialGradient>
          </defs>
          {bolts.map((angle) => {
            const p = pointOnCircle(angle, BOLT_RADIUS);
            return <circle key={angle} cx={p.x} cy={p.y} r={3.5} fill="#081f38" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />;
          })}
          <circle cx={CENTER} cy={CENTER} r={38} fill="url(#hc-hub)" stroke="rgba(255,255,255,0.2)" strokeWidth={1.5} />
          <circle cx={CENTER} cy={CENTER} r={5} fill="#8ecae6" opacity={0.95} />
        </svg>

        {/* Aktif slaytı gösteren ibre */}
        <div
          className="absolute top-1/2 left-1/2 h-[2px] origin-left bg-gradient-to-r from-assid-lime to-transparent transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ width: NEEDLE_LENGTH, transform: `rotate(${BADGE_ANGLES[index]}deg)` }}
        />

        {/* Bölüm rozetleri */}
        {SLIDES.map((slide, i) => {
          const p = pointOnCircle(BADGE_ANGLES[i], BADGE_RADIUS);
          const isActive = i === index;
          return (
            <button
              key={slide.label}
              type="button"
              aria-label={slide.label}
              title={slide.label}
              onClick={() => goTo(i)}
              style={{ left: p.x, top: p.y }}
              className={`pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-xs font-semibold tracking-wide transition-all duration-500 ${
                isActive
                  ? "scale-110 border-assid-lime bg-assid-lime text-assid-green-dark shadow-[0_0_18px_rgba(142,202,230,0.55)]"
                  : "border-white/30 bg-assid-green-dark/90 text-white/60 hover:border-white/50 hover:text-white/90"
              }`}
            >
              0{i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
