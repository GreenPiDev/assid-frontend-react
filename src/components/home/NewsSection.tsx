import { useHomeNews } from "../../api/resources/news";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";

export default function NewsSection() {
  const showToast = useToast();
  const { data: news } = useHomeNews(3);

  if (news.length === 0) return null;

  return (
    <section className="bg-white py-17 md:py-24">
      <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
        <div className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green before:h-0.5 before:w-5 before:bg-assid-lime">
              Gündem ve duyurular
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em]">
              Derneğimizden haberler
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => showToast("Haberler yönetim panelinden yönetilecek.")}
          >
            Tüm Haberler →
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3 md:[grid-template-columns:1.18fr_.82fr_.82fr]">
          {news.map((item, index) => {
            const featured = index === 0;
            return (
              <article
                key={item._id}
                className="overflow-hidden rounded-[22px] border border-assid-line bg-white transition duration-250 hover:-translate-y-1.5 hover:shadow-card"
              >
                {item.imageUrl && (
                  <div
                    className={`bg-cover bg-center ${featured ? "h-65" : "h-42.5"}`}
                    style={{ backgroundImage: `url('${item.imageUrl}')` }}
                  />
                )}
                <div className="p-5">
                  {item.category && (
                    <small className="text-[0.72rem] font-black uppercase tracking-wide text-assid-orange">
                      {item.category}
                    </small>
                  )}
                  <h3 className={`my-2.5 leading-tight tracking-tight ${featured ? "text-[1.45rem]" : "text-[1.15rem]"}`}>
                    {item.title}
                  </h3>
                  {item.summary && <p className="m-0 text-[0.84rem] text-assid-muted">{item.summary}</p>}
                  <a href="#" className="mt-3.5 inline-flex text-[0.84rem] font-extrabold text-assid-green">
                    Haberi Oku →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
