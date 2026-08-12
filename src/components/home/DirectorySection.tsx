import { Link } from "react-router-dom";
import { SECTORS } from "../../constants/sectors";
import Button from "../ui/Button";
import MemberSearch from "./MemberSearch";
import SectorCard from "./SectorCard";

export default function DirectorySection() {
  return (
    <section
      id="firma-rehberi"
      className="relative flex h-auto scroll-mt-[78px] flex-col bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center py-17 text-white lg:h-[calc(100vh-78px)] lg:py-5.5"
    >
      <div className="mx-auto flex h-auto w-[min(calc(100%-40px),1240px)] flex-col lg:h-full">
        <div className="mb-5 flex items-end justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Dijital firma rehberi
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(1.5rem,2.6vw,2.35rem)] leading-[1.07] tracking-[-.045em] text-white">
              İhtiyacınız olan üreticiye, tedarikçiye veya iş ortağına ulaşın.
            </h2>
          </div>
        </div>
        <div className="mb-4.5 flex flex-wrap items-start gap-3">
          <MemberSearch />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 [grid-auto-rows:1fr] md:grid-cols-3 lg:grid-cols-5">
          {SECTORS.map((sector) => (
            <SectorCard sector={sector} key={sector.slug} />
          ))}
        </div>
        <div className="mt-4.5 flex justify-center">
          <Button as={Link} to="/firma-rehberi" variant="primary">
            Tüm Firmaları Görüntüle <span>→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
