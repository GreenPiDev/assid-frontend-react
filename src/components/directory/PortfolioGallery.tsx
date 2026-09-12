import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PortfolioGallery({ slides }: { slides: string[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!slides || slides.length === 0) return <span>—</span>;

  return (
    <>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {slides.map((url, index) => (
          <button
            type="button"
            key={url}
            onClick={() => setLightboxIndex(index)}
            className="aspect-square cursor-pointer overflow-hidden rounded-[10px] border border-white/25 transition duration-200 hover:border-white/55"
          >
            <img src={url} alt={`Slayt ${index + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <Lightbox
        open={lightboxIndex !== null}
        close={() => setLightboxIndex(null)}
        index={lightboxIndex ?? 0}
        slides={slides.map((src) => ({ src }))}
      />
    </>
  );
}
