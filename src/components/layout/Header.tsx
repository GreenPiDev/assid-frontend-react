import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { useToast } from "../../context/ToastContext";

const navLinks = [
  { href: "#hakkimizda", label: "Dernek" },
  { href: "#firma-rehberi", label: "Firma Rehberi" },
  { href: "#etkinlikler", label: "Etkinlikler" },
  { href: "#", label: "Duyurular" },
  { href: "#iletisim", label: "İletişim" },
];

export default function Header() {
  const showToast = useToast();

  return (
    <header className="sticky top-0 z-30 border-b border-assid-line/80 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex min-h-[78px] w-[min(calc(100%-40px),1240px)] items-center gap-8">
        <a className="flex min-w-max items-center gap-2.5" href="#anasayfa" aria-label="ASSİD ana sayfa">
          <span className="relative grid h-[43px] w-[43px] place-items-center overflow-hidden rounded-full bg-assid-green text-base font-black tracking-tighter text-white">
            A
            <span className="absolute -right-3.5 -top-2.5 h-7 w-7 rounded-full border-[3px] border-assid-lime" />
          </span>
          <span>
            <b className="block text-base leading-none tracking-tight">ASSİD</b>
            <small className="mt-1 block text-[0.58rem] tracking-wide text-assid-muted">
              ANKARA SİTELER SANAYİCİ VE İŞ İNSANLARI DERNEĞİ
            </small>
          </span>
        </a>
        <nav className="ml-auto hidden items-center gap-6 text-[0.89rem] font-bold text-[#405048] lg:flex" aria-label="Ana menü">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative py-1.5"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-assid-lime transition-all duration-250 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <span className="hidden sm:block">
            <Button as={Link} to="/firma-rehberi" variant="outline">
              Firma Ara
            </Button>
          </span>
          <Button
            variant="primary"
            onClick={() => showToast("Üyelik başvuru sayfası WordPress formuna bağlanacak.")}
          >
            Üye Ol <span>↗</span>
          </Button>
          <button className="p-2 text-assid-green lg:hidden" aria-label="Menüyü aç">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
