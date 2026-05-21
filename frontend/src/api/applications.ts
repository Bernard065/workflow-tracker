import { apiRequest } from "./client";
import type {
  Application,
  ApplicationCreatePayload,
  ApplicationListItem,
  ApplicationUpdatePayload,
  ReviewerDecisionPayload,
} from "../types/application";

export function getApplications(): Promise<ApplicationListItem[]> {
  return apiRequest<ApplicationListItem[]>("/applications");
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
