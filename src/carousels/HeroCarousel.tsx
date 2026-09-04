import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useHomeNews } from "../api/resources/news";
import { usePresidentMessage } from "../api/resources/presidentMessage";
import { useOrgStats } from "../api/resources/stats";
import { useCarousel } from "../hooks/useCarousel";
import { onHeroCarouselGoTo } from "../utils/heroCarouselBus";
import { scrollToId } from "../utils/scroll";
import { slugify } from "../utils/slug";
import Button from "../components/ui/Button";

const WHEEL_LOCK_MS = 1300;
// Son/ilk slayta yeni ulaşıldığında, sayfa scroll'una geçmeden önce
// kullanıcının slaytı görebilmesi için biraz daha uzun tutulur.
const BOUNDARY_HOLD_MS = 1000;
const WHEEL_SIZE = 220;
const CENTER = WHEEL_SIZE / 2;
const TEETH_RADIUS = 102;
const RIM_RADIUS = 88;
const BOLT_RADIUS = 52;
const BADGE_RADIUS = 68;
const TOOTH_COUNT = 20;
// hero-wheel-exit/enter keyframe süresiyle (index.css) birebir eşleşmeli.
const WHEEL_TRANSITION_MS = 650;
// Rozetler arası açı farkı — çarkın sadece sağ (görünür) yarısına yayılır.
const BADGE_STEP = 35;
const SLIDE_COUNT = 3;

