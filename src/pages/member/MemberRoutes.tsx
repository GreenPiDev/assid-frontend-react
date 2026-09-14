import { Navigate, Route, Routes } from "react-router-dom";
import MemberLayout from "../../components/member/MemberLayout";
import MemberConversationPage from "./MemberConversationPage";
import MemberMessagingPage from "./MemberMessagingPage";
import MemberPasswordPage from "./MemberPasswordPage";
import MemberProfilePage from "./MemberProfilePage";

export default function MemberRoutes() {
  return (
    <MemberLayout>
      <Routes>
        <Route index element={<Navigate to="/panel/profilim" replace />} />
        <Route path="profilim" element={<MemberProfilePage />} />
        <Route path="sifre" element={<MemberPasswordPage />} />
        <Route path="mesajlasma" element={<MemberMessagingPage />} />
        <Route path="mesaj/:id" element={<MemberConversationPage />} />
        <Route path="*" element={<Navigate to="/panel/profilim" replace />} />
      </Routes>
    </MemberLayout>
  );
}
