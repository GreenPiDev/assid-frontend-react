import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMemberById, useMembersBySector } from "../api/resources/members";
import MemberModal from "../components/directory/MemberModal";
import FilterPanel from "../components/directory/FilterPanel";
import MapView from "../components/directory/MapView";
import { SECTORS } from "../constants/sectors";
import type { Member } from "../types";
import { getActivityAreasForMembers, getSectorName } from "../utils/directory";

const sectorItems = SECTORS.map((s) => ({ value: s.slug, label: s.name }));

export default function FirmaRehberiPage() {
  const [searchParams] = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentSector, setCurrentSector] = useState<string | null>(null);
  const [currentActivity, setCurrentActivity] = useState("");
  const [modalMember, setModalMember] = useState<Member | null>(null);
  const initialized = useRef(false);

  const { data: membersInSector } = useMembersBySector(currentSector);

  const memberIdParam = searchParams.get("firma");
  const { data: requestedMember } = useMemberById(memberIdParam);

  function selectSector(slug: string) {
    setCurrentSector(slug);
    setCurrentActivity("");
  }

  function openPanel(slug: string) {
    selectSector(slug);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
  }

  // URL'den gelen ?sektor= veya ?firma= parametresiyle ilk açılış durumunu ayarla.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (memberIdParam) return;

    const requestedSlug = searchParams.get("sektor");
    const isValid = requestedSlug && SECTORS.some((s) => s.slug === requestedSlug);
    openPanel(isValid ? requestedSlug : SECTORS[0].slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (memberIdParam && requestedMember) setModalMember(requestedMember);
  }, [memberIdParam, requestedMember]);

  // Harita sürüklenirken mobilde sayfanın "bounce" ile kaymasını engelle.
  useEffect(() => {
    document.body.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overscrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (modalMember) setModalMember(null);
      else if (panelOpen) closePanel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  const activityItems = useMemo(() => {
    const tags = getActivityAreasForMembers(membersInSector);
    return [{ value: "", label: "Tüm Faaliyet Alanları" }, ...tags.map((t) => ({ value: t, label: t }))];
  }, [membersInSector]);

  const filteredMembers = useMemo(() => {
    if (!currentActivity) return membersInSector;
    return membersInSector.filter((m) => (m.activityAreas || []).includes(currentActivity));
  }, [membersInSector, currentActivity]);

  function handlePinClick(slug: string) {
    openPanel(slug);
  }

  const scrimOpen = panelOpen || !!modalMember;

  return (
    <>
      <MapView activeSector={panelOpen ? currentSector : null} onPinClick={handlePinClick} />

      <Link
        className="group fixed left-6 top-6 z-10 grid h-11.5 w-11.5 place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white backdrop-blur-md transition duration-250 hover:-translate-x-0.5 hover:bg-[rgba(30,155,255,.42)]"
        to="/"
        aria-label="Ana sayfaya dön"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-full bg-[rgba(6,18,30,.68)] px-3.5 py-2 text-[0.78rem] font-extrabold tracking-tight text-white opacity-0 backdrop-blur-sm transition duration-250 group-hover:translate-x-0 group-hover:opacity-100">
          Ana Sayfaya Dön
        </span>
      </Link>

      <div
        className={`fixed inset-0 z-15 bg-[rgba(6,18,30,.38)] transition-opacity duration-300 ${
          scrimOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          if (modalMember) setModalMember(null);
          else if (panelOpen) closePanel();
        }}
      />

      <FilterPanel
        open={panelOpen}
        onClose={closePanel}
        sectorItems={sectorItems}
        sectorValue={currentSector}
        onSectorChange={selectSector}
        sectorName={getSectorName(currentSector)}
        activityItems={activityItems}
        activityValue={currentActivity}
        onActivityChange={setCurrentActivity}
        filteredMembers={filteredMembers}
        totalMembers={membersInSector.length}
        onMemberClick={setModalMember}
      />

      <MemberModal member={modalMember} onClose={() => setModalMember(null)} />
    </>
  );
}
