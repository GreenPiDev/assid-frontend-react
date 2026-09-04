import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroCarousel from "../carousels/HeroCarousel";
import ActivityAreasSection from "../components/home/ActivityAreasSection";
import DirectorySection from "../components/home/DirectorySection";
import EventsSection from "../components/home/EventsSection";
import { goToHeroCarouselSlide, type HeroCarouselSlideId } from "../utils/heroCarouselBus";
import { scrollToId } from "../utils/scroll";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { scrollTo?: string; heroSlide?: HeroCarouselSlideId } | null;
    if (!state?.scrollTo) return;
    const targetId = state.scrollTo;
    const heroSlide = state.heroSlide;

    function finish() {
      scrollToId(targetId);
      if (heroSlide) goToHeroCarouselSlide(heroSlide);
      navigate(location.pathname, { replace: true, state: null });
    }

    if (document.getElementById(targetId)) {
      finish();
      return;
    }

    // Hedef bölüm (ör. etkinlikler) veri yüklenene kadar DOM'da olmayabilir;
    // DOM'a eklenir eklenmez yakalayıp scroll işlemi tamamlanır.
    const observer = new MutationObserver(() => {
      if (document.getElementById(targetId)) {
        observer.disconnect();
        window.clearTimeout(timeout);
        finish();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => observer.disconnect(), 8000);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <main>
      <HeroCarousel />
      <div className="pointer-events-none relative -mt-28 h-28 bg-gradient-to-b from-transparent to-[rgba(9,30,46,0.97)] md:-mt-36 md:h-36" />
      <EventsSection />
      <div className="pointer-events-none relative -mt-28 h-28 bg-gradient-to-b from-transparent to-[rgba(6,18,30,0.98)] md:-mt-36 md:h-36" />
      <DirectorySection />
      <ActivityAreasSection />
    </main>
  );
}
