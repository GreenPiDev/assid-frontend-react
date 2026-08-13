import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="min-h-screen bg-assid-paper px-5 py-10">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <div>
          <span className="text-[0.74rem] font-extrabold uppercase tracking-[.16em] text-assid-green">
            {user.role === "admin" ? "Yönetim Paneli" : "Üye Paneli"}
          </span>
          <h1 className="mt-1 text-[1.6rem] tracking-[-.03em]">Merhaba, {user.email}</h1>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="cursor-pointer rounded-full border border-assid-line bg-white px-5 py-2.5 text-[0.85rem] font-bold text-assid-ink"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="mx-auto mt-8 w-full max-w-5xl rounded-[24px] bg-white p-8 shadow-card">
        {user.role === "admin" ? (
          <p className="text-assid-muted">Admin paneli içeriği burada olacak.</p>
        ) : (
          <p className="text-assid-muted">Üye paneli içeriği burada olacak.</p>
        )}
      </div>
    </div>
  );
}
