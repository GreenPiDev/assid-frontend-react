import { useNavigate } from "react-router-dom";
import type { Sector } from "../../types";

export default function SectorCard({ sector }: { sector: Sector }) {
  const navigate = useNavigate();

  return (
    <article
      className="group relative isolate flex cursor-pointer items-center justify-center overflow-hidden rounded-[22px] p-3.5 text-center transition duration-250 hover:-translate-y-1 hover:shadow-card"
      onClick={() => navigate(`/firma-rehberi?sektor=${sector.slug}`)}
    >
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(6,18,30,.66),rgba(6,18,30,.32))] bg-cover bg-center transition-transform duration-450 ease-out group-hover:scale-107"
        style={{ backgroundImage: `linear-gradient(to top, rgba(6,18,30,.66), rgba(6,18,30,.32)), url('${sector.image}')` }}
      />
      <h3 className="m-0 text-[clamp(.82rem,1.1vw,1rem)] tracking-tight text-white">{sector.name}</h3>
    </article>
  );
}
