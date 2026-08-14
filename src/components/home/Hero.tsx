import StatsBar from "./StatsBar";
import Ticker from "./Ticker";
import Button from "../ui/Button";
import { scrollToId } from "../../utils/scroll";

export default function Hero() {
  return (
    <section
      id="anasayfa"
      className="relative flex flex-col overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(183,216,87,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] after:pointer-events-none after:absolute after:-bottom-22 after:-right-16 after:h-90 after:w-90 after:rounded-full after:border-[58px] after:border-assid-lime/13 lg:min-h-[calc(100vh-78px)]"
    >
      <div className="flex flex-1 flex-col justify-center">
        <div className="relative z-10 mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-end gap-10 py-16 md:py-22 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,.75fr)]">
          <div>

            <h1 className="my-4 max-w-3xl text-[clamp(3rem,6vw,5.75rem)] leading-[.92] tracking-[-.07em]">
              Birlikte büyüyen <em>güçlü</em> bir sanayi ekosistemi.
            </h1>
            <p className="mb-7 max-w-2xl text-[clamp(1rem,1.6vw,1.17rem)] text-white/75">
              ASSİD; üyelerini, üretim gücünü ve yeni iş fırsatlarını tek bir dijital platformda buluşturur.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => scrollToId("firma-rehberi")} variant="light">
                Firma Rehberini Keşfet <span>→</span>
              </Button>
            </div>
          </div>
          <aside className="rounded-[32px] border border-white/18 bg-white/9 p-6 backdrop-blur-md">
            <span className="text-[0.75rem] font-extrabold uppercase tracking-[.12em] text-assid-lime">
              Başkanın mesajı
            </span>
            <h3 className="my-3 text-[1.55rem] leading-[1.1] tracking-tight">
              "Gücümüz, birbirimizi tanımaktan ve birlikte üretmekten gelir."
            </h3>
            <p className="m-0 text-[0.92rem] text-white/73">
              ASSİD, Ankara Siteler'in üretim ve ticaret potansiyelini dijital dünyaya taşımak için çalışır.
            </p>
            <div className="mt-5 flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,var(--color-assid-lime),#fff)] text-[0.8rem] font-black text-assid-green-dark">
                AŞ
              </span>
              <span className="text-[0.81rem] text-white/72">
                <b>ASSİD Yönetim Kurulu</b>
                <br />
                2026 Dönemi
              </span>
            </div>
          </aside>
        </div>
        <StatsBar />
      </div>
      <Ticker />
    </section>
  );
}
