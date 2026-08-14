import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminMembers, setMemberApplicationStatus, type AdminMember } from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Tooltip from "../../components/admin/Tooltip";
import { BanIcon, CheckIcon, UndoIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";
import { getSectorName } from "../../utils/directory";

type Filter = "pending" | "rejected";
type Action = "approve" | "reject" | "restore";

export default function AdminMembersPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [actionTarget, setActionTarget] = useState<{ member: AdminMember; action: Action } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
    fetchAdminMembers({
      status: filter,
      q: debouncedQ || undefined,
    })
      .then(setMembers)
      .catch(() => showToast("Üyeler yüklenemedi."))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedQ]);

  async function handleActionConfirm() {
    if (!actionTarget) return;
    setIsSubmitting(true);
    try {
      if (actionTarget.action === "approve") {
        await setMemberApplicationStatus(actionTarget.member._id, "approved");
        showToast("Üye onaylandı.");
      } else if (actionTarget.action === "reject") {
        await setMemberApplicationStatus(actionTarget.member._id, "rejected");
        showToast("Başvuru reddedildi.");
      } else {
        await setMemberApplicationStatus(actionTarget.member._id, "pending");
        showToast("Başvuru bekleyenlere alındı.");
      }
      setActionTarget(null);
      load();
    } catch {
      showToast("İşlem başarısız oldu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const actionCopy: Record<Action, { title: string; message: (name: string) => string; confirmLabel: string; isDanger?: boolean }> = {
    approve: {
      title: "Üyeyi onayla",
      message: (name) => `${name} firma rehberinde görünür hale gelecek. Onaylamak istiyor musunuz?`,
      confirmLabel: "Onayla",
    },
    reject: {
      title: "Başvuruyu reddet",
      message: (name) => `${name} başvurusu reddedilen başvurular listesine aktarılacak. Devam edilsin mi?`,
      confirmLabel: "Reddet",
      isDanger: true,
    },
    restore: {
      title: "Bekleyenlere al",
      message: (name) => `${name} başvurusu tekrar onay bekleyen listesine alınacak. Devam edilsin mi?`,
      confirmLabel: "Bekleyenlere Al",
    },
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Onay Bekleyen Üye Başvuruları</h1>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İsim, firma veya sektör ara..."
          className="min-w-64 rounded-full border border-assid-line bg-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-assid-green/50"
        />
      </div>

      <div className="mb-5 flex gap-2">
        {(["pending", "rejected"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[0.82rem] font-bold ${
              filter === f
                ? "border-assid-green bg-assid-green text-white"
                : "border-assid-line bg-white text-assid-ink"
            }`}
          >
            {f === "pending" ? "Onay Bekleyen" : "Reddedilen"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[820px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">Firma / Ad Soyad</th>
              <th className="px-5 py-3.5">E-posta</th>
              <th className="px-5 py-3.5">Sektör</th>
              <th className="px-5 py-3.5">Başvuru Tarihi</th>
              <th className="px-5 py-3.5">Durum</th>
              <th className="px-5 py-3.5">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-assid-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-assid-muted">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m._id}
                  onClick={() => navigate(`/dashboard/uye-basvurulari/${m._id}`)}
                  className="cursor-pointer border-b border-assid-line last:border-0 hover:bg-assid-paper"
                >
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[#2563eb]">{m.companyName || m.fullName}</div>
                    <div className="text-[0.78rem] text-assid-muted">{m.fullName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">{m.email}</td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {m.sectors.map((s) => getSectorName(s)).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {new Date(m.applicationDate).toLocaleDateString("tr-TR")}
                  </td>
                  <td className="px-5 py-3.5">
                    {m.applicationStatus === "rejected" ? (
                      <Badge variant="danger">Reddedildi</Badge>
                    ) : (
                      <Badge variant="pending">Bekliyor</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {filter === "pending" ? (
                        <>
                          <Tooltip label="Onayla">
                            <button
                              type="button"
                              onClick={() => setActionTarget({ member: m, action: "approve" })}
                              aria-label="Onayla"
                              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-assid-green text-white"
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                          <Tooltip label="Reddet">
                            <button
                              type="button"
                              onClick={() => setActionTarget({ member: m, action: "reject" })}
                              aria-label="Reddet"
                              className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-[#c0392b] text-white"
                            >
                              <BanIcon className="h-4 w-4" />
                            </button>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip label="Bekleyen'e Al">
                          <button
                            type="button"
                            onClick={() => setActionTarget({ member: m, action: "restore" })}
                            aria-label="Bekleyen'e Al"
                            className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-assid-green text-white"
                          >
                            <UndoIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {actionTarget && (
        <ConfirmModal
          title={actionCopy[actionTarget.action].title}
          message={actionCopy[actionTarget.action].message(actionTarget.member.companyName || actionTarget.member.fullName)}
          confirmLabel={actionCopy[actionTarget.action].confirmLabel}
          isDanger={actionCopy[actionTarget.action].isDanger}
          isLoading={isSubmitting}
          onConfirm={handleActionConfirm}
          onClose={() => setActionTarget(null)}
        />
      )}
    </div>
  );
}
