import { Link } from "react-router-dom";
import Button from "../ui/Button";
import { scrollToId, scrollToTop } from "../../utils/scroll";

const navLinks = [
  { id: "hakkimizda", label: "Dernek" },
  { id: "firma-rehberi", label: "Firma Rehberi" },
  { id: "etkinlikler", label: "Etkinlikler" },
  { id: null, label: "Duyurular" },
  { id: "iletisim", label: "İletişim" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-assid-line/80 bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex min-h-[78px] w-[min(calc(100%-40px),1240px)] items-center gap-8">
        <button
          type="button"
          className="flex min-w-max cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left"
          onClick={scrollToTop}
          aria-label="ASSİD ana sayfa"
        >
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
        </button>
        <nav className="ml-auto hidden items-center gap-6 text-[0.89rem] font-bold text-[#405048] lg:flex" aria-label="Ana menü">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => link.id && scrollToId(link.id)}
              className="group relative cursor-pointer border-0 bg-transparent p-0 py-1.5 text-left"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-assid-lime transition-all duration-250 group-hover:w-full" />
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 lg:ml-0">
          <Button as={Link} to="/login" variant="primary">
            Kullanıcı Girişi
          </Button>
          <button className="p-2 text-assid-green lg:hidden" aria-label="Menüyü aç">
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
