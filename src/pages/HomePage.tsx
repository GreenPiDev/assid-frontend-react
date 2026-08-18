import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroCarousel from "../carousels/HeroCarousel";
import DirectorySection from "../components/home/DirectorySection";
import NewsSection from "../components/home/NewsSection";
import { goToHeroCarouselSlide, type HeroCarouselSlideId } from "../utils/heroCarouselBus";
import { scrollToId } from "../utils/scroll";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as { scrollTo?: string; heroSlide?: HeroCarouselSlideId } | null;
    if (!state?.scrollTo) return;
    scrollToId(state.scrollTo);
    if (state.heroSlide) goToHeroCarouselSlide(state.heroSlide);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <main>
      <HeroCarousel />
      <div className="pointer-events-none relative -mt-28 h-28 bg-gradient-to-b from-transparent to-[rgba(6,18,30,0.98)] md:-mt-36 md:h-36" />
      <DirectorySection />
      <div className="pointer-events-none relative -mt-28 h-28 bg-gradient-to-b from-transparent to-[rgba(9,30,46,0.97)] md:-mt-36 md:h-36" />
      <NewsSection />
    </main>
  );
}
