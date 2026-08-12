import { useEffect, useRef } from "react";
import { SECTORS } from "../../constants/sectors";

declare global {
  interface Window {
    __mapJustDragged?: boolean;
  }
}

const MOBILE_BREAKPOINT = 760;
const NATURAL_WIDTH = 1920;
const NATURAL_HEIGHT = 1080;

interface MapViewProps {
  activeSector: string | null;
  onPinClick: (slug: string) => void;
}

export default function MapView({ activeSector, onPinClick }: MapViewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewportEl = viewportRef.current;
    const canvasEl = canvasRef.current;
    if (!viewportEl || !canvasEl) return;
    const viewport: HTMLDivElement = viewportEl;
    const canvas: HTMLDivElement = canvasEl;
    let mode = "mobile";
    let canvasWidth = NATURAL_WIDTH;
    let canvasHeight = NATURAL_HEIGHT;
    let x = 0;
    let y = 0;
    let dragging = false;
    let moved = false;
    let pointerId: number | null = null;
    let startPointerX = 0;
    let startPointerY = 0;
    let startX = 0;
    let startY = 0;

    function bounds() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const b = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
      if (canvasWidth <= vw) b.minX = b.maxX = (vw - canvasWidth) / 2;
      else { b.minX = vw - canvasWidth; b.maxX = 0; }
      if (canvasHeight <= vh) b.minY = b.maxY = (vh - canvasHeight) / 2;
      else { b.minY = vh - canvasHeight; b.maxY = 0; }
      return b;
    }

    function clamp(v: number, min: number, max: number) {
      return Math.min(max, Math.max(min, v));
    }

    function applyTransform() {
      canvas.style.transform = `translate3d(${x}px,${y}px,0)`;
    }

    function centerMap() {
      const b = bounds();
      x = (b.minX + b.maxX) / 2;
      y = (b.minY + b.maxY) / 2;
      applyTransform();
    }

    function applyMode() {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      mode = isMobile ? "mobile" : "desktop";
      viewport.style.cursor = isMobile ? "grab" : "default";
      viewport.style.touchAction = isMobile ? "none" : "auto";
      canvas.style.width = isMobile ? `${NATURAL_WIDTH}px` : "100%";
      canvas.style.height = isMobile ? "auto" : "100%";

      if (isMobile) {
        canvasWidth = NATURAL_WIDTH;
        canvasHeight = NATURAL_HEIGHT;
        centerMap();
      } else {
        canvasWidth = window.innerWidth;
        canvasHeight = window.innerHeight;
        x = 0;
        y = 0;
        applyTransform();
      }
    }

    function handlePointerDown(e: PointerEvent) {
      if (mode === "desktop") return;
      dragging = true;
      moved = false;
      pointerId = e.pointerId;
      startPointerX = e.clientX;
      startPointerY = e.clientY;
      startX = x;
      startY = y;
      viewport.style.cursor = "grabbing";
      viewport.setPointerCapture(pointerId);
    }

    function handlePointerMove(e: PointerEvent) {
      if (!dragging) return;
      const dx = e.clientX - startPointerX;
      const dy = e.clientY - startPointerY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved = true;
      const b = bounds();
      x = clamp(startX + dx, b.minX, b.maxX);
      y = clamp(startY + dy, b.minY, b.maxY);
      applyTransform();
    }

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      viewport.style.cursor = mode === "mobile" ? "grab" : "default";
      if (pointerId !== null) {
        try { viewport.releasePointerCapture(pointerId); } catch { /* noop */ }
      }
      pointerId = null;
      if (moved) {
        window.__mapJustDragged = true;
        setTimeout(() => { window.__mapJustDragged = false; }, 0);
      }
    }

    function handlePointerLeave(e: PointerEvent) {
      if (dragging && e.pointerId === pointerId) endDrag();
    }

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("resize", applyMode);

    applyMode();

    return () => {
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", applyMode);
    };
  }, []);

  return (
    <div ref={viewportRef} className="fixed inset-0 overflow-hidden bg-[#0d2a26]">
      <div ref={canvasRef} className="absolute left-0 top-0 will-change-transform">
        <img
          className="pointer-events-none block h-auto w-full select-none"
          src="/assid-firma-rehberi-sehir.avif"
          alt=""
          draggable="false"
        />
        {SECTORS.map((sector) => {
          const isActive = activeSector === sector.slug;
          return (
            <div
              key={sector.slug}
              className={`absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center gap-1.5 rounded-full py-1.5 pl-2 pr-3.5 shadow-[0_2px_8px_rgba(0,0,0,.35)] backdrop-blur-sm transition duration-200 hover:-translate-y-[calc(50%+2px)] ${
                isActive ? "bg-assid-orange/30" : "bg-[rgba(6,18,30,.68)] hover:bg-[rgba(6,18,30,.85)]"
              }`}
              style={{ left: sector.pin.left, top: sector.pin.top }}
              onClick={() => {
                if (window.__mapJustDragged) return;
                onPinClick(sector.slug);
              }}
            >
              <span className="relative h-3.5 w-3.5 flex-none">
                <span
                  className={`absolute inset-0 rounded-full border-2 border-white shadow-[0_0_0_4px_rgba(30,155,255,.35),0_2px_8px_rgba(0,0,0,.35)] ${
                    isActive ? "bg-assid-orange" : "bg-[#1e9bff]"
                  }`}
                />
                <span
                  className={`absolute -inset-0.5 animate-pin-pulse rounded-full ${
                    isActive ? "bg-assid-orange" : "bg-[#1e9bff]"
                  }`}
                />
              </span>
              <span className="pointer-events-none whitespace-nowrap text-[0.72rem] font-extrabold tracking-tight text-white">
                {sector.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
