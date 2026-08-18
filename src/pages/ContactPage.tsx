import { useOrganizationSettings } from "../api/resources/organizationSettings";

export default function ContactPage() {
  const { data: settings } = useOrganizationSettings();

  const contactItems = [
    { icon: "⌖", label: "Adres", value: settings?.address },
    { icon: "☎", label: "Telefon", value: settings?.phone },
    { icon: "✉", label: "E-posta", value: settings?.email },
  ].filter((item) => item.value);

  return (
    <main className="lg:h-full">
      <section className="flex min-h-screen items-center overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center pb-10 pt-24 text-white lg:min-h-0 lg:h-full lg:py-6">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Bize ulaşın
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.8rem,4vw,3.6rem)] leading-[1.03] tracking-[-.055em]">
            Sorularınız için buradayız.
          </h1>
          <p className="max-w-xl text-white/75">
            ASSİD ekibiyle iletişime geçmek için aşağıdaki bilgileri kullanabilirsiniz.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4.5 sm:grid-cols-3">
            {contactItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-white/18 bg-white/9 p-6.5 backdrop-blur-md"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full bg-assid-lime text-[1.1rem] text-assid-green-dark">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-[0.79rem] font-extrabold tracking-wide text-assid-lime uppercase">
                  {item.label}
                </h3>
                <p className="mt-1 text-[0.95rem] font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
