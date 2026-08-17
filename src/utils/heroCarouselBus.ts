// Header'daki menü linkleri, HeroCarousel'in içindeki ilgili slayta geçmesi
// için bu custom event üzerinden haberdar edilir (bileşenler arasında doğrudan
// referans olmadığı için basit bir event bus kullanılıyor).
const EVENT_NAME = "hero-carousel:goto";

export const HERO_CAROUSEL_SLIDES = {
  anasayfa: 0,
  etkinlikler: 1,
  uyelik: 2,
} as const;

export type HeroCarouselSlideId = keyof typeof HERO_CAROUSEL_SLIDES;

export function goToHeroCarouselSlide(id: HeroCarouselSlideId) {
  window.dispatchEvent(new CustomEvent<number>(EVENT_NAME, { detail: HERO_CAROUSEL_SLIDES[id] }));
}

export function onHeroCarouselGoTo(handler: (index: number) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<number>).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
