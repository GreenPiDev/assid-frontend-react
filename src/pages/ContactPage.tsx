const contactItems = [
  { icon: "⌖", label: "Adres", value: "Siteler, Altındağ / Ankara" },
  { icon: "☎", label: "Telefon", value: "+90 312 000 00 00" },
  { icon: "✉", label: "E-posta", value: "bilgi@assid.org.tr" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="py-17 md:py-24">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
            Bize ulaşın
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.03] tracking-[-.055em]">
            Sorularınız için buradayız.
          </h1>
          <p className="max-w-xl text-[#5d665f]">
            ASSİD ekibiyle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4.5 sm:grid-cols-3">
            {contactItems.map((item) => (
              <div key={item.label} className="rounded-[24px] bg-assid-sand p-6.5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-assid-green text-[1.1rem] text-white">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-[0.79rem] font-extrabold tracking-wide text-assid-green uppercase">
                  {item.label}
                </h3>
                <p className="mt-1 text-[0.95rem] font-bold text-assid-ink">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
