import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminAboutPage from "./AdminAboutPage";
import AdminBoardManagementPage from "./AdminBoardManagementPage";
import AdminConversationPage from "./AdminConversationPage";
import AdminEventsPage from "./AdminEventsPage";
import AdminLoginPageSettingsPage from "./AdminLoginPageSettingsPage";
import AdminMembersPage from "./AdminMembersPage";
import AdminMembershipDetailPage from "./AdminMembershipDetailPage";
import AdminMembershipFormPage from "./AdminMembershipFormPage";
import AdminMembershipsPage from "./AdminMembershipsPage";
import AdminMessagingPage from "./AdminMessagingPage";
import AdminNewsPage from "./AdminNewsPage";
import AdminPresidentMessagePage from "./AdminPresidentMessagePage";
import AdminSettingsPage from "./AdminSettingsPage";
import AdminUsersPage from "./AdminUsersPage";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="/panel/uye-basvurulari" replace />} />
        <Route path="uye-basvurulari" element={<AdminMembersPage />} />
        <Route path="uye-basvurulari/:id" element={<AdminMembershipDetailPage />} />
        <Route path="uyelikler" element={<AdminMembershipsPage />} />
        <Route path="uyelikler/:id" element={<AdminMembershipDetailPage />} />
        <Route path="mesajlasma" element={<AdminMessagingPage />} />
        <Route path="mesajlasma/:id" element={<AdminConversationPage />} />
        <Route path="etkinlikler" element={<AdminEventsPage />} />
        <Route path="haberler" element={<AdminNewsPage />} />
        <Route path="kullanicilar" element={<AdminUsersPage />} />
        <Route path="organizasyon-bilgileri" element={<AdminSettingsPage />} />
        <Route path="uye-girisi-sayfasi" element={<AdminLoginPageSettingsPage />} />
        <Route path="uye-kayit-formu" element={<AdminMembershipFormPage />} />
        <Route path="hakkimizda" element={<AdminAboutPage />} />
        <Route path="baskanin-mesaji" element={<AdminPresidentMessagePage />} />
        <Route path="dernek-yonetimi" element={<AdminBoardManagementPage />} />
        <Route path="*" element={<Navigate to="/panel/uye-basvurulari" replace />} />
      </Routes>
    </AdminLayout>
  );
}
