import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CloseIcon, KeyIcon, LogoutIcon, MenuIcon, UserIcon } from "../admin/icons";

const navItems = [
  { to: "/dashboard/profilim", label: "Profilim", icon: UserIcon },
  { to: "/dashboard/sifre", label: "Şifre Değiştir", icon: KeyIcon },
];

function NavList({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  return (
    <nav className="grid gap-1">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            `flex items-center gap-3 overflow-hidden rounded-[12px] px-4 py-3 text-[0.88rem] font-bold whitespace-nowrap transition ${
              isActive ? "bg-assid-green text-white" : "text-assid-ink hover:bg-assid-paper"
            }`
          }
        >
          <item.icon className="h-5 w-5 shrink-0" />
          <span className={`transition-opacity duration-150 ${collapsed ? "opacity-0" : "opacity-100"}`}>
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
}

const RAIL_COLLAPSED = "72px";
const RAIL_EXPANDED = "256px";

export default function MemberLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRailExpanded, setIsRailExpanded] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div className="font-dashboard min-h-screen bg-assid-paper">
      <header className="fixed inset-x-0 top-0 z-40 flex h-[64px] items-center justify-between border-b border-assid-line bg-white px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-assid-ink lg:hidden"
            aria-label="Menüyü aç"
          >
            <MenuIcon />
          </button>
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-assid-green text-[0.9rem] font-black text-white">
            A
          </span>
          <span className="text-[0.95rem] font-extrabold tracking-[-.02em] text-assid-ink">Üye Paneli</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-[0.85rem] text-assid-muted sm:inline">{user?.email}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-assid-line bg-transparent px-4 py-2 text-[0.82rem] font-bold text-assid-ink"
          >
            <LogoutIcon className="h-4 w-4" />
            Çıkış
          </button>
        </div>
      </header>

      <aside
        onMouseEnter={() => setIsRailExpanded(true)}
        onMouseLeave={() => setIsRailExpanded(false)}
        style={{ width: isRailExpanded ? RAIL_EXPANDED : RAIL_COLLAPSED }}
        className="fixed bottom-0 left-0 top-[64px] z-40 hidden overflow-y-auto overflow-x-hidden border-r border-assid-line bg-white p-3 shadow-[4px_0_16px_rgba(9,20,33,.06)] transition-[width] duration-200 ease-out lg:block"
      >
        <NavList collapsed={!isRailExpanded} />
      </aside>

      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[rgba(9,20,33,.55)]" onClick={() => setIsMobileNavOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white p-4 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[0.95rem] font-extrabold text-assid-ink">Menü</span>
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(false)}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-assid-paper text-assid-muted"
                aria-label="Menüyü kapat"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
            <NavList onNavigate={() => setIsMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <main className="pt-[64px] lg:pl-[72px]">
        <div className="p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
