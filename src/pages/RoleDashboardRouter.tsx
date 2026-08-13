import { useAuth } from "../context/AuthContext";
import AdminRoutes from "./admin/AdminRoutes";
import MemberRoutes from "./member/MemberRoutes";

export default function RoleDashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "admin") return <AdminRoutes />;
  return <MemberRoutes />;
}
