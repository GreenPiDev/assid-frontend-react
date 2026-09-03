import { Link } from "react-router-dom";
import { useAllNews } from "../api/resources/news";
import { slugify } from "../utils/slug";
import type { BackendNews } from "../api/client";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function NewsCard({ item }: { item: BackendNews }) {
  return (
    <Link
      to={`/haberler/${slugify(item.title)}`}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-assid-line bg-white transition duration-200 hover:-translate-y-1 hover:shadow-card"
    >
      <div
        className="h-40 bg-cover bg-center"
        style={{
          backgroundImage: `url('${item.imageUrls[0] || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=85"}')`,
        }}
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-[0.76rem] text-assid-muted">{formatDate(item.publishedAt)}</span>
        <h3 className="line-clamp-2 text-[1.02rem] leading-tight tracking-[-.01em] text-assid-ink">{item.title}</h3>
        {item.summary && <p className="line-clamp-2 text-[0.82rem] text-assid-muted">{item.summary}</p>}
      </div>
    </Link>
  );
}

export default function AllNewsPage() {
  const { data: news, isLoading } = useAllNews();

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),1240px)]">
          <div className="inline-flex items-center gap-2 text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-lime before:h-0.5 before:w-5 before:bg-assid-lime">
            Gündem ve duyurular
          </div>
          <h1 className="my-4.5 max-w-2xl text-[clamp(1.9rem,4vw,3.4rem)] leading-[1.05] tracking-[-.05em]">
            Dernek Haberleri
          </h1>
          <p className="text-white/75 whitespace-nowrap">
            ASSİD tarafından paylaşılan tüm haber ve duyuruları buradan takip edebilirsiniz.
          </p>
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),1240px)] py-14">
        {isLoading ? (
          <p className="text-assid-muted">Yükleniyor...</p>
        ) : news.length === 0 ? (
          <p className="text-assid-muted">Şu anda yayında bir haber bulunmuyor.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((item) => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
