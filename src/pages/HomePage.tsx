import AboutSection from "../components/home/AboutSection";
import DirectorySection from "../components/home/DirectorySection";
import EventsSection from "../components/home/EventsSection";
import Hero from "../components/home/Hero";
import JoinSection from "../components/home/JoinSection";
import NewsSection from "../components/home/NewsSection";
import Ticker from "../components/home/Ticker";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Ticker />
      <AboutSection />
      <DirectorySection />
      <EventsSection />
      <NewsSection />
      <JoinSection />
    </main>
  );
}
