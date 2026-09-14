import { useAuth } from "../context/AuthContext";
import { MessagingSocketProvider } from "../context/MessagingSocketContext";
import AdminRoutes from "./admin/AdminRoutes";
import MemberRoutes from "./member/MemberRoutes";

export default function RoleDashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;
  return <MessagingSocketProvider>{user.role === "admin" ? <AdminRoutes /> : <MemberRoutes />}</MessagingSocketProvider>;
}
