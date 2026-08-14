import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DirectorySection from "../components/home/DirectorySection";
import EventsSection from "../components/home/EventsSection";
import Hero from "../components/home/Hero";
import JoinSection from "../components/home/JoinSection";
import NewsSection from "../components/home/NewsSection";
import { scrollToId } from "../utils/scroll";

export default function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (!scrollTo) return;
    scrollToId(scrollTo);
    navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <main>
      <Hero />
      <EventsSection />
      <DirectorySection />
      <NewsSection />
      <JoinSection />
    </main>
  );
}
