import { useEffect } from "react";

interface TextModalProps {
  title: string;
  text: string;
  onClose: () => void;
}

export default function TextModal({ title, text, onClose }: TextModalProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-[rgba(9,20,33,.55)] px-4 py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-[24px] bg-white p-6 shadow-card md:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[1.25rem] tracking-[-.03em] text-assid-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-assid-paper text-assid-muted hover:text-assid-ink"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto whitespace-pre-line text-[0.86rem] leading-relaxed text-assid-muted">
          {text}
        </div>
      </div>
    </div>
  );
}
