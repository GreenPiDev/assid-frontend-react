import { useEffect, useState } from "react";
import {
  createAdminUser,
  deleteAdminMember,
  fetchAdminMembers,
  setMemberApproval,
  updateAdminMember,
  type AdminMember,
} from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import Tooltip from "../../components/admin/Tooltip";
import { PencilIcon, TrashIcon, UserCogIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";
import { getSectorName } from "../../utils/directory";

type Filter = "pending" | "approved" | "all";

export default function AdminMembersPage() {
  const showToast = useToast();
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");

  const [editTarget, setEditTarget] = useState<AdminMember | null>(null);
  const [approvalTarget, setApprovalTarget] = useState<{ member: AdminMember; nextValue: boolean } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMember | null>(null);
  const [credentialsTarget, setCredentialsTarget] = useState<AdminMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
    fetchAdminMembers({
      isApproved: filter === "all" ? undefined : filter === "approved",
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

  async function handleApprovalConfirm() {
    if (!approvalTarget) return;
    setIsSubmitting(true);
    try {
      await setMemberApproval(approvalTarget.member._id, approvalTarget.nextValue);
      showToast(approvalTarget.nextValue ? "Üye onaylandı." : "Üye onayı kaldırıldı.");
      setApprovalTarget(null);
      load();
    } catch {
      showToast("İşlem başarısız oldu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    try {
      await deleteAdminMember(deleteTarget._id);
      showToast("Üye silindi.");
      setDeleteTarget(null);
      load();
    } catch {
      showToast("Silme işlemi başarısız oldu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            Yönetim Paneli
          </span>
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Üye Başvuruları</h1>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="İsim, firma veya sektör ara..."
          className="min-w-64 rounded-full border border-assid-line bg-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-assid-green/50"
        />
      </div>

      <div className="mb-5 flex gap-2">
        {(["pending", "approved", "all"] as Filter[]).map((f) => (
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
            {f === "pending" ? "Onay Bekleyen" : f === "approved" ? "Onaylı" : "Tümü"}
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
                <tr key={m._id} className="border-b border-assid-line last:border-0">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-assid-ink">{m.companyName || m.fullName}</div>
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
                    {m.isApproved ? <Badge variant="success">Onaylı</Badge> : <Badge variant="pending">Bekliyor</Badge>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setApprovalTarget({ member: m, nextValue: !m.isApproved })}
                        className={`cursor-pointer rounded-full border-0 px-3.5 py-2 text-[0.78rem] font-bold text-white ${
                          m.isApproved ? "bg-[#c0392b]" : "bg-assid-green"
                        }`}
                      >
                        {m.isApproved ? "Onayı Kaldır" : "Onayla"}
                      </button>
                      <Tooltip label="Giriş bilgisi oluştur">
                        <button
                          type="button"
                          onClick={() => setCredentialsTarget(m)}
                          aria-label="Giriş bilgisi oluştur"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                        >
                          <UserCogIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip label="Düzenle">
                        <button
                          type="button"
                          onClick={() => setEditTarget(m)}
                          aria-label="Düzenle"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip label="Sil">
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(m)}
                          aria-label="Sil"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-[#c0392b]"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {approvalTarget && (
        <ConfirmModal
          title={approvalTarget.nextValue ? "Üyeyi onayla" : "Onayı kaldır"}
          message={
            approvalTarget.nextValue
              ? `${approvalTarget.member.companyName || approvalTarget.member.fullName} firma rehberinde görünür hale gelecek. Onaylamak istiyor musunuz?`
              : `${approvalTarget.member.companyName || approvalTarget.member.fullName} firma rehberinden kaldırılacak. Devam edilsin mi?`
          }
          confirmLabel={approvalTarget.nextValue ? "Onayla" : "Onayı Kaldır"}
          isDanger={!approvalTarget.nextValue}
          isLoading={isSubmitting}
          onConfirm={handleApprovalConfirm}
          onClose={() => setApprovalTarget(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Üyeyi sil"
          message={`${deleteTarget.companyName || deleteTarget.fullName} kalıcı olarak silinecek. Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          isDanger
          isLoading={isSubmitting}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeleteTarget(null)}
        />
      )}

      {editTarget && (
        <EditMemberModal
          member={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            load();
          }}
        />
      )}

      {credentialsTarget && (
        <CreateCredentialsModal member={credentialsTarget} onClose={() => setCredentialsTarget(null)} />
      )}
    </div>
  );
}

function EditMemberModal({
  member,
  onClose,
  onSaved,
}: {
  member: AdminMember;
  onClose: () => void;
  onSaved: () => void;
}) {
  const showToast = useToast();
  const [form, setForm] = useState({
    fullName: member.fullName,
    companyName: member.companyName ?? "",
    email: member.email,
    phone: member.phone ?? "",
    mobilePhone: member.mobilePhone ?? "",
    companyAddress: member.companyAddress ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateAdminMember(member._id, form);
      showToast("Üye bilgileri güncellendi.");
      onSaved();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Güncelleme başarısız oldu.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Üyeyi Düzenle" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Ad Soyad</span>
          <input
            required
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Firma Adı</span>
          <input
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">E-posta</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Telefon</span>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Cep Telefonu</span>
            <input
              value={form.mobilePhone}
              onChange={(e) => setForm({ ...form, mobilePhone: e.target.value })}
              className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
            />
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Firma Adresi</span>
          <textarea
            value={form.companyAddress}
            onChange={(e) => setForm({ ...form, companyAddress: e.target.value })}
            rows={2}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CreateCredentialsModal({ member, onClose }: { member: AdminMember; onClose: () => void }) {
  const showToast = useToast();
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createAdminUser({ email: member.email, password, role: "member", memberId: member._id });
      showToast(`${member.email} için giriş bilgisi oluşturuldu.`);
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Giriş bilgisi oluşturulamadı.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Giriş Bilgisi Oluştur" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <p className="text-[0.88rem] text-assid-muted">
          <strong className="text-assid-ink">{member.companyName || member.fullName}</strong> için üye paneli giriş
          bilgisi oluşturuluyor. Belirlediğiniz şifreyi üyeye iletmeniz gerekir.
        </p>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">E-posta</span>
          <input
            disabled
            value={member.email}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 text-assid-muted outline-none"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Şifre</span>
          <input
            required
            minLength={8}
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <div className="mt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-assid-line bg-transparent px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
          >
            {isSaving ? "Oluşturuluyor..." : "Oluştur"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