function pointOnCircle(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

// Rozetlerin sırası (01→02→03) hiçbir zaman bozulmaz; sanki sabit aralıklı
// bir cetvel üzerindeymiş gibi her rozetin "ev" açısı i*BADGE_STEP'tir ve
// aktif slayt değiştikçe bütün cetvel bu kadar kayar (döngüsel sarma yok).
// Böylece 01 aktifken 02/03 onun altında, 03 aktifken 01/02 onun üstünde
// sırayla dizilir; sadece ortadaki (aktif) her zaman merkezde (0°) kalır.
function badgeAngle(badgeIndex: number, activeIndex: number) {
  return (badgeIndex - activeIndex) * BADGE_STEP;
}

function HeroSlide() {
  const { data: presidentMessage } = usePresidentMessage();

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] lg:h-full lg:min-h-0">
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-end gap-10 py-16 md:py-22 md:pl-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.75fr)] lg:items-stretch lg:pl-32">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Firma Rehberi
            </div>
            <h1 className="my-4 max-w-3xl text-[clamp(2rem,8vw,3rem)] leading-[.98] tracking-[-.04em] lg:text-[clamp(3rem,6vw,5.75rem)] lg:leading-[.92] lg:tracking-[-.07em]">
              Birlikte büyüyen <em>güçlü</em> bir sanayi ekosistemi.
            </h1>
            <p className="mb-7 max-w-2xl text-[clamp(.85rem,3.6vw,1rem)] text-white/75 lg:text-[clamp(1rem,1.6vw,1.17rem)]">
              ASSİD; üyelerini, üretim gücünü ve yeni iş fırsatlarını tek bir dijital platformda buluşturuyor..
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => scrollToId("firma-rehberi")} variant="light">
                Firma Rehberini Keşfet <span>→</span>
              </Button>
            </div>
          </div>
          <aside className="relative flex flex-col items-end justify-between gap-4 overflow-hidden rounded-[32px] border border-white/18 bg-white/9 p-5 text-right backdrop-blur-md lg:gap-6 lg:p-8">
            {presidentMessage?.image && (
              <img
                src={presidentMessage.image}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 h-full w-[65%] object-cover object-left-top opacity-45"
                style={{
                  left: "-10%",
                  maskImage: "linear-gradient(to right, rgba(0,0,0,.85), transparent 92%)",
                  WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,.85), transparent 92%)",
                }}
              />
            )}
            <div className="relative z-10">
              <span className="text-[0.75rem] font-extrabold uppercase tracking-[.12em] text-assid-lime">
                Başkanın mesajı
              </span>
              <h3 className="mt-4 mb-4 text-[1.3rem] leading-[1.2] tracking-tight lg:text-[1.7rem] lg:leading-[1.15]">
                "Siteler, Türkiye mobilya, dekorasyon ve imalat sektörünün köklü ve stratejik üretim üssüdür."
              </h3>
              <p className="m-0 text-[0.95rem] text-white/73">
                ASSİD olarak, bu gücü ortak akıl ve kolektif bir vizyonla yönetme sorumluluğunu üstleniyoruz.
              </p>
              <Link
                to="/baskanin-mesaji"
                className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-assid-lime transition hover:text-white"
              >
                Devamını oku <span>→</span>
              </Link>
            </div>
            <div className="relative z-10 text-[0.81rem] text-white/72">
              <b className="text-white">Koray Durşen</b>
              <br />
              ASSİD Yönetim Kurulu Başkanı
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
    <div className="relative z-3 mx-auto w-[min(calc(100%-40px),1240px)] pb-11 md:pl-24 lg:pl-32">
      <div className="grid grid-cols-2 overflow-hidden rounded-[22px] bg-white shadow-card md:grid-cols-4">
        {items.map((stat, index) => (
          <div key={stat.label} className={`px-5 py-5 text-center md:px-7 ${borderClasses[index]}`}>
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

function NewsSlide() {
  const { data: news } = useHomeNews(14);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = news[activeIndex] ?? news[0];

  if (news.length === 0) {
    return (
      <section className="flex h-full flex-col items-center justify-center bg-assid-paper py-16 text-center">
        <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
          Gündem ve duyurular
        </div>
        <h2 className="mt-2.5 max-w-2xl text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.07] tracking-[-.045em] text-assid-ink">
          Şu anda yayınlanmış bir haber bulunmuyor.
        </h2>
      </section>
    );
  }

  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-17 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] md:py-24">
      <div className="relative z-10 mx-auto w-[min(calc(100%-40px),1240px)] md:pl-24 lg:pl-32">
        <div className="mb-9">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Ankara Siteler Sanayici ve İş İnsanları Derneği
          </div>
          <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em] text-white">
            Derneğimizden Haberler
          </h2>
          <p className="mt-2.5 max-w-2xl text-[clamp(.78rem,1.6vw,1.17rem)] text-white/75 md:max-w-none md:whitespace-nowrap">
            ASSİD, Siteler Bölgesi sanayisinin kalitesini ve rekabet gücünü temsil eden 1200'den fazla aktif üyeyi çatısı altında birleştirmektedir.
          </p>
        </div>
        <div className="relative mb-4 h-[340px] overflow-hidden rounded-[22px] border border-white/18 bg-white/9 md:h-[520px]">
          <Link to={`/haberler/${slugify(active.title)}`} className="absolute inset-0">
            <div key={active._id} className="absolute inset-0 animate-slide-fade">
              {active.imageUrls[0] && (
                <div
                  className="absolute inset-0 bg-cover bg-top"
                  style={{ backgroundImage: `url('${active.imageUrls[0]}')` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-20 p-6 md:bottom-24 md:max-w-lg md:p-8">
                <h3 className="text-[clamp(1.3rem,2.6vw,2rem)] leading-tight tracking-tight text-white">
                  {active.title}
                </h3>
                {active.summary && (
                  <p className="mt-2.5 line-clamp-2 text-[0.9rem] text-white/75">{active.summary}</p>
                )}
              </div>
            </div>
          </Link>
          {activeIndex > 0 && (
            <button
              type="button"
              aria-label="Önceki haber"
              onClick={() => setActiveIndex((i) => i - 1)}
              className="absolute top-[40%] left-4 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
            >
              <span>←</span>
            </button>
          )}
          {activeIndex < news.length - 1 && (
            <button
              type="button"
              aria-label="Sonraki haber"
              onClick={() => setActiveIndex((i) => i + 1)}
              className="absolute top-[40%] right-4 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/55"
            >
              <span>→</span>
            </button>
          )}
          <div className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
            <div className="flex flex-1 gap-2.5 overflow-hidden">
              {news.map((item, index) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded-[12px] border bg-cover bg-center transition ${
                    index === activeIndex
                      ? "border-assid-lime"
                      : "border-white/18 opacity-60 hover:opacity-100"
                  }`}
                  style={item.imageUrls[0] ? { backgroundImage: `url('${item.imageUrls[0]}')` } : undefined}
                  title={item.title}
                  aria-label={item.title}
                />
              ))}
            </div>
            <Button as={Link} to="/haberler" variant="light" className="flex-shrink-0">
              Tüm Haberler →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function JoinSlide() {
  return (
    <section className="relative flex h-full flex-col justify-center overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-15 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] lg:py-11">
      <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-center gap-10 md:pl-24 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.75fr)] lg:pl-32">
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
  { Component: NewsSlide, label: "Haberler" },
  { Component: HeroSlide, label: "Anasayfa" },
  { Component: JoinSlide, label: "Üyelik" },
];

// Slaytı, çark göbeğine (sol kenar) menteşelenmiş bir kart gibi döndürerek
// değiştirir. İleri gidilirken (index büyüyor) mevcut slayt sol üste doğru
// çıkar, yenisi alttan takip ederek gelir; geri gidilirken (index küçülüyor)
// yön tersine döner — mevcut slayt aşağı gider, yenisi sol üstten gelir.
function useWheelTransition(index: number) {
  const [displayed, setDisplayed] = useState(index);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (index === displayed) return;
    setDirection(index > displayed ? "forward" : "backward");
    setIncoming(index);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDisplayed(index);
      setIncoming(null);
    }, WHEEL_TRANSITION_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return { displayed, incoming, direction };
}

export default function HeroCarousel() {
  const { index, next, prev, goTo } = useCarousel(SLIDE_COUNT, 0);
  const { displayed, incoming, direction } = useWheelTransition(index);
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  indexRef.current = index;

  useEffect(() => onHeroCarouselGoTo(goTo), [goTo]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let lockUntil = 0;

    const onWheel = (e: WheelEvent) => {
      // Sayfa tepede değilse (kullanıcı zaten aşağı inmiş, hero'nun sadece
      // bir kısmı görünüyor olabilir) imleç nerede olursa olsun normal
      // sayfa scroll'u işlesin; karusel yalnızca sayfanın tam en üstünde
      // (scrollY 0) iken scroll'u yakalayıp slayt değiştirsin.
      if (window.scrollY > 1) return;

      const goingNext = e.deltaY > 0;
      const goingPrev = e.deltaY < 0;
      if (!goingNext && !goingPrev) return;

      const curIndex = indexRef.current;
      const atLast = curIndex === SLIDE_COUNT - 1;
      const atFirst = curIndex === 0;
      const atBoundary = (goingNext && atLast) || (goingPrev && atFirst);

      const now = Date.now();
      const locked = now < lockUntil;

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
      lockUntil = now + (landingOnBoundary ? BOUNDARY_HOLD_MS : WHEEL_LOCK_MS);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const teeth = Array.from({ length: TOOTH_COUNT }, (_, i) => (i * 360) / TOOTH_COUNT);
  const bolts = Array.from({ length: 8 }, (_, i) => (i * 360) / 8);
  const DisplayedSlide = SLIDES[displayed].Component;
  const IncomingSlide = incoming !== null ? SLIDES[incoming].Component : null;

  return (
    <div id="anasayfa" ref={containerRef} className="relative isolate h-screen scroll-mt-[78px] overflow-hidden">
      <div className="relative h-full overflow-hidden">
        <div
          className={`absolute inset-0 h-full ${
            incoming !== null ? (direction === "forward" ? "animate-hero-wheel-exit-up" : "animate-hero-wheel-exit-down") : ""
          }`}
        >
          <DisplayedSlide />
        </div>
        {IncomingSlide && (
          <div
            key={incoming}
            className={`absolute inset-0 z-10 h-full ${
              direction === "forward" ? "animate-hero-wheel-enter-from-below" : "animate-hero-wheel-enter-from-corner"
            }`}
          >
            <IncomingSlide />
          </div>
        )}
      </div>

      {/* Kaydırma ipucu */}
      {index < SLIDE_COUNT - 1 ? (
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 text-[11px] tracking-[0.14em] text-assid-ink/45 uppercase lg:left-auto lg:right-32 lg:translate-x-0">
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
        </div>
      ) : (
        <div className="animate-hero-hint-bounce pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 text-[15px] font-normal tracking-[0.18em] text-white uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]">
          Devam etmek için aşağı kaydırın
        </div>
      )}

      {/* Dişli çark — masaüstünde sol kenarda, mobilde alt kenarda yarım görünür */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-20 -translate-x-1/2 translate-y-1/2 -rotate-90 md:top-1/2 md:left-0 md:bottom-auto md:-translate-x-1/2 md:-translate-y-1/2 md:rotate-0"
        style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      >
        {/* Dişli halkası — artık kendi kendine sürekli dönmüyor; rozetlerle
            birlikte, aynı yönde ve aynı miktarda dönerek gerçek bir çark
            hissi veriyor. */}
        <svg
          className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
          style={{ transform: `rotate(${-index * BADGE_STEP}deg)` }}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
        >
          <defs>
            <linearGradient id="hc-steel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7a8390" />
              <stop offset="45%" stopColor="#565e69" />
              <stop offset="100%" stopColor="#3a4048" />
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

        {/* Bölüm rozetleri — aktif slayta göre çark üzerinde konum değiştirir.
            Ön-arka sırası (z-index) sabittir: 01 her zaman en önde, 03 en
            arkada; dönerken yalnızca açısal konumları değişir. */}
        {SLIDES.map((slide, i) => {
          const p = pointOnCircle(badgeAngle(i, index), BADGE_RADIUS);
          const isActive = i === index;
          return (
            <button
              key={slide.label}
              type="button"
              aria-label={slide.label}
              title={slide.label}
              onClick={() => goTo(i)}
              style={{ left: p.x, top: p.y, zIndex: SLIDE_COUNT - i }}
              className={`pointer-events-auto absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 rotate-90 items-center justify-center rounded-full border text-xs font-semibold tracking-wide transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] md:rotate-0 ${
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
