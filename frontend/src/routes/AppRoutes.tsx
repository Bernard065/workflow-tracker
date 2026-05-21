import { Navigate, Route, Routes } from "react-router-dom";

import { ApplicationFormPage } from "@/pages/ApplicationFormPage";
import { ApplicationListPage } from "@/pages/ApplicationListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />
      <Route path="/applications" element={<ApplicationListPage />} />
      <Route path="/applications/new" element={<ApplicationFormPage />} />
    </Routes>
  );
}
