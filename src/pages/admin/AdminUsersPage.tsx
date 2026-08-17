import { useEffect, useState } from "react";
import { createAdminUser, fetchAdminUsers, resetUserPassword, setUserActive, type AdminUser } from "../../api/admin";
import Badge from "../../components/admin/Badge";
import ConfirmModal from "../../components/admin/ConfirmModal";
import Modal from "../../components/admin/Modal";
import Tooltip from "../../components/admin/Tooltip";
import { BanIcon, CheckIcon, KeyIcon, PlusIcon } from "../../components/admin/icons";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export default function AdminUsersPage() {
  const showToast = useToast();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [q, setQ] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<AdminUser | null>(null);
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function load() {
    setIsLoading(true);
    fetchAdminUsers()
      .then(setUsers)
      .catch(() => showToast("Kullanıcılar yüklenemedi."))
      .finally(() => setIsLoading(false));
  }

  useEffect(load, []);

  const filteredUsers = users.filter((u) => u.email.toLocaleLowerCase("tr").includes(q.trim().toLocaleLowerCase("tr")));

  async function handleToggleConfirm() {
    if (!toggleTarget) return;
    setIsSubmitting(true);
    try {
      await setUserActive(toggleTarget.id, !toggleTarget.isActive);
      showToast(toggleTarget.isActive ? "Kullanıcı pasif hale getirildi." : "Kullanıcı aktif hale getirildi.");
      setToggleTarget(null);
      load();
    } catch {
      showToast("İşlem başarısız oldu.");
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
          <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Kullanıcılar</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="E-posta ara..."
            className="min-w-64 rounded-full border border-assid-line bg-white px-4 py-2.5 text-[0.85rem] outline-none focus:border-assid-green/50"
          />
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="flex cursor-pointer items-center gap-2 rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white"
          >
            <PlusIcon className="h-4 w-4" /> Yeni Kullanıcı
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[20px] border border-assid-line bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-assid-line text-[0.74rem] uppercase tracking-wide text-assid-muted">
              <th className="px-5 py-3.5">E-posta</th>
              <th className="px-5 py-3.5">Rol</th>
              <th className="px-5 py-3.5">Durum</th>
              <th className="px-5 py-3.5">Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-assid-muted">
                  Yükleniyor...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-assid-muted">
                  {users.length === 0 ? "Henüz kullanıcı yok." : "Sonuç bulunamadı."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => (
                <tr key={u.id} className="border-b border-assid-line last:border-0">
                  <td className="px-5 py-3.5 font-bold text-assid-ink">{u.email}</td>
                  <td className="px-5 py-3.5 text-assid-muted">{u.role === "admin" ? "Admin" : "Üye"}</td>
                  <td className="px-5 py-3.5">
                    {u.isActive ? <Badge variant="success">Aktif</Badge> : <Badge variant="danger">Pasif</Badge>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Tooltip label="Şifreyi sıfırla">
                        <button
                          type="button"
                          onClick={() => setResetTarget(u)}
                          aria-label="Şifreyi sıfırla"
                          className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent text-assid-ink"
                        >
                          <KeyIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                      <Tooltip label={u.isActive ? "Pasif hale getir" : "Aktif hale getir"}>
                        <button
                          type="button"
                          disabled={currentUser?.id === u.id}
                          onClick={() => setToggleTarget(u)}
                          aria-label={u.isActive ? "Pasif hale getir" : "Aktif hale getir"}
                          className={`grid h-8 w-8 cursor-pointer place-items-center rounded-full border border-assid-line bg-transparent disabled:cursor-not-allowed disabled:opacity-40 ${
                            u.isActive ? "text-[#c0392b]" : "text-assid-green"
                          }`}
                        >
                          {u.isActive ? <BanIcon className="h-4 w-4" /> : <CheckIcon className="h-4 w-4" />}
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

      {isCreateOpen && (
        <CreateUserModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => {
            setIsCreateOpen(false);
            load();
          }}
        />
      )}

      {resetTarget && <ResetPasswordModal user={resetTarget} onClose={() => setResetTarget(null)} />}

      {toggleTarget && (
        <ConfirmModal
          title={toggleTarget.isActive ? "Kullanıcıyı pasif hale getir" : "Kullanıcıyı aktif hale getir"}
          message={
            toggleTarget.isActive
              ? `${toggleTarget.email} artık giriş yapamayacak. Devam edilsin mi?`
              : `${toggleTarget.email} tekrar giriş yapabilecek. Devam edilsin mi?`
          }
          confirmLabel={toggleTarget.isActive ? "Pasif Yap" : "Aktif Yap"}
          isDanger={toggleTarget.isActive}
          isLoading={isSubmitting}
          onConfirm={handleToggleConfirm}
          onClose={() => setToggleTarget(null)}
        />
      )}
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "member">("admin");
  const [memberId, setMemberId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await createAdminUser({ email, password, role, memberId: role === "member" ? memberId || undefined : undefined });
      showToast("Kullanıcı oluşturuldu.");
      onCreated();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Kullanıcı oluşturulamadı.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Yeni Kullanıcı" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">E-posta</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Şifre</span>
          <input
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="En az 8 karakter"
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          />
        </label>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Rol</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "member")}
            className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
          >
            <option value="admin">Admin</option>
            <option value="member">Üye</option>
          </select>
        </label>
        {role === "member" && (
          <label className="grid gap-1.5">
            <span className="text-[0.78rem] font-bold text-assid-muted">Bağlı Üye ID (opsiyonel)</span>
            <input
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Üye Başvuruları sayfasından ID kopyalanabilir"
              className="rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
            />
          </label>
        )}
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

function ResetPasswordModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const showToast = useToast();
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      await resetUserPassword(user.id, password);
      showToast(`${user.email} için şifre sıfırlandı.`);
      onClose();
    } catch {
      showToast("Şifre sıfırlanamadı.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal title="Şifreyi Sıfırla" onClose={onClose}>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <p className="text-[0.88rem] text-assid-muted">
          <strong className="text-assid-ink">{user.email}</strong> için yeni bir şifre belirleyin.
        </p>
        <label className="grid gap-1.5">
          <span className="text-[0.78rem] font-bold text-assid-muted">Yeni Şifre</span>
          <input
            required
            minLength={8}
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
            {isSaving ? "Kaydediliyor..." : "Sıfırla"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
