import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminMembers, type AdminMember } from "../../api/admin";
import Badge from "../../components/admin/Badge";
import { useToast } from "../../context/ToastContext";
import { getSectorName } from "../../utils/directory";

type Filter = "approved" | "pending" | "all";

export default function AdminMembershipsPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("approved");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 400);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    setIsLoading(true);
    fetchAdminMembers({
      isApproved: filter === "all" ? undefined : filter === "approved",
      q: debouncedQ || undefined,
    })
      .then(setMembers)
      .catch(() => showToast("Üyelikler yüklenemedi."))
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, debouncedQ]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Üyelikler</h1>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İsim, firma veya sektör ara..."
          className="min-w-64 rounded-full border border-assid-line bg-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-assid-green/50"
        />
      </div>

      <div className="mb-5 flex gap-2">
        {(["all", "approved", "pending"] as Filter[]).map((f) => (
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
            {f === "all" ? "Tümü" : f === "approved" ? "Onaylı" : "Onay Bekleyen"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[880px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">Logo</th>
              <th className="px-5 py-3.5">Firma / Ad Soyad</th>
              <th className="px-5 py-3.5">Sektör</th>
              <th className="px-5 py-3.5">Üyelik Tipi</th>
              <th className="px-5 py-3.5">Telefon</th>
              <th className="px-5 py-3.5">Durum</th>
              <th className="px-5 py-3.5">Onay Tarihi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-assid-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : members.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-assid-muted">
                  Kayıt bulunamadı.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m._id}
                  onClick={() => navigate(`/dashboard/uyelikler/${m._id}`)}
                  className="cursor-pointer border-b border-assid-line last:border-0 hover:bg-assid-paper"
                >
                  <td className="px-5 py-3.5">
                    <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-assid-line bg-assid-paper">
                      {m.logo ? (
                        <img
                          src={m.logo}
                          alt={`${m.companyName || m.fullName} logosu`}
                          className="h-full w-full object-contain p-1"
                        />
                      ) : (
                        <span className="text-[0.9rem] font-black text-assid-green">
                          {(m.companyName || m.fullName).charAt(0)}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-assid-ink">{m.companyName || m.fullName}</div>
                    <div className="text-[0.78rem] text-assid-muted">{m.fullName}</div>
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {m.sectors.map((s) => getSectorName(s)).join(", ") || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {m.membershipType === "corporate" ? "Tüzel" : "Gerçek"}
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">{m.phone || m.mobilePhone || "—"}</td>
                  <td className="px-5 py-3.5">
                    {m.isApproved ? <Badge variant="success">Onaylı</Badge> : <Badge variant="pending">Bekliyor</Badge>}
                  </td>
                  <td className="px-5 py-3.5 text-assid-muted">
                    {m.approvedAt ? new Date(m.approvedAt).toLocaleDateString("tr-TR") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
