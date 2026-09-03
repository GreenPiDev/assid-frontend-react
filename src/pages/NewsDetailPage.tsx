import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAllNews } from "../api/resources/news";
import { slugify } from "../utils/slug";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}

function ImageLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-black/85 px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Kapat"
        className="absolute right-5 top-5 grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-2xl text-white hover:bg-white/20"
      >
        ✕
      </button>

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          aria-label="Önceki görsel"
          className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"
        >
          ‹
        </button>
      )}

      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-full rounded-[12px] object-contain"
      />

      {images.length > 1 && (
        <button
          type="button"
          onClick={() => onNavigate((index + 1) % images.length)}
          aria-label="Sonraki görsel"
          className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"
        >
          ›
        </button>
      )}
    </div>
  );
}

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: news, isLoading } = useAllNews();
  const item = news.find((n) => slugify(n.title) === slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <main>
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(6,18,30,.86),rgba(6,18,30,.9)),url('/assid-firma-rehberi-sehir.avif')] bg-cover bg-center pb-16 pt-32 text-white md:pb-20 md:pt-40">
        <div className="mx-auto w-[min(calc(100%-40px),900px)]">
          <Link
            to="/haberler"
            className="mb-5 inline-flex items-center gap-2 text-[0.85rem] font-bold text-assid-lime hover:underline"
          >
            ← Tüm Haberlere Dön
          </Link>
          {!isLoading && item && (
            <>
              <h1 className="my-4.5 text-[clamp(1.7rem,3.6vw,3rem)] leading-[1.08] tracking-[-.04em]">
                {item.title}
              </h1>
              {item.summary && <p className="max-w-2xl text-white/75">{item.summary}</p>}
            </>
          )}
        </div>
      </section>

      <section className="mx-auto w-[min(calc(100%-40px),900px)] py-14">
        {isLoading ? (
          <p className="text-assid-muted">Yükleniyor...</p>
        ) : !item ? (
          <p className="text-assid-muted">Haber bulunamadı.</p>
        ) : (
          <article>
            {item.content && (
              <div className="whitespace-pre-wrap text-[0.98rem] leading-relaxed text-assid-ink">{item.content}</div>
            )}

            <div className="mt-8 border-t border-assid-line pt-5 text-[0.82rem] text-assid-muted">
              {formatDate(item.publishedAt)}
            </div>

            {item.imageUrls.length > 0 && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {item.imageUrls.map((url, i) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => setLightboxIndex(i)}
                    className="cursor-pointer overflow-hidden rounded-[20px] border border-assid-line p-0"
                  >
                    <img src={url} alt={item.title} className="h-64 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </article>
        )}
      </section>

      {item && lightboxIndex !== null && (
        <ImageLightbox
          images={item.imageUrls}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </main>
  );
}
