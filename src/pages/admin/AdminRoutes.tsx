import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminEventsPage from "./AdminEventsPage";
import AdminLoginPageSettingsPage from "./AdminLoginPageSettingsPage";
import AdminMembersPage from "./AdminMembersPage";
import AdminMembershipDetailPage from "./AdminMembershipDetailPage";
import AdminMembershipsPage from "./AdminMembershipsPage";
import AdminNewsPage from "./AdminNewsPage";
import AdminSettingsPage from "./AdminSettingsPage";
import AdminUsersPage from "./AdminUsersPage";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/dashboard/uyeler" replace />} />
        <Route path="uyeler" element={<AdminMembersPage />} />
        <Route path="uyelikler" element={<AdminMembershipsPage />} />
        <Route path="uyelikler/:id" element={<AdminMembershipDetailPage />} />
        <Route path="etkinlikler" element={<AdminEventsPage />} />
        <Route path="haberler" element={<AdminNewsPage />} />
        <Route path="kullanicilar" element={<AdminUsersPage />} />
        <Route path="organizasyon-bilgileri" element={<AdminSettingsPage />} />
        <Route path="uye-girisi-sayfasi" element={<AdminLoginPageSettingsPage />} />
        <Route path="*" element={<Navigate to="/dashboard/uyeler" replace />} />
      </Routes>
    </AdminLayout>
  );
}
