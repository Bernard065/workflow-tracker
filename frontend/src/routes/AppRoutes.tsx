import { Navigate, Route, Routes } from "react-router-dom";

import { ApplicationListPage } from "@/pages/ApplicationListPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />
      <Route path="/applications" element={<ApplicationListPage />} />
    </Routes>
  );
}
