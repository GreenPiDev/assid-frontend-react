import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useOrganizationSettings } from "../../api/resources/organizationSettings";
import { goToHeroCarouselSlide, HERO_CAROUSEL_SLIDES, type HeroCarouselSlideId } from "../../utils/heroCarouselBus";
import { scrollToId, scrollToTop } from "../../utils/scroll";

const navLinks = [
  { type: "scroll", id: "etkinlikler", label: "Etkinlikler" },
  { type: "scroll", id: "firma-rehberi", label: "Firma Rehberi" },
  { type: "route", to: "/haberler", label: "Basın Odası" },
  { type: "scroll", id: "uyelik", label: "Üyelik" },
  { type: "route", to: "/iletisim", label: "İletişim" },
] as const;

const kurumsalLinks = [
  { to: "/hakkimizda", label: "Hakkımızda" },
  { to: "/baskanin-mesaji", label: "Başkanın Mesajı" },
  { to: "/dernek-yonetimi", label: "Dernek Yönetimi" },
] as const;

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/anasayfa";
  const { user } = useAuth();
  const { data: settings } = useOrganizationSettings();
  const logoUrl = settings?.logo;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileKurumsalOpen, setMobileKurumsalOpen] = useState(false);
  const [kurumsalOpen, setKurumsalOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      if (currentScrollY < 80) {
        setHidden(false);
      } else if (delta > 4) {
        setHidden(true);
      } else if (delta < -4) {
        setHidden(false);
      }

      lastScrollY.current = currentScrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function goHome() {
    setMobileMenuOpen(false);
    if (isHome) scrollToTop();
    else navigate("/anasayfa");
  }

  function goToSection(id: string) {
    setMobileMenuOpen(false);
    if (id in HERO_CAROUSEL_SLIDES) {
      if (isHome) {
        scrollToId("anasayfa");
        goToHeroCarouselSlide(id as HeroCarouselSlideId);
      } else {
        navigate("/anasayfa", { state: { scrollTo: "anasayfa", heroSlide: id }, preventScrollReset: true });
      }
      return;
    }
    if (isHome) scrollToId(id);
    else navigate("/anasayfa", { state: { scrollTo: id }, preventScrollReset: true });
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-30 bg-transparent backdrop-blur-[2px] transition-transform duration-300 ${
          hidden && !mobileMenuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
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
          <div
            className="relative py-1.5"
            onMouseEnter={() => setKurumsalOpen(true)}
            onMouseLeave={() => setKurumsalOpen(false)}
          >
            <button type="button" className="flex cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 text-left">
              Kurumsal
              <span className={`text-[0.7rem] transition-transform duration-200 ${kurumsalOpen ? "-rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            <div
              className={`absolute left-0 top-full pt-3 transition-all duration-150 ${
                kurumsalOpen ? "visible opacity-100" : "invisible opacity-0"
              }`}
            >
              <div className="min-w-[210px] rounded-[14px] border border-white/15 bg-white/10 p-2 shadow-card backdrop-blur-md">
                {kurumsalLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setKurumsalOpen(false)}
                    className="block rounded-lg px-3.5 py-2.5 text-[0.85rem] font-bold text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
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
          {user ? (
            <Button as={Link} to="/panel" variant="light">
              Yönetim Paneli
            </Button>
          ) : (
            <Button as={Link} to="/giris" variant="light">
              Üye Girişi
            </Button>
          )}
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
      </header>

      <div
        className={`fixed inset-0 top-[78px] z-30 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      <nav
        className={`fixed top-[78px] right-0 bottom-0 z-40 flex w-[78%] max-w-[320px] flex-col gap-1 overflow-y-auto bg-assid-green-dark px-5 py-5 text-[0.95rem] font-bold text-white shadow-[-8px_0_24px_rgba(0,0,0,.3)] transition-transform duration-300 lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobil menü"
      >
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => setMobileKurumsalOpen((prev) => !prev)}
            aria-expanded={mobileKurumsalOpen}
            className="flex w-full cursor-pointer items-center justify-between rounded-lg border-0 bg-transparent px-3 py-3 text-left hover:bg-white/10"
          >
            Kurumsal
            <span className={`text-[0.7rem] transition-transform duration-200 ${mobileKurumsalOpen ? "-rotate-180" : ""}`}>
              ▾
            </span>
          </button>
          <div
            className={`grid transition-all duration-200 ${mobileKurumsalOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div className="flex flex-col gap-1 overflow-hidden pl-3">
              {kurumsalLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="rounded-lg px-3 py-3 font-normal text-white/85 hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
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
    </>
  );
}
