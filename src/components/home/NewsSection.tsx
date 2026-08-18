import { useHomeNews } from "../../api/resources/news";
import { useToast } from "../../context/ToastContext";
import Button from "../ui/Button";

export default function NewsSection() {
  const showToast = useToast();
  const { data: news } = useHomeNews(3);

  if (news.length === 0) return null;

  return (
    <section
      id="haberler"
      className="relative scroll-mt-[78px] overflow-hidden bg-[linear-gradient(105deg,rgba(8,28,48,.97)_0%,rgba(10,35,58,.89)_53%,rgba(9,30,46,.77)_100%),url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1900&q=85')] bg-cover bg-center py-17 text-white before:pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_82%_20%,rgba(142,202,230,.34),transparent_23%),radial-gradient(circle_at_78%_85%,rgba(233,120,60,.24),transparent_24%)] md:py-24"
    >
      <div className="relative z-10 mx-auto w-[min(calc(100%-40px),1240px)]">
        <div className="mb-9 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
              Gündem ve duyurular
            </div>
            <h2 className="mt-2.5 max-w-3xl text-[clamp(2rem,4vw,3.4rem)] leading-[1.07] tracking-[-.045em] text-white">
              Sektörel Haberler ve Duyurular
            </h2>
          </div>
          <Button
            variant="light"
            onClick={() => showToast("Haberler yönetim panelinden yönetilecek.")}
          >
            Tüm Haberler →
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4.5 md:grid-cols-3">
          {news.map((item) => (
            <article
              key={item._id}
              className="flex h-full flex-col overflow-hidden rounded-[22px] border border-white/18 bg-white/9 backdrop-blur-md transition duration-250 hover:-translate-y-1.5 hover:bg-white/14"
            >
              {item.imageUrl && (
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('${item.imageUrl}')` }} />
              )}
              <div className="flex flex-1 flex-col p-5">
                {item.category && (
                  <small className="text-[0.72rem] font-black uppercase tracking-wide text-assid-orange">
                    {item.category}
                  </small>
                )}
                <h3 className="my-2.5 line-clamp-2 text-[1.2rem] leading-tight tracking-tight text-white">
                  {item.title}
                </h3>
                {item.summary && <p className="m-0 line-clamp-2 text-[0.84rem] text-white/70">{item.summary}</p>}
                <button
                  type="button"
                  className="mt-auto inline-flex w-max cursor-pointer border-0 bg-transparent p-0 pt-3.5 text-[0.84rem] font-extrabold text-assid-lime"
                >
                  Haberi Oku →
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
