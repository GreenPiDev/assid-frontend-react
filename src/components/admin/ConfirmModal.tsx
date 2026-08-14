import Modal from "./Modal";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  title,
  message,
  confirmLabel = "Onayla",
  isDanger = false,
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-[0.92rem] text-assid-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
        >
          Vazgeç
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isLoading}
          className={`cursor-pointer rounded-full border-0 px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60 ${
            isDanger ? "bg-[#c0392b]" : "bg-assid-green"
          }`}
        >
          {isLoading ? "İşleniyor..." : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
