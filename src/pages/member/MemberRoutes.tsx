import { Navigate, Route, Routes } from "react-router-dom";
import MemberLayout from "../../components/member/MemberLayout";
import MemberPasswordPage from "./MemberPasswordPage";
import MemberProfilePage from "./MemberProfilePage";

export default function MemberRoutes() {
  return (
    <MemberLayout>
      <Routes>
        <Route index element={<Navigate to="/dashboard/profilim" replace />} />
        <Route path="profilim" element={<MemberProfilePage />} />
        <Route path="sifre" element={<MemberPasswordPage />} />
        <Route path="*" element={<Navigate to="/dashboard/profilim" replace />} />
      </Routes>
    </MemberLayout>
  );
}
