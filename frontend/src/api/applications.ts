import { apiRequest } from "./client";
import type {
  Application,
  ApplicationCreatePayload,
  ApplicationListItem,
  ApplicationUpdatePayload,
  PaginatedResponse,
  ReviewerDecisionPayload,
} from "../types/application";

interface GetApplicationsParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  applicationType?: string;
}

export function getApplications({
  page = 1,
  pageSize = 10,
  search = "",
  status = "",
  applicationType = "",
}: GetApplicationsParams = {}): Promise<PaginatedResponse<ApplicationListItem>> {
  const searchParams = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  });

  if (search.trim()) {
    searchParams.set("search", search.trim());
  }

  if (status) {
    searchParams.set("status", status);
  }

  if (applicationType) {
    searchParams.set("application_type", applicationType);
  }

  return apiRequest<PaginatedResponse<ApplicationListItem>>(
    `/applications?${searchParams.toString()}`,
  );
}

export function getApplication(applicationId: string): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}`);
}

export function createApplication(
  payload: ApplicationCreatePayload,
): Promise<Application> {
  return apiRequest<Application>("/applications", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateApplication(
  applicationId: string,
  payload: ApplicationUpdatePayload,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function submitApplication(applicationId: string): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}/submit`, {
    method: "POST",
  });
}

export function startReview(applicationId: string): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}/start-review`, {
    method: "POST",
  });
}

export function recordReviewerDecision(
  applicationId: string,
  payload: ReviewerDecisionPayload,
): Promise<Application> {
  return apiRequest<Application>(`/applications/${applicationId}/decision`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
