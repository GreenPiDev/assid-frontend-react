import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMembers } from "../../api/resources/members";

const SCROLL_STEP_PX = 1;
const SCROLL_INTERVAL_MS = 30;

export default function MemberLogoSlider() {
  const { data: members } = useMembers();
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);

  const logoMembers = (members ?? [])
    .filter((m) => m.logo)
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

  useEffect(() => {
    const track = trackRef.current;
    if (!track || logoMembers.length === 0) return;

    const interval = setInterval(() => {
      if (pausedRef.current) return;
      track.scrollLeft += SCROLL_STEP_PX;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 1) {
        track.scrollLeft = 0;
      }
    }, SCROLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [logoMembers.length]);

  if (logoMembers.length === 0) return null;

  // Şerit sorunsuz döngü hissi versin diye logolar iki kez arka arkaya basılıyor.
  const doubled = [...logoMembers, ...logoMembers];

  return (
    <div
      ref={trackRef}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
      className="flex items-center gap-8 overflow-x-hidden py-2"
    >
      {doubled.map((member, index) => (
        <button
          type="button"
          key={`${member.id}-${index}`}
          onClick={() => navigate(`/firma-rehberi?firma=${member.id}`)}
          title={member.name}
          className="grid h-16 w-28 flex-shrink-0 cursor-pointer place-items-center rounded-[12px] border border-white/15 bg-white/5 p-2.5 transition duration-200 hover:border-white/35 hover:bg-white/10"
        >
          <img src={member.logo} alt={member.name} className="max-h-full max-w-full object-contain" />
        </button>
      ))}
    </div>
  );
}
