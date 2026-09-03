import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAdminBoardMember,
  deleteAdminBoardMember,
  fetchAdminBoardMembers,
  updateAdminBoardMember,
  type AdminBoardMember,
  type BoardMemberCategory,
} from "../../api/admin";
import { PencilIcon, TrashIcon } from "../../components/admin/icons";
import { useToast } from "../../context/ToastContext";

const boardMembersQueryKey = ["admin", "board-members"];

const CATEGORIES: { key: BoardMemberCategory; label: string }[] = [
  { key: "yonetim_kurulu_asil", label: "Yönetim Kurulu Asıl Üye Listesi" },
  { key: "yonetim_kurulu_yedek", label: "Yönetim Kurulu Yedek Üye Listesi" },
  { key: "denetleme_kurulu_asil", label: "Denetleme Kurulu Asıl Üye Listesi" },
  { key: "denetleme_kurulu_yedek", label: "Denetleme Kurulu Yedek Üye Listesi" },
  { key: "disiplin_kurulu_asil", label: "Disiplin Kurulu Asıl Üye Listesi" },
  { key: "disiplin_kurulu_yedek", label: "Disiplin Kurulu Yedek Üye Listesi" },
];

function MemberRow({ member }: { member: AdminBoardMember }) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [title, setTitle] = useState(member.title ?? "");

  const updateMutation = useMutation({
    mutationFn: () => updateAdminBoardMember(member._id, { name: name.trim(), title: title.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardMembersQueryKey });
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAdminBoardMember(member._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: boardMembersQueryKey }),
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await updateMutation.mutateAsync();
    } catch {
      showToast("Güncelleme başarısız oldu.");
    }
  }

  async function handleDelete() {
    try {
      await deleteMutation.mutateAsync();
    } catch {
      showToast("İsim silinemedi.");
    }
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="İsim Soyisim"
            className="min-w-32 flex-1 rounded-[10px] border border-assid-line bg-white px-2.5 py-1.5 text-[0.85rem] outline-none focus:border-assid-green/50"
          />
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Unvan (opsiyonel)"
            className="min-w-32 flex-1 rounded-[10px] border border-assid-line bg-white px-2.5 py-1.5 text-[0.85rem] outline-none focus:border-assid-green/50"
          />
          <button
            type="submit"
            disabled={updateMutation.isPending || !name.trim()}
            className="cursor-pointer rounded-full border-0 bg-assid-green px-3.5 py-1.5 text-[0.78rem] font-bold text-white disabled:opacity-60"
          >
            Kaydet
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="cursor-pointer rounded-full border border-assid-line bg-transparent px-3.5 py-1.5 text-[0.78rem] font-bold text-assid-ink"
          >
            Vazgeç
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5">
      <span className="text-[0.9rem] text-assid-ink">
        {member.name}
        {member.title && <span className="ml-2 text-[0.78rem] text-assid-muted">— {member.title}</span>}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Düzenle"
          className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-assid-ink"
        >
          <PencilIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          aria-label="Sil"
          className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[#c0392b]"
        >
          <TrashIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </li>
  );
}

function CategoryCard({ category, label, members }: { category: BoardMemberCategory; label: string; members: AdminBoardMember[] }) {
  const showToast = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");

  const createMutation = useMutation({
    mutationFn: () => createAdminBoardMember({ category, name: name.trim(), title: title.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardMembersQueryKey });
      setName("");
      setTitle("");
    },
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createMutation.mutateAsync();
    } catch {
      showToast("İsim eklenemedi.");
    }
  }

  return (
    <div className="rounded-[20px] border border-assid-line bg-white p-6 md:p-7">
      <h2 className="text-[1.02rem] font-bold text-assid-ink">{label}</h2>

      {members.length > 0 && (
        <ul className="mt-4 grid gap-2">
          {members.map((member) => (
            <MemberRow key={member._id} member={member} />
          ))}
        </ul>
      )}

      <form onSubmit={handleAdd} className="mt-4 flex flex-wrap gap-2.5">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="İsim Soyisim"
          className="min-w-40 flex-1 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
        />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Unvan (opsiyonel)"
          className="min-w-40 flex-1 rounded-[12px] border border-assid-line bg-assid-paper px-3.5 py-2.5 outline-none focus:border-assid-green/50"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !name.trim()}
          className="cursor-pointer rounded-full border-0 bg-assid-green px-5 py-2.5 text-[0.85rem] font-bold text-white disabled:opacity-60"
        >
          Ekle
        </button>
      </form>
    </div>
  );
}

export default function AdminBoardManagementPage() {
  const showToast = useToast();
  const { data: members = [], isError } = useQuery({
    queryKey: boardMembersQueryKey,
    queryFn: fetchAdminBoardMembers,
  });

  useEffect(() => {
    if (isError) showToast("Kurul üyeleri yüklenemedi.");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);

  return (
    <div>
      <div className="mb-6">
        <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
          Yönetim Paneli
        </span>
        <h1 className="mt-1 text-[1.5rem] tracking-[-.03em] text-assid-ink">Dernek Yönetimi</h1>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {CATEGORIES.map(({ key, label }) => (
          <CategoryCard
            key={key}
            category={key}
            label={label}
            members={members.filter((m) => m.category === key)}
          />
        ))}
      </div>
    </div>
  );
}
