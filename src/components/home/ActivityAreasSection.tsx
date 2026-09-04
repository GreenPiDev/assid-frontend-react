const ACTIVITY_AREAS = [
  {
    title: "Kurumsal Temsil ve Lobicilik",
    description:
      "Kamu kurumları, bakanlıklar ve meslek odaları nezdinde çözüm odaklı lobicilik faaliyetleriyle Siteler sanayisinin menfaatlerini temsil ederiz.",
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Dış Ticaret ve İhracat Kapasitesi",
    description:
      "Yeni pazar araştırmaları, yurt dışı ticaret heyeti organizasyonları ve uluslararası fuar katılım destekleriyle üyelerimizin ihracat hacmini artırmayı sağlıyoruz.",
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Yatırım ve Destek Mekanizmaları",
    description:
      "KOSGEB, Kalkınma Ajansları, hibe ve kredi destek programları hakkında proje geliştirme rehberliği ve bilgilendirme hizmetleri sunarak yatırım potansiyellerini maksimize ediyoruz.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Teknolojik Dönüşüm ve İnovasyon",
    description:
      "İleri imalat teknolojileri, dijitalleşme ve otomasyon konularında bilgi transferi ve stratejik yol haritası desteği sağlıyoruz.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  },
] as const;

export default function ActivityAreasSection() {
  return (
    <section className="relative bg-[#08192c] py-17 text-white md:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
        <div className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Faaliyet alanlarımız
            </div>
            <h2 className="mt-2.5 max-w-2xl text-[clamp(1.8rem,3.4vw,3rem)] leading-[1.07] tracking-[-.045em]">
              Siteler Sanayisinin Geleceği
            </h2>
          </div>
          <p className="max-w-md text-[0.95rem] leading-relaxed text-white/70">
            <b className="text-white">ASSİD</b>, lobicilikten ihracat desteğine, teknolojik dönüşümden finansal
            mekanizmalara kadar Siteler sanayisinin ihtiyaç duyduğu tüm stratejik alanlarda aktif rol almaktadır.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIVITY_AREAS.map((area) => (
            <article
              key={area.title}
              className="relative isolate flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[22px] border border-white/18 p-5.5"
            >
              <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(0deg,rgba(2,14,25,.94),rgba(2,14,25,.1)), url('${area.image}')`,
                }}
              />
              <h3 className="text-[1.1rem] leading-tight tracking-[-.03em]">{area.title}</h3>
              <p className="mt-2.5 text-[0.85rem] leading-relaxed text-white/75">{area.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
