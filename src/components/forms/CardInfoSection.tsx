import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatCardNumber, formatCardExpiry } from "../../utils/cardFormat";
import { useToast } from "../../context/ToastContext";

interface CardInfo {
  cardHolderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

const inputClass =
  "rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50";

const emptyFields = { cardHolderName: "", cardNumber: "", cardExpiry: "", cardCvc: "" };

export default function CardInfoSection({
  queryKey,
  fetchCardInfo,
  updateCardInfo,
}: {
  queryKey: unknown[];
  fetchCardInfo: () => Promise<CardInfo | null>;
  updateCardInfo: (dto: CardInfo) => Promise<CardInfo | null>;
}) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey, queryFn: fetchCardInfo });
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState(emptyFields);

  const saveMutation = useMutation({
    mutationFn: updateCardInfo,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, updated);
      setIsEditing(false);
      showToast("Kart bilgileri güncellendi.");
    },
    onError: (err) => showToast(err instanceof Error ? err.message : "Güncelleme başarısız oldu."),
  });

  function startEditing() {
    setFields({
      cardHolderName: data?.cardHolderName ?? "",
      cardNumber: data?.cardNumber ?? "",
      cardExpiry: data?.cardExpiry ?? "",
      cardCvc: data?.cardCvc ?? "",
    });
    setIsEditing(true);
  }

  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[1.05rem] font-bold text-assid-ink">Kart Bilgileri</h2>
        {!isEditing && !isLoading && (
          <button
            type="button"
            onClick={startEditing}
            className="cursor-pointer rounded-[10px] border border-assid-line bg-transparent px-3.5 py-1.5 text-[0.8rem] font-bold text-assid-ink"
          >
            Düzenle
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-assid-muted">Yükleniyor...</p>
      ) : isEditing ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Kart Üzerindeki İsim</span>
            <input
              value={fields.cardHolderName}
              onChange={(e) => setFields((f) => ({ ...f, cardHolderName: e.target.value }))}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Kart Numarası</span>
            <input
              inputMode="numeric"
              value={formatCardNumber(fields.cardNumber)}
              onChange={(e) =>
                setFields((f) => ({ ...f, cardNumber: e.target.value.replace(/[^0-9]/g, "").slice(0, 16) }))
              }
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Son Kullanma Tarihi (AA/YY)</span>
            <input
              placeholder="AA/YY"
              inputMode="numeric"
              value={fields.cardExpiry}
              onChange={(e) => setFields((f) => ({ ...f, cardExpiry: formatCardExpiry(e.target.value) }))}
              className={inputClass}
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">CVC</span>
            <input
              inputMode="numeric"
              value={fields.cardCvc}
              onChange={(e) => setFields((f) => ({ ...f, cardCvc: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
              className={inputClass}
            />
          </label>
          <div className="flex gap-2 sm:col-span-2">
            <button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate(fields)}
              className="cursor-pointer rounded-[10px] border-0 bg-assid-green px-4 py-2 text-[0.85rem] font-bold text-white disabled:opacity-60"
            >
              {saveMutation.isPending ? "Kaydediliyor..." : "Kaydet"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="cursor-pointer rounded-[10px] border border-assid-line bg-transparent px-4 py-2 text-[0.85rem] font-bold text-assid-ink"
            >
              Vazgeç
            </button>
          </div>
        </div>
      ) : data ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
              Kart Üzerindeki İsim
            </div>
            <div className="mt-1 text-[0.92rem] text-assid-ink">{data.cardHolderName || "—"}</div>
          </div>
          <div>
            <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">Kart Numarası</div>
            <div className="mt-1 text-[0.92rem] text-assid-ink">
              {data.cardNumber ? formatCardNumber(data.cardNumber) : "—"}
            </div>
          </div>
          <div>
            <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">
              Son Kullanma Tarihi
            </div>
            <div className="mt-1 text-[0.92rem] text-assid-ink">{data.cardExpiry || "—"}</div>
          </div>
          <div>
            <div className="text-[0.74rem] font-bold uppercase tracking-wide text-assid-muted">CVC</div>
            <div className="mt-1 text-[0.92rem] text-assid-ink">{data.cardCvc || "—"}</div>
          </div>
        </div>
      ) : (
        <p className="text-assid-muted">Kayıtlı kart bilgisi yok.</p>
      )}
    </div>
  );
}
