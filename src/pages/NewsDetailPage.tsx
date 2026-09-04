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
  const itemIndex = news.findIndex((n) => slugify(n.title) === slug);
  const item = itemIndex >= 0 ? news[itemIndex] : undefined;
  const prevItem = itemIndex > 0 ? news[itemIndex - 1] : undefined;
  const nextItem = itemIndex >= 0 && itemIndex < news.length - 1 ? news[itemIndex + 1] : undefined;
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

            {(prevItem || nextItem) && (
              <div className="mt-10 grid grid-cols-1 gap-4 border-t border-assid-line pt-8 sm:grid-cols-2">
                {prevItem ? (
                  <Link
                    to={`/haberler/${slugify(prevItem.title)}`}
                    className="group flex items-center gap-3.5 overflow-hidden rounded-[16px] border border-assid-line p-3 transition hover:border-assid-green/40"
                  >
                    {prevItem.imageUrls[0] && (
                      <img
                        src={prevItem.imageUrls[0]}
                        alt=""
                        className="h-16 w-20 flex-shrink-0 rounded-[10px] object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="block text-[0.72rem] font-bold uppercase tracking-[.1em] text-assid-muted">
                        ← Önceki Haber
                      </span>
                      <span className="mt-1 block truncate text-[0.9rem] font-bold text-assid-ink group-hover:text-assid-green">
                        {prevItem.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}
                {nextItem && (
                  <Link
                    to={`/haberler/${slugify(nextItem.title)}`}
                    className="group flex items-center gap-3.5 overflow-hidden rounded-[16px] border border-assid-line p-3 text-right transition hover:border-assid-green/40 sm:flex-row-reverse"
                  >
                    {nextItem.imageUrls[0] && (
                      <img
                        src={nextItem.imageUrls[0]}
                        alt=""
                        className="h-16 w-20 flex-shrink-0 rounded-[10px] object-cover"
                      />
                    )}
                    <div className="min-w-0">
                      <span className="block text-[0.72rem] font-bold uppercase tracking-[.1em] text-assid-muted">
                        Sonraki Haber →
                      </span>
                      <span className="mt-1 block truncate text-[0.9rem] font-bold text-assid-ink group-hover:text-assid-green">
                        {nextItem.title}
                      </span>
                    </div>
                  </Link>
                )}
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
