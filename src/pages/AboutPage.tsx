import { useAboutPage } from "../api/resources/aboutPage";

export default function AboutPage() {
  const { data: about } = useAboutPage();

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Kurumsal
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-.05em]">
            {about?.title || "Hakkımızda"}
          </h1>
          <p className="text-white/75 whitespace-nowrap">
            {about?.subtitle || "Siteler Sanayisinin Kurumsal Gücü"}
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),1240px)] py-14">
        <div className="grid gap-5 text-[0.98rem] leading-relaxed text-assid-muted">
          {about?.bodyParagraph1 && <p>{about.bodyParagraph1}</p>}
          {about?.bodyParagraph2 && <p>{about.bodyParagraph2}</p>}
        </div>

        {(about?.visionText || about?.missionText) && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {about?.visionText && (
              <div className="rounded-[24px] border border-assid-line bg-assid-paper p-7 md:p-8">
                <h2 className="text-[1.15rem] tracking-[-.02em] text-assid-green">Vizyon</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-assid-muted">{about.visionText}</p>
              </div>
            )}
            {about?.missionText && (
              <div className="rounded-[24px] border border-assid-line bg-assid-paper p-7 md:p-8">
                <h2 className="text-[1.15rem] tracking-[-.02em] text-assid-green">Misyon</h2>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-assid-muted">{about.missionText}</p>
              </div>
            )}
          </div>
        )}

        {(about?.image1 || about?.image2) && (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {about?.image1 && (
              <div className="h-64 overflow-hidden rounded-[24px] border border-assid-line">
                <img src={about.image1} alt={about.title || "ASSİD"} className="h-full w-full object-cover" />
              </div>
            )}
            {about?.image2 && (
              <div className="h-64 overflow-hidden rounded-[24px] border border-assid-line">
                <img src={about.image2} alt={about.title || "ASSİD"} className="h-full w-full object-cover" />
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
