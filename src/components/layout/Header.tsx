import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useOrganizationSettings } from "../../api/resources/organizationSettings";
import { goToHeroCarouselSlide, HERO_CAROUSEL_SLIDES, type HeroCarouselSlideId } from "../../utils/heroCarouselBus";
import { scrollToId, scrollToTop } from "../../utils/scroll";

const navLinks = [
  { type: "scroll", id: "etkinlikler", label: "Etkinlikler" },
  { type: "scroll", id: "firma-rehberi", label: "Firma Rehberi" },
  { type: "scroll", id: "haberler", label: "Sektörel Haberler" },
  { type: "scroll", id: "uyelik", label: "Üyelik" },
  { type: "route", to: "/contact", label: "İletişim" },
] as const;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const { data: settings } = useOrganizationSettings();
  const logoUrl = settings?.logo;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function goHome() {
    setMobileMenuOpen(false);
    if (isHome) scrollToTop();
    else navigate("/");
  }

  function goToSection(id: string) {
    setMobileMenuOpen(false);
    if (id in HERO_CAROUSEL_SLIDES) {
      if (isHome) {
        scrollToId("anasayfa");
        goToHeroCarouselSlide(id as HeroCarouselSlideId);
      } else {
        navigate("/", { state: { scrollTo: "anasayfa", heroSlide: id } });
      }
      return;
    }
    if (isHome) scrollToId(id);
    else navigate("/", { state: { scrollTo: id } });
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-transparent backdrop-blur-[2px]">
      <div className="mx-auto flex min-h-[78px] w-[min(calc(100%-40px),1240px)] items-center gap-8">
        <button
          type="button"
          className="flex min-w-max cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left"
          onClick={goHome}
          aria-label="ASSİD ana sayfa"
        >
          {logoUrl && <img src={logoUrl} alt="ASSİD logo" className="h-[43px] w-auto object-contain" />}
        </button>
        <nav className="ml-auto hidden items-center gap-6 text-[0.89rem] font-bold text-white/85 lg:flex" aria-label="Ana menü">
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link key={link.label} to={link.to} className="group relative py-1.5">
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-assid-lime transition-all duration-250 group-hover:w-full" />
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={() => goToSection(link.id)}
                className="group relative cursor-pointer border-0 bg-transparent p-0 py-1.5 text-left"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-assid-lime transition-all duration-250 group-hover:w-full" />
              </button>
            ),
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <Button as={Link} to="/login" variant="light">
            Üye Girişi
          </Button>
          <button
            type="button"
            className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-3xl leading-none text-white lg:hidden"
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav
          className="flex flex-col gap-1 border-t border-white/15 bg-[rgba(6,18,30,0.92)] px-5 py-4 text-[0.95rem] font-bold text-white backdrop-blur-md lg:hidden"
          aria-label="Mobil menü"
        >
          {navLinks.map((link) =>
            link.type === "route" ? (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-lg px-3 py-3 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={link.label}
                type="button"
                onClick={() => goToSection(link.id)}
                className="cursor-pointer rounded-lg border-0 bg-transparent px-3 py-3 text-left hover:bg-white/10"
              >
                {link.label}
              </button>
            ),
          )}
        </nav>
      )}
    </header>
  );
}
