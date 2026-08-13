import Button from "../ui/Button";
import { scrollToId } from "../../utils/scroll";

const features = [
  "Kurumsal tanıtım ve iletişim merkezi",
  "Dijital firma rehberi ve sektör filtreleme",
  "Üyelere özel B2B iş geliştirme alanı",
  "Etkinlik, duyuru, teklif ve CRM altyapısı",
];

export default function AboutSection() {
  return (
    <section
      className="flex scroll-mt-[78px] flex-col justify-center py-17 md:py-24 lg:min-h-[calc(100vh-78px)] lg:py-0"
      id="hakkimizda"
    >
      <div className="mx-auto grid w-[min(calc(100%-40px),1240px)] grid-cols-1 items-stretch gap-8.5 md:grid-cols-2">
        <div className="rounded-[32px] bg-assid-sand p-8 md:p-11">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
            ASSİD hakkında
          </div>
          <h2 className="my-4.5 text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.03] tracking-[-.055em]">
            Sanayinin birikimini, geleceğin fırsatlarıyla buluşturuyoruz.
          </h2>
          <p className="max-w-xl text-[#5d665f]">
            Kurumsal kimliği güçlendiren, firmaları görünür kılan ve üyeler arası ekonomik
            etkileşimi artıran yaşayan bir dijital platform tasarlanmıştır.
          </p>
          <ul className="my-7 grid gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 text-[0.93rem] font-bold">
                <i className="grid h-5.5 w-5.5 place-items-center rounded-full bg-assid-green text-[0.76rem] not-italic text-assid-lime">
                  ✓
                </i>
                {feature}
              </li>
            ))}
          </ul>
          <Button onClick={() => scrollToId("b2b")} variant="primary">
            Platformu İncele <span>→</span>
          </Button>
        </div>
        <div className="relative min-h-[360px] overflow-hidden rounded-[32px] bg-[linear-gradient(15deg,rgba(9,30,46,.74),rgba(9,30,46,.06)),url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center md:min-h-[470px]">
          <div className="absolute inset-x-6 bottom-6 rounded-[20px] border border-white/24 bg-[rgba(10,35,58,.55)] p-6 text-white backdrop-blur-md">
            <p className="m-0 text-[1.13rem] leading-snug tracking-tight">
              "Sadece görünür olmak değil, birbirimize ulaşabilmek ve birlikte iş geliştirebilmek
              istiyoruz."
            </p>
            <small className="mt-3 block font-extrabold text-assid-lime">ASSİD Dijital Dönüşüm Vizyonu</small>
          </div>
        </div>
      </div>
    </section>
  );
}
