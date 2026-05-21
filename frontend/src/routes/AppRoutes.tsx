import { Navigate, Route, Routes } from "react-router-dom";

import { ApplicationDetailPage } from "@/pages/ApplicationDetailPage";
import { ApplicationFormPage } from "@/pages/ApplicationFormPage";
import { ApplicationListPage } from "@/pages/ApplicationListPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/applications" replace />} />
      <Route path="/applications" element={<ApplicationListPage />} />
      <Route path="/applications/new" element={<ApplicationFormPage />} />
      <Route path="/applications/:applicationId" element={<ApplicationDetailPage />} />
      <Route
        path="/applications/:applicationId/edit"
        element={<ApplicationFormPage />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
