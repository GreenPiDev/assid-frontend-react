import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMemberById, useMembers, useMembersBySector } from "../api/resources/members";
import MemberDetailPanel from "../components/directory/MemberDetailPanel";
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
  const [nameQuery, setNameQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const initialized = useRef(false);

  const isSearching = nameQuery.trim().length > 0;
  const { data: membersInSector } = useMembersBySector(currentSector);
  const { data: allMembers } = useMembers();

  function handleNameQueryChange(value: string) {
    setNameQuery(value);
    // İsimle arama, seçili sektör/faaliyet alanı ile birlikte çift filtreye
    // dönüşmesin diye — arama başlayınca bu filtreler sıfırlanıp tüm
    // firmalar arasında aranır.
    if (value.trim()) {
      setCurrentSector(null);
      setCurrentActivity("");
    }
  }

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
    if (memberIdParam && requestedMember) setSelectedMember(requestedMember);
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
      if (selectedMember) setSelectedMember(null);
      else if (panelOpen) closePanel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  const activityItems = useMemo(() => {
    const tags = getActivityAreasForMembers(membersInSector);
    return [{ value: "", label: "Tüm Faaliyet Alanları" }, ...tags.map((t) => ({ value: t, label: t }))];
  }, [membersInSector]);

  const baseMembers = isSearching ? allMembers : membersInSector;

  const filteredMembers = useMemo(() => {
    if (!currentActivity) return baseMembers;
    return baseMembers.filter((m) => (m.activityAreas || []).includes(currentActivity));
  }, [baseMembers, currentActivity]);

  function handlePinClick(slug: string) {
    openPanel(slug);
  }

  const MOBILE_BREAKPOINT = 1024;

  function handleMemberSelect(member: Member) {
    setSelectedMember(member);
    // Mobilde iki panel yan yana sığmaz — firma seçilince filtre paneli kapanır.
    if (window.innerWidth < MOBILE_BREAKPOINT) closePanel();
  }

  const scrimOpen = panelOpen || !!selectedMember;

  return (
    <>
      <MapView activeSector={panelOpen ? currentSector : null} onPinClick={handlePinClick} />

      <Link
        className="group fixed left-6 top-6 z-10 grid h-11.5 w-11.5 place-items-center rounded-full border border-white/50 bg-[rgba(30,155,255,.28)] text-white backdrop-blur-md transition duration-250 hover:-translate-x-0.5 hover:bg-[rgba(30,155,255,.42)]"
        to="/anasayfa"
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
        className={`fixed inset-0 z-15 transition-opacity duration-300 ${
          selectedMember ? "bg-[rgba(6,18,30,.38)]" : "bg-transparent"
        } ${scrimOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => {
          if (selectedMember) setSelectedMember(null);
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
        totalMembers={baseMembers.length}
        nameQuery={nameQuery}
        onNameQueryChange={handleNameQueryChange}
        onMemberClick={handleMemberSelect}
      />

      <MemberDetailPanel member={selectedMember} onClose={() => setSelectedMember(null)} />
    </>
  );
}
