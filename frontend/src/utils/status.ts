import type { ApplicationStatus, ApplicationType } from "../types/application";

export function formatApplicationStatus(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    draft: "Draft",
    submitted: "Submitted",
    under_review: "Under Review",
    need_more_information: "Need More Information",
    approved: "Approved",
    rejected: "Rejected",
  };

  return labels[status];
}

export function formatApplicationType(type: ApplicationType): string {
  const labels: Record<ApplicationType, string> = {
    recordation: "Recordation",
    renewal: "Renewal",
    change_of_ownership: "Change of Ownership",
    change_of_name: "Change of Name",
    discontinuation: "Discontinuation",
  };

  return labels[type];
}

export function canEditApplication(status: ApplicationStatus): boolean {
  return status === "draft" || status === "need_more_information";
}

export function canSubmitApplication(status: ApplicationStatus): boolean {
  return status === "draft" || status === "need_more_information";
}

export function canStartReview(status: ApplicationStatus): boolean {
  return status === "submitted";
}

export function canRecordDecision(status: ApplicationStatus): boolean {
  return status === "under_review";
}

export function isFinalStatus(status: ApplicationStatus): boolean {
  return status === "approved" || status === "rejected";
}
