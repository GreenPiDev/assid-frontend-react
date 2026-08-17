import { SECTORS } from "../../constants/sectors";

// Kesintisiz kayan görünüm için liste iki kez tekrarlanır.
const items = [...SECTORS, ...SECTORS];

export default function Ticker() {
  return (
    <div className="overflow-hidden bg-assid-lime font-extrabold tracking-tight text-assid-green-dark" aria-label="Öne çıkan alanlar">
      <div className="flex w-max animate-ticker">
        {items.map((sector, index) => (
          <span
            key={`${sector.slug}-${index}`}
            className="inline-flex items-center gap-6 whitespace-nowrap px-7 py-4.5 after:text-[.8rem] after:opacity-75 after:content-['✦']"
          >
            {sector.name}
          </span>
        ))}
      </div>
    </div>
  );
}
