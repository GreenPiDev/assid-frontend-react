import AboutSection from "../components/home/AboutSection";
import DirectorySection from "../components/home/DirectorySection";
import EventsSection from "../components/home/EventsSection";
import Hero from "../components/home/Hero";
import JoinSection from "../components/home/JoinSection";
import NewsSection from "../components/home/NewsSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <DirectorySection />
      <EventsSection />
      <NewsSection />
      <JoinSection />
    </main>
  );
}
